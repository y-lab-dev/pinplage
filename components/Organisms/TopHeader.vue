<template>
  <div app>
    <v-app-bar app color="#fff" elevation="1">
      <v-btn icon :ripple="false" :disabled="!isHide" @click="backPage()">
        <v-icon v-show="isHide" color="#78dabe">mdi-arrow-left-bold-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <span class="header-title">{{ headerName }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :ripple="false" @click.stop="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="drawer-menu" fixed temporary right>
      <v-list nav dense>
        <v-list-item
          class="pl-0"
          :disabled="this.$route.path.includes('mypage')"
          @click.stop="pushPage('mypage')"
        >
          <v-list-item-avatar>
            <v-img
              src="https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/user%2Ficon%2FdefaultIcon%2Ftest%2FS__46522415_200x200.jpg?alt=media&token=c541794a-a096-451d-b021-29662c353550"
            ></v-img>
          </v-list-item-avatar>
          <span>user Name</span>
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
          @click.stop="pushPage(contacts[index].name)"
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
export default {
  data() {
    return {
      group: null,
      drawer: null,
      subPages: [
        { name: '部活・サークル', icon: 'mdi-run', link: 'clubs' },
        { name: '設定', icon: 'mdi-account-settings-outline', link: 'settings' },
        { name: '利用規約', icon: 'mdi-file-outline', link: 'apprule' },
        {
          name: 'お問い合わせ',
          icon: 'mdi-account-heart-outline',
          link: 'https://forms.gle/n7ejy3uWDJsJBoP89',
        },
      ],
      contacts: [
        { name: 'パンプラweb版', icon: 'mdi-web', link: 'webplage' },
        { name: 'twitter', icon: 'mdi-twitter', link: 'twitter', color: '#1DA1F2' },
      ],
    };
  },
  computed: {
    isHide() {
      const pageName = this.$route.path;
      const slashCount = (pageName.match(/\//g) || []).length;
      console.log(slashCount);
      if (slashCount === 1) {
        return false;
      } else {
        return true;
      }
    },
    headerName() {
      let pageName = this.$route.path;
      console.log(this.$route.path.includes('mypage'));
      console.log(pageName);
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
      } else {
        return '';
      }
    },
  },
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    pushPage(link) {
      console.log(link);
      if (link === 'https://forms.gle/n7ejy3uWDJsJBoP89') {
        location.href = link;
      } else {
        this.$router.push({ name: link });
      }
    },
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
}
.drawer-menu {
  z-index: 20;
}
</style>
