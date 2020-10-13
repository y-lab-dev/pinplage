<template>
  <div>
    <v-card
      class="rinrin-card"
      v-for="item in articleArray"
      :key="item.id"
      :elevation="5"
      @click="toDetail(item)"
    >
      <v-img class="white--text align-end" height="200px" :src="item.mainImg"></v-img>
      <v-card-title class="title" v-if="!alreadyRead">
        {{ item.title }}
      </v-card-title>
      <v-card-title class="title already" v-if="alreadyRead">
        {{ item.title }}
      </v-card-title>
      <v-card-subtitle>澤円/{{ item.provider }}</v-card-subtitle>
      <v-list-item>
        <v-chip class="label-view">{{ item.views }} views</v-chip>
        <v-list-item-content class="date">
          {{ item.date }}
        </v-list-item-content>
        <v-row align="center" justify="end">
          <v-icon class="mr-1" style="color: #61d4b3">mdi-thumb-up</v-icon>
          <span class="subheading mr-2">{{ item.like }}</span>
        </v-row>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';

export default {
  data() {
    return {
      articleArray: [],
    };
  },
  created() {
    const that = this;
    const article = firebase.firestore().collection('articles');

    article
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.articleArray = [
            ...that.articleArray,
            {
              id: doc.id,
              title: doc.data().title,
              date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD'),
              category: doc.data().category,
              canRead: doc.data().canRead,
              like: doc.data().like,
              mainImg: doc.data().mainImg,
              provider: doc.data().provider,
              range: doc.data().range,
              views: doc.data().views,
            },
          ];
        });
      })
      .catch((err) => {
        alert(err);
      });
  },
  methods: {
    toDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('article/getData', obj);
      }
      assignment().then(this.$router.push('timeline/article/detailArticle'));
    },
  },
};
</script>
