<template>
  <div>
    <v-tabs v-model="model" color="#61d4b3" class="tabs" grow center-active show-arrows>
      <v-tab href="#tab-1">スレッド</v-tab>
      <v-tab href="#tab-2">知恵袋 </v-tab>
      <v-tab href="#tab-3">アルバイト</v-tab>
      <v-tab href="#tab-4">周辺施設</v-tab>
      <v-tab href="#tab-5">イベント</v-tab>
      <v-tab href="#tab-6">鈴鈴</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1"></v-tab-item>
      <v-tab-item value="tab-2"></v-tab-item>
      <v-tab-item value="tab-3"></v-tab-item>
      <v-tab-item value="tab-4">
        <v-card v-for="item in reviewArray" :key="item.id" :elevation="2">
          <v-card-title @click="toPlaceDetail(item)">
            {{ item.name }}
          </v-card-title>
          <div @click="toReviewDetail(item)">
            <Rating
              :readOnly="true"
              :starSize="20"
              :ratingResult="item.rating"
              :increment="1"
            ></Rating>
            <v-card-subtitle>{{ item.comment }}</v-card-subtitle>
            <v-list-item>
              <v-list-item-content class="date">
                {{ item.date }}
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-5"> </v-tab-item>
      <v-tab-item value="tab-6"> </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
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
              date: doc.data().date,
              placeId: doc.data().placeId,
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
