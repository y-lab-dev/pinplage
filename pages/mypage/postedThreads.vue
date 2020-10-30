<template>
  <!-- <div>{{ post }}{{ reply }} -->
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿一覧</v-tab>
      <v-tab>返信一覧</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>{{ post }}</v-tab-item>
      <v-tab-item>{{ reply }}</v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  data() {
    return {
      postedTab: '',
      post: [],
      reply: [],
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
    }),
  },
  created() {
    this.getUserThread('post').then((value) => {
      this.post = value;
    });
    this.getUserThread('reply').then((value) => {
      this.reply = value;
    });
  },
  methods: {
    async getUserThread(docId) {
      const userThread = await firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('thread')
        .doc(docId)
        .get()
        .then((doc) => {
          return doc.data().id;
        });
      return userThread;
    },
  },
};
</script>
