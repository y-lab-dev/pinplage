<template>
  <div class="post-items">
    <v-container class="py-0 post-items" fluid>
      <v-row class="post-items" align-content="center">
        <v-col cols="6">
          <nuxt-link to="post/eventPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/eventPost.png')"
              >
                <v-card-title class="text-subtitle-1 pt-3">イベント</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6">
          <nuxt-link to="post/wisdomPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/wisdomPost.png')"
              >
                <v-card-title class="text-subtitle-1 pt-3">知恵袋</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12">
          <nuxt-link to="post/threadPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/threadPost.png')"
              >
                <v-card-title class="text-subtitle-1 pt-2">スレッド</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6">
          <nuxt-link to="post/parttimeJobPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/parttimeJobPost.png')"
              >
                <v-card-title class="text-subtitle-1 pt-3">アルバイト</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6">
          <nuxt-link to="post/placePost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/placePost.png')"
              >
                <v-card-title class="text-subtitle-1 pt-3">周辺施設</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  layout: 'protected',
};
</script>
<style scoped>
.post-items {
  height: 100%;
}
.card-title {
  color: aliceblue;
}
</style>
