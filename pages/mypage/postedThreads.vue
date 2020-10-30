<template>
  <!-- <div>{{ post }}{{ reply }} -->
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿一覧</v-tab>
      <v-tab>返信一覧</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item><thread-card v-for="item in post" :key="item.id" v-bind="item" /></v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ThreadCard from '~/components/molecules/ThreadCard';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  components: { ThreadCard },
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
    this.getUserThread();
    this.getUserThreadReply();
  },
  methods: {
    async getUserThread() {
      const that = this;
      const threads = firebase.firestore().collection('threads');
      await threads
        .orderBy('createdAt', 'desc')
        .where('uid', '==', this.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            that.post = [
              ...that.post,
              {
                id: doc.id,
                name: doc.data().name,
                content: doc.data().content,
                img: doc.data().img,
                date: doc.data().createdAt.toDate(),
              },
            ];
          });
        });
    },
    async getUserThreadReply() {
      // const that = this;
      const threads = firebase.firestore();
      await threads
        .collectionGroup('reply')
        // .orderBy('createdAt', 'desc')
        .where('uid', '==', this.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // that.post = [
            //   ...that.reply,
            //   {
            //     id: doc.id,
            //     name: doc.data().name,
            //     content: doc.data().content,
            //     img: doc.data().img,
            //     date: doc.data().createdAt.toDate(),
            //   },
            // ];
            console.log(doc.data());
          });
        });
    },
  },
};
</script>
