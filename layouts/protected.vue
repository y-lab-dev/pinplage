<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer class="pa-0" fixed color="white">
      <bottom-tab />
    </v-footer>
  </v-app>
</template>
<script>
import BottomTab from '~/components/Organisms/TopBottom';
export default {
  components: {
    BottomTab,
  },
};
</script>
