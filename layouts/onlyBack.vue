<template>
  <v-app class="overflow-hidden">
    <v-app-bar app color="#fff" style="max-width: 100vw">
      <v-btn icon :ripple="false" @click="backPage()">
        <v-icon color="#78dabe">mdi-arrow-left-bold-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="main-layout-styles">
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  methods: {
    backPage() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
#app {
  font-family: 'Kosugi', sans-serif;
}
.main-layout-styles {
  height: 100%;
  width: 100vw;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter,
.page-leave-to {
  transform: translateX(-20px);
  opacity: 0;
  transition: all 0.2s;
}
</style>
