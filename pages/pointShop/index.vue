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
          <v-card color="#fff">
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-card-title v-bind="attrs" v-on="on">プラージュとは？</v-card-title>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2"> プラージュとは </v-card-title>

                <v-card-text class="pt-5">
                  パンプラージュ内で次の投稿アクションをする事で得ることが出来る、アプリ内通貨です。<br />
                  このプラージュショップ内で利用することが出来ます。<br />
                  <span style="color: red">対象の投稿アクション</span><br />
                  ①スレッドの投稿 <br />
                  ②知恵袋の投稿 <br />
                  ③アルバイト紹介の投稿 <br />
                  ④イベントの投稿 <br />
                  ⑤周辺施設口コミの投稿 <br />
                  <span style="color: red">獲得プラージュ数</span><br />
                  アクション①⇒5プラージュ<br />
                  アクション②～⑤⇒10プラージュ
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" @click="dialog = false"> 閉じる </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card @click="pushPage('pointShop-dressUp')">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"> 着せ替え </v-card-title>
                <v-card-subtitle class="pr-0 pb-2"
                  ><span style="color: red">10</span>プラージュ必要</v-card-subtitle
                >

                <v-card-subtitle class="pr-0 py-0"
                  >マイページ上のグラデーションを購入することが出来ます</v-card-subtitle
                >
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  :src="'https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/konshinya%2F%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202021-01-07%20144753.png?alt=media&token=15dc6bb0-70f4-4a71-b107-acc8beedafa7'"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <!-- <v-col cols="12">
          <v-card @click="pushPage('pointShop-konshinya')">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"> 魂心屋 </v-card-title>
                <v-card-subtitle class="pr-0 pb-2"
                  ><span style="color: red">20</span>プラージュ必要</v-card-subtitle
                >

                <v-card-subtitle class="pr-0 py-0"
                  >魂心屋まくりけんの抽選22枚に応募できます</v-card-subtitle
                >
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  :src="'https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/konshinya%2Fo0720096013247205936.jpg?alt=media&token=73f2c982-c9be-4d55-a995-a239262ac1c1'"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card @click="pushPage('pointShop-otoshidama')">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"> パンプラお年玉 </v-card-title>
                <v-card-subtitle class="pr-0 pb-2"
                  ><span style="color: red">20</span>プラージュ必要</v-card-subtitle
                >

                <v-card-subtitle class="pr-0">
                  パンプラージュからお年玉をもらえるかも？？
                </v-card-subtitle>
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  :src="'https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/konshinya%2F801963_s.jpg?alt=media&token=15b88252-4a9f-47a4-9458-8b9f26a283b0'"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col> -->
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
      dialog: false,
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
