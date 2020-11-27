<template>
  <v-icon dark small :color="alreadyLiked ? '#f00' : '#E6E6E6'" @click="addWisdomLike">
    mdi-heart
  </v-icon>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  props: {
    wisdomId: {
      required: true,
      type: String,
    },
    type: {
      required: false,
      type: String,
      default: 'likedPost',
    },
  },
  data() {
    return {
      alreadyLiked: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      likedWisdoms: 'user/likedPost',
    }),
  },
  created() {
    this.alreadyLiked = this.likedWisdoms.some((value) => {
      return value === this.wisdomId;
    });
  },
  methods: {
    addWisdomLike() {
      const that = this;
      const userWisdomLikedPost = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('wisdom')
        .doc(this.type);
      if (!this.alreadyLiked) {
        userWisdomLikedPost
          .set(
            {
              id: firebase.firestore.FieldValue.arrayUnion(that.wisdomId),
            },
            { merge: true }
          )
          .then(() => {
            that.alreadyLiked = true;
            that.$store.dispatch('user/getUserWisdom');
          });
      } else {
        userWisdomLikedPost
          .update({
            id: firebase.firestore.FieldValue.arrayRemove(that.wisdomId),
          })
          .then(() => {
            that.alreadyLiked = false;
            that.$store.dispatch('user/getUserWisdom');
          });
      }
    },
  },
};
</script>
