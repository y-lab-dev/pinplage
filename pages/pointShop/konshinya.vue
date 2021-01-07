<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="pb-0"> 魂心屋のまくり券22枚抽選応募</v-card-title>
            <p class="mb-0 pr-4" style="text-align: right">
              現在の応募人数：<span style="color: red">{{ appliers.length }}</span>
            </p>
            <v-card-subtitle
              >こちらから「魂心屋のまくり券22枚抽選応募」にご応募いただくと応募したユーザの中から1名様に「魂心屋のまくり券22枚」をさしあげます。</v-card-subtitle
            >
            <v-img
              height="200px"
              src="https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/konshinya%2Fo0720096013247205936.jpg?alt=media&token=73f2c982-c9be-4d55-a995-a239262ac1c1"
            />

            <div class="text-center">
              <p style="margin-bottom: 0">↓応募はこちらから↓</p>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" width="500">
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
            <v-card-subtitle>当選発表日：2020/01/11 10:00</v-card-subtitle>
            <v-card-subtitle class="pb-0">お渡し：2020/01/10以降</v-card-subtitle>
            <v-card-subtitle class="pt-0">＊メールにて,お渡し日を決定します</v-card-subtitle>
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
      userPoint: '',
      appliers: [],
      dialog: false,
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
    const users = firebase.firestore().collection('users');
    const konshinya = firebase.firestore().collection('konshinya');

    users
      .doc(this.uid)
      .get()
      .then((doc) => {
        that.userPoint = doc.data().point;
      });

    konshinya.get().then((snap) => {
      snap.forEach((doc) => {
        that.appliers = [...that.appliers, doc.data().applier];
      });
    });
  },
  methods: {
    apply() {
      const konshinya = firebase.firestore().collection('konshinya');
      const timestamp = firebase.firestore.Timestamp.now();

      this.decrementPoint().then(() => {
        konshinya.add({
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
