<template>
  <div class="header-footer">
    <v-container>
      <v-row justify="center">
        <v-col cols="6">
          <nuxt-link to="post/threadPost" class="card-title">
            <v-card>
              <v-img
                class="white--text align-end"
                height="150px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              >
                <v-card-title>スレッド</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6">
          <nuxt-link to="post/wisdomPost" class="card-title">
            <v-card>
              <v-img
                class="white--text align-end"
                height="150px"
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              >
                <v-card-title>知恵袋</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12">
          <nuxt-link to="post/eventPost" class="card-title">
            <v-card>
              <v-img
                class="white--text align-end"
                height="150px"
                src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
              >
                <v-card-title>イベント</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6">
          <nuxt-link to="post/placePost" class="card-title">
            <v-card>
              <v-img
                class="white--text align-end"
                height="150px"
                src="https://cdn.vuetifyjs.com/images/cards/road.jpg"
              >
                <v-card-title>周辺施設</v-card-title>
              </v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6">
          <nuxt-link to="post/parttimeJobPost" class="card-title">
            <v-card>
              <v-img
                class="white--text align-end"
                height="150px"
                src="https://cdn.vuetifyjs.com/images/cards/plane.jpg"
              >
                <v-card-title> アルバイト</v-card-title>
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
.header-footer {
  padding-top: 60px;
  padding-bottom: 60px;
}
.card-title {
  color: aliceblue;
}
</style>
