<template>
  <div>
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
    />
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
    const that = this;
    const wisdoms = firebase.firestore().collection('wisdoms');
    wisdoms
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().poster !== that.uid) {
            return;
          }
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
  },
};
</script>
