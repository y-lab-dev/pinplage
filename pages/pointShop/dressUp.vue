<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>マイページ背景着せ替え</v-card-title>
            <v-card-subtitle class="pb-0"
              >こちらで購入した背景をマイページの背景としてご利用頂けます。
            </v-card-subtitle>
            <v-card-subtitle>グラデーションをタッチすると購入することができます。 </v-card-subtitle>
            <v-card-subtitle
              >購入後のテーマ変更はマイページ右上の編集ボタン<v-icon small
                >mdi-account-edit-outline</v-icon
              >から変更可能です。
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(item, n) in gradients" :key="n" cols="6">
          <granim
            :granim-canvas="`granim-canvas${n}`"
            :granim-height="granimHeight"
            :granim-width="granimWidth"
            :granim-round="granimRound"
            :granim-speed="5000"
            :granim-theme="gradients[n].name"
          />
          <p class="theme-name">
            {{ `${n}:${gradients[n].name}` }}
            <v-dialog width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-chip v-if="!gradients[n].already" color="#61d4b3" v-bind="attrs" v-on="on"
                  >購入する</v-chip
                >
                <v-chip v-else>購入済み</v-chip>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2"> 購入確認画面 </v-card-title>

                <v-card-text class="pt-5">
                  現在のあなたのプラージュ：<span style="color: red">{{ userPoint }}</span> <br />
                  消費プラージュ：10 <br />
                  購入後のあなたのプラージュ：<span style="color: red">{{ userPoint - 10 }}</span
                  ><br />
                  一度購入すると利用したプラージュを返還することは出来ませんのでご了承ください。
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="enoughPoints" color="warning" @click="purchase(n)">
                    購入を完了する
                  </v-btn>
                  <v-chip v-else>プラージュが足りません</v-chip>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import granim from '~/components/Atoms/Granim';

export default {
  layout: 'onlyBack',
  components: {
    granim,
  },
  data() {
    return {
      userPoint: [],
      usersBackground: [],
      granimHeight: '100%',
      granimWidth: '100%',
      granimRound: '15px',
      gradients: [
        {
          name: '初夏',
          array: [
            ['#85FFBD', '#FFFB7D'],
            ['#FFFB7D', '#85FFBD'],
          ],
          already: false,
        },
        {
          name: '秋風',
          array: [
            ['#F71810', '#FCCE22'],
            ['#F4DD2E', '#F3EC0E'],
          ],
          already: false,
        },
        {
          name: '夕焼け',
          array: [
            ['#fa709a', '#fee140'],
            ['#fee140', '#fa709a'],
          ],
          already: false,
        },
        {
          name: '海風',
          array: [
            ['#4facfe', '#00f2fe'],
            ['#00f2fe', '#66a6ff'],
          ],
          already: false,
        },
        {
          name: '妖艶',
          array: [
            ['#c471f5', '#fa71cd'],
            ['#0250c5', '#d43f8d'],
          ],
          already: false,
        },
        {
          name: '深海',
          array: [
            ['#30cfd0', '#330867'],
            ['#5337df', '#30cfd0'],
          ],
          already: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
    enoughPoints() {
      if (this.userPoint >= 10) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    const users = firebase.firestore().collection('users');
    const that = this;

    users
      .doc(this.uid)
      .get()
      .then((doc) => {
        that.userPoint = doc.data().point;
      });

    users
      .doc(this.uid)
      .collection('items')
      .doc('background')
      .get()
      .then((doc) => {
        if (doc.exists) {
          that.usersBackground = doc.data().themes;
          that.gradients.forEach((element) => {
            if (that.usersBackground.includes(element.name)) {
              element.already = true;
            } else {
              element.already = false;
            }
          });
        } else {
          console.log('no data');
        }
      });
  },
  methods: {
    purchase(n) {
      this.gradients[n].already = true;
      const users = firebase.firestore().collection('users');
      const that = this;
      this.decresePoint()
        .then(() => {
          users
            .doc(this.uid)
            .collection('items')
            .doc('background')
            .set(
              { themes: firebase.firestore.FieldValue.arrayUnion(that.gradients[n].name) },
              { merge: true }
            );
        })
        .then(() => {
          this.$router.go(-1);
        });
    },
    async decresePoint() {
      const user = firebase.firestore().collection('users').doc(this.uid);
      const that = this;
      await user.update({ point: that.userPoint - 10 });
    },
  },
};
</script>

<style scoped>
.theme-name {
  margin-bottom: 0;
  text-align: center;
}
</style>
