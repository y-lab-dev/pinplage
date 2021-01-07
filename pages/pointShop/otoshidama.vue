<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="pb-0">パンプラお年玉</v-card-title>
            <p class="mb-0 pr-4" style="text-align: right">
              現在の応募人数：<span style="color: red">{{ appliers.length }}</span>
            </p>
            <v-card-subtitle> パンプラージュからお年玉もらえるかも？？？ </v-card-subtitle>
            <v-img
              height="150px"
              src="https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/konshinya%2F801963_s.jpg?alt=media&token=15b88252-4a9f-47a4-9458-8b9f26a283b0"
            />
            <v-card-text>20プラージュを利用してパンプラージュのお年玉権に応募できます</v-card-text>
            <div class="text-center">
              <p style="margin-bottom: 0">↓クリックして流れを確認する↓</p>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn width="70vw" dark x-large color="error" v-bind="attrs" v-on="on">
                    パンプラお年玉の流れ
                  </v-btn>
                </template>

                <v-stepper v-model="e1">
                  <v-stepper-header>
                    <v-stepper-step :complete="e1 > 1" step="1"> Name of step 1 </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 2" step="2"> Name of step 2 </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3"> Name of step 3 </v-stepper-step>
                  </v-stepper-header>

                  <v-stepper-items>
                    <v-stepper-content step="1">
                      <v-card class="mb-12" color="">
                        <v-card-title> 流れ①</v-card-title>
                        <v-card-text>パンプラージュ運営が３０００円分の宝くじを購入</v-card-text>
                        <v-card-title> 流れ②</v-card-title>
                        <v-card-text
                          >パンプラージュユーザーは20プラージュを利用してパンプラージュの<span
                            style="color: red"
                            >お年玉獲得権利を獲得できます</span
                          ></v-card-text
                        >
                      </v-card>

                      <v-btn color="primary" @click="e1 = 2"> 次に進む </v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                      <v-card class="mb-12" color="">
                        <v-card-title>もし当選した場合</v-card-title>
                        <v-card-text>
                          ユーザーの獲得金額は<br />
                          <span
                            style="color: red; font-size: 0.8rem; text-align: center; margin: 5px"
                            >獲得金額 = 当選金額 ÷ 権利獲得者人数</span
                          ><br />
                          となります。
                        </v-card-text>
                      </v-card>
                      <v-card class="mb-12" color="">
                        <v-card-title>獲得金額が100円以下の場合</v-card-title>
                        <v-card-text>
                          今後のパンプラージュ運営費に回させていただきます
                        </v-card-text>
                      </v-card>

                      <v-btn color="primary" @click="e1 = 3"> 次に進む </v-btn>

                      <v-btn text @click="e1 = 1"> 戻る </v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                      <v-card class="mb-12" color="">
                        <v-card-subtitle> 結果はパンプラージュ公式twitterで！ </v-card-subtitle>
                        <v-img
                          height="150px"
                          src="https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/konshinya%2F801963_s.jpg?alt=media&token=15b88252-4a9f-47a4-9458-8b9f26a283b0"
                        />
                      </v-card>

                      <v-btn color="primary" @click="e1 = 1"> 最初に戻る </v-btn>
                      <v-btn text @click="dialog = false"> 閉じる </v-btn>
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
              </v-dialog>
              <v-spacer></v-spacer>
            </v-card-actions>
            <div class="text-center">
              <p style="margin-bottom: 0">↓応募はこちらから↓</p>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn v-if="(alreadyApplied && enoughPoints) || (alreadyApplied && !enoughPoints)">
                応募済み
              </v-btn>
              <p v-if="!alreadyApplied && !enoughPoints">
                <span style="color: red">プラージュが足りません</span>
              </p> -->
              <v-dialog v-model="applyDialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-if="canApply" dark x-large color="warning" v-bind="attrs" v-on="on">
                    応募する
                  </v-btn>
                  <v-btn v-else-if="alreadyApplied">応募済み</v-btn>
                  <v-btn v-else-if="!enoughPoints" color="error">プラージュが足りません</v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2"> 応募確認画面 </v-card-title>

                  <v-card-text class="pt-5">
                    応募は1人1回までとなっています。<br />
                    現在のあなたのプラージュ：<span style="color: red">{{ userPoint }}</span> <br />
                    消費プラージュ：20 <br />
                    応募後のあなたのプラージュ：<span style="color: red">{{ userPoint - 20 }}</span
                    ><br />
                    一度応募すると利用したプラージュを返還することは出来ませんのでご了承ください。
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" @click="apply"> 応募を完了する </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-card-subtitle>応募期間：2020/01/01~2020/01/10 0:00</v-card-subtitle>
            <v-card-subtitle>結果発表日：2020/01/11 10:00</v-card-subtitle>
            <v-card-subtitle class="pb-0"
              >お渡し：＊メールにて,お渡し日を決定します</v-card-subtitle
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
const users = firebase.firestore().collection('users');
const otoshidama = firebase.firestore().collection('otoshidama');

export default {
  layout: 'onlyBack',
  data() {
    return {
      userPoint: '',
      appliers: [],
      e1: 1,
      dialog: false,
      applyDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      icon: 'user/icon',
    }),
    alreadyApplied() {
      if (this.appliers.includes(this.uid)) {
        return true;
      } else {
        return false;
      }
    },
    enoughPoints() {
      if (this.userPoint >= 20) {
        return true;
      } else {
        return false;
      }
    },
    canApply() {
      if (this.alreadyApplied === false && this.enoughPoints === true) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    const that = this;
    users
      .doc(this.uid)
      .get()
      .then((doc) => {
        that.userPoint = doc.data().point;
      });
    otoshidama.get().then((snap) => {
      snap.forEach((doc) => {
        that.appliers = [...that.appliers, doc.data().applier];
      });
    });
  },
  methods: {
    apply() {
      const timestamp = firebase.firestore.Timestamp.now();
      this.decrementPoint().then(() => {
        otoshidama.add({
          applier: this.uid,
          name: this.email,
          createdAt: timestamp,
        });
        this.$router.go(-1);
      });
    },
    async decrementPoint() {
      const user = firebase.firestore().collection('users').doc(this.uid);
      const that = this;
      await user.update({ point: that.userPoint - 20 });
    },
  },
};
</script>
