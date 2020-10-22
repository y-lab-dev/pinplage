<template>
  <div>
    <v-container class="py-0">
      <v-row>
        <v-col class="pa-0" cols="12">
          <v-card :elevation="0">
            <v-row align="center">
              <v-col class="pa-0" cols="8">
                <v-card-title class="p-2" @click="toPlaceDetail(reviewArray)">
                  {{ reviewArray.name }}
                </v-card-title>
              </v-col>
              <v-col class="pa-0" cols="4">
                <rating
                  :read-only="true"
                  :star-size="20"
                  :rating-result="reviewArray.rating"
                  :increment="1"
                ></rating>
              </v-col>
            </v-row>
            <v-list class="pa-2">
              <v-list-item-content>{{ reviewArray.comment }}</v-list-item-content>
              <v-img max-width="100%" max-height="240px" :src="reviewArray.img"></v-img>
              <v-row align="center">
                <v-col class="pa-0" cols="2">
                  <v-list-item v-for="scene in reviewArray.scene" :key="scene" align="center">
                    <v-icon v-if="!scene.indexOf('朝')" color="#61d4b3" class="float-right"
                      >mdi-weather-sunset</v-icon
                    >
                    <v-icon v-if="!scene.indexOf('昼')" color="#61d4b3" class="float-right"
                      >mdi-weather-sunny</v-icon
                    >
                    <v-icon v-if="!scene.indexOf('夜')" color="#61d4b3" class="float-right"
                      >mdi-moon-waning-crescent</v-icon
                    >
                  </v-list-item>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <v-list-item-subtitle align="center">
                    <div v-if="reviewArray.budgetLow" class="float-left">
                      ￥{{ reviewArray.budgetLow }}
                    </div>
                    <div v-if="reviewArray.budgetHigh || reviewArray.budgetLow" class="float-left">
                      ～
                    </div>
                    <div v-if="reviewArray.budgetHigh" class="float-left">
                      ￥{{ reviewArray.budgetHigh }}
                    </div>
                  </v-list-item-subtitle>
                </v-col>
                <v-col class="pa-0" cols="6">
                  <v-list-item-subtitle v-if="reviewArray.genre" align="center"
                    >:{{ reviewArray.genre }}</v-list-item-subtitle
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-list-item-subtitle class="pr-4 text-right">{{
                  reviewArray.date
                }}</v-list-item-subtitle>
              </v-row>
            </v-list>
          </v-card>
          <v-divider></v-divider>
          <v-list>
            <v-list-item-title class="text-subtitle-2"
              ><v-icon size="18" color="#61d4b3" class="mr-1 pb-1">mdi-flag-variant</v-icon
              >コメント</v-list-item-title
            >
          </v-list>
          <v-divider></v-divider>
          <v-list two-line class="mb-6">
            <v-card v-for="item in reviewCommentArray" :key="item.index" :elevation="0">
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="item.icon"></v-img>
                </v-list-item-avatar>
                <v-list-item-content class="py-0">
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.createdAt"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item-content class="ml-4 pt-0">
                {{ item.content }}
              </v-list-item-content>
              <v-divider></v-divider>
            </v-card>
            <text-area
              class="mt-4"
              :textarea-placeholder="commentPlaceholder"
              :textarea-value="content"
              @input="content = $event"
            ></text-area>
            <v-list-item-content class="caption mx-8"
              ><p class="mb-0">
                不適切な投稿をすると、利用規約の違反により<span class="font-weight-bold"
                  >投稿の削除</span
                >や<span class="font-weight-bold">利用停止</span>となる場合があります。
              </p>
            </v-list-item-content>
            <div class="post-button">
              <post-button
                class="mt-4"
                :button-method="post"
                :button-type="buttonType"
                :button-disabled="content == ''"
                >コメント投稿</post-button
              >
            </div>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';
import PostButton from '~/components/Atoms/AppButton';
import TextArea from '~/components/Atoms/AppTextarea';
const reviews = firebase.firestore().collection('reviews');
const user = firebase.firestore().collection('users');

export default {
  layout: 'protected',
  components: {
    Rating,
    PostButton,
    TextArea,
  },
  data() {
    return {
      model: 'tab-4',
      reviewArray: {},
      reviewCommentArray: [],
      commentPlaceholder: 'コメントしてみよう',
      content: '',
      name: '',
      icon: '',
      buttonType: 'submit',
    };
  },
  created() {
    const self = this;
    reviews
      .doc(self.$store.state.review.reviewId)
      .get()
      .then((doc) => {
        console.log(doc);
        self.reviewArray = {
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
          budgetHigh: doc.data().budgetHigh,
          budgetLow: doc.data().budgetLow,
        };
      })
      .catch((err) => {
        alert('エラー' + err);
      });
    const reviewComments = reviews.doc(self.$store.state.review.reviewId).collection('comment');
    reviewComments
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          snapshot.forEach((doc) => {
            user
              .doc(doc.data().commenter)
              .get()
              .then((doc) => {
                self.name = doc.data().name;
                self.icon = doc.data().icon;
              })
              .then(() => {
                self.reviewCommentArray = [
                  ...self.reviewCommentArray,
                  {
                    content: doc.data().content,
                    createdAt: dayjs(doc.data().createdAt.toDate())
                      .locale('ja')
                      .format('YYYY/MM/DD HH:mm'),
                    name: self.name,
                    icon: self.icon,
                  },
                ];
              });
          });
        }
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
    post() {
      const self = this;
      const timestamp = firebase.firestore.Timestamp.now();
      const reviews = firebase.firestore().collection('reviews');
      const reviewComments = reviews.doc(this.reviewArray.id).collection('comment');

      reviewComments
        .add({
          commenter: self.uid,
          email: self.email,
          createdAt: timestamp,
          content: self.content,
        })
        .then(() => {
          alert('コメントが投稿されました');
          this.$router.go(-1);
        });
    },
  },
};
</script>

<style scoped>
.post-button {
  text-align: center;
}
</style>
