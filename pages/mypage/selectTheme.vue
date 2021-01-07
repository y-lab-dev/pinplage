<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <granim
            :granim-canvas="`granim-canvas`"
            :granim-height="granimHeight"
            :granim-width="granimWidth"
            :granim-round="granimRound"
            :granim-speed="5000"
            :granim-theme="'基本'"
          />
          <div class="text-center">
            <p class="theme-name">基本</p>
            <v-btn outlined @click="changeTheme('基本')">変更する</v-btn>
          </div>
        </v-col>
        <v-col v-for="(item, n) in granimTheme" :key="n" cols="6">
          <granim
            :granim-canvas="`granim-canvas${n}`"
            :granim-height="granimHeight"
            :granim-width="granimWidth"
            :granim-round="granimRound"
            :granim-speed="5000"
            :granim-theme="granimTheme[n]"
          />
          <div class="text-center">
            <p class="theme-name">
              {{ granimTheme[n] }}
            </p>
            <v-btn outlined @click="changeTheme(granimTheme[n])">変更する</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import granim from '~/components/Atoms/Granim';
const users = firebase.firestore().collection('users');
export default {
  layout: 'onlyBack',
  components: {
    granim,
  },
  data() {
    return {
      granimTheme: [],
      granimHeight: '100%',
      granimWidth: '100%',
      granimRound: '15px',
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
    users
      .doc(this.uid)
      .collection('items')
      .doc('background')
      .get()
      .then((doc) => {
        if (doc.exists) {
          that.granimTheme = doc.data().themes;
        }
      });
  },
  methods: {
    changeTheme(str) {
      users.doc(this.uid).set({ theme: str }, { merge: true });
      this.$store.commit('user/changeTheme', str);
      this.$router.go(-1);
    },
  },
};
</script>
