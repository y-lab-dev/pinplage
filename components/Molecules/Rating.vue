<template>
  <div>
    <star-rating
      v-model="ratingResult"
      :max-rating="5"
      :show-rating="showRating"
      :read-only="true"
      :star-size="starSize"
      :increment="increment"
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
    showRating: {
      type: Boolean,
      required: true,
      default: false,
    },
    starSize: {
      type: Number,
      required: true,
      default: 30,
    },
    ratingResult: {
      type: Number,
      required: true,
      default: 0,
    },
    increment: {
      type: Number,
      required: true,
      default: 1,
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
  mounted() {
    if (this.ratingResult != null) {
      this.rating = this.ratingResult;
    }
  },
  methods: {
    setRating(rating) {
      this.rating = rating;
    },
  },
};
</script>
