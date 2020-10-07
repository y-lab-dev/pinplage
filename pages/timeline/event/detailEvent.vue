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
            >{{ userName }}さんの公開イベント</v-list-item-content
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
          <v-list-item-content class="font-weight-black">参加費</v-list-item-content>
          <v-list-item-content class="text-subtitle-2">{{
            eventDetailObject.fee
          }}</v-list-item-content>
          <v-list-item-content class="font-weight-black">定員</v-list-item-content>
          <v-list-item-content class="text-subtitle-2">{{
            eventDetailObject.capacity
          }}</v-list-item-content>
          <v-list-item-content v-if="eventDetailObject.hpUrl" class="font-weight-black"
            >参考URL</v-list-item-content
          >
          <v-list-item-content
            class="text-subtitle-2 content-url"
            @click="toLink(eventDetailObject.hpUrl)"
          >
            {{ eventDetailObject.hpUrl }}
          </v-list-item-content>
        </v-list>
        <nuxt-link to="/timeline/event/eventEdit">
          <v-btn v-if="isEdit" rounded style="margin: 0 auto; float: right">
            <v-icon>mdi-pencil</v-icon>編集
          </v-btn>
        </nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'onlyBack',
  data() {
    return {
      eventObject: [],
      eventDetailObject: [],
      isInterest: false,
      isJoin: false,
      isEdit: false,
      isCancel: false,
      joinDialog: false,
      cancelDialog: false,
      userName: '',
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email', id: 'event/id' }),
  },
  created() {
    const that = this;
    const event = firebase.firestore().collection('events').doc(this.id);
    const eventDetail = event.collection('detail');
    const user = firebase.firestore().collection('users').doc(this.uid);
    const userEvent = user.collection('event');
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
          date: doc.data().date,
          holdDate: doc.data().date,
          join: doc.data().join,
          interest: doc.data().interest,
        };
        if (that.uid === doc.data().uid) {
          that.isEdit = true;
          console.log('that.isEdit: ', that.isEdit);
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

    user.get().then((doc) => {
      that.userName = doc.data().name;
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
          alert('このイベントに参加します');
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
          alert('イベント参加をキャンセルしました');
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
          alert('このイベントにいいねしました');
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
          alert('このイベントのいいねをやめました');
          that.isInterest = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    cancel() {
      const that = this;
      const event = firebase.firestore().collection('events').doc(this.id);

      event
        .update({
          cancel: true,
        })
        .then(() => {
          alert('このイベントを中止にしました');
          that.isCancel = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    toLink(link) {
      if (link.match(/^http(s)?/)) {
        location.href = link;
      } else {
        return null;
      }
    },
  },
};
</script>
<style scoped>
.top-img {
  width: 90vw;
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
</style>
