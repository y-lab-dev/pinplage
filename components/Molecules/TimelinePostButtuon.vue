<template>
  <v-fab-transition>
    <v-btn
      v-show="hidden"
      class="mr-0 mb-14"
      color="#DE237C"
      dark
      fixed
      bottom
      right
      fab
      large
      @click="pushPage()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      postTarget: [
        'post/threadPost',
        'post/wisdomPost',
        'post/reviewPost',
        '',
        'post/eventPost',
        'post/jobPost',
      ],
    };
  },
  computed: {
    ...mapGetters({
      tab: 'timeline/tab',
    }),
    hidden() {
      if (this.tab === 3) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    pushPage() {
      this.$router.push({ path: this.postTarget[this.tab] });
    },
  },
};
</script>
