<template>
  <div class="infinite-scroll">
    <div class="infinite-scroll-list">
      <wisdom-thread v-for="item in wisdoms" :key="item.wisdomId" v-bind="item" />
      <infinite-loading ref="infiniteLoading" spinner="waveDots" @infinite="infiniteHandler">
        <slot slot="no-more">表示可能な件数に達しました</slot>
        <slot slot="no-results">表示可能な件数に達しました</slot>
      </infinite-loading>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import WisdomThread from '~/components/Organisms/WisdomThread';
export default {
  components: { WisdomThread },
  fetch() {
    this.$store.dispatch('user/getPostedWisdom');
    this.$store.dispatch('user/getUserLikedWisdomReply');
  },
  computed: {
    ...mapGetters({
      wisdoms: 'wisdom/wisdoms',
      maxLimit: 'wisdom/maxLimit',
      limit: 'wisdom/limit',
    }),
  },
  destroyed() {
    this.$store.dispatch('wisdom/unsubscribed');
  },
  methods: {
    infiniteHandler() {
      setTimeout(() => {
        if (this.maxLimit < this.limit) {
          this.$refs.infiniteLoading.stateChanger.complete();
        } else {
          this.dispatchWisdom().then(() => {
            this.$refs.infiniteLoading.stateChanger.loaded();
          });
        }
      }, 250);
    },
    async dispatchWisdom() {
      await this.$store.dispatch('wisdom/incrementLimit');
    },
  },
};
</script>
