<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form">
          <v-text-field
            v-model="latestName"
            dense
            outlined
            clearable
            label="ユーザーネーム"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <v-btn @click="changeName">変更を保存する</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  data() {
    return {
      latestName: '',
    };
  },
  computed: {
    ...mapGetters({
      name: 'user/name',
      uid: 'user/uid',
    }),
  },
  created() {
    this.latestName = this.name;
  },
  methods: {
    changeName() {
      const that = this;
      const users = firebase.firestore().collection('users').doc(that.uid);
      users
        .update({
          name: that.latestName,
        })
        .then(() => {
          console.log(this.latestName);
          this.$store.commit('user/changeName', this.latestName);
          this.$router.go(-1);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
