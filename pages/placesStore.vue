<template>
  <div>
    <br />lat
    <input v-model.number="lat" placeholder="lat" />
    <br />lng
    <input v-model.number="lng" placeholder="lng" />
    <br />radius
    <input v-model.number="radius" />
    <br />type
    <input v-model="type" />
    <div ref="map" />
    {{ message }}
    <v-btn @click="start()">START</v-btn>
  </div>
</template>

<script>
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';

const db = firebase.firestore().collection('places');

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
      details: {},
      openingHours: [],
      geometry: {},
      mainImg: '',
      website: '',
      formatted_phone_number: '',
      priceLevel: null,
      reviews: [],
      lat: null,
      lng: null,
      radius: 50,
      type: 'restaurant',
    };
  },
  async mounted() {
    this.gmap = await initMap();
  },
  methods: {
    start() {
      this.message = '処理中';
      const latLng = new this.gmap.LatLng(this.lat, this.lng);
      const service = new this.gmap.places.PlacesService(this.$refs.map);
      const request = {
        location: latLng,
        radius: this.radius,
        type: [this.type],
        language: 'ja',
      };
      service.nearbySearch(request, this.displayResults);
    },
    async displayResults(results, status, pagination) {
      const self = this;
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
              await db
                .doc(this.placesList[i].place_id)
                .get()
                .then(async function (doc) {
                  if (doc.exists) {
                    // console.log(self.placesList[i].name + ' is exist');
                  } else {
                    const service = new self.gmap.places.PlacesService(self.$refs.map);
                    service.getDetails(
                      {
                        placeId: self.placesList[i].place_id,
                        fields: [
                          'formatted_phone_number',
                          'opening_hours',
                          'website',
                          'photos',
                          'price_level',
                          'reviews',
                        ],
                      },
                      function (place) {
                        self.details = place;
                        if (typeof place.opening_hours !== 'undefined') {
                          self.openingHours = place.opening_hours.weekday_text;
                        }
                        if (typeof place.website !== 'undefined') {
                          self.website = place.website;
                        }
                        if (typeof place.formatted_phone_number !== 'undefined') {
                          self.formatted_phone_number = place.formatted_phone_number;
                        }
                        if (typeof place.price_level !== 'undefined') {
                          self.priceLevel = place.price_level;
                        }
                        if (typeof place.reviews !== 'undefined') {
                          for (let i = 0; i < place.reviews.length; i++) {
                            const reviewObj = {};
                            reviewObj.rate = place.reviews[i].rating;
                            reviewObj.content = place.reviews[i].text;
                            self.reviews.push(reviewObj);
                          }
                        }
                      }
                    );
                    await _sleep(1000);
                    console.log(i + 1);
                    self.geometry = {
                      lat: self.placesList[i].geometry.location.lat(),
                      lng: self.placesList[i].geometry.location.lng(),
                    };
                    const imgUrls = [];
                    let url = '';
                    let str1 = [];
                    let str2 = [];
                    let photos = '';
                    if (typeof self.details.photos !== 'undefined') {
                      for (let i = 0; i < self.details.photos.length; i++) {
                        url = self.details.photos[i].getUrl();
                        str1 = url.split('?1s');
                        str2 = str1[1].split('&');
                        photos =
                          'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' +
                          str2[0] +
                          '&' +
                          str2[5];
                        imgUrls.push(photos);
                      }
                      self.mainImg = imgUrls[0];
                    }
                    db.doc(self.placesList[i].place_id)
                      .set({
                        placeId: self.placesList[i].place_id,
                        name: self.placesList[i].name,
                        vincinty: self.placesList[i].vicinity,
                        types: self.placesList[i].types,
                        mainImgUrl: self.mainImg,
                        rating: 0,
                        _tags: [],
                        genre: [],
                      })
                      .then(() => {
                        self.array.push(self.placesList[i].place_id);
                        db.doc(self.placesList[i].place_id)
                          .collection('detail')
                          .doc('browse')
                          .set({
                            icon: self.placesList[i].icon,
                            geometry: self.geometry,
                            reviews: [],
                            googleReviews: self.reviews,
                            imgUrls,
                            phoneNumber: self.formatted_phone_number,
                            openingHours: self.openingHours,
                            website: self.website,
                            priceLevel: self.priceLevel,
                          })
                          .then(() => {})
                          .catch((err) => {
                            alert(err);
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                })
                .catch(function (error) {
                  console.log('Error getting document:', error);
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
