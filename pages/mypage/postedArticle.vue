<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    // const that =this;
    const userUid = this.uid;
    const userInfo = firebase.firestore().collection('users').doc(userUid);
    userInfo
      .collection('article')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id);
          console.log(doc.data());
        });
      });
  },
};
</script>
