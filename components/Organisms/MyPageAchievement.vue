<template>
  <div>
    <v-card class="mx-auto" max-height="9vh" :max-width="`${cardInfoTitleSize}vw`" elevation="1">
      <v-container>
        <v-row class="justify-center" no-gutters>
          <v-col v-for="item in cardInfo" :key="item.name" cols="4">
            <p class="ma-0 card-info-amount">{{ item.amount }}</p>
            <p class="ma-0 card-info-title">{{ item.title }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cardInfo: [{ title: 'ポイント', amount: '1231pp' }],
    };
  },
  computed: {
    cardInfoTitleSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return 70;
      } else {
        return 50;
      }
    },
  },
};
</script>
<style scoped>
.card-info-title {
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
}
.card-info-amount {
  font-size: 1rem;
  color: rgba(14, 232, 68, 0.6);
  text-align: center;
}
</style>
