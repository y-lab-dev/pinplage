<template>
  <div>
    <v-container class="py-0">
      <v-row>
        <v-col v-for="wisdom in postedWisdoms" :key="wisdom.createdDay" class="pa-0" cols="12">
          <v-divider></v-divider>
          <v-card tile elevation="0">
            <v-row class="my-2" style="max-width: 100vw">
              <v-col cols="3">
                <v-avatar class="ml-5 rounded-circle">
                  <img :src="wisdom.icon" />
                </v-avatar>
              </v-col>
              <v-col class="pa-0 pt-3" cols="9">
                <v-row>
                  <v-col class="pa-0 pl-3" cols="9">
                    <span class="posted-user-name">{{ posterName }}</span>
                  </v-col>
                  <v-col class="pa-0" cols="3">
                    <span style="font-size: 0.8rem">{{ createdDay }}</span>
                  </v-col>
                </v-row>
                <p class="posted-content">{{ content }}</p>
                <v-row no-gutters>
                  <v-col class="pa-1" cols="4" align-self="center">
                    <v-icon small color="#c8c8c8">mdi-message-outline</v-icon>
                    <span class="posted-info">
                      {{ replyAmount }}
                    </span>
                  </v-col>
                  <v-col class="pa-1 pr-0" cols="4">
                    <v-icon small color="#f00">mdi-heart</v-icon>
                    <span class="posted-info">
                      {{ likeAmount }}
                    </span>
                  </v-col>
                  <v-col class="pa-1 pr-0" cols="4">
                    <v-icon small color="yellow">mdi-file-outline</v-icon>
                    <span class="posted-info">
                      {{ category }}
                    </span>
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
export default {
  props: {
    resolved: {
      required: true,
      type: Boolean,
      default: false,
    },
    poster: {
      required: true,
      type: String,
      default: '',
    },
    createdDay: {
      required: true,
      type: String,
      default: '',
    },
    content: {
      required: true,
      type: String,
      default: '',
    },
    category: {
      required: true,
      type: String,
      default: '',
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
  },
  data() {
    return {
      posterName: String,
      posterIcon: String,
    };
  },
  created() {
    // const that = this;
    const posterInfo = firebase.firestore().collection('users').doc('CMtv22qbuWNq2Gv1t9g7ryL3HL52');
    posterInfo.get().then((doc) => {
      console.log(doc.data());
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
.posted-info {
  font-size: 0.7rem;
}
</style>
