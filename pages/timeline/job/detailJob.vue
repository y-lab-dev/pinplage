<template>
  <div class="detail-job-wrap">
    <v-container fluid>
      <v-row align="center">
        <v-col>
          <viewer :images="jobObject.img">
            <template v-for="src in jobObject.img">
              <img :key="src" class="top-img" :src="src" />
            </template>
          </viewer>
          <v-card-title class="font-weight-black">{{ jobObject.name }} </v-card-title>
          <v-card-subtitle>{{ jobObject.genre }}</v-card-subtitle>
          <v-list-item>
            <v-icon size="25" left>mdi-currency-cny</v-icon>
            <v-list-item-content>時給{{ jobObject.money }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-icon size="25" left>mdi-clock-time-three-outline</v-icon>
            <v-list-item-content
              >勤務時間帯 {{ jobObject.startTime }}-{{ jobObject.endTime }}</v-list-item-content
            >
          </v-list-item>

          <v-divider class="mt-4 content-divider"></v-divider>
          <v-list>
            <v-list-item-title class="content-title">募集情報</v-list-item-title>
            <v-list-item>
              <v-list-item-content class="font-weight-black">仕事内容</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="text-subtitle-2 content-newline">{{
                jobDetailObject.content
              }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="font-weight-black">シフト詳細</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="text-subtitle-2 content-newline">{{
                jobDetailObject.shift
              }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="font-weight-black">場所</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="text-subtitle-2">{{
                jobObject.placeName
              }}</v-list-item-content>
            </v-list-item>
            <google-map v-show="geometry" :geometry="geometry"></google-map>
            <div v-if="jobDetailObject.holiday">
              <v-list-item>
                <v-list-item-content class="font-weight-black">休日</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="text-subtitle-2 content-newline">{{
                  jobDetailObject.holiday
                }}</v-list-item-content>
              </v-list-item>
            </div>
            <div v-if="jobDetailObject.carfare">
              <v-list-item>
                <v-list-item-content class="font-weight-black">交通費支給</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="text-subtitle-2 content-newline">{{
                  jobDetailObject.carfare
                }}</v-list-item-content>
              </v-list-item>
            </div>
            <div v-if="jobDetailObject.welfare">
              <v-list-item>
                <v-list-item-content class="font-weight-black">待遇・福利厚生</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="text-subtitle-2 content-newline">{{
                  jobDetailObject.welfare
                }}</v-list-item-content>
              </v-list-item>
            </div>
            <div v-if="jobDetailObject.refer">
              <v-list-item>
                <v-list-item-content class="font-weight-black">紹介料</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="text-subtitle-2 content-newline">{{
                  jobDetailObject.refer
                }}</v-list-item-content>
              </v-list-item>
            </div>
            <div v-if="jobDetailObject.hp">
              <v-list-item>
                <v-list-item-content class="font-weight-black">公式HP</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="text-subtitle-2" @click="toLink(jobDetailObject.hp)">{{
                  jobDetailObject.hp
                }}</v-list-item-content>
              </v-list-item>
            </div>
            <div v-if="jobDetailObject.secret">
              <v-list-item>
                <v-list-item-content class="font-weight-black">ここだけの話</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="text-subtitle-2 content-newline">{{
                  jobDetailObject.secret
                }}</v-list-item-content>
              </v-list-item>
            </div>
            <v-list-item>
              <v-list-item-content class="font-weight-black">連絡先</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="text-subtitle-2"
                ><a :href="'mailto:' + jobDetailObject.contactEmail">
                  {{ jobDetailObject.contactEmail }}</a
                ></v-list-item-content
              >
            </v-list-item>
          </v-list>
          <nuxt-link to="/timeline/job/jobEdit">
            <v-btn v-if="isEdit" rounded class="edit-button">
              <v-icon left>mdi-pencil</v-icon>
              編集する
            </v-btn>
          </nuxt-link>
          <v-divider class="mt-12 content-divider"></v-divider>
          <v-list two-line>
            <v-list-item-title class="content-title">質問リスト</v-list-item-title>
            <question-thread
              v-for="(item, index) in jobQuestionArray"
              :key="item.questionId"
              v-bind="jobQuestionArray[index]"
              :class="`index-${index}`"
            ></question-thread>
            <text-area
              class="mt-4"
              :textarea-placeholder="contentPlaceholder"
              :textarea-value="content"
              @input="content = $event"
            ></text-area>
            <v-list-item-content class="caption mx-8"
              ><p class="mb-0">
                不適切な投稿をすると、利用規約の違反により<span class="font-weight-bold"
                  >投稿の削除</span
                >や<span class="font-weight-bold">利用停止</span>となる場合があります。
              </p>
            </v-list-item-content>
            <div class="post-button">
              <post-button
                class="mt-4"
                :button-method="post"
                :button-type="buttonType"
                :button-disabled="content == ''"
                >質問投稿</post-button
              >
            </div>
          </v-list>
          <v-footer app fixed class="ma-0 py-3 buttom-button-bar">
            <v-row no-gutters>
              <v-col cols="7" class="text-center">
                <v-btn
                  v-show="!isKeep"
                  width="52vw"
                  rounded
                  outlined
                  color="yellow darken-3"
                  dark
                  class="bottom-button-nokeep"
                  @click="keep"
                >
                  <v-icon left>mdi-star</v-icon>
                  キープする
                </v-btn>
                <v-btn
                  v-show="isKeep"
                  width="52vw"
                  rounded
                  color="yellow darken-3"
                  dark
                  class="bottom-button-keep"
                  @click="notKeep"
                >
                  <v-icon left>mdi-star</v-icon>
                  キープ済み
                </v-btn>
              </v-col>
              <v-col cols="5" class="text-center">
                <a :href="'mailto:' + jobDetailObject.contactEmail">
                  <v-btn width="33vw" rounded color="teal lighten-1" class="bottom-button" dark>
                    <v-icon left>mdi-email-outline</v-icon>連絡する</v-btn
                  ></a
                >
              </v-col>
            </v-row>
          </v-footer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import TextArea from '~/components/Atoms/AppTextarea';
import GoogleMap from '~/components/Atoms/GoogleMap';
import QuestionThread from '~/components/Molecules/QuestionThread';

export default {
  layout: 'onlyBack',
  components: {
    PostButton,
    TextArea,
    GoogleMap,
    QuestionThread,
  },
  data() {
    return {
      buttonType: 'submit',
      jobObject: {},
      jobDetailObject: {},
      jobQuestionArray: [],
      contentPlaceholder: 'バイトについて気になったことなど',
      content: '',
      isKeep: false,
      isEdit: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
      id: 'job/id',
      geometry: 'job/geometry',
    }),
  },
  created() {
    const that = this;
    const job = firebase.firestore().collection('jobs').doc(this.id);
    const jobDetail = job.collection('detail');
    const jobQuestion = job.collection('question');
    const user = firebase.firestore().collection('users');
    const userJobKeep = user.doc(this.uid).collection('job').doc('keep');

    job.get().then((doc) => {
      that.jobObject = {
        name: doc.data().name,
        place: doc.data().place,
        money: doc.data().money,
        img: [doc.data().img],
        genre: doc.data().genre,
        isRecruit: doc.data().isRecruit,
        startTime: doc.data().startTime,
        endTime: doc.data().endTime,
        placeName: doc.data().placeName,
      };
      if (that.uid === doc.data().poster) {
        that.isEdit = true;
      }
    });
    jobDetail.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        that.jobDetailObject = {
          carfare: doc.data().carfare,
          welfare: doc.data().welfare,
          content: doc.data().content,
          shift: doc.data().shift,
          holiday: doc.data().holiday,
          contactEmail: doc.data().contactEmail,
          hp: doc.data().hp,
          refer: doc.data().refer,
          secret: doc.data().secret,
        };
      });
    });

    jobQuestion
      .orderBy('createdAt')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.jobQuestionArray = [
            ...that.jobQuestionArray,
            {
              questionId: doc.id,
              questioner: doc.data().questioner,
              content: doc.data().content,
              createdAt: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
            },
          ];
        });
      });

    userJobKeep.get().then((doc) => {
      that.isKeep = doc.data().id.find((val) => {
        return val === that.id;
      });
    });
  },
  methods: {
    keep() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('job')
        .doc('keep');

      user
        .update({ id: firebase.firestore.FieldValue.arrayUnion(that.id) })
        .then(() => {
          that.isKeep = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    notKeep() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('job')
        .doc('keep');

      user
        .update({ id: firebase.firestore.FieldValue.arrayRemove(that.id) })
        .then(() => {
          that.isKeep = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    scrollToElement(index) {
      this.$nextTick(() => {
        const newAnswerDOM = this.$el.getElementsByClassName(`index-${index}`)[0];
        newAnswerDOM.scrollIntoView({ behavior: 'smooth' });
      });
    },
    toLink(link) {
      if (link.match(/^http(s)?/)) {
        location.href = link;
      } else {
        return null;
      }
    },
    post() {
      const that = this;
      const jobQuestion = firebase
        .firestore()
        .collection('jobs')
        .doc(this.id)
        .collection('question');
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('job')
        .doc('question');
      const timestamp = firebase.firestore.Timestamp.now();
      const question = {
        questionId: timestamp.toDate().toString(),
        content: that.content,
        createdAt: dayjs(timestamp.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
        questioner: that.uid,
      };

      jobQuestion
        .add({
          questioner: that.uid,
          email: that.email,
          createdAt: timestamp,
          content: that.content,
        })
        .then((doc) => {
          that.content = '';
          user
            .set({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) }, { merge: true })
            .then(() => {
              that.jobQuestionArray = [...that.jobQuestionArray, question];
              that.scrollToElement(that.jobQuestionArray.length - 1);
            })
            .catch((err) => {
              alert(err);
            });
        });
    },
  },
};
</script>
<style scoped>
.detail-job-wrap {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}
.top-img {
  width: 100%;
  height: 30vh;
  object-fit: cover;
}
.content-divider {
  border-color: #61d4b3;
}
.content-title {
  color: #61d4b3;
  text-align: center;
}
.content-newline {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.content-url {
  color: #00f;
  text-decoration: underline;
}
.edit-button {
  float: right;
}
.post-button {
  text-align: center;
}
.bottom-button-nokeep {
  z-index: 1;
  background-color: #fff;
}
.bottom-button-keep {
  z-index: 1;
}
.buttom-button-bar {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
