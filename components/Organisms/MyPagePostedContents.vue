<template>
  <div>
    <v-container class="px-4" fluid>
      <v-row align="center">
        <v-col v-for="content in contentsList" :key="content.name" class="text-centerr" cols="6">
          <v-btn
            class="button-wrapper"
            width="35vw"
            height="7vh"
            nuxt
            dark
            :to="content.link"
            :color="content.iconColor"
          >
            <v-avatar rounded tile size="30"><img :src="content.src" /></v-avatar>
            <v-spacer></v-spacer>
            {{ content.name }}
            <v-spacer></v-spacer>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
export default {
  data() {
    return {
      uid: '',
      userInfo: {},
      contentsList: [
        {
          name: 'スレッド',
          src: require('~/assets/timeline/thread.png'),
          iconColor: '#61D4B3',
          link: '/mypage/postedThreads',
        },
        {
          name: '学生記事',
          src: require('~/assets/timeline/article.png'),
          iconColor: '#61D4B3',
          link: '/mypage/postedArticle',
        },
        {
          name: '知恵袋',
          src: require('~/assets/timeline/wisdom.png'),
          iconColor: '#61D4B3',
          link: '/mypage/postedWisdoms',
        },
        {
          name: 'アルバイト',
          src: require('~/assets/timeline/job.png'),
          iconColor: '#61D4B3',
          link: '/mypage/postedPartTimeJobs',
        },
        {
          name: 'クチコミ',
          src: require('~/assets/timeline/review.png'),
          iconColor: '#61D4B3',
          link: '/mypage/postedSurroundingFacilities',
        },
        {
          name: 'イベント',
          src: require('~/assets/timeline/event.png'),
          iconColor: '#61D4B3',
          link: '/mypage/postedEvents',
        },
        // { name: , src:: 'mdi-message-text-outline', iconColor: '#F9BF4B', link: '#' },
      ],
    };
  },
  computed: {
    userid() {
      return this.$store.getters['user/email'];
    },
  },
  created() {
    const that = this;
    const userData = firebase.firestore().collection('userData');
    userData
      .doc('kaji.takahiro.17@shizuoka.ac.jp')
      .get()
      .then((doc) => {
        that.userInfo = doc.data();
      });
  },
};
</script>

<style scoped>
.button-wrapper {
  align-content: center;
  width: 35vw;
  height: 7vh;
  background: linear-gradient(
    195deg,
    rgba(164, 164, 164, 0.1) 10%,
    rgba(101, 101, 101, 0.1) 25% 75%,
    rgba(164, 164, 164, 0.1) 95%
  );
}
</style>
