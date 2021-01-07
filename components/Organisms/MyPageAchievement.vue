<template>
  <div>
    <v-card class="mx-auto" max-height="9vh" :max-width="`${cardInfoTitleSize}vw`" elevation="1">
      <v-container>
        <v-row class="justify-center" no-gutters>
          <v-col v-for="item in cardInfo" :key="item.name" cols="4">
            <p class="ma-0 card-info-amount">{{ point }}</p>
            <p class="ma-0 card-info-title">{{ item.title }}</p>
          </v-col>
          <v-col cols="4">
            <v-btn color="#61d4b3" outlined rounded @click="toShop">
              <span>利用する</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    point: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      cardInfo: [{ title: 'プラージュ' }],
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
  methods: {
    toShop() {
      this.$router.push({ name: 'pointShop' });
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
