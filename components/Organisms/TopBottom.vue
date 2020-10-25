<template>
  <v-bottom-navigation :app="true" grow fixed class="bottom-navigation" color="#78dabe">
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
    <v-btn nuxt :to="tabMypage.link" class="pa-0" max-width="15vw" :ripple="false">
      <span class="tab-name">{{ tabMypage.name }}</span>
      <v-avatar size="24px">
        <img v-show="isLoaded" :src="icon" @load="isLoaded = true" />
      </v-avatar>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'TopButom',
  data() {
    return {
      tabItems: [
        { name: 'タイムライン', link: '/timeline', icon: 'mdi-home-outline' },
        { name: '検索', link: '/search', icon: 'mdi-card-search-outline' },
        { name: '投稿', link: '/post', icon: 'mdi-plus-circle-outline' },
        { name: '時間割', link: '/timetable', icon: 'mdi-av-timer' },
        // { name: 'マイページ', link: '/mypage', icon: 'mdi-account-outline' },
      ],
      tabMypage: { name: 'マイページ', link: '/mypage' },
      isLoaded: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
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
  border-radius: 15px 15px 0 0;
}
.v-item-group.v-bottom-navigation .v-btn {
  min-width: 20%;
}
.theme--light.v-btn:hover::before {
  opacity: 0 !important;
}
</style>
