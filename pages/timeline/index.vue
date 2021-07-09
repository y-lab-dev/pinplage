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
                <div v-if="buttonHidden">
                  <TimelinePostButton />
                </div>
                <v-col v-if="menuHidden" md="4">
                  <div class="right-menu-wrap">
                    <v-card min-width="280px">
                      <v-list nav dense>
                        <v-list-item
                          class="pl-0"
                          :disabled="this.$route.path.includes('mypage')"
                          @click.stop="pushPage('mypage')"
                        >
                          <v-list-item-avatar>
                            <v-img :src="icon"></v-img>
                          </v-list-item-avatar>
                          <span>{{ name }}</span>
                        </v-list-item>
                        <v-divider class="my-3"></v-divider>
                        <v-list-item
                          v-for="(item, index) in subPages"
                          :key="item.name"
                          class="my-1"
                          nuxt
                          @click.stop="pushPage(subPages[index].link)"
                        >
                          <v-list-item-icon class="ml-3">
                            <v-icon color="rgba(0,0,0,0.6)" v-text="item.icon"></v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title class="item-title">
                              {{ item.name }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="my-3"></v-divider>
                        <v-list-item
                          v-for="(item, index) in contacts"
                          :key="item.name"
                          class="my-1"
                          @click.stop="pushPage(contacts[index].link)"
                        >
                          <v-list-item-icon class="ml-3">
                            <v-icon :color="item.color" v-text="item.icon"></v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title class="item-title">
                              {{ item.name }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list></v-card
                    >
                  </div></v-col
                >
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
  },
  data() {
    return {
      model: '',
      group: null,
      drawer: null,
      subPages: [
        { name: '部活・サークル', icon: 'mdi-run', link: 'club' },
        {
          name: 'お問い合わせ',
          icon: 'mdi-account-heart-outline',
          link: 'https://forms.gle/n7ejy3uWDJsJBoP89',
        },
        { name: 'よくある質問', icon: 'mdi-help', link: 'q&a' },
        { name: '設定', icon: 'mdi-cog-outline', link: 'setting' },
      ],
      contacts: [
        // { name: 'パンプラweb版', icon: 'mdi-web', link: 'webplage' },
        {
          name: 'Twitter',
          icon: 'mdi-twitter',
          link: 'https://twitter.com/pin__plage',
          color: '#1DA1F2',
        },
      ],
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
    pushPage(link) {
      if (
        link === 'https://forms.gle/n7ejy3uWDJsJBoP89' ||
        link === 'https://twitter.com/pin__plage'
      ) {
        window.open(link, null, 'noopener');
      } else {
        this.$router.push({ name: link });
      }
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
  max-width: 550px;
  margin: auto;
}
@media screen and (min-width: 960px) {
  .timeline-main-contents {
    float: right;
  }
}
.right-menu-wrap {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
  margin-right: auto;
  padding: 10px 0 0 15px;
}
@media screen and (max-width: 960px) {
  .right-menu-wrap {
    display: none;
  }
}
</style>
