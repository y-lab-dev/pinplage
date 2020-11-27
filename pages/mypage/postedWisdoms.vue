<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>いいねした知恵袋</v-tab>
      <v-tab>投稿した知恵袋</v-tab>
      <v-tab>あなたの回答</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>
        <div v-if="!likedWisdoms.length">
          <prompt-card
            :link="'timeline'"
            :image="require('~/assets/timeline/wisdom.png')"
            :message="'みんなの知恵袋を見てみませんか？'"
            :timeline-tab="1"
          />
        </div>
        <wisdom-thread v-for="item in likedWisdoms" :key="item.wisdomId" v-bind="item" />
      </v-tab-item>
      <v-tab-item>
        <div v-if="!postedWisdoms.length">
          <prompt-card
            :link="'post-wisdomPost'"
            :image="require('~/assets/timeline/wisdom.png')"
            :message="'初めての知恵袋を投稿してみませんか？'"
          />
        </div>
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
      <v-tab-item>
        <div v-if="!postedReplies.length">
          <prompt-card
            :link="'timeline'"
            :image="require('~/assets/timeline/wisdom.png')"
            :message="'知恵袋に回答してみませんか？'"
            :timeline-tab="1"
          />
        </div>
        <div
          v-for="item in postedReplies"
          :key="item.wisdomId"
          @click="toParentWisdom(item.parentWisdomId)"
        >
          <wisdom-reply :key="item.wisdomId" v-bind="item" />
        </div>
      </v-tab-item>
      <!-- <v-tab-item>
        <div
          v-for="item in likedReplies"
          :key="item.wisdomId"
          @click="toParentWisdom(item.parentWisdomId)"
        >
          <wisdom-reply :key="item.wisdomId" v-bind="item" />
        </div>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import WisdomThread from '~/components/Organisms/WisdomThread';
import WisdomReply from '~/components/Organisms/WisdomReply';
import PromptCard from '~/components/Molecules/PromptCard';
const db = firebase.firestore();
export default {
  layout: 'onlyBack',
  components: { WisdomThread, WisdomReply, PromptCard },
  data() {
    return {
      postedWisdoms: [],
      postedReplies: [],
      likedWisdoms: [],
      likedReplies: [],
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
    this.getUserLikedPost().then((idArr) => {
      idArr.forEach((id) => {
        db.collection('wisdoms')
          .doc(id)
          .get()
          .then((doc) => {
            const wisdom = doc.data();
            const likedWisdom = {
              wisdomId: doc.id,
              poster: wisdom.poster,
              resolved: wisdom.resolved,
              likeAmount: wisdom.like,
              content: wisdom.content,
              category: wisdom.category,
              createdAt: wisdom.createdAt.toDate(),
            };

            db.collection('wisdoms')
              .doc(doc.id)
              .collection('reply')
              .get()
              .then((doc) => {
                likedWisdom.replyAmount = doc.size;
                that.likedWisdoms = [...that.likedWisdoms, likedWisdom];
              });
          });
      });
    });
  },
  methods: {
    async getUserWisdomReply() {
      const that = this;
      await db
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
                replyer: doc.data().replyer,
                likeAmount: Number(doc.data().like),
                content: doc.data().content,
                createdAt: doc.data().createdAt.toDate(),
                parentWisdomId: doc.ref.parent.parent.id,
              },
            ];
          });
        });
    },
    async getUserLikedPost() {
      const likedPost = await db
        .collection('users')
        .doc(this.uid)
        .collection('wisdom')
        .doc('likedPost')
        .get()
        .then((doc) => {
          return doc.data().id;
        });
      return likedPost;
    },
    // async getUserLikedReply() {
    //   const likedReply = await db
    //     .collection('users')
    //     .doc(this.uid)
    //     .collection('wisdom')
    //     .doc('likedReply')
    //     .get()
    //     .then((doc) => {
    //       return doc.data().id;
    //     });
    //   return likedReply;
    // },
    toParentWisdom(wisdomId) {
      this.$router.push({ name: 'timeline-wisdom-detailWisdom', query: wisdomId });
    },
  },
};
</script>
