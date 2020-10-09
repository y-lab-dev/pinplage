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
            <v-icon dark v-text="content.icon"></v-icon>
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
          icon: 'mdi-message-text-outline',
          iconColor: '#FEF37F',
          link: '/mypage/postedThreads',
        },
        {
          name: '鈴鈴(仮)',
          icon: 'mdi-book-outline',
          iconColor: '#7883FF',
          link: '/mypage/postedRinrin',
        },
        {
          name: '知恵袋',
          icon: 'mdi-head-question-outline',
          iconColor: '#83FF78',
          link: '/mypage/postedWisdoms',
        },
        {
          name: 'アルバイト',
          icon: 'mdi-food',
          iconColor: '#F478FF',
          link: '/mypage/postedPartTimeJobs',
        },
        {
          name: '周辺施設',
          icon: 'mdi-store-outline',
          iconColor: '#78FFF4',
          link: '/mypage/postedSurroundingFacilities',
        },
        {
          name: 'イベント',
          icon: 'mdi-flag-variant-outline',
          iconColor: '#FF7883',
          link: '/mypage/postedEvents',
        },
        // { name: , icon: 'mdi-message-text-outline', iconColor: '#F9BF4B', link: '#' },
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
