<template>
  <div class="detail-article-wrap">
    <v-container>
      <v-row>
        <v-col>
          <v-img class="white--text align-end top-img" :src="articleObject.mainImg"></v-img>
          <v-list>
            <v-list-item-title class="font-weight-bold text-h6">{{
              articleObject.title
            }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ articleObject.provider }}<created-time-diff :previous-date="articleObject.date" />
            </v-list-item-subtitle>
          </v-list>
          <v-list class="content">
            <div v-for="item in articleDetailObject.mainArticle" :key="item.id">
              <v-list-item-content
                v-if="item.type == 'title'"
                class="font-weight-bold"
                style="white-space: pre-wrap; word-wrap: break-word"
                >{{ item.contents }}</v-list-item-content
              >
              <v-list-item-content
                v-if="item.type == 'detail'"
                style="white-space: pre-wrap; word-wrap: break-word"
                >{{ item.contents }}</v-list-item-content
              >
              <img v-if="item.type == 'image'" style="width: 100%" :src="item.contents" />
              <div v-if="item.type == 'image'" style="color: #808080; text-align: center">
                {{ item.imageDesc }}
              </div>
            </div>
          </v-list>
          <v-list class="mb-4">
            <v-list-item>
              <v-list-item-avatar class="article-author-icon">
                <img :src="authorIcon" @click="toAuthorArticle" />
              </v-list-item-avatar>
              <v-list-item-content class="article-author-name" @click="toAuthorArticle">
                <v-list-item-title>{{ authorName }}</v-list-item-title>
                <v-list-item-subtitle class="to-author">著者関連記事へ</v-list-item-subtitle>
              </v-list-item-content>
              <v-row align="center" justify="end">
                <v-btn v-show="isLiked" icon @click="notLike">
                  <v-icon color="#61d4b3">mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn v-show="!isLiked" icon @click="like">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span class="subheading mr-7">{{ articleObject.like }}</span>
              </v-row>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item-title class="text-subtitle-2"
              ><v-icon size="18" color="#61d4b3" class="mr-1 pb-1">mdi-flag-variant</v-icon
              >コメント</v-list-item-title
            >
          </v-list>
          <v-divider></v-divider>
          <v-list two-line class="mb-6">
            <comment-thread
              v-for="(item, index) in articleCommentArray"
              :key="item.commentId"
              v-bind="articleCommentArray[index]"
              :class="`index-${index}`"
            ></comment-thread>
            <text-area
              class="mt-4"
              :textarea-placeholder="commentPlaceholder"
              :textarea-value="content"
              @input="content = $event"
            ></text-area>
            <v-list-item-content class="caption mx-8"
              ><p class="mb-0">
                不適切な投稿をすると、利用規約の違反により<span class="font-weight-bold"
                  >投稿の削除</span
                >や<span class="font-weight-bold">利用停止</span>となる場合があります。
              </p>
            </v-list-item-content>
            <div class="post-button">
              <post-button
                class="mt-4"
                :button-method="post"
                :button-type="buttonType"
                :button-disabled="content == ''"
                >コメント投稿</post-button
              >
            </div>
          </v-list>
          <v-divider></v-divider>
          <v-list v-if="isSameCategory">
            <v-list-item-title class="text-subtitle-2"
              ><v-icon size="18" color="#61d4b3" class="mr-1 pb-1"
                >mdi-book-open-page-variant</v-icon
              >こんな記事も</v-list-item-title
            >
          </v-list>
          <v-divider></v-divider>
          <v-card
            v-for="item in articleSameCategoryArray"
            :key="item.id"
            flat
            @click="toDetail(item)"
          >
            <v-list-item class="px-3">
              <img width="70px" height="50px" :src="item.mainImg" />
              <v-list-item-content class="ml-2">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import TextArea from '~/components/Atoms/AppTextarea';
import CreatedTimeDiff from '~/components/Molecules/TimeDiff';
import CommentThread from '~/components/Molecules/CommentThread';

export default {
  layout: 'onlyBack',
  components: {
    PostButton,
    TextArea,
    CreatedTimeDiff,
    CommentThread,
  },
  data() {
    return {
      buttonType: 'submit',
      articleObject: {},
      articleDetailObject: {},
      articleCommentArray: [],
      articleSameCategoryArray: [],
      authorName: '',
      authorIcon: '',
      commentPlaceholder: 'コメントしてみよう',
      content: '',
      isLiked: false,
      isSameCategory: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
      id: 'article/id',
      category: 'article/category',
    }),
  },
  watch: {
    articleSameCategoryArray(val) {
      if (val.length !== 0) {
        this.isSameCategory = true;
      }
    },
  },
  created() {
    this.getArticleContent();
  },
  methods: {
    getArticleContent() {
      const that = this;
      const article = firebase.firestore().collection('articles');
      const thisArticle = article.doc(this.id);
      const articleDetail = thisArticle.collection('detail').doc('browse');
      const articleComment = thisArticle.collection('comment');
      const user = firebase.firestore().collection('users');
      const userLikedArticle = user.doc(this.uid).collection('article').doc('favorite');

      const getArticleData = new Promise((resolve) => {
        thisArticle.get().then((doc) => {
          that.articleObject = {
            id: doc.id,
            title: doc.data().title,
            date: doc.data().createdAt.toDate(),
            category: doc.data().category,
            canRead: doc.data().canRead,
            like: doc.data().like,
            mainImg: doc.data().mainImg,
            provider: doc.data().provider,
            range: doc.data().range,
            views: doc.data().views,
          };
          that.author = doc.data().author;

          user
            .doc(that.author)
            .get()
            .then((doc) => {
              that.authorName = doc.data().name;
              that.authorIcon = doc.data().icon;
            });
        });
        resolve();
      });

      const getArticleDetailData = new Promise((resolve) => {
        articleDetail.get().then((doc) => {
          that.articleDetailObject = {
            mainArticle: doc.data().mainArticle,
          };
        });
        resolve();
      });

      const getArticleComment = new Promise((resolve) => {
        articleComment
          .orderBy('createdAt')
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              that.articleCommentArray = [
                ...that.articleCommentArray,
                {
                  commentId: doc.id,
                  commenter: doc.data().commenter,
                  content: doc.data().content,
                  createdAt: dayjs(doc.data().createdAt.toDate())
                    .locale('ja')
                    .format('YYYY/MM/DD HH:mm'),
                },
              ];
            });
          });
        resolve();
      });

      const getSameCategoryArticleData = new Promise((resolve) => {
        article
          .orderBy('createdAt', 'desc')
          .where('category', '==', this.category)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.id !== that.id) {
                that.articleSameCategoryArray = [
                  ...that.articleSameCategoryArray,
                  {
                    id: doc.id,
                    title: doc.data().title,
                    date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD'),
                    category: doc.data().category,
                    canRead: doc.data().canRead,
                    mainImg: doc.data().mainImg,
                    provider: doc.data().provider,
                    range: doc.data().range,
                  },
                ];
              }
            });
          });
        resolve();
      });

      const getArticleLikedData = new Promise((resolve) => {
        userLikedArticle.get().then((doc) => {
          that.isLiked = doc.data().id.find((val) => {
            return val === that.id;
          });
        });
        resolve();
      });

      // HACK
      Promise.all([
        getArticleData,
        getArticleDetailData,
        getArticleComment,
        getSameCategoryArticleData,
        getArticleLikedData,
      ]).then(() => {
        window.scroll(0, 0);
      });
    },
    scrollToElement(index) {
      this.$nextTick(() => {
        const newAnswerDOM = this.$el.getElementsByClassName(`index-${index}`)[0];
        newAnswerDOM.scrollIntoView({ behavior: 'smooth' });
      });
    },
    like() {
      const that = this;
      const article = firebase.firestore().collection('articles');
      const thisArticle = article.doc(this.id);
      const loginUser = firebase.firestore().collection('users').doc(this.uid);

      this.articleObject.like++;
      thisArticle.update({ like: that.articleObject.like });
      loginUser
        .collection('article')
        .doc('favorite')
        .update({ id: firebase.firestore.FieldValue.arrayUnion(that.id) })
        .then(() => {
          that.isLiked = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    notLike() {
      const that = this;
      const article = firebase.firestore().collection('articles');
      const thisArticle = article.doc(this.id);
      const loginUser = firebase.firestore().collection('users').doc(this.uid);

      this.articleObject.like--;
      thisArticle.update({ like: that.articleObject.like });
      loginUser
        .collection('article')
        .doc('favorite')
        .update({ id: firebase.firestore.FieldValue.arrayRemove(that.id) })
        .then(() => {
          that.isLiked = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    post() {
      const that = this;
      const articleComment = firebase
        .firestore()
        .collection('articles')
        .doc(this.id)
        .collection('comment');
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('article')
        .doc('comment');
      const timestamp = firebase.firestore.Timestamp.now();
      const comment = {
        commentId: timestamp.toDate().toString(),
        content: that.content,
        createdAt: dayjs(timestamp.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
        commenter: that.uid,
      };
      articleComment
        .add({
          commenter: that.uid,
          email: that.email,
          createdAt: timestamp,
          content: that.content,
        })
        .then((doc) => {
          that.content = '';
          user
            .set({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) }, { merge: true })
            .then(() => {
              that.articleCommentArray = [...that.articleCommentArray, comment];
              that.scrollToElement(that.articleCommentArray.length - 1);
            })
            .catch((err) => {
              alert(err);
            });
        });
    },
    toDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('article/getData', obj);
        that.articleCommentArray = [];
        that.articleSameCategoryArray = [];
      }
      assignment().then(this.getArticleContent);
    },
    toAuthorArticle() {
      const that = this;
      async function assignment() {
        await that.$store.commit('article/getAuthorData', that.author);
      }
      assignment().then(this.$router.push('authorArticle'));
    },
  },
};
</script>
<style scoped>
.top-img {
  height: 25vh;
}
@media screen and (min-width: 960px) {
  .top-img {
    height: 40vh;
  }
}
.detail-article-wrap {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}
.to-author {
  text-decoration: underline;
}
.post-button {
  text-align: center;
}
.article-author-icon {
  cursor: pointer;
}
.article-author-name {
  cursor: pointer;
}
</style>
