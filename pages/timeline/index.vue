<template>
  <div>
    <v-tabs v-model="model" color="#61d4b3" class="tabs" center-active @change="pauseTab">
      <v-tab href="#tab-1" class="pa-0">スレッド</v-tab>
      <v-tab href="#tab-2" class="pa-0">知恵袋</v-tab>
      <v-tab href="#tab-3" class="pa-0">アルバイト</v-tab>
      <v-tab href="#tab-4" class="pa-0">周辺施設</v-tab>
      <v-tab href="#tab-5" class="pa-0">イベント</v-tab>
      <v-tab href="#tab-6" class="pa-0">学生記事</v-tab>
    </v-tabs>

    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <thread></thread>
      </v-tab-item>
      <v-tab-item value="tab-2"><wisdom /></v-tab-item>
      <v-tab-item value="tab-3">
        <job></job>
      </v-tab-item>
      <v-tab-item value="tab-4">
        <place></place>
      </v-tab-item>
      <v-tab-item value="tab-5">
        <event></event>
      </v-tab-item>
      <v-tab-item value="tab-6">
        <TimelineArticle />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Thread from '~/components/Organisms/TimelineThread';
import Job from '~/components/Organisms/TimelineJob';
import Wisdom from '~/components/Organisms/TimelineWisdom';
import Place from '~/components/Organisms/TimelinePlace';
import Event from '~/components/Organisms/TimelineEvent';
import TimelineArticle from '~/components/Organisms/TimelineArticle';

export default {
  layout: 'protected',
  components: {
    Thread,
    Place,
    Job,
    Wisdom,
    Event,
    TimelineArticle,
  },
  data() {
    return {
      model: '',
    };
  },
  computed: {
    ...mapGetters({
      tab: 'timeline/tab',
    }),
  },
  created() {
    this.model = this.tab;
  },
  methods: {
    pauseTab() {
      this.$store.commit('timeline/pauseTab', this.model);
    },
  },
};
</script>

<style scoped>
.tabs {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 200;
}
</style>
<style>
.v-slide-group__prev {
  display: none !important;
}
.v-tab {
  font-size: 0.8rem;
}
</style>
