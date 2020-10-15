<template>
  <div>
    <v-card
      v-for="item in articleArray"
      :key="item.id"
      class="mt-2 mx-2"
      :elevation="5"
      @click="toDetail(item)"
    >
      <v-img class="white--text align-end" height="200px" :src="item.mainImg"></v-img>
      <v-card-title class="font-weight-bold">
        {{ item.title }}
      </v-card-title>
      <v-card-subtitle>澤円/{{ item.provider }}</v-card-subtitle>
      <v-list-item>
        <v-chip class="label-view">{{ item.views }} views</v-chip>
        <v-list-item-content class="ml-5">
          <created-time-diff :previous-date="item.date" />
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
import firebase from '~/plugins/firebase';
import CreatedTimeDiff from '~/components/molecules/TimeDiff';

export default {
  components: {
    CreatedTimeDiff,
  },
  data() {
    return {
      articleArray: [],
    };
  },
  created() {
    const that = this;
    const article = firebase.firestore().collection('articles');

    article
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.articleArray = [
            ...that.articleArray,
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
