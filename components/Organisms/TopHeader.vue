<template>
  <div app>
    <!-- <HowToUse :show="show" /> -->
    <v-app-bar
      app
      color="accent"
      :elevation="isTimeline ? 0 : 1"
      :scroll-target="$refs.maincontents"
    >
      <!-- :hide-on-scroll="isTimeline ? true : false" -->
      <v-btn icon :ripple="false" :disabled="!isHide" @click="backPage()">
        <v-icon v-show="isHide" color="#78dabe">mdi-arrow-left-bold-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <span class="header-title">{{ headerName }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-switch v-model="theme" false :prepend-icon="themeIcon" color="#61d4b3" label=""></v-switch> -->
      <div class="menu-icon">
        <v-btn icon :ripple="false" @click.stop="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="drawer-menu" fixed temporary right>
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
        <!-- <v-list-item @click.stop="pushHowtoUse">
          <v-list-item-icon class="ml-3">
            <v-icon color="rgba(0,0,0,0.6)">mdi-run</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="item-title"> 使い方 </v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
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
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import HowToUse from '~/components/Organisms/HowToUse';

export default {
  data() {
    return {
      // show: false,
      theme: false,
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
      name: 'user/name',
      icon: 'user/icon',
    }),
    isHide() {
      const pageName = this.$route.path;
      const slashCount = (pageName.match(/\//g) || []).length;
      if (slashCount === 1) {
        return false;
      } else {
        return true;
      }
    },
    isTimeline() {
      const pageName = this.$route.path;
      if (pageName === '/timeline') {
        return true;
      } else {
        return false;
      }
    },
    headerName() {
      let pageName = this.$route.path;
      if (pageName === '/timeline') {
        pageName = 'タイムライン';
        return pageName;
      } else if (pageName === '/search') {
        pageName = '検索';
        return pageName;
      } else if (pageName === '/post') {
        pageName = '投稿';
        return pageName;
      } else if (pageName === '/timetable') {
        pageName = '時間割';
        return pageName;
      } else if (pageName === '/mypage') {
        pageName = 'マイページ';
        return pageName;
      } else if (pageName === '/club') {
        pageName = '部活・サークル';
        return pageName;
      } else if (pageName === '/q&a') {
        pageName = 'よくある質問';
        return pageName;
      } else if (pageName === '/setting') {
        pageName = '設定';
        return pageName;
      } else {
        return '';
      }
    },
    // themeIcon() {
    //   return this.theme ? 'mdi-weather-night' : 'mdi-weather-sunny';
    // },
  },
  // watch: {
  //   theme() {
  //     this.$vuetify.theme.dark = this.theme;
  //   },
  // },
  methods: {
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
    // pushHowtoUse() {
    //   console.log('hi!');
    //   this.show = true;
    // },
  },
};
</script>
<style scoped>
.item-title {
  font-size: 0.9rem !important;
  opacity: 0.9;
}
.header-title {
  font-size: 1rem;
  opacity: 0.8;
  cursor: default;
}
.drawer-menu {
  z-index: 20;
}
@media screen and (min-width: 960px) {
  .menu-icon {
    display: none;
  }
}
</style>
