<template>
  <div>
    {{ message }}
    <div ref="map" />
    <v-btn @click="start()">START</v-btn>
  </div>
</template>

<script>
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';

const collection = firebase.firestore().collection('places');

async function initMap() {
  const gmap = await loadGoogleMapsApi({
    key: 'AIzaSyCkPkussjC7YNEMi8dY9jwWy-XXZK9-SmA',
    libraries: ['places'],
    language: 'ja',
  });
  return gmap;
}

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  data() {
    return {
      message: '開始',
      array: [],
      gmap: {},
      map: null,
      request: 1,
      placesList: [],
      geometry: {},
      imgUrl: '',
      latLngBounds: {
        north: 34.854409,
        south: 34.38496,
        west: 137.547374,
        east: 137.820871,
      },
    };
  },
  async mounted() {
    this.gmap = await initMap();
  },
  methods: {
    start() {
      this.message = '処理中';
      const latLng = new this.gmap.LatLng(34.706396, 137.731436);
      const service = new this.gmap.places.PlacesService(this.$refs.map);
      const request = {
        location: latLng,
        radius: 100,
        type: ['establishment'],
        language: 'ja',
      };
      service.nearbySearch(request, this.displayResults);
    },
    async displayResults(results, status, pagination) {
      if (status === this.gmap.places.PlacesServiceStatus.OK) {
        // 検索結果をplacesList配列に連結
        this.placesList = this.placesList.concat(results);

        if (pagination.hasNextPage) {
          this.request++;
          setTimeout(pagination.nextPage(), 1000);
        } else {
          console.log('リクエスト数' + this.request);
          console.log('プレイス数' + this.placesList.length);
          console.log(this.placesList);

          for (let i = 0; i < this.placesList.length; i++) {
            if (this.placesList[i].business_status) {
              await _sleep(1000);
              console.log(i);
              this.geometry = {
                lat: this.placesList[i].geometry.location.lat(),
                lng: this.placesList[i].geometry.location.lng(),
              };
              this.imgUrl = '';
              if (this.placesList[i].photos) {
                this.imgUrl = this.placesList[i].photos[0].getUrl();
                console.log(this.imgUrl);
              }
              collection
                .doc(this.placesList[i].place_id)
                .set({
                  placeId: this.placesList[i].place_id,
                  name: this.placesList[i].name,
                  vincinty: this.placesList[i].vicinity,
                  types: this.placesList[i].types,
                  icon: this.placesList[i].icon,
                  geometry: this.geometry,
                  imgUrl: this.imgUrl,
                  rating: 0,
                  reviews: [],
                  hashtag: [],
                  purpose: [],
                })
                .then(() => {
                  this.array.push(this.placesList[i].place_id);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }

          await _sleep(1100);
          const setjson = JSON.stringify(this.array);
          this.$localStorage.set('placeIdDatas', setjson);
          this.message = '完了';
          console.log(this.message);
        }
      } else {
        let results = '';
        if (status === this.gmap.places.PlacesServiceStatus.ZERO_RESULTS) {
          results = '検索結果が0件です。';
        } else if (status === this.gmap.places.PlacesServiceStatus.ERROR) {
          results = 'サーバ接続に失敗しました。';
        } else if (status === this.gmap.places.PlacesServiceStatus.INVALID_REQUEST) {
          results = 'リクエストが無効でした。';
        } else if (status === this.gmap.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          results = 'リクエストの利用制限回数を超えました。';
        } else if (status === this.gmap.places.PlacesServiceStatus.REQUEST_DENIED) {
          results = 'サービスが使えない状態でした。';
        } else if (status === this.gmap.places.PlacesServiceStatus.UNKNOWN_ERROR) {
          results = '原因不明のエラーが発生しました。';
        }
        this.message = results;
      }
    },
  },
};
</script>
