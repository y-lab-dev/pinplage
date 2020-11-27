<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3">
      <v-tab>お気に入り</v-tab>
      <v-tab>あなたのコメント</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>
        <div v-if="!favorites.length">
          <prompt-card
            :link="'timeline'"
            :image="require('~/assets/timeline/article.png')"
            :message="'お気に入りの記事を見つけてみませんか？'"
            :timeline-tab="3"
          />
        </div>
        <div v-else>
          <article-card
            v-for="(item, index) in favorites"
            :key="item.id"
            v-bind="favorites[index]"
          />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div v-if="!comments.length">
          <prompt-card
            :link="'timeline'"
            :image="require('~/assets/timeline/article.png')"
            :message="'記事にコメントしてませんか？筆者がコメントを待っています。'"
            :timeline-tab="3"
          />
        </div>
        <comment-thread v-for="(item, index) in comments" :key="index" v-bind="item" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import CommentThread from '~/components/Molecules/CommentThread';
export default {
  layout: 'onlyBack',
  components: {
    CommentThread,
  },
  data() {
    return {
      comments: [],
      favorites: [],
      postedTab: '',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    this.getUserArticleComments();
    this.getFavoritedArticles();
  },
  methods: {
    async getUserArticleComments() {
      const that = this;
      await firebase
        .firestore()
        .collectionGroup('comment')
        .where('commenter', '==', this.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.ref.parent.parent.parent.id !== 'articles') {
              return;
            }
            that.comments = [
              ...that.comments,
              {
                commentId: doc.id,
                commenter: doc.data().commenter,
                content: doc.data().content,
                createdAt: dayjs(doc.data().createdAt.toDate())
                  .locale('ja')
                  .format('YY/MM/DD HH:mm:ss'),
              },
            ];
          });
        });
    },
    async getUserFavoritedArticles() {
      const favorites = await firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('article')
        .doc('favorite')
        .get()
        .then((doc) => {
          return doc.data().id;
        });
      return favorites;
    },
    getFavoritedArticles() {
      const that = this;
      this.getUserFavoritedArticles().then((idArr) => {
        idArr.forEach((id) => {
          firebase
            .firestore()
            .collection('articles')
            .doc(id)
            .get()
            .then((doc) => {
              that.favorites = [
                ...that.favorites,
                {
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
                  author: doc.data().author,
                },
              ];
            });
        });
      });
    },
  },
};
</script>
