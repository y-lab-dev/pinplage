<template>
  <div>
    <v-card v-for="item in reviewArray" :key="item.id" :elevation="2">
      <v-card-title @click="toPlaceDetail(item)">
        {{ item.name }}
      </v-card-title>
      <div @click="toReviewDetail(item)">
        <rating
          :read-only="true"
          :star-size="20"
          :rating-result="item.rating"
          :increment="1"
        ></rating>
        <v-card-subtitle>{{ item.comment }}</v-card-subtitle>
        <v-list-item>
          <v-list-item-content class="date">
            {{ item.date }}
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-card>
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
