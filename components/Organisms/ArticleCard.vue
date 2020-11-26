<template>
  <div>
    <v-card class="mt-2 mx-2" :elevation="5" @click="toDetail">
      <v-img class="white--text align-end" height="200px" :src="mainImg"></v-img>
      <v-card-title class="font-weight-bold">
        {{ title }}
      </v-card-title>
      <v-card-subtitle>{{ authorName }}/{{ provider }}</v-card-subtitle>
      <v-list-item>
        <v-chip class="label-view">{{ views }} views</v-chip>
        <v-list-item-content class="ml-5">
          <created-time-diff :previous-date="date" />
        </v-list-item-content>
        <v-row align="center" justify="end">
          <v-icon class="mr-1" style="color: #61d4b3">mdi-thumb-up</v-icon>
          <span class="subheading mr-2">{{ like }}</span>
        </v-row>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import firebase from '~/plugins/firebase';
import CreatedTimeDiff from '~/components/Molecules/TimeDiff';
export default {
  components: {
    CreatedTimeDiff,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    canRead: {
      type: Boolean,
      required: true,
    },
    like: {
      type: Number,
      required: true,
    },
    mainImg: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    range: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      authorName: '',
    };
  },
  created() {
    const that = this;
    const articleInfo = firebase.firestore().collection('users').doc(this.author);
    articleInfo.get().then((doc) => {
      that.authorName = doc.data().name;
    });
  },
  methods: {
    toDetail() {
      const that = this;
      const obj = {
        id: that.id,
        category: that.category,
      };
      async function assignment() {
        await that.$store.commit('article/getData', obj);
      }
      assignment().then(this.$router.push({ name: 'timeline-article-detailArticle' }));
    },
  },
};
</script>
