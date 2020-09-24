<template>
  <div>
    <v-card>
      <v-card-title>
        <img class="icon" :src="place.icon" />
        {{ place.name }}
      </v-card-title>
      <v-card-subtitle>{{ place.vincinty }}</v-card-subtitle>
      <rating
        :read-only="true"
        :star-size="20"
        :rating-result="place.rating"
        :increment="0.1"
      ></rating>
      <img class="photo" :src="place.imgUrl" />

      <div ref="map" class="main" />
    </v-card>
  </div>
</template>

<script>
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';
const db = firebase.firestore().collection('places');

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: 'AIzaSyCkPkussjC7YNEMi8dY9jwWy-XXZK9-SmA',
    libraries: ['places'],
  });
  return gmap;
}

export default {
  layout: 'protected',
  components: {
    Rating,
  },
  data() {
    return {
      place: {},
      gmap: {},
      map: null,
      coord: {},
      defaultZoom: 15.0,
    };
  },
  async mounted() {
    const self = this;
    await db
      .doc(self.$store.state.place.placeId)
      .get()
      .then((doc) => {
        this.place = {
          id: doc.data().placeId,
          name: doc.data().name,
          vincinty: doc.data().vincinty,
          types: doc.data().types,
          icon: doc.data().icon,
          rating: doc.data().rating,
          reviews: doc.data().reviews,
          hashtag: doc.data().hashtag,
          purpose: doc.data().purpose,
          geometry: doc.data().geometry,
          imgUrl: doc.data().imgUrl,
        };
        console.log(this.place.rating);
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
    this.coord = { lat: this.place.geometry.lat, lng: this.place.geometry.lng };
    this.gmap = await initMap();
    this.map = new this.gmap.Map(this.$refs.map, {
      center: this.coord,
      zoom: this.defaultZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    const marker = new this.gmap.Marker({
      position: this.coord,
      map: this.map,
    });
    marker.setMap(this.map);
  },
};
</script>
<style scoped>
.main {
  width: 240px;
  height: 180px;
}

.icon {
  width: 20px;
  height: 20px;
}

.photo {
  max-width: 240px;
  max-height: 180px;
}
</style>
