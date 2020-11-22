<template>
  <div style="height: 100%">
    <v-container class="post-wisdom-back" style="height: 100%" fluid>
      <v-row justify="center">
        <v-card width="90vw" color="white">
          <v-container class="py-0">
            <v-row justify="center">
              <v-col cols="5">
                <v-img height="auto" :src="require('~/assets/post/wisdomPost.png')"></v-img>
              </v-col>
              <v-col cols="6" align-self="center" class="pa-0 pr-5">
                <v-row>
                  <v-col cols="12" class="pa-0">
                    <p class="catchphrase">静大生に</p>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <p class="catchphrase">気になること</p>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <p class="catchphrase">知りたいこと</p>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <p class="catchphrase">聞いてみませんか？</p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row class="mt-2" align="start" justify="center">
        <v-col>
          <v-card elevation="1">
            <v-container>
              <v-row class="px-4">
                <v-col cols="2">
                  <v-avatar>
                    <img :src="userIcon" />
                  </v-avatar>
                </v-col>
                <v-col cols="9" align-self="center">{{ userName }}</v-col>
              </v-row>
              <v-row dense class="ma-2">
                <v-col cols="12">
                  カテゴリー:
                  <v-btn
                    :dark="category === selectCategory ? false : true"
                    :rounded="category === selectCategory ? false : true"
                    :outlined="category === selectCategory ? true : false"
                    :color="category === selectCategory ? '' : '#61d4b3'"
                    @click="categoryOverlay = true"
                    >{{ category }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <v-textarea
                    v-model="newQuestion"
                    class="px-3"
                    counter="300"
                    placeholder="新規質問を作成する"
                    :full-width="true"
                    color="#61d4b3"
                    outlined
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row justify="end">
                <v-col v-if="overLimit" cols="9" align-self="center">
                  <p class="mb-0 warning-message">
                    <span class="over-message">{{ questionCounter - 300 }}</span>
                    文字オーバーしています
                  </p>
                </v-col>
                <v-col class="pa-1" cols="3">
                  <v-btn
                    v-if="!overLimit && canSend"
                    elevation="5"
                    fab
                    color="#61d4b3"
                    :disabled="overLimit"
                    @click="postQuestion()"
                  >
                    <v-icon v-if="!overLimit && canSend" color="#fff">mdi-send</v-icon>
                  </v-btn>
                  <v-icon v-if="overLimit" x-large color="#f00">mdi-do-not-disturb</v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay class="overlay" :absolute="true" :value="categoryOverlay" opacity="0.2">
      <wisdom-category @my-click="category = $event" @my-boolean="categoryOverlay = $event" />
    </v-overlay>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import WisdomCategory from '~/components/Organisms/WisdomCategory';
export default {
  layout: 'protected',
  components: { WisdomCategory },
  data() {
    return {
      newQuestion: null,
      categoryOverlay: false,
      category: 'カテゴリを選択する',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      userName: 'user/name',
      userIcon: 'user/icon',
    }),
    questionCounter() {
      if (this.newQuestion === null) {
        return 0;
      } else {
        return this.newQuestion.length;
      }
    },
    overLimit() {
      if (this.questionCounter > 300) {
        return true;
      } else {
        return false;
      }
    },
    selectCategory() {
      if (this.category === 'カテゴリを選択する') {
        return false;
      } else {
        return true;
      }
    },
    canSend() {
      if (this.selectCategory && this.newQuestion) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    console.log(this.newQuestion === false);
  },
  methods: {
    postQuestion() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp.now();
      const wisdoms = firebase.firestore().collection('wisdoms');
      const users = firebase.firestore().collection('users');
      wisdoms
        .add({
          category: that.category,
          content: that.newQuestion,
          createdAt: timestamp,
          email: that.email,
          like: 0,
          read: false,
          poster: that.uid,
          resolved: false,
        })
        .then((doc) => {
          users
            .doc(that.uid)
            .collection('wisdom')
            .doc('post')
            .set({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) }, { merge: true });
        });
      that.newQuestion = null;
      that.$router.push({ name: 'timeline' });
    },
  },
};
</script>
<style scoped>
.post-wisdom-back {
  background-color: #e7e7e75e;
}
.warning-message {
  text-align: right;
  opacity: 0.6;
  font-size: 0.7rem;
}
.over-message {
  color: red;
  font-size: 0.9rem;
}
.catchphrase {
  text-align: center;
  margin-bottom: 0;
  font-size: 0.8rem;
}
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
