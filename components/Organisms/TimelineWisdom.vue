<template>
  <div>
    <wisdom-thread
      v-for="(item, index) in postedWisdoms"
      :key="item.wisdomId"
      v-bind="postedWisdoms[index]"
    />
  </div>
</template>
<script>
import firebase from '~/plugins/firebase';
import WisdomThread from '~/components/Organisms/WisdomThread';
export default {
  components: { WisdomThread },
  data() {
    return {
      postedWisdoms: [],
      likedWisdoms: '',
    };
  },
  created() {
    this.$store.dispatch('user/getUserWisdom');
    this.$store.dispatch('user/getPostedWisdom');
    const that = this;
    const wisdoms = firebase.firestore().collection('wisdoms');
    wisdoms
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const wisdom = doc.data();
          const postedWisdom = {
            wisdomId: doc.id,
            poster: wisdom.poster,
            resolved: wisdom.resolved,
            likeAmount: wisdom.like,
            content: wisdom.content,
            category: wisdom.category,
            createdAt: wisdom.createdAt.toDate(),
          };
          wisdoms
            .doc(doc.id)
            .collection('reply')
            .get()
            .then((snapshot) => {
              postedWisdom.replyAmount = snapshot.size;
              that.postedWisdoms.push(postedWisdom);
            });
        });
      });
  },
};
</script>
