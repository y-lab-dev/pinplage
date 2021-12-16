<template>
  <div>
    <v-container class="pa-0">
      <v-row cols="12" no-gutters
        ><v-col xs="12" sm="12" md="12">
          <HowToUse />
          <v-tabs
            v-model="model"
            grow
            color="#61d4b3"
            class="tabs"
            center-active
            height="57px"
            min-width="600px"
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
          <div class="timeline-contents-wrap">
            <v-tabs-items v-cloak v-model="model" class="tabs_styles" @change="pauseTab">
              <v-row cols="12" no-gutters>
                <v-col xs="12" sm="12" md="8">
                  <div class="timeline-main-contents">
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
                  </div>
                </v-col>
                <TimelinePostButton v-if="buttonHidden" />
                <v-col v-if="menuHidden" md="4">
                  <TimelineRightMenu />
                </v-col>
              </v-row>
            </v-tabs-items>
          </div>
        </v-col>
      </v-row>
    </v-container>
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
import TimelinePostButton from '~/components/Molecules/TimelinePostButtuon.vue';
import TimelineRightMenu from '~/components/Organisms/TimelineRightMenu.vue';

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
    TimelinePostButton,
    TimelineRightMenu,
  },
  data() {
    return {
      model: '',
      group: null,
      drawer: null,
    };
  },
  computed: {
    ...mapGetters({
      tab: 'timeline/tab',
      name: 'user/name',
      icon: 'user/icon',
    }),
    buttonHidden() {
      if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
        return true;
      } else {
        return false;
      }
    },
    menuHidden() {
      if (
        this.$vuetify.breakpoint.name === 'md' ||
        this.$vuetify.breakpoint.name === 'lg' ||
        this.$vuetify.breakpoint.name === 'xl'
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.model = this.tab;
  },
  methods: {
    pauseTab() {
      this.$store.commit('timeline/pauseTab', this.model);
    },
    backPage() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.tabs {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
}
</style>
<style>
.v-slide-group__prev {
  display: none !important;
}
.v-tab {
  font-size: 0.8rem;
}
.timeline-main-contents {
  margin-left: auto;
  margin-right: auto;
}
@media screen and (min-width: 960px) {
  .timeline-main-contents {
    float: right;
    min-width: 550px;
  }
}
</style>
