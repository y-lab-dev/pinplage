<template>
  <div>
    <v-container>
      <v-row align-content="center">
        <v-col cols="4">
          <v-chip v-if="!question.resolved" color="#61d4b3" dark>回答受付中</v-chip>
          <v-chip v-if="question.resolved" color="#DE237C" dark>解決済み！</v-chip>
        </v-col>
        <v-col cols="8" align-self="center">
          <span class="category">カテゴリ:{{ question.category }}</span>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row dense class="mt-2">
        <v-col cols="2">
          <v-avatar>
            <img :src="posterIcon" />
          </v-avatar>
        </v-col>
        <v-col cols="9" align-self="center">{{ posterName }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12">{{ question.content }}</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" class="format-day">{{ formatDay }}</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row dense align-content="center">
        <v-col cols="3">{{ answers.length }}件の回答</v-col>
        <v-col cols="5">{{ question.likeAmount }}件のいいね</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row dense justify="center">
        <v-col cols="3" class="bar-item" align-self="start" @click="openMessage()">
          <v-icon class="mx-auto">mdi-message-outline</v-icon>
        </v-col>
        <v-col cols="3" class="bar-item">
          <v-icon class="mx-auto" @click="pushLike()">mdi-heart-outline</v-icon>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-container>
    <v-divider></v-divider>
    <v-container fluid> </v-container>
    <div v-if="!noReply">
      <wisdom-thread
        v-for="(item, index) in answers"
        :key="item.wisdomId"
        v-bind="answers[index]"
        :answer-display="true"
      />
    </div>
    <div v-else></div>
    <v-footer app fixed color="white" class="text-area">
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-textarea
              ref="answer"
              v-model="answerMessage"
              clearable
              auto-grow
              dense
              outlined
              color="#61d4b3"
              rows="1"
              hide-details
              placeholder="回答する"
              @click="isTouch = true"
              @click:clear="clearMessage()"
              @blur="isTouch = false"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row
          v-show="isTouch || answerCounter"
          class="mt-1"
          no-gutters
          justify="end"
          @touch="isTouch = true"
        >
          <v-col v-if="overLimit" cols="5" align-self="center">
            <span class="over-characther">文字数をオーバーしています</span>
          </v-col>
          <v-col cols="3" align-self="center">
            <span :style="overLimit ? 'color:red;' : ''">{{ answerCounter }}</span> / 200
          </v-col>
          <v-col cols="2">
            <v-chip
              :disabled="overLimit || !answerMessage"
              dark
              color="#61d4b3"
              @click="postReply()"
              >回答</v-chip
            >
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import WisdomThread from '~/components/Organisms/WisdomThread';
export default {
  layout: 'onlyBack',
  components: WisdomThread,
  data() {
    return {
      question: {},
      answers: [],
      posterIcon: null,
      posterName: null,
      noReply: false,
      answerMessage: null,
      isTouch: false,
    };
  },
  computed: {
    formatDay() {
      const formatDay = dayjs(this.question.createdDay).format('HH:mm  YYYY/MM/DD ');
      return formatDay;
    },
    answerCounter() {
      if (this.answerMessage === null) {
        return 0;
      } else {
        return this.answerMessage.length;
      }
    },
    overLimit() {
      if (this.answerCounter > 200) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    const that = this;
    const docId = this.$route.query;
    const wisdoms = firebase.firestore().collection('wisdoms').doc(docId);
    const users = firebase.firestore().collection('users');
    async function getWisdoms() {
      await wisdoms.get().then((doc) => {
        const wisdom = doc.data();
        that.question = {
          wisdomId: doc.id,
          poster: wisdom.poster,
          likeAmount: wisdom.like,
          resolved: wisdom.resolved,
          content: wisdom.content,
          category: wisdom.category,
          createdDay: wisdom.createdAt.toDate(),
        };
      });
    }

    getWisdoms().then(() => {
      users
        .doc(that.question.poster)
        .get()
        .then((doc) => {
          that.posterName = doc.data().name;
          that.posterIcon = doc.data().icon;
        });
    });

    wisdoms
      .collection('reply')
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        if (snapshot.size !== 0) {
          snapshot.forEach((doc) => {
            const answer = doc.data();
            const answerDetail = {
              wisdomId: doc.id,
              poster: answer.replyer,
              likeAmount: answer.like,
              content: answer.content,
              createdDay: answer.createdAt.toDate(),
            };
            that.answers.push(answerDetail);
          });
        } else {
          that.noReply = true;
        }
      });
  },
  methods: {
    clearMessage() {
      this.answerMessage = '';
      this.isTouch = false;
    },
    openMessage() {
      this.isTouch = true;
      this.$refs.answer.focus();
    },
    pushLike() {
      console.log('like');
    },
    postReply() {
      const that = this;
      if (that.uid === '') {
        console.log('no uid');
        return;
      }
      const timestamp = firebase.firestore.Timestamp.now();
      const wisdoms = firebase.firestore().collection('wisdoms').doc(this.$route.query);
      wisdoms
        .collection('reply')
        .doc()
        .set({
          content: that.answerMessage,
          bestAnswer: false,
          createdAt: timestamp,
          email: that.email,
          like: 0,
          replyer: that.uid,
        })
        .then(() => {
          const newAnswer = {
            wisdomId: timestamp.toDate().toString(),
            poster: that.uid,
            likeAmount: 0,
            content: that.answerMessage,
            createdDay: timestamp.toDate(),
          };
          that.answerMessage = '';
          window.scrollTo(0, 0);
          that.answers.unshift(newAnswer);
        });
    },
  },
};
</script>
<style scoped>
.category {
  font-size: 0.8rem;
  opacity: 0.8;
}
.bar-item {
  text-align: center;
}
.format-day {
  font-size: 0.8rem;
  opacity: 0.8;
}
.text-area {
  border-top: 1px solid rgb(53, 53, 53) !important;
}
.over-characther {
  color: red;
  font-size: 0.6rem;
}
</style>
