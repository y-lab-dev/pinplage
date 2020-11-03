<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  data() {
    return {
      post: [],
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
    }),
  },
  created() {
    this.getUserPartTimeJob().then(() => {
      console.log(this.post);
    });
  },
  methods: {
    async getUserPartTimeJob() {
      const that = this;
      const events = firebase.firestore().collection('jobs');
      await events
        .where('poster', '==', this.uid)
        .orderBy('updatedAt', 'desc')
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
  },
};
</script>
