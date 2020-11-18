<template>
  <div style="height: 100%">
    <v-container style="height: 100%" fluid>
      <v-row justify="center" align-content="center" style="height: 100%" fluid>
        <v-col>
          <v-card>
            <v-card-title>
              <img class="icon" :src="placeDetail.icon" />
              {{ place.name }}
            </v-card-title>
            <div class="px-4">
              <rating
                :show-rating="true"
                :star-size="20"
                :rating-result="place.rating"
                :increment="0.1"
              ></rating>
            </div>
            <template v-for="(item, index) in place.genres">
              <v-chip v-show="item" :key="index" color="orange" small outlined class="ml-3 mt-3">{{
                item
              }}</v-chip>
            </template>
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
                  <v-icon class="calendar" color="orange">mdi-calendar</v-icon>
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
                  <v-icon color="orange">mdi-web</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-btn
                    text
                    color="link"
                    min-height="20"
                    class="x-small post-link align-center py-1 px-2"
                  >
                    <v-list-item-subtitle
                      class="text-left post-link"
                      @click="moveLink(placeDetail.website)"
                      >{{ placeDetail.website }}</v-list-item-subtitle
                    >
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-phone</v-icon>
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
                <v-icon color="orange">mdi-chat-outline</v-icon>静大生のクチコミ
              </v-list-item-title>
              <v-divider inset></v-divider>
              <place-reviews
                v-for="(item, i) in reviews"
                :key="`reviews${i}`"
                v-bind="reviews[i]"
              />
            </v-list>
            <v-list>
              <v-list-item-title>
                <v-icon color="orange">mdi-chat-outline</v-icon>Googleレビューのクチコミ
              </v-list-item-title>
              <v-divider inset></v-divider>
              <template v-for="(item2, j) in placeDetail.googleReviews">
                <v-list-item :key="`second-${j}`">
                  <v-list-item-content>
                    <rating
                      :show-rating="false"
                      :star-size="12"
                      :rating-result="item2.rate"
                      :increment="0.1"
                      class="pl-4"
                    ></rating>
                    <div class="chatting">
                      <div class="say">{{ item2.content }}</div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="j < placeDetail.googleReviews.length - 1" :key="j"></v-divider>
              </template>
            </v-list>
            <v-footer app fixed class="ma-0 py-3 buttom-button-bar">
              <v-row no-gutters>
                <v-col cols="7" class="text-center">
                  <v-btn
                    v-show="!isKeep"
                    width="52vw"
                    rounded
                    outlined
                    color="yellow darken-3"
                    dark
                    class="bottom-button-nokeep"
                    @click="keep"
                  >
                    <v-icon left>mdi-heart</v-icon>行きたい
                  </v-btn>
                  <v-btn
                    v-show="isKeep"
                    width="52vw"
                    rounded
                    color="yellow darken-3"
                    dark
                    class="bottom-button-keep"
                    @click="notKeep"
                  >
                    <v-icon left>mdi-heart</v-icon>行きたい
                  </v-btn>
                </v-col>
                <v-col cols="5" class="text-center">
                  <v-btn
                    width="33vw"
                    rounded
                    color="orange"
                    class="bottom-button"
                    dark
                    @click="postReview(place)"
                  >
                    <v-icon left>mdi-pencil</v-icon>行った
                  </v-btn>
                </v-col>
              </v-row>
            </v-footer>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import loadGoogleMapsApi from 'load-google-maps-api';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';
import PlaceReviews from '~/components/Organisms/PlaceReviews';
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
  layout: 'onlyBack',
  components: {
    Rating,
    PlaceReviews,
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
      isKeep: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
      id: 'place/id',
    }),
  },
  created() {
    const self = this;
    const user = firebase.firestore().collection('users');
    const userPlaceFavorite = user.doc(this.uid).collection('place').doc('favorite');
    userPlaceFavorite.get().then((doc) => {
      self.isKeep = doc.data().id.find((val) => {
        return val === self.id;
      });
    });
  },
  async mounted() {
    const self = this;
    await db
      .doc(this.id)
      .get()
      .then((doc) => {
        this.place = {
          id: doc.data().placeId,
          name: doc.data().name,
          vincinty: doc.data().vincinty,
          types: doc.data().types,
          rating: doc.data().rating,
          genres: doc.data().genres,
          tags: doc.data()._tags,
          mainImgUrl: doc.data().mainImgUrl,
        };
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
    await db
      .doc(self.id)
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
            poster: doc.data().uid,
          });
        })
        .catch((err) => {
          alert(err);
          console.log(err);
        });
    }
  },
  methods: {
    moveLink(url) {
      window.open(url, '_blank');
    },
    keep() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('place')
        .doc('favorite');

      user
        .set({ id: firebase.firestore.FieldValue.arrayUnion(that.id) })
        .then(() => {
          that.isKeep = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    notKeep() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('place')
        .doc('favorite');

      user
        .update({ id: firebase.firestore.FieldValue.arrayRemove(that.id) })
        .then(() => {
          that.isKeep = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    postReview(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('place/getId', obj.id);
        await self.$store.commit('place/getName', obj.name);
      }
      assignment().then(this.$router.push({ name: 'post-reviewPost' }));
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
.chatting {
  width: 100%;
  text-align: left;
}
.say {
  display: inline-block;
  position: relative;
  margin: 0 0 0 20px;
  padding: 10px;
  border-radius: 12px;
  background: aliceblue;
}
.say::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 3px;
  left: -19px;
  border: 8px solid transparent;
  border-right: 18px solid aliceblue;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
}
.bottom-button-nokeep {
  z-index: 1;
  background-color: #fff;
}
.bottom-button-keep {
  z-index: 1;
}
.buttom-button-bar {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
<style>
.vue-star-rating-rating-text {
  margin: 1px !important;
}
</style>
