<template>
  <div class="job-edit-wrap">
    <v-container>
      <p class="required-phrase">※は必須項目です</p>
      <v-row justify="center">
        <v-col cols="12">
          <v-img v-show="img" :src="img" class="top-img"></v-img>
          <v-btn v-show="img" class="ml-2" style="float: right" @click="imgDelete">
            <v-icon>mdi-delete-empty</v-icon>
          </v-btn>
          <v-file-input
            v-show="!img"
            color="#61d4b3"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="※画像"
            :clearable="false"
            @change="imgAdd"
          ></v-file-input>
          <v-text-field
            v-model="name"
            color="#61d4b3"
            label="※店舗名/アルバイト名"
            prepend-icon="mdi-flag-variant"
          ></v-text-field>
          <div ref="map" />
          <v-text-field
            ref="input"
            v-model="placeName"
            color="#61d4b3"
            label="※場所"
            prepend-icon="mdi-map-marker-radius"
            :rules="[() => !!placeName || requiredText]"
            required
          ></v-text-field>
          <v-select
            v-model="genre"
            :items="genres"
            sv-model="genre"
            color="#61d4b3"
            label="※ジャンル"
            prepend-icon="mdi-content-copy"
          ></v-select>
          <v-text-field
            v-model="money"
            color="#61d4b3"
            label="※時給"
            prepend-icon="mdi-currency-cny"
          ></v-text-field>
          <div style="display: inline-flex">
            <v-dialog
              ref="dialog1"
              v-model="startTimeModal"
              :return-placeue.sync="startTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startTime"
                  color="#61d4b3"
                  label="※勤務時間(始まり)"
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
              :return-placeue.sync="endTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endTime"
                  color="#61d4b3"
                  label="※(終わり)"
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
          <v-textarea
            v-model="content"
            color="#61d4b3"
            label="※仕事内容"
            auto-grow
            rows="3"
            prepend-icon="mdi-pencil"
          ></v-textarea>
          <v-textarea
            v-model="shift"
            color="#61d4b3"
            label="※シフト詳細"
            auto-grow
            rows="3"
            prepend-icon="mdi-calendar-clock"
          ></v-textarea>
          <v-text-field
            v-model="contactEmail"
            color="#61d4b3"
            label="※連絡先"
            prepend-icon="mdi-email-multiple"
          ></v-text-field>
          <v-text-field
            v-model="holiday"
            color="#61d4b3"
            label="休日"
            prepend-icon="mdi-seat-individual-suite"
          ></v-text-field>
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
          <v-textarea
            v-model="secret"
            color="#61d4b3"
            label="ここだけの話"
            auto-grow
            rows="3"
            prepend-icon="mdi-lock"
          ></v-textarea>
          <div class="edit-button mb-3">
            <post-button
              :button-method="post"
              :button-type="buttonType"
              :button-disabled="
                img == '' ||
                name == '' ||
                genre == '' ||
                placeId == '' ||
                placeName == '' ||
                money == '' ||
                startTime == '' ||
                endTime == '' ||
                content == '' ||
                shift == '' ||
                contactEmail == ''
              "
              >編集完了</post-button
            >
          </div>
          <div class="close-button">
            <v-btn
              v-show="!isClose"
              width="80vw"
              max-width="500px"
              rounded
              dark
              color="pink lighten-2"
              @click="close"
            >
              <v-icon left>mdi-emoticon-kiss-outline</v-icon>
              募集を締め切る
            </v-btn>
            <v-btn v-show="isClose" width="80vw" max-width="500px" rounded dark color="grey">
              <v-icon left>mdi-check-circle-outline</v-icon>
              募集を終了しました
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
require('dotenv').config();

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: process.env.GOOGLEMAPS_APIKEY,
    libraries: ['places'],
    language: 'ja',
  });
  return gmap;
}
const crypto = require('crypto');
function md5hex(str /*: string */) {
  const md5 = crypto.createHash('md5');
  return md5.update(str, 'binary').digest('hex');
}

export default {
  layout: 'protected',
  components: {
    PostButton,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      requiredText: 'この項目は必須です',
      startTimeModal: false,
      endTimeModal: false,
      isClose: false,
      genres: [
        '生協紹介',
        '大学紹介',
        '実験・研究協力',
        '飲食/フード',
        'カフェ',
        '居酒屋',
        '販売・接客・サービス',
        'アパレル・ファッション関連',
        'レジャー・アミューズメント',
        'クリエイティブ・編集',
        'エンジニア・サポート・保守',
        'イベント・キャンペーン',
        '教育',
        '塾講',
        '家庭教師',
        'エステ・理美容',
        '医療・介護・保育',
        'オフィスワーク',
        '営業',
        '配送・引越・ドライバー',
        '軽作業',
        '工場・倉庫・建築・土木',
        '警備・清掃・ビル管理',
        '誰か助けて！',
      ],
      name: '',
      genre: '',
      img: '',
      placeId: '',
      placeName: '',
      geometry: '',
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
      gmap: {},
      mapAutoComplete: null,
      map: null,
      coord: { lat: 34.709557, lng: 137.726014 },
      defaultZoom: 14.0,
      restriction: {
        latLngBounds: {
          north: 34.854409,
          south: 34.38496,
          west: 137.547374,
          east: 137.820871,
        },
        strictBounds: false,
      },
      fiels: ['place_id', 'name', 'type', 'geometry'],
    };
  },
  computed: {
    ...mapGetters({ id: 'job/id' }),
  },
  created() {
    const that = this;
    const job = firebase.firestore().collection('jobs').doc(this.id);

    job.get().then((doc) => {
      that.name = doc.data().name;
      that.genre = doc.data().genre;
      that.img = doc.data().img;
      that.placeId = doc.data().placeId;
      that.placeName = doc.data().placeName;
      that.geometry = doc.data().geometry;
      that.money = doc.data().money;
      that.startTime = doc.data().startTime;
      that.endTime = doc.data().endTime;
      that.isRecruit = doc.data().isRecruit;
      if (doc.data().isRecruit === false) {
        that.isClose = true;
      }
      job
        .collection('detail')
        .doc('browse')
        .get()
        .then((doc) => {
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
  async mounted() {
    this.gmap = await initMap();
    this.map = new this.gmap.Map(this.$refs.map, {
      center: new this.gmap.LatLng(this.coord.lat, this.coord.lng),
      zoom: this.defaultZoom,
      restriction: this.restriction,
      mapTypeControl: false,
      streetViewControl: false,
    });
    const defaultBounds = new this.gmap.LatLngBounds(
      new this.gmap.LatLng(this.restriction.latLngBounds.south, this.restriction.latLngBounds.west),
      new this.gmap.LatLng(this.restriction.latLngBounds.north, this.restriction.latLngBounds.east)
    );
    const searchOptions = {
      bounds: defaultBounds,
      componentRestrictions: { country: 'jp' },
      types: ['establishment'],
      strictBounds: true,
    };
    let element = this.$refs.input.$el;
    element = element.querySelector('input');
    this.mapAutoComplete = new this.gmap.places.Autocomplete(element, searchOptions);
    this.mapAutoComplete.setFields(this.fiels);
    this.mapAutoComplete.addListener('place_changed', () => {
      this.onClickLocation();
    });
  },
  methods: {
    onClickLocation() {
      const place = this.mapAutoComplete.getPlace();
      const geometry = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      this.placeId = place.place_id;
      this.placeName = place.name;
      this.geometry = geometry;
    },
    post() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp.now();
      const job = firebase.firestore().collection('jobs').doc(this.id);

      job
        .update({
          img: this.img,
          name: this.name,
          genre: this.genre,
          placeId: this.placeId,
          placeName: this.placeName,
          geometry: this.geometry,
          money: this.money,
          startTime: this.startTime,
          endTime: this.endTime,
          isRecruit: true,
          updatedAt: timestamp,
        })
        .then(() => {
          job
            .collection('detail')
            .doc('browse')
            .update({
              holiday: that.holiday,
              content: that.content,
              shift: that.shift,
              welfare: that.welfare,
              carfare: that.carfare,
              refer: that.refer,
              hp: that.hpUrl,
              contactEmail: that.contactEmail,
              secret: that.secret,
            })
            .then(() => {
              const that = this;
              const obj = { id: that.id, geometry: that.geometry };
              async function assignment() {
                await that.$store.commit('job/getData', obj);
              }
              assignment().then(this.$router.go(-1));
            });
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
          that.isClose = true;
          that.$router.push({ name: 'timeline' });
        })
        .catch((err) => {
          alert(err);
        });
    },
    imgAdd(e) {
      const that = this;
      const imgName = e.name;

      const storageRef = firebase
        .storage()
        .ref('jobs/image/' + md5hex(JSON.stringify(new Date())) + imgName);

      storageRef.put(e).then(function () {
        storageRef.getDownloadURL().then(function (url) {
          that.img = url;
        });
      });
    },
    imgDelete() {
      this.img = '';
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
@media screen and (min-width: 960px) {
  .top-img {
    height: 40vh;
  }
}
.job-edit-wrap {
  max-width: 600px;
  margin: 0 auto;
}
.required-phrase {
  margin-bottom: 0;
  margin-left: 4px;
  font-size: 0.8rem;
}
.input-text {
  border-bottom: 1px solid rgb(134, 134, 134);
  margin-bottom: 28px;
  width: 300px;
  outline: none;
}
.edit-button {
  text-align: center;
}
.close-button {
  text-align: center;
}
</style>
