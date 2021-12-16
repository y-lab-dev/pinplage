<template>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
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
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  methods: {
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

<style>
.right-menu-wrap {
  position: sticky;
  position: -webkit-sticky;
  top: 55px;
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
