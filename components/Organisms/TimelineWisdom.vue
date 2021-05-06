<template>
  <div class="infinite-scroll">
    <div class="infinite-scroll-list">
      <wisdom-thread v-for="item in wisdoms" :key="item.wisdomId" v-bind="item" />
    </div>
    <infinite-loading ref="infiniteLoading" spinner="waveDots" @infinite="infiniteHandler">
      <slot slot="no-more">表示可能な件数に達しました</slot>
      <slot slot="no-results">表示可能な件数に達しました</slot>
    </infinite-loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import WisdomThread from '~/components/Organisms/WisdomThread';
export default {
  components: { WisdomThread },
  fetch() {
    this.$store.dispatch('user/getPostedWisdom');
    this.$store.dispatch('user/getUserWisdom');
    this.$store.dispatch('user/getUserLikedWisdomReply');
    this.$store.dispatch('wisdom/getMaxLimit');
  },
  data() {
    return {
      test: false,
    };
  },
  computed: {
    ...mapGetters({
      wisdoms: 'wisdom/wisdoms',
      maxLimit: 'wisdom/maxLimit',
      limit: 'wisdom/limit',
      loading: 'wisdom/loading',
    }),
  },
  destroyed() {
    this.$store.dispatch('wisdom/unsubscribed');
  },
  methods: {
    infiniteHandler() {
      if (this.test) return;
      this.test = true;
      try {
        setTimeout(() => {
          if (this.maxLimit === this.wisdoms.length) {
            this.$refs.infiniteLoading.stateChanger.complete();
          } else {
            this.dispatchWisdom().then(() => {
              this.$refs.infiniteLoading.stateChanger.loaded();
            });
          }
        }, 500);
      } catch (error) {
        console.error(error);
      } finally {
        console.clear();
        setTimeout(() => {
          this.test = false;
          console.log('in finally test' + this.test);
        }, 1000);
      }
    },
    async dispatchWisdom() {
      await this.$store.dispatch('wisdom/incrementLimit');
    },
  },
};
</script>
