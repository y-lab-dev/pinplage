<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿した知恵袋</v-tab>
      <v-tab>あなたの返信</v-tab>
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
          :created-at="item.createdAt"
          :like-amount="item.likeAmount"
      /></v-tab-item>
      <div>
        <v-tab-item>
          <div
            v-for="(item, index) in postedReplies"
            :key="item.wisdomId"
            @click="toParentWisdom(item.parentWisdomId)"
          >
            <wisdom-reply :key="item.wisdomId" :class="`index-${index}`" v-bind="item" />
          </div>
        </v-tab-item>
      </div>
    </v-tabs-items>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import WisdomThread from '~/components/Organisms/WisdomThread';
import WisdomReply from '~/components/Organisms/WisdomReply';

export default {
  layout: 'onlyBack',
  components: { WisdomThread, WisdomReply },
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
          const postedWisdom = {
            wisdomId: doc.id,
            likeAmount: wisdom.like,
            resolved: wisdom.resolved,
            content: wisdom.content,
            category: wisdom.category,
            createdAt: wisdom.createdAt.toDate(),
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
            that.postedReplies = [
              ...that.postedReplies,
              {
                wisdomId: doc.id,
                poster: doc.data().replyer,
                likeAmount: Number(doc.data().like),
                content: doc.data().content,
                createdAt: doc.data().createdAt.toDate(),
                parentWisdomId: doc.ref.parent.parent.id,
              },
            ];
          });
        });
    },
    toParentWisdom(wisdomId) {
      this.$router.push({ name: 'timeline-wisdom-detailWisdom', query: wisdomId });
    },
  },
};
</script>
