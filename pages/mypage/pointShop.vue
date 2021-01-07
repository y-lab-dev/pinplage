<template>
  <div>
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#fff">
            <v-card-title>現在保有しているプラージュ:{{ pointAmount }}</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#61d4b3" dark @click="pushPage('pointShop-dressUp')">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"> 着せ替え </v-card-title>
                <v-card-subtitle class="pr-0 pb-2">10プラージュ必要</v-card-subtitle>

                <v-card-subtitle class="pr-0 py-0"
                  >マイページ上のグラデーションを購入することが出来ます</v-card-subtitle
                >
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="'https://cdn.vuetifyjs.com/images/cards/foster.jpg'"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#385F73" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"> 魂心屋 </v-card-title>
                <v-card-subtitle class="pr-0 pb-2">10プラージュ必要</v-card-subtitle>

                <v-card-subtitle class="pr-0 py-0"
                  >魂心屋まくりけんの抽選22枚に応募できます</v-card-subtitle
                >
                <v-card-subtitle class="pr-0 py-0">研究室にありました</v-card-subtitle>
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="'https://cdn.vuetifyjs.com/images/cards/foster.jpg'"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#61d4b3" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"> パンプラお年玉 </v-card-title>

                <v-card-subtitle class="pr-0">
                  パンプラージュからお年玉をもらえるかも？？
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text outlined> 次に進む </v-btn>
                </v-card-actions>
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="'https://cdn.vuetifyjs.com/images/cards/foster.jpg'"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';

export default {
  layout: 'onlyBack',
  data() {
    return {
      pointAmount: '',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    const users = firebase.firestore().collection('users');
    const that = this;
    users
      .doc(this.uid)
      .get()
      .then((doc) => {
        that.pointAmount = doc.data().point;
      });
  },
  methods: {
    pushPage(str) {
      this.$router.push({ name: str });
    },
  },
};
</script>
