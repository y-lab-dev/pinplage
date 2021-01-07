<template>
  <div>
    <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
      <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        color="#61d4b3"
        :icon="item.icon"
        fill-dot
      >
        <v-card color="#61d4b3" dark width="60vw">
          <v-card-title class="pa-0 pl-4">
            <p style="margin-bottom: 0; font-size: 0.8rem">{{ item.point }}プラージュ獲得</p>
          </v-card-title>
          <v-card-text class="white text--primary py-2">
            <p style="margin-bottom: 0">{{ item.explain }}</p>
            <p style="margin-bottom: 0">{{ item.createdAt }}</p>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';

export default {
  data: () => ({
    items: [],
  }),
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    const user = firebase.firestore().collection('users').doc(this.uid);
    const that = this;
    user
      .collection('point')
      .doc('log')
      .get()
      .then((snap) => {
        snap.data().point.forEach((log) => {
          let category = '';
          let action = '';
          switch (log.category) {
            case 'wisdom':
              category = '知恵袋';
              break;
            case 'review':
              category = '口コミ';
              break;
            case 'thread':
              category = 'スレッド';
              break;
            case 'event':
              category = 'イベント';
              break;
            case 'job':
              category = 'バイト';
              break;
          }
          switch (log.action) {
            case 'post':
              action = '投稿';
              break;
          }
          const logObj = {
            point: log.pointAmount,
            explain: `${category}の${action}のため`,
            createdAt: dayjs(new Date(log.createdAt)).locale('ja').format('YY/MM/DD HH:mm:ss'),
          };
          that.items = [...that.items, logObj];
        });
      });
  },
};
</script>
