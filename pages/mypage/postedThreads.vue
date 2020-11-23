<template>
  <!-- <div>{{ post }}{{ reply }} -->
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿したスレッド</v-tab>
      <v-tab>あなたの返信</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item><thread-card v-for="item in post" :key="item.id" v-bind="item" /></v-tab-item>
      <v-tab-item>
        <div v-for="(item, index) in reply" :key="index" @click="pushParentPage(item.parentId)">
          <thread-comment v-bind="reply[index]"></thread-comment>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import ThreadCard from '~/components/Molecules/ThreadCard';
import ThreadComment from '~/components/Organisms/ThreadComment';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  components: { ThreadCard, ThreadComment },
  data() {
    return {
      postedTab: '',
      post: [],
      reply: [],
      parentThread: {},
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
      const that = this;
      await firebase
        .firestore()
        .collectionGroup('reply')
        .where('uid', '==', this.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            // console.log(doc.ref.parent.parent.id);
            that.reply = [
              ...that.reply,
              {
                commentId: doc.id,
                name: doc.data().name,
                content: doc.data().content,
                date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
                parentId: doc.ref.parent.parent.id,
              },
            ];
          });
        });
    },
    async getParentThread(threadId) {
      const that = this;
      await firebase
        .firestore()
        .collection('threads')
        .doc(threadId)
        .get()
        .then((doc) => {
          that.parentThread = {
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            img: doc.data().img,
            date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
          };
        });
    },
    pushParentPage(parentId) {
      this.getParentThread(parentId)
        .then(() => {
          this.$store.commit('thread/getId', this.parentThread);
        })
        .then(() => {
          this.$router.push({ name: 'timeline-thread-detailThread' });
        });
    },
  },
};
</script>
