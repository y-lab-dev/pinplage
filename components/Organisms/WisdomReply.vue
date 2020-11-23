<template>
  <div>
    <v-container class="py-0">
      <v-row>
        <v-col class="pa-0" cols="12">
          <v-divider></v-divider>
          <v-card tile elevation="0">
            <v-row class="my-2 pt-0" style="max-width: 100vw">
              <v-col cols="3" class="pt-0">
                <v-avatar class="ml-5 rounded-circle">
                  <img
                    :src="posterIcon"
                    :class="[isCreated ? '' : 'hide']"
                    @load="isCreated = true"
                  />
                </v-avatar>
              </v-col>
              <v-col class="pa-0" cols="9">
                <v-row>
                  <v-col class="pa-0 pl-3" cols="7">
                    <span class="posted-user-name">{{ posterName }}</span>
                  </v-col>
                  <v-col class="py-0 pl-0 pr-4 created-time-diff" cols="5">
                    <created-time-diff :previous-date="createdAt" />
                  </v-col>
                </v-row>
                <p class="posted-content">{{ content }}</p>
                <v-row no-gutters justify="end">
                  <v-col class="pa-1 pr-0" cols="4" align-self="center">
                    <div v-if="!selfAnswer">
                      <wisdom-like :wisdom-id="wisdomId" />
                      <span class="posted-info">
                        {{ likeAmount }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="!selfAnswer" justify="center" class="pb-2 chip-row">
              <v-col class="py-2" style="text-align: center" cols="12 chip-row">
                <v-chip class="ma-auto" color="#61D4B3" small text-color="#fff">
                  ベストアンサーに選ぶ
                </v-chip>
              </v-col>
            </v-row>
          </v-card>
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import CreatedTimeDiff from '~/components/Molecules/TimeDiff';
import WisdomLike from '~/components/Organisms/WisdomLike';
export default {
  components: { CreatedTimeDiff, WisdomLike },
  props: {
    wisdomId: {
      required: true,
      type: String,
    },
    poster: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    createdAt: {
      required: false,
      type: Date,
      default: null,
    },
    likeAmount: {
      required: false,
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      posterName: '',
      posterIcon: '',
      isCreated: false,
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      likedWisdoms: 'user/likedPost',
      postedWisdoms: 'user/postedWisdom',
    }),
    selfAnswer() {
      if (this.uid === this.poster) {
        return true;
      } else {
        return false;
      }
    },
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
};
</script>
<style scoped>
.posted-wisdoms-title {
  margin: 16px 0;
  text-align: center;
}
.posted-user-name {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0;
}
.posted-content {
  font-size: 0.85rem;
  margin-bottom: 0;
}
.created-time-diff {
  width: 100%;
  text-align: right;
}
.created-time-diff-data {
  font-size: 0.8rem;
  opacity: 0.8;
}
.posted-info {
  font-size: 0.7rem;
}
.posted-category {
  font-size: 0.5rem;
}
.hide {
  display: none;
}
.chip-row {
  max-width: 100vw;
}
</style>
