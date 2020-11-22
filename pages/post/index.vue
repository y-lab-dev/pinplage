<template>
  <div class="post-items">
    <v-container class="py-0 post-items" fluid>
      <v-row class="post-items" align-content="center">
        <v-col cols="6" class="post-card-left">
          <nuxt-link to="post/threadPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/threadPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-right">
          <nuxt-link to="post/wisdomPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/wisdomPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-left">
          <nuxt-link to="post/reviewPost" class="card-title">
            <v-card @click="$store.commit('place/getId', '')">
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/reviewPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-right">
          <nuxt-link to="post/circlePost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/circlePost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-left">
          <nuxt-link to="post/eventPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/eventPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-right">
          <nuxt-link to="post/jobPost" class="card-title">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/jobPost.jpg')"
              ></v-img>
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
.post-card-left {
  padding-left: 18px;
  padding-right: 9px;
  padding-top: 18px;
  padding-bottom: 0;
}
.post-card-right {
  padding-left: 9px;
  padding-right: 18px;
  padding-top: 18px;
  padding-bottom: 0;
}
</style>
