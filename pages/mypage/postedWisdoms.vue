<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿した知恵袋</v-tab>
      <v-tab>あなたの返信</v-tab>
      <v-tab>いいねした返信</v-tab>
      <v-tab>いいねした投稿</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>
        <wisdom-thread
          v-for="item in postedWisdoms"
          :key="item.wisdomId"
          :wisdom-id="item.wisdomId"
          :poster="uid"
          :resolved="item.resolved"
          :content="item.content"
          :category="item.category"
          :created-day="item.createdDay"
          :like-amount="item.likeAmount"
          :reply-amount="item.replyAmount"
      /></v-tab-item>
      <v-tab-item>
        <wisdom-thread
          v-for="(item, index) in postedReplies"
          :key="item.wisdomId"
          :class="`index-${index}`"
          v-bind="item"
          :answer-display="true"
      /></v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import WisdomThread from '~/components/Organisms/WisdomThread';

export default {
  layout: 'onlyBack',
  components: WisdomThread,
  data() {
    return {
      postedWisdoms: [],
      postedReplies: [],
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
    this.$store.dispatch('user/getUserWisdom');
    const that = this;
    const db = firebase.firestore();
    const wisdoms = db.collection('wisdoms');
    wisdoms
      .orderBy('createdAt', 'desc')
      .where('poster', '==', this.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const wisdom = doc.data();
          console.log(wisdom);
          const postedWisdom = {
            wisdomId: doc.id,
            likeAmount: wisdom.like,
            resolved: wisdom.resolved,
            content: wisdom.content,
            category: wisdom.category,
            createdDay: wisdom.createdAt.toDate(),
          };
          wisdoms
            .doc(doc.id)
            .collection('reply')
            .get()
            .then((doc) => {
              postedWisdom.replyAmount = doc.size;
              that.postedWisdoms.push(postedWisdom);
            });
        });
      });
    // db.collectionGroup('reply').
    this.getUserWisdomReply();
  },
  methods: {
    async getUserWisdomReply() {
      const that = this;
      await firebase
        .firestore()
        .collectionGroup('reply')
        .where('replyer', '==', this.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.data());
            that.postedReplies = [
              ...that.postedReplies,
              {
                wisdomId: doc.id,
                poster: doc.data().replyer,
                likeAmount: doc.data().like,
                content: doc.data().content,
                createdDay: doc.data().createdAt.toDate(),
              },
            ];
          });
        });
    },
  },
};
</script>
