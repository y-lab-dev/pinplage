<template>
  <div>
    <!-- <v-container class="py-0">
      <v-row>
        <v-col v-for="wisdom in postedWisdoms" :key="wisdom.createdDay" class="pa-0" cols="12">
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
                  <span class="posted-user-name">{{ wisdom.userName }}</span>
                </v-col>
                <v-col class="pa-0" cols="3">
                  <span style="font-size: 0.8rem">{{ wisdom.createdDay }}</span>
                </v-col>
              </v-row>
              <p class="posted-content">{{ wisdom.content }}</p>
              <v-row no-gutters>
                <v-col class="pa-1" cols="4" align-self="center">
                  <v-icon small color="#c8c8c8">mdi-message-outline</v-icon>
                  <span class="posted-info">
                    {{ wisdom.answers }}
                  </span>
                </v-col>
                <v-col class="pa-1 pr-0" cols="4">
                  <v-icon small color="#f00">mdi-heart</v-icon>
                  <span class="posted-info">
                    {{ wisdom.niceNumber }}
                  </span>
                </v-col>
                <v-col class="pa-1 pr-0" cols="4">
                  <v-icon small color="yellow">mdi-file-outline</v-icon>
                  <span class="posted-info">
                    {{ wisdom.category }}
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          </v-card>
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </v-container> -->
    <wisdom-thread />
  </div>
</template>
<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import wisdomThread from '~/components/Organisms/WisdomThread';

export default {
  layout: 'onlyBack',
  components: wisdomThread,
  data() {
    return {
      postedWisdoms: [],
    };
  },
  computed: {
    userEmail() {
      return this.$store.getters['user/email'];
    },
  },
  created() {
    const that = this;
    const wisdoms = firebase.firestore().collection('allQuestion');
    wisdoms
      // .where('userEmail', '==', that.userEmail)
      .where('userEmail', '==', 'kaji.takahiro.17@shizuoka.ac.jp')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const postedWisdom = {
            content: doc.data().content,
            niceNumber: doc.data().niceNumber,
            answers: doc.data().answers.length,
            createdDay: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD'),
            icon: doc.data().userIconUrl,
            userName: doc.data().user,
            category: doc.data().category,
          };
          that.postedWisdoms.push(postedWisdom);
        });
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
