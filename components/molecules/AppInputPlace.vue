<template>
  <div class="mt-1 pt-3">
    <div ref="map" />
    <v-icon> mdi-map-marker-radius </v-icon>
    <input
      ref="input"
      v-model="placeName"
      class="input-text"
      :type="inputType"
      :placeholder="inputPlaceholder"
    />
  </div>
</template>

<script>
import loadGoogleMapsApi from 'load-google-maps-api';

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: 'AIzaSyCkPkussjC7YNEMi8dY9jwWy-XXZK9-SmA',
    libraries: ['places'],
    language: 'ja',
  });
  return gmap;
}
export default {
  props: {
    inputType: {
      type: String,
      required: true,
      default: '',
    },
    inputPlaceholder: {
      type: String,
      required: true,
      default: '',
    },
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
      fiels: ['place_id', 'name', 'type'],
      placeName: '',
    };
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
      this.placeName = place.name;
      this.$emit('place', { placeId: place.place_id, placeName: place.name });
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
