<template>
  <div class="detail-job-wrap">
    <v-container fluid>
      <v-row align="center">
        <v-col>
          <viewer :image="jobObject.img">
            <img class="top-img" :src="jobObject.img" />
          </viewer>
          <v-card-title class="font-weight-black">{{ jobObject.placeName }} </v-card-title>
          <v-card-subtitle>{{ jobObject.genre }}</v-card-subtitle>
          <v-list-item>
            <v-icon size="25" left>mdi-currency-cny</v-icon>
            <v-list-item-content class="ml-2">時給{{ jobObject.money }}円</v-list-item-content>
          </v-list-item>
          <div v-if="jobObject.remark" class="ml-5">{{ jobObject.remark }}</div>
          <v-list-item>
            <v-icon size="25" left>mdi-clock-time-three-outline</v-icon>
            <span class="ml-2"> 勤務時間</span>
          </v-list-item>
          <span class="ml-5">{{ jobObject.startTime1 }}-{{ jobObject.endTime1 }}</span>
          <span v-if="jobObject.startTime2" class="ml-2">
            {{ jobObject.startTime2 }}-{{ jobObject.endTime2 }}
          </span>
          <span v-if="jobObject.startTime3" class="ml-2">
            {{ jobObject.startTime3 }}-{{ jobObject.endTime3 }}
          </span>

          <v-divider class="mt-4 content-divider"></v-divider>
          <div class="content-title">募集情報</div>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">仕事内容</div>
            <div class="text-subtitle-2 mx-3">
              {{ jobDetailObject.content }}
            </div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">場所</div>
            <div class="text-subtitle-2 mx-3">{{ jobObject.placeName }}</div>
            <google-map v-show="geometry" :geometry="geometry" class="mb-3"></google-map>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">シフトについて</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.shift }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">従業員の雰囲気</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.employee }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">長期休暇や年末年始について</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.vacation }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">学校との両立のしやすさ</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.school }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">福利厚生</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.welfare }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">研修・教育制度</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.training }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">服装・髪型について</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.hair }}</div>
          </v-card>
          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">実際に働いている人の声</div>
            <div class="text-subtitle-2 mx-3">{{ jobDetailObject.opinion }}</div>
          </v-card>

          <div v-if="jobDetailObject.holiday">
            <v-card elevation="0" class="mb-4">
              <div class="font-weight-black mx-3 mb-2">定休日</div>
              <div class="text-subtitle-2 mx-3">
                {{ jobDetailObject.holiday }}
              </div>
            </v-card>
          </div>
          <div v-if="jobDetailObject.carfare">
            <v-card elevation="0" class="mb-4">
              <div class="font-weight-black mx-3 mb-2">交通費支給</div>
              <div class="text-subtitle-2 mx-3">
                {{ jobDetailObject.carfare }}
              </div>
            </v-card>
          </div>
          <div v-if="jobDetailObject.hp">
            <v-card elevation="0" class="mb-4">
              <div class="font-weight-black mx-3 mb-2">公式HP</div>
              <div class="text-subtitle-2 mx-3 content-url" @click="toLink(jobDetailObject.hp)">
                {{ jobDetailObject.hp }}
              </div>
            </v-card>
          </div>

          <v-card elevation="0" class="mb-4">
            <div class="font-weight-black mx-3 mb-2">連絡先</div>
            <div class="text-subtitle-2 mx-3">
              <a :href="'mailto:' + jobObject.contactEmail"> {{ jobObject.contactEmail }}</a>
            </div>
            <div v-if="jobObject.contactPhone" class="text-subtitle-2 mx-3">
              <a :href="'tel:' + jobObject.contactPhone"> {{ jobObject.contactPhone }}</a>
            </div>
            <div v-if="jobObject.contactRemark" class="text-subtitle-2 mx-3">
              {{ jobObject.contactRemark }}
            </div>
          </v-card>
          <nuxt-link to="/timeline/job/jobEdit">
            <v-btn v-if="isEdit" rounded class="edit-button">
              <v-icon left>mdi-pencil</v-icon>
              編集する
            </v-btn>
          </nuxt-link>
          <!-- <v-divider class="mt-12 content-divider"></v-divider>
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
          </v-list> -->

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
import firebase from '~/plugins/firebase';
import GoogleMap from '~/components/Atoms/GoogleMap';
// import dayjs from 'dayjs';
// import PostButton from '~/components/Atoms/AppButton';
// import TextArea from '~/components/Atoms/AppTextarea';
// import QuestionThread from '~/components/Molecules/QuestionThread';

export default {
  layout: 'onlyBack',
  components: {
    GoogleMap,
    // PostButton,
    // TextArea,
    // QuestionThread,
  },
  data() {
    return {
      buttonType: 'submit',
      jobQuestionArray: [],
      contentPlaceholder: 'バイトについて気になったことなど',
      content: '',
      isKeep: false,
      isEdit: false,
      geometry: {},
    };
  },
  computed: {
    ...mapGetters({
      jobDetailObject: 'job/recruitDetail',
      jobObject: 'job/recruitObject',
      id: 'job/id',
      uid: 'user/uid',
    }),
  },
  created() {
    const user = firebase.firestore().collection('users');
    const userJobKeep = user.doc(this.uid).collection('job').doc('keep');
    this.geometry = this.jobObject.geometry;
    console.log('uid' + this.uid);
    const that = this;

    // const jobQuestion = job.collection('question');
    // job.get().then((doc) => {
    //   that.jobObject = {
    //     name: doc.data().name,
    //     place: doc.data().place,
    //     money: doc.data().money,
    //     img: [doc.data().img],
    //     genre: doc.data().genre,
    //     isRecruit: doc.data().isRecruit,
    //     startTime: doc.data().startTime,
    //     endTime: doc.data().endTime,
    //     placeName: doc.data().placeName,
    //   };
    //   if (that.uid === doc.data().poster) {
    //     that.isEdit = true;
    //   }
    // });
    // jobDetail.get().then((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     that.jobDetailObject = {
    //       carfare: doc.data().carfare,
    //       welfare: doc.data().welfare,
    //       content: doc.data().content,
    //       shift: doc.data().shift,
    //       holiday: doc.data().holiday,
    //       contactEmail: doc.data().contactEmail,
    //       hp: doc.data().hp,
    //       refer: doc.data().refer,
    //       secret: doc.data().secret,
    //     };
    //   });
    // });

    // jobQuestion
    //   .orderBy('createdAt')
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       that.jobQuestionArray = [
    //         ...that.jobQuestionArray,
    //         {
    //           questionId: doc.id,
    //           questioner: doc.data().questioner,
    //           content: doc.data().content,
    //           createdAt: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
    //         },
    //       ];
    //     });
    //   });

    userJobKeep.get().then((doc) => {
      that.isKeep = doc.data().id.find((val) => {
        console.log(val);
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
      console.log('id: ' + that.id);

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
        window.open(link, null, 'noopener');
      } else {
        return null;
      }
    },
    // post() {
    //   const that = this;
    //   const jobQuestion = firebase
    //     .firestore()
    //     .collection('jobs')
    //     .doc(this.id)
    //     .collection('question');
    //   const user = firebase
    //     .firestore()
    //     .collection('users')
    //     .doc(this.uid)
    //     .collection('job')
    //     .doc('question');
    //   const timestamp = firebase.firestore.Timestamp.now();
    //   const question = {
    //     questionId: timestamp.toDate().toString(),
    //     content: that.content,
    //     createdAt: dayjs(timestamp.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
    //     questioner: that.uid,
    //   };

    //   jobQuestion
    //     .add({
    //       questioner: that.uid,
    //       email: that.email,
    //       createdAt: timestamp,
    //       content: that.content,
    //     })
    //     .then((doc) => {
    //       that.content = '';
    //       user
    //         .set({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) }, { merge: true })
    //         .then(() => {
    //           that.jobQuestionArray = [...that.jobQuestionArray, question];
    //           that.scrollToElement(that.jobQuestionArray.length - 1);
    //         })
    //         .catch((err) => {
    //           alert(err);
    //         });
    //     });
    // },
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
@media screen and (min-width: 960px) {
  .top-img {
    height: 40vh;
  }
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
  cursor: pointer;
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
