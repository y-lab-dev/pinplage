<template>
  <v-container class="pa-0">
    <v-tabs v-model="clubTab" grow color="#61d4b3" class="club-tabs" @change="pauseTab">
      <v-tab>部活動</v-tab>
      <v-tab>サークル</v-tab>
    </v-tabs>

    <v-tabs-items v-model="clubTab" @change="pauseTab">
      <v-tab-item>
        <v-list>
          <v-list-item v-for="(item, index) in club" :key="index" @click="clubDetail(item.id)">
            <v-list-item-avatar>
              <img :src="item.icon" />
            </v-list-item-avatar>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <v-list>
          <v-list-item v-for="(item, index) in circle" :key="index" @click="clubDetail(item.id)">
            <v-list-item-avatar>
              <img :src="item.icon" />
            </v-list-item-avatar>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'protected',
  data() {
    return {
      clubTab: '',
      club: [],
      circle: [],
    };
  },
  computed: {
    ...mapGetters({
      tab: 'club/tab',
    }),
  },
  created() {
    console.log(this.tab);
    this.clubTab = this.tab;
    const that = this;
    // const circles =
    firebase
      .firestore()
      .collection('circles')
      .orderBy('name')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().genre === '部活') {
            const clubData = {
              id: doc.id,
              name: doc.data().name,
              icon: doc.data().icon,
            };
            that.club.push(clubData);
          } else {
            const circleData = {
              id: doc.id,
              name: doc.data().name,
              icon: doc.data().icon,
            };
            that.circle.push(circleData);
          }
        });
      });
  },
  methods: {
    clubDetail(clubId) {
      this.$router.push({ name: 'club-detail', query: clubId });
    },
    pauseTab() {
      console.log(this.clubTab);
      this.$store.commit('club/pauseTab', this.clubTab);
    },
  },
};
</script>

<style scoped>
.club-tabs {
  position: sticky;
  position: -webkit-sticky;
  top: 56px;
  z-index: 10;
}
</style>
