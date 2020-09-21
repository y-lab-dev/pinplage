<template>
  <v-bottom-navigation class="bottom-navigation" color="#78dabe">
    <v-btn
      v-for="item in tabItems"
      :key="item.link"
      nuxt
      :to="item.link"
      class="pa-0"
      max-width="15vw"
      :ripple="false"
    >
      <span class="tab-name">{{ item.name }}</span>
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'TopButom',
  data() {
    return {
      tabItems: [
        { name: 'タイムライン', link: '/timeline', icon: 'mdi-home-outline' },
        { name: '検索', link: '/search', icon: 'mdi-card-search-outline' },
        { name: '投稿', link: '/post', icon: 'mdi-plus-circle-outline' },
        { name: '時間割', link: '/timetable', icon: 'mdi-av-timer' },
        { name: 'マイページ', link: '/mypage', icon: 'mdi-account-outline' },
      ],
    };
  },
};
</script>
<style scoped>
.tab-name {
  font-size: 0.5rem;
}
.active-tab {
  color: yellow;
}
.bottom-navigation {
  border-radius: 5px 6px 0 0;
}
.v-item-group.v-bottom-navigation .v-btn {
  min-width: 20%;
}
</style>
