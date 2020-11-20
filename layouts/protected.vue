<template>
  <!-- class="overflow-hidden" -->
  <v-app>
    <top-header />
    <v-sheet refs="maincontents">
      <v-main class="main-layout-styles">
        <nuxt />
      </v-main>
    </v-sheet>
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
.main-layout-styles {
  height: 100%;
}
</style>
