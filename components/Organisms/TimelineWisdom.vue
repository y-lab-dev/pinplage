<template>
  <div>
    <wisdom-thread v-for="item in wisdoms" :key="item.wisdomId" v-bind="item" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import WisdomThread from '~/components/Organisms/WisdomThread';
export default {
  components: { WisdomThread },
  data() {
    return {
      postedWisdoms: [],
      likedWisdoms: '',
    };
  },
  computed: {
    ...mapGetters({
      wisdoms: 'wisdom/wisdoms',
    }),
  },
  created() {
    this.$store.dispatch('user/getUserWisdom');
    this.$store.dispatch('user/getPostedWisdom');
    this.$store.dispatch('user/getUserLikedWisdomReply');
  },
};
</script>
