<template>
  <v-container>
    <div ref="map" />
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <v-card>
          <v-card-text>
            <div class="title">周辺施設</div>
            <input
              ref="input"
              v-model="placeName"
              type="text"
              placeholder="店名を入力してください"
            />
            <rating :star-size="40" @rating-selected="rating = $event"></rating>
            <input-textarea
              :textarea-placeholder="contentPlaceholder"
              :textarea-value="content"
              @input="content = $event"
            ></input-textarea>
            <post-button
              :button-method="post"
              :button-type="buttonType"
              :button-disabled="postValidation"
              >投稿</post-button
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import loadGoogleMapsApi from 'load-google-maps-api';
import InputTextarea from '~/components/Atoms/AppTextarea';
import PostButton from '~/components/Atoms/AppButton';
import Rating from '~/components/molecules/PostRating';
import firebase from '~/plugins/firebase';

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: 'AIzaSyCkPkussjC7YNEMi8dY9jwWy-XXZK9-SmA',
    libraries: ['places'],
    language: 'ja',
  });
  return gmap;
}

export default {
  layout: 'protected',
  components: {
    InputTextarea,
    PostButton,
    Rating,
  },
  data() {
    return {
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

      inputType: 'text',
      buttonType: 'submit',
      namePlaceholder: '店名',
      contentPlaceholder: '内容',
      placeId: '',
      placeName: '',
      mainImg: '',
      subImg: [],
      content: '',
      rating: 0,
      purpose: [],
      hashtag: [],
      postValidation: false,
      fiels: ['place_id', 'name', 'type'],
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email' }),
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
    this.mapAutoComplete = new this.gmap.places.Autocomplete(this.$refs.input, searchOptions);
    this.mapAutoComplete.setFields(this.fiels);
    this.mapAutoComplete.addListener('place_changed', () => {
      this.onClickLocation();
    });
  },

  methods: {
    onClickLocation() {
      const place = this.mapAutoComplete.getPlace();
      this.placeId = place.place_id;
      this.placeName = place.name;
      console.log(place);
    },
    post() {
      const db = firebase.firestore().collection('reviews');
      const timestamp = firebase.firestore.Timestamp.now();
      const self = this;
      if (this.placeName !== '' && this.content !== '') {
        db.doc()
          .add({
            placeId: self.placeId,
            placeName: self.placeName,
            mainImg: self.mainImg,
            comment: self.content,
            rating: self.rating,
            purpose: self.purpose,
            hashtag: self.hashtag,
            createdAt: timestamp,
            uid: self.uid,
            email: self.email,
            isRead: true,
          })
          .then((doc) => {
            db.doc(doc.id)
              .collection('detail')
              .doc('browse')
              .add({
                userName: self.userName,
                subImg: self.subImg,
                updatedAt: timestamp,
              })
              .then(() => {
                self.$router.push({ name: 'timeline' });
              })
              .catch((err) => {
                alert(err);
              });
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
  },
};
</script>
