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
    parentId: {
      required: false,
      type: String,
      default: '',
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
      likedReply: 'user/likedReply',
    }),
  },
  created() {
    if (this.type === 'likedPost') {
      this.alreadyLiked = this.likedWisdoms.some((value) => {
        return value === this.wisdomId;
      });
    } else {
      this.alreadyLiked = this.likedReply.some((value) => {
        return value === this.wisdomId;
      });
    }
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
            that.incrementWisdomLike();
          });
      } else {
        userWisdomLikedPost
          .update({
            id: firebase.firestore.FieldValue.arrayRemove(that.wisdomId),
          })
          .then(() => {
            that.incrementWisdomLike();
          });
      }
    },
    async incrementWisdomLike() {
      const that = this;
      if (this.type === 'likedPost') {
        const targetWisdom = await firebase.firestore().collection('wisdoms').doc(this.wisdomId);
        if (!this.alreadyLiked) {
          targetWisdom.update({ like: firebase.firestore.FieldValue.increment(1) });
          that.alreadyLiked = true;
          that.$store.dispatch('user/getUserWisdom');
        } else {
          targetWisdom.update({ like: firebase.firestore.FieldValue.increment(-1) });
          that.alreadyLiked = false;
          that.$store.dispatch('user/getUserWisdom');
        }
      } else if (this.type === 'likedReply') {
        const targetReply = await firebase
          .firestore()
          .collection('wisdoms')
          .doc(this.parentId)
          .collection('reply')
          .doc(this.wisdomId);

        if (!this.alreadyLiked) {
          targetReply.update({ like: firebase.firestore.FieldValue.increment(1) });
          that.alreadyLiked = true;
          that.$store.dispatch('user/getUserLikedWisdomReply');
        } else {
          targetReply.update({ like: firebase.firestore.FieldValue.increment(-1) });
          that.alreadyLiked = false;
          that.$store.dispatch('user/getUserLikedWisdomReply');
        }
      }
    },
  },
};
</script>
