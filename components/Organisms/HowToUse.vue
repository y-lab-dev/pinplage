<template>
  <v-dialog v-model="dialog" persistent>
    <!-- <template v-slot:activator="{ on, attrs }">
      <v-btn color="#61d4b3" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
    </template> -->
    <v-card class="parent">
      <v-stepper v-model="page">
        <v-stepper-header>
          <v-stepper-step :complete="page > 1" step="1"> ようこそ </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="page > 2" step="2"> タイムライン </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="page > 3" step="3"> 検索 </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="page > 4" step="4"> 投稿 </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="page > 5" step="5"> 時間割 </v-stepper-step>

          <!-- <v-divider></v-divider>

          <v-stepper-step step="6"> おわり </v-stepper-step> -->
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card class="mb-12" color="white" height="60vh" flat>
              <v-responsive :aspect-ratio="3 / 4">
                <v-img
                  class="white--text"
                  height="60vh"
                  :src="require('~/assets/howtouse/top.jpg')"
                  contain
                ></v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn dark color="#61d4b3" @click="page = 2"> 次へ </v-btn>
                </v-card-actions>
              </v-responsive>
            </v-card>
            <!-- <v-btn text @click="dialog = false"> スキップ </v-btn> -->
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card class="mb-12" color="white" height="60vh" flat>
              <v-responsive :aspect-ratio="3 / 4">
                <v-img
                  class="white--text"
                  height="60vh"
                  :src="require('~/assets/howtouse/timeline.jpg')"
                  contain
                ></v-img>
                <v-card-actions>
                  <v-btn text @click="page = 1"> 戻る </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark color="#61d4b3" @click="page = 3"> 次へ </v-btn>
                </v-card-actions>
              </v-responsive>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card class="mb-12" color="white" height="60vh" flat>
              <v-responsive :aspect-ratio="3 / 4">
                <v-img
                  class="white--text"
                  height="60vh"
                  :src="require('~/assets/howtouse/search.jpg')"
                  contain
                ></v-img>
                <v-card-actions>
                  <v-btn text @click="page = 2"> 戻る </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark color="#61d4b3" @click="page = 4"> 次へ </v-btn>
                </v-card-actions>
              </v-responsive>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="4">
            <v-card class="mb-12" color="white" height="60vh" flat>
              <v-responsive :aspect-ratio="3 / 4">
                <v-img
                  class="white--text"
                  height="60vh"
                  :src="require('~/assets/howtouse/post.jpg')"
                  contain
                ></v-img>
                <v-card-actions>
                  <v-btn text @click="page = 3"> 戻る </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark color="#61d4b3" @click="page = 5"> 次へ </v-btn>
                </v-card-actions>
              </v-responsive>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="5">
            <v-card class="mb-12" color="white" height="60vh" flat>
              <v-responsive :aspect-ratio="3 / 4">
                <v-img
                  class="white--text"
                  height="60vh"
                  :src="require('~/assets/howtouse/timetable.jpg')"
                  contain
                ></v-img>
                <v-card-actions>
                  <v-btn text @click="page = 4"> 戻る </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark color="#61d4b3" @click="page = 6"> 次へ </v-btn>
                </v-card-actions>
              </v-responsive>
            </v-card>

            <!-- <v-btn color="#61d4b3" @click="dialog = false"> 始める </v-btn> -->
          </v-stepper-content>

          <v-stepper-content step="6">
            <v-card class="mb-12" color="white" height="60vh" flat>
              <v-responsive :aspect-ratio="3 / 4">
                <v-img
                  class="white--text"
                  height="60vh"
                  :src="require('~/assets/howtouse/finish.jpg')"
                  contain
                ></v-img>
                <v-card-actions>
                  <v-btn text @click="page = 5"> 戻る </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark color="#61d4b3" @click="clickStart"> 始める </v-btn>
                </v-card-actions>
              </v-responsive>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';

export default {
  data() {
    return {
      page: 1,
      dialog: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
    }),
  },
  created() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.uid)
      .get()
      .then((doc) => {
        if (doc.data().firstAccess === undefined) {
          this.dialog = true;
        }
      });
  },
  methods: {
    clickStart() {
      this.dialog = false;
      this.page = 1;
      firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .set({ firstAccess: false }, { merge: true });
    },
  },
};
</script>
