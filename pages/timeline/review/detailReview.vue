<template>
  <div>
    <v-card>
      <v-card-title> {{ reviewArray.name }} </v-card-title>
      <Rating
        :readOnly="true"
        :starSize="20"
        :ratingResult="reviewArray.rating"
        :increment="1"
      ></Rating>
      <v-card-subtitle>{{ reviewArray.comment }}</v-card-subtitle>
      <v-list-item>
        <v-list-item-content class="date"> {{ reviewArray.date }} </v-list-item-content>
      </v-list-item>
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
      reviewArray: {},
    };
  },
  created() {
    const self = this;
    store
      .doc(self.$store.state.review.reviewId)
      .get()
      .then((doc) => {
        console.log(doc);
        self.reviewArray = {
          id: doc.id,
          name: doc.data().name,
          rating: doc.data().rating,
          comment: doc.data().comment,
          date: doc.data().date,
          placeId: doc.data().placeId,
        };
      })
      .catch((err) => {
        alert('エラー' + err);
      });
    console.log('reviewArray' + this.reviewArray);
  },
};
</script>
