<template>
  <div ref="map" class="google-map" />
</template>
<script>
import loadGoogleMapsApi from 'load-google-maps-api';

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: 'AIzaSyCkPkussjC7YNEMi8dY9jwWy-XXZK9-SmA',
    libraries: ['places'],
  });
  return gmap;
}

export default {
  props: {
    geometry: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      gmap: {},
      map: null,
      coord: {},
      defaultZoom: 15.0,
    };
  },
  async mounted() {
    this.coord = { lat: this.geometry.lat, lng: this.geometry.lng };
    console.log(this.coord);
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
.google-map {
  width: 100%;
  height: 24vh;
}
</style>
