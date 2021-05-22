<template>
  <div class="event-edit-wrap">
    <v-container>
      <p class="required-phrase">※は必須項目です</p>
      <v-row justify="center">
        <v-col cols="12" md="8" sm="6">
          <v-img v-show="img" :src="img" class="top-img"></v-img>
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
            label="※イベント名"
            prepend-icon="mdi-flag-variant"
            :rules="[() => !!title || requiredText]"
            required
          ></v-text-field>
          <v-select
            v-model="type"
            color="#61d4b3"
            :items="types"
            sv-model="Type"
            label="※イベントタイプ"
            prepend-icon="mdi-content-copy"
            :rules="[() => !!type || requiredText]"
            required
          ></v-select>
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
                label="※日程"
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
                  label="※時間(始まり)"
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
                  label="※時間(終わり)"
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
          <v-text-field
            v-model="hpUrl"
            color="#61d4b3"
            label="ホームページなど（URL）"
            prepend-icon="mdi-home-circle-outline"
          ></v-text-field>
          <v-textarea
            v-model="content"
            color="#61d4b3"
            auto-grow
            label="※詳細"
            rows="3"
            prepend-icon="mdi-pencil"
            :rules="[() => !!content || requiredText]"
            required
          ></v-textarea>
          <div class="edit-button mb-3">
            <post-button
              :button-method="post"
              :button-type="buttonType"
              :button-disabled="
                img == '' ||
                title == '' ||
                type == '' ||
                placeId == '' ||
                placeName == '' ||
                date == '' ||
                startTime == '' ||
                finishTime == '' ||
                content == ''
              "
              >編集完了</post-button
            >
          </div>
          <div class="cancel-button">
            <v-btn
              rounded
              width="80vw"
              max-width="500px"
              color="red lighten-3"
              class="white--text"
              :disabled="cancel == true"
              @click="eventCancel"
              >イベントを中止にする</v-btn
            >
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

const crypto = require('crypto');
function md5hex(str /*: string */) {
  const md5 = crypto.createHash('md5');
  return md5.update(str, 'binary').digest('hex');
}
async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: process.env.GOOGLEMAPS_APIKEY,
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
      placeholder: '※場所',
      requiredText: 'この項目は必須です',
      title: '',
      type: '',
      place: '',
      date: '',
      cancel: '',
      startTime: '',
      finishTime: '',
      capacity: '',
      hpUrl: '',
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
      fiels: ['place_id', 'name', 'type', 'geometry'],
      placeId: '',
      placeName: '',
      geometry: '',
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email', id: 'event/id' }),
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
        that.placeId = doc.data().placeId;
        that.placeName = doc.data().placeName;
        that.geometry = doc.data().geometry;
        that.date = doc.data().date;
        that.cancel = doc.data().cancel;
        console.log('this.geometry:ddddd ', that.geometry);
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
            that.hpUrl = doc.data().hpUrl;
            that.content = doc.data().content;
          });
      });
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
      const event = firebase.firestore().collection('events').doc(this.id);
      const timestamp = firebase.firestore.Timestamp.now();

      event
        .update({
          title: that.title,
          type: that.type,
          img: that.img,
          placeId: that.placeId,
          placeName: that.placeName,
          geometry: that.geometry,
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
            hpUrl: that.hpUrl,
            content: that.content,
          });
        })
        .then(() => {
          const that = this;
          const obj = { id: that.id, geometry: that.geometry };
          async function assignment() {
            await that.$store.commit('event/getData', obj);
          }
          assignment().then(this.$router.go(-1));
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
    eventCancel() {
      const event = firebase.firestore().collection('events').doc(this.id);
      event
        .update({
          cancel: true,
        })
        .then(() => {
          alert('このイベントを中止にしました');
          this.$router.push({ name: 'timeline' });
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
<style scoped>
.event-edit-wrap {
  max-width: 600px;
  margin: 0 auto;
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
.cancel-button {
  text-align: center;
}
</style>
