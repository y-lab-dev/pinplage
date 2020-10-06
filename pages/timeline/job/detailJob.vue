<template>
  <div style="margin-bottom: 60px">
    <v-row align="center" justify="space-around">
      <v-btn bottom left fixed rounded color="primary" dark>連絡してみる</v-btn>
      <v-btn v-show="!isKeep" bottom right fixed rounded color="success" dark @click="keep">
        <v-icon left>mdi-star</v-icon>
        キープする
      </v-btn>
      <v-btn v-show="isKeep" bottom right fixed rounded color="success" dark @click="notKeep">
        <v-icon left>mdi-star</v-icon>
        キープ済み
      </v-btn>
    </v-row>
    <div v-for="item in jobArray" :key="item.id">
      <viewer :images="item.img">
        <template v-for="src in item.img">
          <img :key="src" class="top-img" :src="src" />
        </template>
      </viewer>
      <v-card-title class="font-weight-black">{{ item.name }} </v-card-title>
      <v-card-subtitle>{{ item.genre }}</v-card-subtitle>
      <v-list-item>
        <v-icon size="25" left>mdi-currency-cny</v-icon>
        <v-list-item-content>時給{{ item.money }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-icon size="25" left>mdi-clock-time-three-outline</v-icon>
        <v-list-item-content
          >勤務時間帯 {{ item.startTime }}-{{ item.endTime }}</v-list-item-content
        >
      </v-list-item>
    </div>
    <div v-for="item in jobDetailArray" :key="item.id">
      <v-list-item>
        <v-list-item-content class="font-weight-black">仕事内容</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.content }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">シフト詳細</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.shift }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">休日</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.holiday }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">交通費支給</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.carfare }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">待遇・福利厚生</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.welfare }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">紹介料</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.refer }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">公式HP</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2"
          ><a :href="item.hp">{{ item.hp }}</a></v-list-item-content
        >
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">ここだけの話</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2">{{ item.secret }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="font-weight-black">連絡先</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-subtitle-2"
          ><a :href="'mailto:' + item.contactEmail">
            {{ item.contactEmail }}</a
          ></v-list-item-content
        >
      </v-list-item>
    </div>
    <v-list-item>
      <v-btn rounded color="primary" large dark>連絡してみる</v-btn>
    </v-list-item>
    <v-list-item v-show="!isKeep">
      <v-btn rounded color="success" large dark @click="keep">
        <v-icon left>mdi-star</v-icon>
        キープする
      </v-btn>
    </v-list-item>
    <v-list-item v-show="isKeep">
      <v-btn rounded color="success" large dark @click="notKeep">
        <v-icon left>mdi-star</v-icon>
        キープ済み
      </v-btn>
    </v-list-item>
    <v-list-item v-show="!isClose">
      <v-btn rounded color="pink" large dark @click="close">
        <v-icon left>mdi-star</v-icon>
        募集を締め切る
      </v-btn>
    </v-list-item>
    <v-list-item v-show="isClose">
      <v-btn rounded color="grey" large dark>
        <v-icon left>mdi-star</v-icon>
        募集を終了しました
      </v-btn>
    </v-list-item>
    <v-list-item v-show="isEdit">
      <nuxt-link to="/timeline/job/jobEdit">
        <v-btn rounded color="red" large dark>
          <v-icon left>mdi-pencil</v-icon>
          編集する
        </v-btn>
      </nuxt-link>
    </v-list-item>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';

export default {
  layout: 'onlyBack',
  data() {
    return {
      jobArray: [],
      jobDetailArray: [],
      isKeep: false,
      isEdit: false,
      isClose: false,
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email', id: 'job/id' }),
  },
  created() {
    const that = this;
    const job = firebase.firestore().collection('jobs').doc(this.id);
    const jobDetail = job.collection('detail');
    const user = firebase
      .firestore()
      .collection('users')
      .doc(this.uid)
      .collection('job')
      .doc('keep');

    job.get().then((doc) => {
      that.jobArray = [
        ...that.jobArray,
        {
          name: doc.data().name,
          place: doc.data().place,
          money: doc.data().money,
          img: [doc.data().img],
          genre: doc.data().genre,
          isRecruit: doc.data().isRecruit,
          startTime: doc.data().startTime,
          endTime: doc.data().endTime,
        },
      ];
      if (that.uid === doc.data().uid) {
        that.isEdit = true;
      }
      if (doc.data().isRecruit === false) {
        that.isClose = true;
      }
    });
    jobDetail.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        that.jobDetailArray = [
          ...that.jobDetailArray,
          {
            carfare: doc.data().carfare,
            welfare: doc.data().welfare,
            content: doc.data().content,
            shift: doc.data().shift,
            holiday: doc.data().holiday,
            contactEmail: doc.data().contactEmail,
            hp: doc.data().hp,
            refer: doc.data().refer,
            secret: doc.data().secret,
          },
        ];
      });
    });

    user.get().then((doc) => {
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
          alert('キープしました');
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
          alert('キープを解除しました');
          that.isKeep = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    close() {
      const that = this;
      const job = firebase.firestore().collection('jobs').doc(this.id);

      job
        .update({
          isRecruit: false,
        })
        .then(() => {
          alert('このアルバイトの募集を締め切りました');
          that.isClose = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
<style scoped>
.top-img {
  width: 100vw;
}
</style>
