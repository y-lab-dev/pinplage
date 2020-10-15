<template>
  <v-container>
    <v-row>
      <v-col>
        <v-img class="white--text align-end" height="200px" :src="articleObject.mainImg"></v-img>
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
            <v-list-item-avatar>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/user%2Ficon%2FdefaultIcon%2FS__46522416.jpg?alt=media&token=f1abc803-995b-49e7-863b-265110ad7972"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>ちょまど</v-list-item-title>
              <v-list-item-subtitle>情報学部</v-list-item-subtitle>
            </v-list-item-content>
            <v-row align="center" justify="end">
              <v-btn icon v-show="isLiked" @click="notLike">
                <v-icon color="#61d4b3">mdi-thumb-up</v-icon>
              </v-btn>
              <v-btn icon v-show="!isLiked" @click="like">
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
          <v-card
            v-for="(item, index) in articleCommentArray"
            :key="item.index"
            :elevation="0"
            :class="`index-${index}`"
          >
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="item.icon"></v-img>
              </v-list-item-avatar>
              <v-list-item-content class="py-0">
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.createdAt"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item-content class="ml-4 pt-0">
              {{ item.content }}
            </v-list-item-content>
            <v-divider></v-divider>
          </v-card>
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
        <v-list>
          <v-list-item-title class="text-subtitle-2"
            ><v-icon size="18" color="#61d4b3" class="mr-1 pb-1">mdi-book-open-page-variant</v-icon
            >こんな記事も</v-list-item-title
          >
        </v-list>
        <v-divider></v-divider>
        <v-card v-for="item in articleSameCategoryArray" :key="item.id" flat>
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
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import TextArea from '~/components/Atoms/AppTextarea';
import CreatedTimeDiff from '~/components/molecules/TimeDiff';

export default {
  layout: 'onlyBack',
  components: {
    PostButton,
    TextArea,
    CreatedTimeDiff,
  },
  data() {
    return {
      buttonType: 'submit',
      articleObject: {},
      articleDetailObject: {},
      articleCommentArray: [],
      articleSameCategoryArray: [],
      commentPlaceholder: 'コメントしてみよう',
      content: '',
      isLiked: false,
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
  created() {
    const that = this;
    const article = firebase.firestore().collection('articles');
    const thisArticle = article.doc(this.id);
    const articleDetail = thisArticle.collection('detail').doc('browse');
    const articleComment = thisArticle.collection('comment');
    const user = firebase.firestore().collection('users');
    const userLikedArticle = user.doc(this.uid).collection('article').doc('favorite');
    let userName = '';
    let userIcon = '';

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
    });
    articleDetail.get().then((doc) => {
      that.articleDetailObject = {
        mainArticle: doc.data().mainArticle,
      };
    });

    articleComment
      .orderBy('createdAt')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          user
            .doc(doc.data().commenter)
            .get()
            .then((doc) => {
              userName = doc.data().name;
              userIcon = doc.data().icon;
            })
            .then(() => {
              that.articleCommentArray = [
                ...that.articleCommentArray,
                {
                  content: doc.data().content,
                  createdAt: dayjs(doc.data().createdAt.toDate())
                    .locale('ja')
                    .format('YYYY/MM/DD HH:mm'),
                  name: userName,
                  icon: userIcon,
                },
              ];
            });
        });
      });

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
      })
      .catch((err) => {
        alert(err);
      });

    userLikedArticle.get().then((doc) => {
      that.isLiked = doc.data().id.find((val) => {
        return val === that.id;
      });
    });
  },
  methods: {
    scrollToElement(index) {
      this.$nextTick(() => {
        const newAnswerDOM = this.$el.getElementsByClassName(`index-${index}`)[0];
        newAnswerDOM.scrollIntoView({ behavior: 'smooth' });
      });
    },
    like() {
      const that = this;
      const loginUser = firebase.firestore().collection('users').doc(this.uid);

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
      const loginUser = firebase.firestore().collection('users').doc(this.uid);

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
        .doc('reply');
      const timestamp = firebase.firestore.Timestamp.now();
      const comment = {
        content: that.content,
        createdAt: dayjs(timestamp.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
        name: that.name,
        icon: that.icon,
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
            .update({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) })
            .then(() => {
              that.articleCommentArray = [...that.articleCommentArray, comment];
              that.scrollToElement(that.articleCommentArray.length - 1);
            })
            .catch((err) => {
              alert(err);
            });
        });
    },
  },
};
</script>
<style scoped>
.post-button {
  text-align: center;
}
</style>
