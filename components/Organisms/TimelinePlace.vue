<template>
  <div style="height: 100%">
    <v-container style="height: 100%" fluid>
      <v-row style="height: 100%">
        <v-col class="pt-0">
          <div v-for="item in reviewArray" :key="item.id">
            <v-card
              v-if="item.isRead"
              nuxt
              outlined
              tile
              :elevation="2"
              @click="toReviewDetail(item)"
            >
              <v-row justify="center" align-content="center">
                <v-col class="title pl-5 pr-0" cols="7">
                  <div>
                    <v-card-text class="pa-0" style="color: #1976d2" @click="toPlaceDetail(item)">{{
                      item.name
                    }}</v-card-text>
                  </div>
                </v-col>
                <v-col cols="5" class="px-0">
                  <div class="px-1 pt-1">
                    <rating
                      :show-rating="false"
                      :star-size="20"
                      :rating-result="item.rating"
                      :increment="1"
                    ></rating>
                  </div>
                </v-col>
              </v-row>
              <v-row align-content="center">
                <v-col class="px-8 py-0" cols="8" justify="center">
                  <v-chip v-show="item.genre" color="orange" small outlined>{{
                    item.genre
                  }}</v-chip>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <div v-for="scene in item.scene" :key="scene">
                    <div v-if="!scene.indexOf('朝')">
                      <v-icon color="orange">mdi-weather-sunset</v-icon>
                      <span class="orange--text py-3">朝</span>
                    </div>
                    <div v-if="!scene.indexOf('昼')">
                      <v-icon color="orange">mdi-weather-sunny</v-icon>
                      <span class="orange--text py-3">昼</span>
                    </div>
                    <div v-if="!scene.indexOf('夜')">
                      <v-icon color="orange">mdi-moon-waning-crescent</v-icon>
                      <span class="orange--text py-3">夜</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-list class="px-2 py-0">
                <v-list-item-content v-if="item.comment" class="py-4">
                  <div class="says">{{ item.comment }}</div>
                </v-list-item-content>
                <v-img max-width="100%" max-height="240px" :src="item.img"></v-img>
                <v-row>
                  <v-col>
                    <v-list-item-subtitle align="right">{{ item.date }}</v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';

export default {
  layout: 'protected',
  components: {
    Rating,
  },
  data() {
    return {
      model: 'tab-4',
      reviewArray: [],
    };
  },
  created() {
    const self = this;
    const store = firebase.firestore().collection('reviews');
    store
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          self.reviewArray = [
            ...self.reviewArray,
            {
              id: doc.id,
              name: doc.data().name,
              rating: doc.data().rating,
              comment: doc.data().comment,
              date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YYYY/MM/DD HH:mm'),
              placeId: doc.data().placeId,
              uid: doc.data().uid,
              genre: doc.data().genre,
              img: doc.data().mainImgUrl,
              scene: doc.data().scene,
              isRead: doc.data().isRead,
            },
          ];
        });
      });
  },
  methods: {
    toPlaceDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('place/getId', obj.placeId);
      }
      assignment().then(this.$router.push({ name: 'timeline-place-detailPlace' }));
    },
    toReviewDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('review/getId', obj.id);
        await self.$store.commit('place/getId', obj.placeId);
      }
      assignment().then(this.$router.push({ name: 'timeline-review-detailReview' }));
    },
  },
};
</script>
<style scoped>
.says {
  display: inline-block;
  position: relative;
  padding: 10px;
  border-radius: 6px;
  background: seashell;
}
.title {
  display: flex;
  align-items: center;
}
</style>
