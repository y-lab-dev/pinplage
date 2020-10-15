<template>
  <div>
    <v-container class="py-0" @click="wisdomDetail(wisdomId)">
      <v-row>
        <v-col class="pa-0" cols="12">
          <v-divider></v-divider>
          <v-card tile elevation="0">
            <v-row class="my-2" style="max-width: 100vw">
              <v-col cols="3">
                <v-avatar class="ml-5 rounded-circle">
                  <img
                    :src="posterIcon"
                    :class="[isCreated ? '' : 'hide']"
                    @load="isCreated = true"
                  />
                </v-avatar>
              </v-col>
              <v-col class="pa-0 pt-3" cols="9">
                <v-row>
                  <v-col class="pa-0 pl-3" cols="7">
                    <span class="posted-user-name">{{ posterName }}</span>
                  </v-col>
                  <v-col class="py-0 pl-0 pr-4 created-time-diff" cols="5">
                    <created-time-diff :previous-date="createdDay" />
                  </v-col>
                </v-row>
                <p class="posted-content">{{ content }}</p>
                <v-row no-gutters justify="end">
                  <v-col v-if="!answerDisplay" class="pa-1" cols="4" align-self="center">
                    <v-icon small color="#c8c8c8">mdi-message-outline</v-icon>
                    <span class="posted-info">
                      {{ replyAmount }}
                    </span>
                  </v-col>
                  <v-col class="pa-1 pr-0" cols="4" align-self="center">
                    <v-icon small color="#f00">mdi-heart</v-icon>
                    <span class="posted-info">
                      {{ likeAmount }}
                    </span>
                  </v-col>
                  <v-col v-if="!answerDisplay" class="pa-1 pr-0" cols="4">
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
  </div>
</template>
<script>
import firebase from '~/plugins/firebase';
import CreatedTimeDiff from '~/components/molecules/TimeDiff';
export default {
  components: { CreatedTimeDiff },
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
    createdDay: {
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
      if (this.$route.name === 'timeline-wisdom-detailWisdom') {
        return;
      }
      this.$router.push({ name: 'timeline-wisdom-detailWisdom', query: wisdomId });
    },
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
</style>
