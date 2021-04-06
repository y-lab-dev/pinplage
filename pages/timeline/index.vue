<template>
  <div>
    <HowToUse />
    <v-tabs
      v-model="model"
      grow
      color="#61d4b3"
      class="tabs"
      center-active
      height="57px"
      @change="pauseTab"
    >
      <v-tab
        ><v-avatar rounded tile size="30"
          ><img :src="require('~/assets/timeline/thread.png')" /></v-avatar
        ><span class="ml-2">スレッド</span></v-tab
      >
      <v-tab
        ><v-avatar rounded tile size="30"
          ><img :src="require('~/assets/timeline/wisdom.png')" /></v-avatar
        ><span class="ml-2">知恵袋</span></v-tab
      >
      <v-tab
        ><v-avatar rounded tile size="30"
          ><img :src="require('~/assets/timeline/review.png')" /></v-avatar
        ><span class="ml-2">クチコミ</span></v-tab
      >
      <v-tab
        ><v-avatar rounded tile size="30"
          ><img :src="require('~/assets/timeline/article.png')" /></v-avatar
        ><span class="ml-2">学生記事</span></v-tab
      >
      <v-tab
        ><v-avatar rounded tile size="30"
          ><img :src="require('~/assets/timeline/event.png')" /></v-avatar
        ><span class="ml-2">イベント</span></v-tab
      >
      <v-tab
        ><v-avatar rounded tile size="30"
          ><img :src="require('~/assets/timeline/job.png')" /></v-avatar
        ><span class="ml-2">アルバイト</span></v-tab
      >
    </v-tabs>

    <v-tabs-items v-cloak v-model="model" @change="pauseTab">
      <v-tab-item>
        <thread></thread>
      </v-tab-item>
      <v-tab-item><wisdom /></v-tab-item>
      <v-tab-item>
        <place></place>
      </v-tab-item>
      <v-tab-item>
        <TimelineArticle />
      </v-tab-item>
      <v-tab-item>
        <event></event>
      </v-tab-item>
      <v-tab-item>
        <job></job>
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
import HowToUse from '~/components/Organisms/HowToUse';

export default {
  layout: 'protected',
  components: {
    Thread,
    Place,
    Job,
    Wisdom,
    Event,
    TimelineArticle,
    HowToUse,
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
  z-index: 10;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
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
