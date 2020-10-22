<template>
  <div>
    <v-container class="py-0">
      <v-row>
        <v-col class="pa-0" cols="12">
          <v-card
            v-for="item in reviewArray"
            :key="item.id"
            nuxt
            outlined
            :elevation="2"
            @click="toReviewDetail(item)"
          >
            <v-row align="center">
              <v-col class="pa-0" cols="8">
                <v-card-title class="p-2" @click="toPlaceDetail(item)">{{
                  item.name
                }}</v-card-title>
              </v-col>
              <v-col class="pa-0" cols="4">
                <rating
                  :read-only="true"
                  :star-size="20"
                  :rating-result="item.rating"
                  :increment="1"
                ></rating>
              </v-col>
            </v-row>
            <v-list class="pa-2">
              <v-list-item-content>{{ item.comment }}</v-list-item-content>
              <v-img max-width="100%" max-height="240px" :src="item.img"></v-img>
              <v-row align="center">
                <v-col class="pa-0" cols="2">
                  <v-list-item v-for="scene in item.scene" :key="scene" align="center">
                    <v-icon v-if="!scene.indexOf('朝')" color="#61d4b3" class="float-right"
                      >mdi-weather-sunset</v-icon
                    >
                    <v-icon v-if="!scene.indexOf('昼')" color="#61d4b3" class="float-right"
                      >mdi-weather-sunny</v-icon
                    >
                    <v-icon v-if="!scene.indexOf('夜')" color="#61d4b3" class="float-right"
                      >mdi-moon-waning-crescent</v-icon
                    >
                  </v-list-item>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <v-list-item-subtitle align="center">
                    <div v-if="item.budgetLow" class="float-left">￥{{ item.budgetLow }}</div>
                    <div v-if="item.budgetHigh || item.budgetLow" class="float-left">～</div>
                    <div v-if="item.budgetHigh" class="float-left">￥{{ item.budgetHigh }}</div>
                  </v-list-item-subtitle>
                </v-col>
                <v-col class="pa-0" cols="6">
                  <v-list-item-subtitle v-if="item.genre" align="center"
                    >:{{ item.genre }}</v-list-item-subtitle
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-list-item-subtitle class="pr-4 text-right">{{ item.date }}</v-list-item-subtitle>
              </v-row>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';

const store = firebase.firestore().collection('reviews');

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
              budgetHigh: doc.data().budgetHigh,
              budgetLow: doc.data().budgetLow,
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
      }
      assignment().then(this.$router.push({ name: 'timeline-review-detailReview' }));
    },
  },
};
</script>
