<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <v-img v-show="img" :src="img" height="200px"></v-img>
        <v-btn v-show="img" style="float: right" @click="imgDelete">
          <v-icon>mdi-delete-empty</v-icon>
        </v-btn>
        <v-file-input
          v-show="!img"
          color="#61d4b3"
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          label="画像"
          :clearable="false"
          @change="imgAdd"
        ></v-file-input>
        <v-text-field
          v-model="title"
          color="#61d4b3"
          label="イベント名"
          prepend-icon="mdi-flag-variant"
        ></v-text-field>
        <v-select
          v-model="type"
          color="#61d4b3"
          :items="types"
          sv-model="Type"
          label="イベントタイプ"
          prepend-icon="mdi-content-copy"
        ></v-select>
        <div class="mt-1 pt-3">
          <div ref="map" />
          <v-icon> mdi-map-marker-radius </v-icon>
          <input ref="input" v-model="placeName" class="input-text" />
        </div>
        <v-dialog
          ref="dialogs"
          v-model="dateModal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              color="#61d4b3"
              label="日程"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" scrollable color="#61d4b3">
            <v-btn text color="#61d4b3" @click="dateModal = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="$refs.dialogs.save(date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
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
                label="時間(始まり)"
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
            v-model="finishTimeModal"
            :return-value.sync="finishTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="finishTime"
                color="#61d4b3"
                label="時間(終わり)"
                prepend-icon
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="finishTimeModal" v-model="finishTime" full-width color="#61d4b3">
              <v-btn text color="#61d4b3" @click="finishTimeModal = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="$refs.dialog2.save(finishTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </div>
        <v-text-field
          v-model="capacity"
          color="#61d4b3"
          label="定員"
          placeholder="ex.特になし,20人"
          prepend-icon="mdi-account-multiple"
        ></v-text-field>
        <v-text-field
          v-model="entryFee"
          color="#61d4b3"
          label="参加費"
          prepend-icon="mdi-cash-usd"
        ></v-text-field>
        <v-textarea
          v-model="content"
          color="#61d4b3"
          auto-grow
          label="詳細"
          rows="3"
          prepend-icon="mdi-pencil"
        ></v-textarea>
        <post-button
          :button-method="post"
          :button-type="buttonType"
          :button-disabled="
            img == '' ||
            title == '' ||
            type == '' ||
            place == '' ||
            date == '' ||
            startTime == '' ||
            finishTime == '' ||
            capacity == '' ||
            entryFee == '' ||
            content == ''
          "
          >投稿</post-button
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';

const crypto = require('crypto');
function md5hex(str /*: string */) {
  const md5 = crypto.createHash('md5');
  return md5.update(str, 'binary').digest('hex');
}
async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: 'AIzaSyCkPkussjC7YNEMi8dY9jwWy-XXZK9-SmA',
    libraries: ['places'],
    language: 'ja',
  });
  return gmap;
}

export default {
  layout: 'onlyBack',
  components: {
    PostButton,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      imgPath: 'events/image/',
      placeholder: '場所',
      title: '',
      place: '',
      date: '',
      startTime: '',
      finishTime: '',
      capacity: '',
      img: '',
      entryFee: '',
      content: '',
      types: ['フリーイベント', 'セミナー'],
      publisherArray: {},
      publishers: [],
      addButton: '投稿',
      formIsValid: true,
      dateModal: false,
      startTimeModal: false,
      finishTimeModal: false,
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
      fiels: ['place_id', 'name', 'type'],
      placeId: '',
      placeName: '',
    };
  },
  created() {
    const that = this;
    const event = firebase.firestore().collection('events').doc(this.id);

    event
      .get()
      .then((doc) => {
        that.title = doc.data().title;
        that.type = doc.data().type;
        that.img = doc.data().img;
        that.place = doc.data().place;
        that.date = doc.data().date;
      })
      .then(() => {
        event
          .collection('detail')
          .doc('browse')
          .get()
          .then((doc) => {
            that.startTime = doc.data().startTime;
            that.finishTime = doc.data().finishTime;
            that.entryFee = doc.data().fee;
            that.capacity = doc.data().capacity;
            that.content = doc.data().content;
          });
      });
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email', id: 'event/id' }),
  },
  async mounted() {
    this.gmap = await initMap();
    console.log(this.$refs);

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
    this.mapAutoComplete = new this.gmap.places.Autocomplete(this.$refs.input, searchOptions);
    this.mapAutoComplete.setFields(this.fiels);
    this.mapAutoComplete.addListener('place_changed', () => {
      this.onClickLocation();
    });
  },
  methods: {
    onClickLocation() {
      const place = this.mapAutoComplete.getPlace();
      this.place = place.place_id;
      this.placeName = place.name;
    },
    post() {
      const that = this;
      const event = firebase.firestore().collection('events').doc(this.id);
      const timestamp = firebase.firestore.Timestamp.now();

      event
        .update({
          title: that.title,
          type: that.type,
          img: that.img,
          place: that.place,
          date: that.date,
          updatedAt: timestamp,
          cancel: false,
        })
        .then(() => {
          event.collection('detail').doc('browse').update({
            startTime: that.startTime,
            finishTime: that.finishTime,
            fee: that.entryFee,
            capacity: that.capacity,
            content: that.content,
          });
        })
        .then(() => {
          this.$router.go(-1);
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
        .ref('events/image/' + md5hex(JSON.stringify(new Date())) + imgName);

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
.input-text {
  border-bottom: 1px solid rgb(134, 134, 134);
  margin-bottom: 28px;
  width: 300px;
  outline: none;
}
</style>
