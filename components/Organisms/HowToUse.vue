<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="#61d4b3" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
    </template>
    <v-card height="510px">
      <v-stepper v-model="page">
        <v-stepper-header>
          <v-stepper-step :complete="page > 1" step="1"> はじめに </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="page > 2" step="2"> Name of step 2 </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="page > 3" step="3"> Name of step 3 </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="4"> Name of step 4 </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card class="mb-12" color="gray lighten-1" height="313px">
              <v-img
                class="white--text"
                height="313px"
                :src="require('~/assets/post/reviewPost.jpg')"
              ></v-img>
            </v-card>
            <v-btn text @click="page = 4"> スキップ </v-btn>
            <v-btn color="#61d4b3" @click="page = 2"> 次へ </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card class="mb-12" color="grey lighten-1" height="313px"></v-card>
            <v-btn text @click="page = 1"> 戻る </v-btn>
            <v-btn color="#61d4b3" @click="page = 3"> 次へ </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card class="mb-12" color="grey lighten-1" height="313px"></v-card>
            <v-btn text @click="page = 2"> 戻る </v-btn>
            <v-btn color="#61d4b3" @click="page = 4"> 次へ </v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <v-card class="mb-12" color="grey lighten-1" height="313px">
              <v-card-title>いつでもメニューから見れるよ</v-card-title>
            </v-card>
            <v-btn text @click="page = 3"> 戻る </v-btn>
            <v-btn
              color="#61d4b3"
              @click="
                dialog = false;
                page = 1;
              "
            >
              始める
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      dialog: false,
    };
  },
};
</script>
