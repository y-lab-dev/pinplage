<template>
  <div style="height: 100%">
    <v-container style="height: 100%" fluid>
      <v-row justify="center" align-content="center" style="height: 100%" fluid>
        <v-col>
          <v-card :elevation="0">
            <v-row align-content="center" class="my-2 pt-0" style="max-width: 100vw">
              <v-col cols="2" class="pl-4 pr-0 py-0">
                <v-avatar size="30" class="rounded-circle pa-2">
                  <img
                    :src="posterIcon"
                    :class="[isCreated ? '' : 'hide']"
                    @load="isCreated = true"
                  />
                </v-avatar>
              </v-col>
              <v-col class="pa-0" cols="8">
                <v-card-text class="pt-1 pb-0 px-0 text-subtitle-1">{{ posterName }}</v-card-text>
              </v-col>
            </v-row>
            <v-row align-content="center">
              <v-col cclass="pl-5 pr-0" cols="7">
                <v-card-title
                  class="pa-0"
                  style="color: #1976d2"
                  @click="toPlaceDetail(reviewArray)"
                  >{{ reviewArray.name }}</v-card-title
                >
              </v-col>
              <v-col class="px-0" cols="5">
                <div class="px-1 pt-1">
                  <rating
                    :show-rating="false"
                    :star-size="20"
                    :rating-result="reviewArray.rating"
                    :increment="1"
                  ></rating>
                </div>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col class="px-8 py-0" cols="8">
                <v-chip v-show="reviewArray.genre" color="orange" small outlined>{{
                  reviewArray.genre
                }}</v-chip>
              </v-col>
              <v-col class="pa-0" cols="4">
                <div v-for="scene in reviewArray.scene" :key="scene">
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
            <v-list class="pa-2">
              <v-list-item-subtitle align="center">
                <v-icon v-if="reviewDetailArray.budget" class="float-left"
                  >mdi-cash-multiple</v-icon
                >
                <div v-if="reviewDetailArray.budget" class="py-1 float-left">
                  ￥{{ reviewDetailArray.budget }}
                </div>
              </v-list-item-subtitle>
              <v-list-item-content class="py-4">{{ reviewArray.comment }}</v-list-item-content>
              <v-img max-width="100%" max-height="240px" :src="reviewArray.img"></v-img>
              <v-list-item-subtitle align="right">{{ reviewArray.date }}</v-list-item-subtitle>
            </v-list>
          </v-card>
          <v-divider></v-divider>
          <v-list>
            <v-list-item-title class="text-subtitle-2">
              <v-icon size="18" color="#61d4b3" class="mr-1 pb-1">mdi-flag-variant</v-icon>コメント
            </v-list-item-title>
          </v-list>
          <v-divider></v-divider>
          <v-list two-line class="mb-6">
            <comment-thread
              v-for="(item, index) in reviewCommentArray"
              :key="item.commentId"
              v-bind="reviewCommentArray[index]"
              :class="`index-${index}`"
            ></comment-thread>
            <text-area
              class="mt-4"
              :textarea-placeholder="commentPlaceholder"
              :textarea-value="content"
              @input="content = $event"
            ></text-area>
            <v-list-item-content class="caption mx-8">
              <p class="mb-0">
                不適切な投稿をすると、利用規約の違反により
                <span class="font-weight-bold">投稿の削除</span>や
                <span class="font-weight-bold">利用停止</span>となる場合があります。
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
                  @click="postReview(reviewArray)"
                >
                  <v-icon left>mdi-pencil</v-icon>行った
                </v-btn>
              </v-col>
            </v-row>
          </v-footer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import Rating from '~/components/molecules/Rating';
import PostButton from '~/components/Atoms/AppButton';
import TextArea from '~/components/Atoms/AppTextarea';
import CommentThread from '~/components/molecules/CommentThread';
const reviews = firebase.firestore().collection('reviews');

export default {
  layout: 'onlyBack',
  components: {
    Rating,
    PostButton,
    TextArea,
    CommentThread,
  },
  data() {
    return {
      model: 'tab-4',
      reviewArray: {},
      reviewCommentArray: [],
      reviewDetailArray: [],
      commentPlaceholder: 'コメントしてみよう',
      content: '',
      name: '',
      icon: '',
      buttonType: 'submit',
      posterName: '',
      posterIcon: '',
      isCreated: false,
      isKeep: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      uname: 'user/name',
      uicon: 'user/icon',
      id: 'review/id',
      placeId: 'place/id',
    }),
  },
  created() {
    const self = this;
    reviews
      .doc(self.$store.state.review.reviewId)
      .get()
      .then((doc) => {
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
        };
        const poster = doc.data().uid;
        const posterInfo = firebase.firestore().collection('users').doc(poster);
        posterInfo.get().then((doc) => {
          const userData = doc.data();
          self.posterName = userData.name;
          self.posterIcon = userData.icon;
        });
      })
      .catch((err) => {
        alert('エラー' + err);
      });
    reviews
      .doc(self.$store.state.review.reviewId)
      .collection('detail')
      .doc('browse')
      .get()
      .then((doc) => {
        self.reviewDetailArray = {
          budget: doc.data().budget,
        };
      })
      .catch((err) => {
        alert('エラー' + err);
      });
    const reviewComments = reviews.doc(this.id).collection('comment');
    reviewComments
      .orderBy('createdAt')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          self.reviewCommentArray = [
            ...self.reviewCommentArray,
            {
              commentId: doc.id,
              commenter: doc.data().commenter,
              content: doc.data().content,
              createdAt: dayjs(doc.data().createdAt.toDate())
                .locale('ja')
                .format('YYYY/MM/DD HH:mm'),
            },
          ];
        });
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
      const reviewComments = reviews.doc(this.id).collection('comment');

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
.post-button {
  text-align: center;
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
