<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <div class="title">アルバイト編集</div>
        <input-image :img-path="imgPath" @imgSubmit="imgAdd"></input-image>
        <v-text-field
          v-model="name"
          color="#61d4b3"
          label="店舗名/アルバイト名"
          prepend-icon="mdi-flag-variant"
        ></v-text-field>
        <input-place
          :input-type="inputType"
          :input-placeholder="placeholder"
          @place="placeAdd"
        ></input-place>
        <v-select
          v-model="genre"
          :items="genres"
          sv-model="genre"
          color="#61d4b3"
          label="ジャンル"
          prepend-icon="mdi-content-copy"
        ></v-select>
        <v-text-field
          v-model="money"
          color="#61d4b3"
          label="時給"
          prepend-icon="mdi-currency-cny"
        ></v-text-field>
        <div style="display: inline-flex">
          <v-dialog
            ref="dialog1"
            v-model="startTimeModal"
            :return-value.sync="startTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startTime"
                color="#61d4b3"
                label="勤務時間(始まり)"
                prepend-icon="mdi-clock"
                readonly
                class="mr-3"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="startTimeModal" v-model="startTime" full-width color="#61d4b3">
              <v-btn text color="#61d4b3" @click="startTimeModal = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="$refs.dialog1.save(startTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
          <v-dialog
            ref="dialog2"
            v-model="endTimeModal"
            :return-value.sync="endTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endTime"
                color="#61d4b3"
                label="(終わり)"
                prepend-icon
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="endTimeModal" v-model="endTime" full-width color="#61d4b3">
              <v-btn text color="#61d4b3" @click="endTimeModal = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="$refs.dialog2.save(endTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </div>
        <v-text-field
          v-model="holiday"
          color="#61d4b3"
          label="休日"
          prepend-icon="mdi-seat-individual-suite"
        ></v-text-field>
        <v-textarea
          v-model="content"
          color="#61d4b3"
          label="仕事内容"
          auto-grow
          rows="3"
          prepend-icon="mdi-pencil"
        ></v-textarea>
        <v-textarea
          v-model="shift"
          color="#61d4b3"
          label="シフト詳細"
          auto-grow
          rows="3"
          prepend-icon="mdi-calendar-clock"
        ></v-textarea>
        <v-textarea
          v-model="welfare"
          color="#61d4b3"
          label="福利厚生"
          auto-grow
          rows="3"
          prepend-icon="mdi-hand-heart"
        ></v-textarea>
        <v-text-field
          v-model="carfare"
          color="#61d4b3"
          label="交通費"
          prepend-icon="mdi-train-car"
        ></v-text-field>
        <v-text-field
          v-model="refer"
          color="#61d4b3"
          label="紹介料"
          prepend-icon="mdi-cash-usd"
        ></v-text-field>
        <v-text-field
          v-model="hpUrl"
          color="#61d4b3"
          label="ホームページなど（URL）"
          prepend-icon="mdi-home-circle-outline"
        ></v-text-field>
        <v-text-field
          v-model="contactEmail"
          color="#61d4b3"
          label="連絡先"
          prepend-icon="mdi-email-multiple"
        ></v-text-field>
        <v-textarea
          v-model="secret"
          color="#61d4b3"
          label="ここだけの話"
          auto-grow
          rows="3"
          prepend-icon="mdi-lock"
        ></v-textarea>
        <post-button
          :button-method="post"
          :button-type="buttonType"
          :button-disabled="
            img == '' ||
            name == '' ||
            genre == '' ||
            place == '' ||
            money == '' ||
            startTime == '' ||
            endTime == '' ||
            holiday == '' ||
            content == '' ||
            shift == '' ||
            welfare == '' ||
            carfare == '' ||
            refer == '' ||
            contactEmail == '' ||
            secret == ''
          "
          >編集完了</post-button
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import InputImage from '~/components/Molecules/AppImageInput';
import InputPlace from '~/components/Molecules/AppInputPlace';

export default {
  layout: 'protected',
  components: {
    PostButton,
    InputImage,
    InputPlace,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      imgPath: 'jobs/image/',
      placeholder: '場所',
      startTimeModal: false,
      endTimeModal: false,
      genres: [
        '飲食/フード',
        '教育',
        '販売',
        'アパレル',
        'IT/コンピュータ',
        '物流/配送',
        '工場/製造',
        'キャバクラ/クラブ',
        '専門職/その他',
      ],
      img: '',
      name: '',
      genre: '',
      place: '',
      money: '',
      startTime: '',
      endTime: '',
      holiday: '',
      content: '',
      shift: '',
      welfare: '',
      carfare: '',
      refer: '',
      contactEmail: '',
      hpUrl: '',
      secret: '',
      res: '',
    };
  },
  computed: {
    ...mapGetters({ id: 'job/id' }),
  },
  created() {
    const that = this;
    const job = firebase.firestore().collection('jobs').doc(this.id);

    job.get().then((doc) => {
      that.img = doc.data().img;
      that.name = doc.data().name;
      that.genre = doc.data().genre;
      that.place = doc.data().place;
      that.money = doc.data().money;
      that.startTime = doc.data().startTime;
      that.endTime = doc.data().endTime;
      that.isRecruit = doc.data().isRecruit;

      job
        .collection('detail')
        .doc('browse')
        .get()
        .then((doc) => {
          console.log(doc.data());
          that.holiday = doc.data().holiday;
          that.content = doc.data().content;
          that.shift = doc.data().shift;
          that.welfare = doc.data().welfare;
          that.carfare = doc.data().carfare;
          that.refer = doc.data().refer;
          that.hpUrl = doc.data().hp;
          that.contactEmail = doc.data().contactEmail;
          that.secret = doc.data().secret;
        });
    });
  },
  methods: {
    post() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp.now();
      const job = firebase.firestore().collection('jobs').doc(this.id);

      job
        .update({
          img: that.img,
          name: that.name,
          genre: that.genre,
          place: that.place,
          money: that.money,
          startTime: that.startTime,
          endTime: that.endTime,
          isRecruit: true,
          updatedAt: timestamp,
        })
        .then((doc) => {
          job.doc(doc.id).collection('detail').doc('browse').update({
            holiday: that.holiday,
            content: that.content,
            shift: that.shift,
            welfare: that.welfare,
            carfare: that.carfare,
            refer: that.refer,
            hp: that.hpUrl,
            contactEmail: that.contactEmail,
            secret: that.secret,
          });
        })
        .catch((err) => {
          alert(err);
        });
    },
    imgAdd(url) {
      this.img = url;
    },
    placeAdd(id) {
      this.place = id;
    },
  },
};
</script>
<style scoped>
.title {
  text-align: center;
}
</style>
