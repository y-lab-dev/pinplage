<template>
  <div style="height: 100%">
    <ais-instant-search :search-client="searchClient" index-name="places">
      <v-container style="height: 100%" fluid class="py-0">
        <v-row justify="center" align-content="center" style="height: 100%">
          <v-col class="pa-0">
            <div class="searchbox">
              <div class="searchboxback">
                <v-row justify="center" align-content="center">
                  <v-col cols="1"></v-col>
                  <v-col class="pa-0">
                    <div class="px-0 pt-4 pb-1">
                      <ais-search-box v-model="all" align="center" placeholder="店名・ジャンル" />
                    </div>
                  </v-col>
                  <v-col cols="1"></v-col>
                </v-row>
                <v-row>
                  <v-col class="px-2 py-0">
                    <v-autocomplete
                      v-model="selectHashtag"
                      :items="hashtags"
                      color="orange"
                      outlined
                      dense
                      chips
                      small-chips
                      label="#ハッシュタグ"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div class="searchresult">
              <ais-hits>
                <ul slot-scope="{ items }" class="pa-0">
                  <ol
                    v-for="item in items"
                    :key="item.objectID"
                    class="pa-0 ma-0"
                    @click="toPlaceDetail(item)"
                  >
                    <v-card nuxt outlined tile :elevation="2">
                      <v-card-title class="pa-2">{{ item.name }}</v-card-title>
                      <div class="px-1 pt-1">
                        <rating
                          :show-rating="true"
                          :star-size="20"
                          :rating-result="item.rating"
                          :increment="0.1"
                        ></rating>
                      </div>
                      <template v-for="(genre, index) in item.genres">
                        <v-chip
                          v-show="genre"
                          :key="index"
                          color="orange"
                          small
                          outlined
                          class="ma-2"
                          >{{ genre }}</v-chip
                        >
                      </template>
                      <v-img v-show="item.mainImgUrl" :src="item.mainImgUrl" class="photo"></v-img>
                      <p class="mx-2">{{ item.vincinty }}</p>
                    </v-card>
                  </ol>
                </ul>
              </ais-hits>
              <div style="height: 80px"></div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch';
import Rating from '~/components/molecules/Rating';
import firebase from '~/plugins/firebase';
require('dotenv').config();

export default {
  layout: 'protected',
  components: {
    Rating,
  },
  data() {
    return {
      searchClient: algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_SEARCH_APIKEY),
      hashtags: [],
      selectHashtag: '',
      genres: [],
      selectGenre: '',
      all: '',
    };
  },
  watch: {
    selectHashtag() {
      if (this.selectHashtag !== null) {
        if (this.selectHashtag !== '') {
          this.all = this.selectHashtag;
          this.selectHashtag = '';
        }
      }
    },
    selectGenre() {
      if (this.selectGenre !== null) {
        if (this.selectGenre !== '') {
          this.all = this.selectGenre;
          this.selectGenre = null;
        }
      }
    },
  },
  mounted() {
    const self = this;
    const reviewTags = firebase.firestore().collection('reviewTags');
    reviewTags
      .doc('hashtags')
      .get()
      .then((doc) => {
        self.hashtags = doc.data().hashtags;
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });

    reviewTags
      .doc('genres')
      .get()
      .then((doc) => {
        self.genres = doc.data().genres;
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  },
  methods: {
    toPlaceDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('place/getId', obj.placeId);
      }
      assignment().then(this.$router.push({ name: 'timeline-place-detailPlace' }));
    },
  },
};
</script>

<style scoped>
.photo {
  max-width: 95vw;
  max-height: 240px;
  margin: auto;
}
.searchboxback {
  margin-top: -1vh;
  margin-left: -2vw;
  margin-right: -2vw;
  margin-bottom: -1vw;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.6);
}
.searchbox {
  margin-top: 1vh;
  margin-left: 2vw;
  background: white;
  border: 1px solid orange;
  width: 96vw;
  border-radius: 10px 10px;
  z-index: 1;
  position: fixed;
  top: 2;
}
.searchresult {
  margin-top: 15vh;
  position: absolute;
  z-index: 0;
  width: 100%;
}
</style>

<style>
.IZ-select__input {
  box-shadow: none !important;
}
input::placeholder {
  font-size: 0.9em;
}
.ais-SearchBox-input {
  padding: 2px;
  border: 1px solid gray;
  border-radius: 5px 5px;
  width: 90%;
}
.ais-SearchBox-resetIcon {
  display: none !important;
}
.v-messages {
  display: none !important;
}
.v-text-field__details {
  display: none !important;
}
.v-input__slot {
  transform: scale(0.75);
  margin-left: -4%;
  width: 104%;
}
</style>
