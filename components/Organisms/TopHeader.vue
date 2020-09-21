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
      <v-btn icon :ripple="false">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
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
        return 'エラー';
      }
    },
  },
  methods: {
    backPage() {
      this.$router.go(-1);
    },
  },
};
</script>
