<template>
  <v-container fluid>
    <v-row align="center">
      <v-col>
        <viewer :images="eventObject.img">
          <template v-for="src in eventObject.img">
            <img :key="src" class="top-img" :src="src" />
          </template>
        </viewer>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle class="red--text">{{ eventObject.date }}</v-list-item-subtitle>
            <v-list-item-title>{{ eventObject.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ eventObject.placeName }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-btn
          v-show="!isJoin"
          class="ml-2"
          color="#61d4b3"
          rounded
          width="80%"
          color-text="white"
          dark
          @click="joinDialog = true"
          >参加する</v-btn
        >
        <v-dialog v-model="joinDialog" width="400">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title
              >イベントに参加</v-card-title
            >

            <v-card-text class="mt-5 px-5 pb-5" style="text-align: center"
              >このイベントに参加しますか？</v-card-text
            >
            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="#61d4b3" text @click="joinDialog = false">キャンセル</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue" text @click="join()">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          v-show="!isInterest"
          class="ml-2"
          style="float: right"
          color="#61d4b3"
          fab
          small
          dark
          @click="interest()"
        >
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn
          v-show="isJoin"
          class="ml-2"
          color="#61d4b3"
          rounded
          width="80%"
          color-text="white"
          dark
          @click="cancelDialog = true"
        >
          参加する
          <v-icon>mdi-check-circle-outline</v-icon>
        </v-btn>
        <v-dialog v-model="cancelDialog" width="400">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title
              >イベントのキャンセル</v-card-title
            >

            <v-card-text class="mt-5 px-5 pb-5" style="text-align: center"
              >このイベントの参加をやめますか？</v-card-text
            >
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="#61d4b3" text @click="cancelDialog = false">キャンセル</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="notJoin()">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          v-show="isInterest"
          class="ml-2"
          color="#61d4b3"
          style="color: #ea5532; float: right"
          fab
          small
          dark
          @click="notInterest()"
        >
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
        <v-list-item class="mt-3">
          <v-icon size="25" left>mdi-account-multiple</v-icon>
          <v-list-item-content class="text-subtitle-2">
            参加予定人数{{ eventObject.join }}人・{{ eventObject.interest }}人が興味あり
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-icon size="25" left>mdi-account-check</v-icon>
          <v-list-item-content class="text-subtitle-2"
            >{{ poster }}さんの公開イベント</v-list-item-content
          >
        </v-list-item>
        <v-list-item>
          <v-icon size="25" left>mdi-map-marker</v-icon>
          <v-list-item-content class="text-subtitle-2">{{
            eventObject.placeName
          }}</v-list-item-content>
        </v-list-item>
        <v-divider class="mt-4 content-divider"></v-divider>
        <v-list>
          <v-list-item-title class="content-title">基本情報</v-list-item-title>
          <v-list-item-content class="font-weight-black">詳細</v-list-item-content>
          <v-list-item-content
            class="text-subtitle-2"
            style="white-space: pre-wrap; word-wrap: break-word"
            >{{ eventDetailObject.content }}</v-list-item-content
          >
          <v-list-item-content class="font-weight-black">日時 </v-list-item-content>
          <v-list-item-content class="text-subtitle-2">
            {{ eventObject.date }} {{ eventDetailObject.startTime }}-{{
              eventDetailObject.finishTime
            }}
          </v-list-item-content>
          <v-list-item-content class="font-weight-black">場所</v-list-item-content>
          <v-list-item-content class="text-subtitle-2">{{
            eventObject.placeName
          }}</v-list-item-content>
          <google-map v-show="geometry" :geometry="geometry"></google-map>
          <div v-if="eventDetailObject.fee">
            <v-list-item-content v-if="eventDetailObject.fee" class="font-weight-black"
              >参加費</v-list-item-content
            >
            <v-list-item-content class="text-subtitle-2">{{
              eventDetailObject.fee
            }}</v-list-item-content>
          </div>
          <div v-if="eventDetailObject.capacity">
            <v-list-item-content class="font-weight-black">定員</v-list-item-content>
            <v-list-item-content class="text-subtitle-2">{{
              eventDetailObject.capacity
            }}</v-list-item-content>
          </div>
          <div v-if="eventDetailObject.hpUrl">
            <v-list-item-content class="font-weight-black">参考URL</v-list-item-content>
            <v-list-item-content
              class="text-subtitle-2 content-url"
              @click="toLink(eventDetailObject.hpUrl)"
            >
              {{ eventDetailObject.hpUrl }}
            </v-list-item-content>
          </div>
        </v-list>
        <nuxt-link to="/timeline/event/eventEdit">
          <v-btn v-if="isEdit" rounded style="margin: 0 auto; float: right">
            <v-icon>mdi-pencil</v-icon>編集
          </v-btn>
        </nuxt-link>
        <v-divider class="mt-12 content-divider"></v-divider>
        <v-list two-line>
          <v-list-item-title class="content-title">質問リスト</v-list-item-title>
          <question-thread
            v-for="(item, index) in eventQuestionArray"
            :key="item.questionId"
            v-bind="eventQuestionArray[index]"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import TextArea from '~/components/Atoms/AppTextarea';
import GoogleMap from '~/components/Atoms/GoogleMap';
import QuestionThread from '~/components/molecules/QuestionThread';

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
      contentPlaceholder: 'イベントについて気になったことなど',
      eventObject: [],
      eventDetailObject: [],
      eventQuestionArray: [],
      content: '',
      isInterest: false,
      isJoin: false,
      isEdit: false,
      isCancel: false,
      joinDialog: false,
      cancelDialog: false,
      userName: '',
      userIcon: '',
      poster: '',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
      id: 'event/id',
      geometry: 'event/geometry',
    }),
  },
  created() {
    const that = this;
    const event = firebase.firestore().collection('events').doc(this.id);
    const eventDetail = event.collection('detail');
    const eventQuestion = event.collection('question');
    const user = firebase.firestore().collection('users');
    const loginUser = user.doc(this.uid);
    const userEvent = loginUser.collection('event');
    const userEventJoin = userEvent.doc('join');
    const userEventInterest = userEvent.doc('interest');

    event
      .get()
      .then((doc) => {
        that.eventObject = {
          title: doc.data().title,
          type: doc.data().type,
          img: [doc.data().img],
          placeId: doc.data().placeId,
          placeName: doc.data().placeName,
          geometry: doc.data().geometry,
          date: doc.data().date,
          holdDate: doc.data().date,
          join: doc.data().join,
          interest: doc.data().interest,
        };

        user
          .doc(doc.data().poster)
          .get()
          .then((doc) => {
            that.poster = doc.data().name;
          });

        if (that.uid === doc.data().poster) {
          that.isEdit = true;
        }
        if (doc.data().isCancel === true) {
          that.isCancel = true;
        }
      })
      .then((doc) => {
        eventDetail
          .doc('browse')
          .get()
          .then((doc) => {
            that.eventDetailObject = {
              capacity: doc.data().capacity,
              content: doc.data().content,
              fee: doc.data().fee,
              hpUrl: doc.data().hpUrl,
              startTime: doc.data().startTime,
              finishTime: doc.data().finishTime,
            };
          });
      });
    eventQuestion
      .orderBy('createdAt')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.eventQuestionArray = [
            ...that.eventQuestionArray,
            {
              questionId: doc.id,
              content: doc.data().content,
              createdAt: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
              questioner: doc.data().questioner,
            },
          ];
        });
      });

    userEventJoin.get().then((doc) => {
      that.isJoin = doc.data().id.find((val) => {
        return val === that.id;
      });
    });
    userEventInterest.get().then((doc) => {
      that.isInterest = doc.data().id.find((val) => {
        return val === that.id;
      });
    });
  },
  methods: {
    join() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('event')
        .doc('join');

      user
        .update({ id: firebase.firestore.FieldValue.arrayUnion(that.id) })
        .then(() => {
          that.isJoin = true;
          that.joinDialog = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    notJoin() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('event')
        .doc('join');

      user
        .update({ id: firebase.firestore.FieldValue.arrayRemove(that.id) })
        .then(() => {
          that.isJoin = false;
          that.cancelDialog = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    interest() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('event')
        .doc('interest');

      user
        .update({ id: firebase.firestore.FieldValue.arrayUnion(that.id) })
        .then(() => {
          that.isInterest = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    notInterest() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('event')
        .doc('interest');

      user
        .update({ id: firebase.firestore.FieldValue.arrayRemove(that.id) })
        .then(() => {
          that.isInterest = false;
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
      const eventQuestion = firebase
        .firestore()
        .collection('events')
        .doc(this.id)
        .collection('question');
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('event')
        .doc('reply');
      const timestamp = firebase.firestore.Timestamp.now();
      const question = {
        questionId: timestamp.toDate().toString(),
        content: that.content,
        createdAt: dayjs(timestamp.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
        questioner: that.uid,
      };

      eventQuestion
        .add({
          questioner: that.uid,
          email: that.email,
          createdAt: timestamp,
          content: that.content,
        })
        .then((doc) => {
          that.content = '';
          user
            .update({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) })
            .then(() => {
              that.eventQuestionArray = [...that.eventQuestionArray, question];
              that.scrollToElement(that.eventQuestionArray.length - 1);
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
.content-url {
  color: #00f;
  text-decoration: underline;
}
.post-button {
  text-align: center;
}
</style>
