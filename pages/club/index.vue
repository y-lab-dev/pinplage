<template>
  <v-container class="pa-0">
    <v-tabs v-model="clubTab" grow color="#61d4b3" class="club-tabs" @change="pauseTab">
      <v-tab>部活動</v-tab>
      <v-tab>サークル</v-tab>
    </v-tabs>

    <v-tabs-items v-model="clubTab" @change="pauseTab">
      <v-tab-item>
        <v-list>
          <v-list-item v-for="(item, index) in clubs" :key="index" @click="clubDetail(item.id)">
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
          <v-list-item v-for="(item, index) in circles" :key="index" @click="clubDetail(item.id)">
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
export default {
  layout: 'protected',
  fetch() {
    this.$store.dispatch('club/getClubs');
    this.$store.dispatch('club/getCircles');
  },
  data() {
    return {
      clubTab: '',
    };
  },
  computed: {
    ...mapGetters({
      tab: 'club/tab',
      circles: 'club/circles',
      clubs: 'club/clubs',
    }),
  },
  created() {
    this.clubTab = this.tab;
  },
  methods: {
    clubDetail(clubId) {
      this.$router.push({ name: 'club-detail', query: clubId });
    },
    pauseTab() {
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
