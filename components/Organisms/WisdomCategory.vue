<template>
  <v-card class="category-card" color="#fff">
    <v-card class="category-icon" width="95vw" color="#fff">
      <v-card-actions>
        <v-icon color="#000" @click="sendBoolean(false)">mdi-arrow-left</v-icon>
        <v-spacer></v-spacer>
        <span class="category-list-title">カテゴリを一つ選んでください</span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <v-container>
      <v-row v-for="item in categoryList" :key="item.mainCategory" justify="start">
        <v-col cols="12">
          <span class="category-main-title">{{ item.mainCategory }}</span>
        </v-col>
        <v-chip
          v-for="(category, index) in item.subCategory"
          :key="index"
          class="ma-1"
          color="#61D4B3"
          @click="sendCategory(category.name), sendBoolean(false)"
        >
          {{ category.name }}
        </v-chip>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import categoryList from '~/assets/wisdomCategory.json';

export default {
  data() {
    return {
      categoryList,
    };
  },
  methods: {
    sendCategory(category) {
      this.$emit('my-click', category);
    },
    sendBoolean(boolean) {
      this.$emit('my-boolean', boolean);
    },
  },
};
</script>

<style scoped>
.category-main-title,
.category-list-title {
  color: #000;
}
.category-card {
  max-height: 70vh;
  max-width: 95vw;
  overflow: scroll;
}
.category-icon {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 200;
}
</style>
