<template>
  <div>
    <star-rating
      :max-rating="3"
      :show-rating="false"
      :star-size="starSize"
      @rating-selected="setRating"
    ></star-rating>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating';
export default {
  components: {
    StarRating,
  },
  props: {
    starSize: {
      type: Number,
      required: true,
      default: 30,
    },
  },
  data() {
    return {
      rating: 0,
    };
  },
  watch: {
    rating() {
      this.$emit('input', this.rating);
    },
  },
  methods: {
    setRating(rating) {
      this.rating = rating;
    },
  },
};
</script>
