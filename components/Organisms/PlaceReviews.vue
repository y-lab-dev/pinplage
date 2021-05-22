<template>
  <div>
    <v-list>
      <v-list-item @click="toReviewDetail(id)">
        <v-list-item-content class="pt-0">
          <v-row align-content="center" class="my-2 pt-0" style="max-width: 100vw">
            <v-col cols="3" class="pl-4 pr-0 py-0">
              <v-avatar class="rounded-circle">
                <img
                  :src="posterIcon"
                  :class="[isCreated ? '' : 'hide']"
                  class="img"
                  @load="isCreated = true"
                />
              </v-avatar>
            </v-col>
            <v-col class="pa-0" cols="9">
              <p class="mb-1 pt-2">{{ posterName }}</p>
              <rating
                :show-rating="false"
                :star-size="12"
                :rating-result="rating"
                :increment="0.1"
                class="rating"
              ></rating>
            </v-col>
          </v-row>
          <v-list-item-content>
            <div class="chatting">
              <div class="says" color="fff">{{ content }}</div>
            </div>
          </v-list-item-content>
          <v-img max-width="100%" max-height="240px" :src="img"></v-img>
        </v-list-item-content>
      </v-list-item>
      <v-divider inset></v-divider>
    </v-list>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
import Rating from '~/components/Molecules/Rating';
export default {
  components: { Rating },
  props: {
    id: {
      required: true,
      type: String,
      default: '',
    },
    content: {
      required: true,
      type: String,
      default: '',
    },
    rating: {
      required: true,
      type: Number,
      default: 0,
    },
    img: {
      required: true,
      type: String,
      default: '',
    },
    poster: {
      required: true,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      posterName: '',
      posterIcon: '',
      isCreated: false,
    };
  },
  created() {
    const that = this;
    const posterInfo = firebase.firestore().collection('users').doc(this.poster);
    posterInfo.get().then((doc) => {
      const userData = doc.data();
      that.posterName = userData.name;
      that.posterIcon = userData.icon;
    });
  },
  methods: {
    toReviewDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('review/getId', obj);
      }
      assignment().then(this.$router.push({ name: 'timeline-review-detailReview' }));
    },
  },
};
</script>

<style scoped>
.chatting {
  width: 100%;
  text-align: left;
}
.says {
  display: inline-block;
  position: relative;
  margin: 0 0 0 20px;
  padding: 10px;
  border-radius: 12px;
  background: seashell;
}
.says::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 3px;
  left: -19px;
  border: 8px solid transparent;
  border-right: 18px solid seashell;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
}
</style>
