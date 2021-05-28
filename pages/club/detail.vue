<template v-cloak>
  <div class="detail-wrap">
    <v-carousel cycle height="200" hide-delimiters show-arrows-on-hover class="club-carousel">
      <p class="club-name">
        <v-avatar class="club-icon" size="30px"><img :src="icon" /></v-avatar>
        <span>{{ name }}</span>
      </p>
      <v-carousel-item v-for="(item, index) in details.picture" :key="index" :src="item" />
    </v-carousel>

    <v-card flat>
      <v-card-subtitle class="pb-2 club-introduction-title"> {{ name }}について </v-card-subtitle>
      <v-card-text class="club-introduction-text">{{ details.introduction }}</v-card-text>
      <v-card-actions>
        <v-container fluid class="py-0">
          <v-row justify="center" class="">
            <v-chip
              v-for="(item, index) in clubLinks"
              :key="index"
              dark
              :color="item.color"
              :disabled="!item.link"
              class="mx-1"
              :class="item.class"
              @click="goToLink(item.link)"
            >
              <v-icon size="1rem" dark>{{ item.icon }}</v-icon>
              <span>{{ item.title }}</span>
            </v-chip>
          </v-row>
        </v-container>
      </v-card-actions>
      <v-list dense>
        <v-list-item v-for="(item, index) in clubListItems" :key="index">
          <v-list-item-avatar>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
            <v-list-item-title>{{ details.more[index] }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  layout: 'onlyBack',
  data() {
    return {
      clubListItems: [
        { title: '活動目標', color: '#E8002B', icon: 'mdi-target' },
        { title: '活動場所', color: '#FA6964', icon: 'mdi-run' },
        { title: '活動時間', color: '#7D3E49', icon: 'mdi-clock-time-eight-outline' },
        { title: '活動予算', color: '#e6b422', icon: 'mdi-currency-jpy' },
        { title: '男女比', color: '#3ac6df', icon: 'mdi-human-male-female' },
      ],
      clubLinks: [
        { title: '公式HP', color: '#61D4b3', icon: 'mdi-home', link: '', class: '' },
        { title: 'twitter', color: '#1A91DA', icon: 'mdi-twitter', link: '', class: '' },
        { title: 'Instagram', color: '', icon: 'mdi-instagram', link: '', class: 'instagram' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      details: 'clubDetails/clubDetails',
      name: 'clubDetails/name',
      icon: 'clubDetails/icon',
    }),
  },
  created() {
    this.clubLinks[0].link = this.details.link.homepage;
    this.clubLinks[1].link = this.details.link.twitter;
    this.clubLinks[2].link = this.details.link.instagram;
  },
  methods: {
    goToLink(link) {
      location.href = link;
    },
  },
};
</script>

<style scoped>
.detail-wrap {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
.club-name {
  position: absolute;
  margin-bottom: 0;
  padding: 0.5rem 0;
  padding-right: 1.3rem;
  text-align: right;
  z-index: 2;
  width: 100%;
  font-size: 1rem;
  color: #fff;
  background: linear-gradient(to left, #0101016d, #68686831);
  bottom: 0;
  border-top-left-radius: 1rem 10px;
}
.club-carousel {
  position: relative;
}
@media only screen and (max-device-width: 550px) {
  .club-carousel {
    height: 300;
  }
}
.club-icon {
  background-color: #fff;
}
.club-introduction-title {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
}
.club-introduction-text {
  color: rgba(0, 0, 0, 0.9);
}
.instagram {
  position: relative;
  background: -webkit-linear-gradient(135deg, #427eff 0%, #f13f79 70%) no-repeat !important;
  background: linear-gradient(135deg, #427eff 0%, #f13f79 70%) no-repeat !important;
}
[v-cloal] {
  display: none;
}
</style>
