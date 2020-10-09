<template>
  <div>
    <wisdom-thread
      v-for="item in postedWisdoms"
      :key="item.wisdomId"
      :wisdom-id="item.wisdomId"
      :poster="item.poster"
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
    userEmail() {
      return this.$store.getters['user/uid'];
    },
  },
  created() {
    const that = this;
    const wisdoms = firebase.firestore().collection('wisdoms');
    // const users = firebase.firestore().collection('users');

    async function getDetails() {
      await wisdoms
        .where('poster', '==', 'CMtv22qbuWNq2Gv1t9g7ryL3HL52')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const wisdom = doc.data();
            const postedWisdom = {
              wisdoeId: doc.id,
              poster: wisdom.poster,
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
    }
    getDetails().then(() => {
      console.log(123);
    });
  },
};
</script>
