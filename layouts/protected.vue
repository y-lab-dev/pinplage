<template>
  <v-app>
    <top-header />
    <v-main>
      <nuxt />
    </v-main>
    <v-footer class="pa-0" fixed color="white">
      <bottom-tab />
    </v-footer>
  </v-app>
</template>
<script>
import TopHeader from '~/components/Organisms/TopHeader';
import BottomTab from '~/components/Organisms/TopBottom';
export default {
  components: {
    BottomTab,
    TopHeader,
  },
};
</script>
<style scoped>
#app {
  font-family: 'Kosugi', sans-serif;
}
</style>
