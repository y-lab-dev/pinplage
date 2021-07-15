<template>
  <v-container class="pa-0">
    <v-row class="posted-wisdom-card" no-gutters>
      <v-col class="pa-0" cols="12">
        <v-divider></v-divider>
        <v-card tile elevation="0">
          <v-row class="pt-2 chip-row" @click="wisdomDetail(wisdomId)">
            <v-col class="py-2">
              <v-chip
                v-if="!answerDisplay"
                class="ml-5"
                :color="resolved ? '#DE237C' : '#61D4B3'"
                small
                text-color="#fff"
                >{{ resolvedMessage }}</v-chip
              >
            </v-col>
          </v-row>
          <v-row class="my-2 pt-0" style="max-width: 100vw">
            <v-col cols="3" class="pt-0" @click="wisdomDetail(wisdomId)">
              <v-avatar class="ml-5 rounded-circle">
                <img
                  :src="posterIcon"
                  :class="[isCreated ? '' : 'hide']"
                  @load="isCreated = true"
                />
              </v-avatar>
            </v-col>
            <v-col class="pa-0" cols="9">
              <v-row @click="wisdomDetail(wisdomId)">
                <v-col class="pa-0 pl-3" cols="7">
                  <span class="posted-user-name">{{ posterName }}</span>
                </v-col>
                <v-col class="py-0 pl-0 pr-4 created-time-diff" cols="5">
                  <created-time-diff :previous-date="createdAt" />
                </v-col>
              </v-row>
              <p class="posted-content" @click="wisdomDetail(wisdomId)">{{ content }}</p>
              <v-row class="bottom-line" no-gutters justify="end">
                <v-col
                  v-if="!answerDisplay"
                  class="pa-1"
                  cols="4"
                  align-self="center"
                  @click="wisdomDetail(wisdomId)"
                >
                  <v-icon small color="#c8c8c8">mdi-message-outline</v-icon>
                  <span class="posted-info">
                    {{ replyAmount }}
                  </span>
                </v-col>

                <v-col class="pa-1 pr-0" cols="4" align-self="center">
                  <wisdom-like :wisdom-id="wisdomId" />
                  <span class="posted-info">
                    {{ likeAmount }}
                  </span>
                </v-col>

                <v-col
                  v-if="!answerDisplay"
                  class="pa-1 pr-0"
                  cols="4"
                  @click="wisdomDetail(wisdomId)"
                >
                  <div v-if="!answerDisplay">
                    <v-icon small color="yellow">mdi-file-outline</v-icon>
                    <span class="posted-category">
                      {{ category }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
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
    resolved: {
      required: false,
      type: Boolean,
    },
    content: {
      required: true,
      type: String,
    },
    category: {
      required: false,
      type: String,
      default: null,
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
    replyAmount: {
      required: false,
      type: Number,
      default: 0,
    },
    answerDisplay: {
      required: false,
      type: Boolean,
      default: false,
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
    resolvedMessage() {
      if (this.resolved) {
        return '解決済み';
      } else {
        return '回答受付中';
      }
    },
    ...mapGetters({
      uid: 'user/uid',
      likedWisdoms: 'user/likedPost',
    }),
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
    wisdomDetail(wisdomId) {
      this.setWisdomId(this.wisdomId).then(() => {
        this.$router.push({ name: 'timeline-wisdom-detailWisdom' });
        firebase.analytics().logEvent('wisdomDetail_view', { property: 'wisdomDetail_view' });
      });
    },
    async setWisdomId(wisdomId) {
      await this.$store.dispatch('wisdomContents/clearAnswers');
      await this.$store.dispatch('wisdomContents/setWisdomId', { id: wisdomId });
    },
  },
};
</script>
<style scoped>
.posted-wisdom-card {
  cursor: pointer;
}
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
.bottom-line {
  cursor: default;
}
</style>
