<template>
  <v-app>
    <top-header />
    <v-main style="height: 100%">
      <nuxt />
    </v-main>
    <bottom-tab />
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
