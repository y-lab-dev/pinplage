<template>
  <v-row v-if="!selfAnswer && selfWisdom && !resolved" justify="center" class="pt-0 chip-row">
    <v-col style="text-align: center" cols="12" class="pt-0">
      <v-chip class="ma-auto" color="#61D4B3" small text-color="#fff" @click="chooseBestAnswer">
        ベストアンサーに選ぶ
      </v-chip>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
const db = firebase.firestore();

export default {
  props: {
    sourceWisdomId: {
      required: true,
      type: String,
    },
    wisdomId: {
      required: true,
      type: String,
    },
    poster: {
      required: true,
      type: String,
    },
    replyer: {
      required: true,
      type: String,
    },
    resolved: {
      required: true,
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
    }),
    selfAnswer() {
      if (this.replyer === this.uid) {
        return true;
      } else {
        return false;
      }
    },
    selfWisdom() {
      if (this.poster === this.uid) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    chooseBestAnswer() {
      this.updateWisdom().then(() => {
        this.$router.go(-1);
      });
    },
    async updateWisdom() {
      const targetWisdom = db.collection('wisdoms').doc(this.sourceWisdomId);
      await targetWisdom.update({ resolved: true });
      await targetWisdom.collection('reply').doc(this.wisdomId).update({ bestAnswer: true });
    },
  },
};
</script>
