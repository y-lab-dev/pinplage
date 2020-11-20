<template>
  <div>
    <div ref="map" />
    <v-text-field
      ref="input"
      v-model="placeName"
      color="#61d4b3"
      :label="label"
      rows="1"
      prepend-icon="mdi-map-marker-radius"
      :rules="[() => !!placeName || requiredText]"
      :disabled="readonly"
      required
    ></v-text-field>
  </div>
</template>

<script>
import loadGoogleMapsApi from 'load-google-maps-api';
require('dotenv').config();

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: process.env.GOOGLEMAPS_APIKEY,
    libraries: ['places'],
    language: 'ja',
  });
  return gmap;
}
export default {
  props: {
    label: {
      type: String,
      required: true,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
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
      fiels: ['place_id', 'name', 'type', 'geometry'],
      placeName: '',
      requiredText: 'この項目は必須です',
    };
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
      this.placeName = place.name;
      const geometry = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      this.$emit('place', {
        placeId: place.place_id,
        placeName: place.name,
        geometry,
      });
    },
  },
};
</script>
