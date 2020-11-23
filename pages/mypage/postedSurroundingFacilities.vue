<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿したクチコミ</v-tab>
      <!-- <v-tab></v-tab> -->
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>
        <div v-for="item in post" :key="item.id">
          <v-card
            v-if="item.isRead"
            nuxt
            outlined
            tile
            :elevation="2"
            @click="toReviewDetail(item)"
          >
            <v-row justify="center" align-content="center">
              <v-col class="pl-5 pr-0" cols="7">
                <v-card-text class="pa-0" style="color: #1976d2" @click="toPlaceDetail(item)">
                  {{ item.name }}
                </v-card-text>
              </v-col>
              <v-col cols="5" class="px-0">
                <div class="px-1 pt-1">
                  <rating
                    :show-rating="false"
                    :star-size="20"
                    :rating-result="item.rating"
                    :increment="1"
                  ></rating>
                </div>
              </v-col>
            </v-row>
            <v-row align-content="center">
              <v-col class="px-8 py-0" cols="8" justify="center">
                <v-chip v-show="item.genre" color="orange" small outlined>{{ item.genre }}</v-chip>
              </v-col>
              <v-col class="pa-0" cols="4">
                <div v-for="scene in item.scene" :key="scene">
                  <div v-if="!scene.indexOf('朝')">
                    <v-icon color="orange">mdi-weather-sunset</v-icon>
                    <span class="orange--text py-3">朝</span>
                  </div>
                  <div v-if="!scene.indexOf('昼')">
                    <v-icon color="orange">mdi-weather-sunny</v-icon>
                    <span class="orange--text py-3">昼</span>
                  </div>
                  <div v-if="!scene.indexOf('夜')">
                    <v-icon color="orange">mdi-moon-waning-crescent</v-icon>
                    <span class="orange--text py-3">夜</span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-list class="px-2 py-0">
              <v-list-item-content v-if="item.comment" class="py-4">
                <div class="says">{{ item.comment }}</div>
              </v-list-item-content>
              <v-img max-width="100%" max-height="240px" :src="item.img"></v-img>
              <v-row>
                <v-col>
                  <v-list-item-subtitle align="right">{{ item.date }}</v-list-item-subtitle>
                </v-col>
              </v-row>
            </v-list>
          </v-card>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
const reviews = firebase.firestore().collection('reviews');
export default {
  layout: 'onlyBack',
  data() {
    return {
      postedTab: '',
      post: [],
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    // const that =this;
    // const userUid = this.uid;
    // const userInfo = firebase.firestore().collection('users').doc(userUid);
    // userInfo
    //   .collection('review')
    //   .doc('post')
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       console.log(doc.id);
    //       console.log(doc.data());
    //     });
    //   });
    this.getUserPostReview();
  },
  methods: {
    async getUserPostReview() {
      const that = this;
      await reviews
        .where('uid', '==', this.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            that.post = [
              ...that.post,
              {
                id: doc.id,
                name: doc.data().name,
                rating: doc.data().rating,
                comment: doc.data().comment,
                date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YYYY/MM/DD HH:mm'),
                placeId: doc.data().placeId,
                uid: doc.data().uid,
                genre: doc.data().genre,
                img: doc.data().mainImgUrl,
                scene: doc.data().scene,
                isRead: doc.data().isRead,
              },
            ];
          });
        });
    },
    toPlaceDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('place/getId', obj.placeId);
      }
      assignment().then(this.$router.push({ name: 'timeline-place-detailPlace' }));
    },
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
