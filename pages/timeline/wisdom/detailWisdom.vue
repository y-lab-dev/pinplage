<template>
  <div class="detail-wisdom-wrap">
    <v-container>
      <v-row align-content="center">
        <v-col cols="4">
          <v-chip v-if="!question.resolved" color="#61d4b3" dark>回答受付中</v-chip>
          <v-chip v-else color="#DE237C" dark>解決済み</v-chip>
        </v-col>
        <v-col cols="8" align-self="center">
          <span class="category">カテゴリ:{{ question.category }}</span>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row dense class="mt-2">
        <v-col cols="2">
          <v-avatar>
            <img :src="question.posterIcon" />
          </v-avatar>
        </v-col>
        <v-col cols="9" align-self="center">{{ question.posterName }}</v-col>
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
        <v-col cols="3" class="bar-item"><wisdom-like :wisdom-id="wisdomId" /></v-col>
      </v-row>
      <v-divider></v-divider>
    </v-container>
    <v-divider></v-divider>
    <v-container v-if="noReply" fluid>
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12">
          <p class="no-reply-message">現在、回答はありません。<br /></p>
        </v-col>
        <v-col cols="12">
          <p class="no-reply-info">下のフォームから回答してみませんか？</p>
        </v-col>
      </v-row>
    </v-container>
    <div v-else>
      <wisdom-reply
        v-for="(item, index) in answers"
        :key="item.wisdomId"
        :class="`index-${index}`"
        v-bind="answers[index]"
        :resolved="question.resolved"
        :poster="question.poster"
        :source-wisdom-id="wisdomId"
      />
    </div>
    <div class="wisdom-text-area-wrap">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import WisdomReply from '~/components/Organisms/WisdomReply';
import WisdomLike from '~/components/Organisms/WisdomLike';
export default {
  layout: 'onlyBack',
  components: { WisdomLike, WisdomReply },
  data() {
    return {
      newAnswers: [],
      answerMessage: null,
      isTouch: false,
    };
  },
  computed: {
    formatDay() {
      return dayjs(this.question.createdAt).format('HH:mm  YYYY/MM/DD ');
    },
    noReply() {
      if (this.answers.length === 0) {
        return true;
      } else {
        return false;
      }
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
      wisdomId: 'wisdomContents/wisdomId',
      question: 'wisdomContents/content',
      answers: 'wisdomContents/answers',
    }),
  },
  mounted() {
    console.log('run');
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
    scrollToElement(index) {
      this.$nextTick(() => {
        const newAnswerDOM = this.$el.getElementsByClassName(`index-${index}`)[0];
        newAnswerDOM.scrollIntoView({ behavior: 'smooth' });
      });
    },
    checkSelfWisdom(wisdomId) {
      if (this.uid === wisdomId) {
        return true;
      } else {
        return false;
      }
    },
    postReply() {
      this.$refs.answer.blur();
      const that = this;
      if (that.uid === '') {
        return;
      }
      const timestamp = firebase.firestore.Timestamp.now();
      const wisdoms = firebase.firestore().collection('wisdoms').doc(this.wisdomId);
      const users = firebase.firestore().collection('users').doc(this.uid);
      wisdoms
        .collection('reply')
        .add({
          content: that.answerMessage,
          bestAnswer: false,
          createdAt: timestamp,
          email: that.email,
          like: 0,
          replyer: that.uid,
        })
        .then((doc) => {
          that.answerMessage = '';
          that.scrollToElement(this.answers.length - 1);
          users
            .collection('wisdom')
            .doc('reply')
            .set({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) }, { merge: true });
        });
    },
  },
};
</script>
<style scoped>
.detail-wisdom-wrap {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}
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
.no-reply-block {
  display: flex;
  align-content: center;
  justify-content: center;
}
.no-reply-block,
.no-reply-info {
  color: black;
  opacity: 0.7;
}
.no-reply-message {
  margin-bottom: 0;
  text-align: center;
  font-size: 0.8rem;
}
.no-reply-info {
  margin-bottom: 0;
  text-align: center;
  font-size: 0.6rem;
}
</style>
