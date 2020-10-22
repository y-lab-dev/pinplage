<template>
  <div>
    <v-container class="py-0">
      <v-row>
        <v-col class="pa-0" cols="12">
          <v-card>
            <v-row align="center">
              <v-col class="pa-0" cols="8">
                <v-card-title>
                  <img class="icon" :src="placeDetail.icon" />
                  {{ place.name }}
                </v-card-title>
              </v-col>
              <v-col class="pa-0" cols="4">
                <rating
                  :read-only="true"
                  :star-size="20"
                  :rating-result="place.rating"
                  :increment="0.1"
                  class="rating"
                ></rating>
              </v-col>
            </v-row>
            <v-card-subtitle>{{ place.vincinty }}</v-card-subtitle>

            <div class="photo">
              <v-carousel height="240" hide-delimiters>
                <v-carousel-item
                  v-for="item in placeDetail.imgUrls"
                  :key="item"
                  :src="item"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                ></v-carousel-item>
              </v-carousel>
            </div>
            <v-list>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon class="calendar" color="indigo">mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[0] }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[1] }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[2] }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[3] }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[4] }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[5] }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ placeDetail.openingHours[6] }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-web</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-btn
                    :href="placeDetail.website"
                    text
                    color="link"
                    min-height="20"
                    class="x-small post-link align-center py-1 px-2"
                  >
                    <v-list-item-subtitle class="text-left post-link">
                      {{ placeDetail.website }}
                    </v-list-item-subtitle>
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>{{ placeDetail.phoneNumber }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider inset></v-divider>
            <div ref="map" class="main" />
            <v-divider inset></v-divider>
            <v-list>
              <v-list-item-title>
                <v-icon color="indigo">mdi-chat-outline</v-icon>クチコミ
              </v-list-item-title>
              <v-divider inset></v-divider>
              <template v-for="(item, i) in reviews">
                <v-list-item :key="i" @click="toReviewDetail(item)">
                  <v-list-item-content>
                    <rating
                      :read-only="true"
                      :star-size="12"
                      :rating-result="item.rating"
                      :increment="0.1"
                      class="rating"
                    ></rating>
                    <v-list-item-content>{{ item.content }}</v-list-item-content>
                    <v-img max-width="100%" max-height="240px" :src="item.img"></v-img>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="i < reviews.length" :key="i"></v-divider>
              </template>
            </v-list>
            <v-list>
              <v-list-item-title>
                <v-icon color="indigo">mdi-chat-outline</v-icon>Googleレビュー
              </v-list-item-title>
              <v-divider inset></v-divider>
              <template v-for="(item, j) in placeDetail.googleReviews">
                <v-list-item :key="j">
                  <v-list-item-content>
                    <rating
                      :read-only="true"
                      :star-size="12"
                      :rating-result="item.rate"
                      :increment="0.1"
                      class="rating"
                    ></rating>
                    <v-list-item-content>{{ item.content }}</v-list-item-content>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="j < placeDetail.googleReviews.length - 1" :key="j"></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';
const db = firebase.firestore().collection('places');
const reviewdb = firebase.firestore().collection('reviews');

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
      placeDetail: {
        openingHours: ['', '', '', '', '', '', ''],
      },
      gmap: {},
      map: null,
      coord: {},
      defaultZoom: 15.0,
      reviews: [],
      urls: [],
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
          rating: doc.data().rating,
          genre: doc.data().genre,
          tags: doc.data()._tags,
          mainImgUrl: doc.data().mainImgUrl,
        };
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
    await db
      .doc(self.$store.state.place.placeId)
      .collection('detail')
      .doc('browse')
      .get()
      .then((doc) => {
        this.placeDetail = {
          icon: doc.data().icon,
          website: doc.data().website,
          phoneNumber: doc.data().phoneNumber,
          pricelevel: doc.data().pricelevel,
          openingHours: doc.data().openingHours,
          reviews: doc.data().reviews,
          geometry: doc.data().geometry,
          imgUrls: doc.data().imgUrls,
          googleReviews: doc.data().googleReviews,
        };
        for (let i = 0; i < doc.data().imgUrls.length; i++) {
          const url = doc.data().imgUrls[i].replace('maxwidth=400', 'maxheight=180');
          this.urls.push(url);
        }
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
    this.coord = { lat: this.placeDetail.geometry.lat, lng: this.placeDetail.geometry.lng };
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

    for (let i = 0; i < this.placeDetail.reviews.length; i++) {
      reviewdb
        .doc(this.placeDetail.reviews[i])
        .get()
        .then((doc) => {
          this.reviews.push({
            id: self.placeDetail.reviews[i],
            content: doc.data().comment,
            rating: doc.data().rating,
            img: doc.data().mainImgUrl,
          });
          console.log(doc.data().mainImgUrl);
        })
        .catch((err) => {
          alert(err);
          console.log(err);
        });
    }
  },
  methods: {
    toReviewDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('review/getId', obj.id);
      }
      assignment().then(this.$router.push({ name: 'timeline-review-detailReview' }));
    },
  },
};
</script>
<style scoped>
.main {
  width: 100%;
  height: 240px;
}

.icon {
  width: 20px;
  height: 20px;
}

.photo {
  text-align: center;
  height: 240px;
}
.calendar {
  padding-top: 48px;
}
.post-link {
  display: inline-block;
  word-break: break-all;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: none !important;
  white-space: normal;
  max-width: calc(100% - 20px);
  height: inherit !important;
}
</style>
