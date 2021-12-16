<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <!-- <v-tab>投稿したアルバイト</v-tab> -->

      <v-tab>キープしたアルバイト</v-tab>
    </v-tabs>
    <div class="posted-job-wrap">
      <v-tabs-items v-model="postedTab">
        <!-- <v-tab-item>
          <div v-if="!post.length">
            <prompt-card
              :link="'post-jobPost'"
              :image="require('~/assets/timeline/job.png')"
              :message="'アルバイトをみんなに紹介してみませんか？'"
            />
          </div>
          <v-card
            v-for="item in post"
            :key="item.id"
            class="mt-2 mx-2"
            :elevation="4"
            @click="tojobDetail(item)"
          >
            <v-chip v-show="item.isNew" color="green" small outlined class="ml-3 mt-3">
              NEW
            </v-chip>
            <v-chip
              v-if="item.isRecruit"
              :class="{ newchip: item.isNew, 'no-newchip': !item.isNew }"
              small
              color="red"
              outlined
            >
              募集中
            </v-chip>
            <v-chip
              v-if="!item.isRecruit"
              :class="{ newchip: item.isNew, 'no-newchip': !item.isNew }"
              small
              color="primary"
              outlined
            >
              募集締切
            </v-chip>
            <v-card-title
              class="pl-3 pt-3 text-subtitle-1 font-weight-bold blue--text text--darken-3"
              >{{ item.name }}</v-card-title
            >
            <v-card-subtitle class="pl-3 pb-3 text-caption">{{ item.genre }}</v-card-subtitle>
            <div class="d-flex justify-space-around">
              <v-row>
                <v-col cols="6" md="6">
                  <v-img
                    v-show="item.img"
                    height="16vh"
                    width="44vw"
                    max-width="200px"
                    class="ml-3 mb-3"
                    :src="item.img"
                  ></v-img>
                </v-col>
                <v-col cols="6">
                  <div>
                    <v-list-item>
                      <v-icon size="20" left>mdi-currency-cny</v-icon>
                      <v-list-item-content class="caption py-0">{{
                        item.money
                      }}</v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-icon size="20" left>mdi-map-marker</v-icon>
                      <v-list-item-content class="caption">{{
                        item.placeName
                      }}</v-list-item-content>
                    </v-list-item>
                  </div>
                </v-col></v-row
              >
            </div>
          </v-card>
        </v-tab-item> -->

        <v-tab-item>
          <div v-if="!keep.length">
            <prompt-card
              :link="'timeline'"
              :image="require('~/assets/timeline/job.png')"
              :message="'どんなアルバイトがあるか覗いてみませんか？'"
              :timeline-tab="5"
            />
          </div>
          <v-card
            v-for="item in keep"
            :key="item.id"
            class="mt-2 mx-2"
            :elevation="4"
            @click="tojobDetail(item)"
          >
            <v-chip
              v-if="item.isPublic"
              :class="{ newchip: item.isNew, 'no-newchip': !item.isNew }"
              small
              color="red"
              outlined
            >
              募集中
            </v-chip>
            <v-chip
              v-if="!item.isPublic"
              :class="{ newchip: item.isNew, 'no-newchip': !item.isNew }"
              small
              color="primary"
              outlined
            >
              募集締切
            </v-chip>
            <v-card-title
              class="pl-3 pt-3 text-subtitle-1 font-weight-bold blue--text text--darken-3"
              >{{ item.name }}</v-card-title
            >
            <v-card-subtitle class="pl-3 pb-3 text-caption">{{ item.genre }}</v-card-subtitle>
            <div class="d-flex justify-space-around">
              <v-img
                v-show="item.img"
                height="16vh"
                width="44vw"
                class="ml-3 mb-3"
                :src="item.img"
              ></v-img>
              <div>
                <v-list-item>
                  <v-icon size="20" left>mdi-currency-cny</v-icon>
                  <v-list-item-content class="caption py-0">{{ item.money }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-icon size="20" left>mdi-map-marker</v-icon>
                  <v-list-item-content class="caption">{{ item.placeName }}</v-list-item-content>
                </v-list-item>
              </div>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import PromptCard from '~/components/Molecules/PromptCard';
const users = firebase.firestore().collection('users');
const jobs = firebase.firestore().collection('recruit');
// import dayjs from 'dayjs';

export default {
  layout: 'onlyBack',
  components: {
    PromptCard,
  },
  data() {
    return {
      post: [],
      keep: [],
      reply: [],
      postedTab: '',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
    }),
  },
  created() {
    this.getUserKeepJobs();
    // this.getUserPostJobs();
    // this.getUserReplyJobs();
  },
  methods: {
    // async getUserPostJobs() {
    //   const that = this;
    //   await jobs
    //     .where('poster', '==', this.uid)
    //     .orderBy('updatedAt', 'desc')
    //     .get()
    //     .then((snapshot) => {
    //       snapshot.forEach((doc) => {
    //         const now = dayjs();
    //         const newDate = dayjs(doc.data().createdAt.toDate()).locale('ja').add(1, 'week');
    //         const isNew = dayjs(now).isBefore(newDate);
    //         that.post = [
    //           ...that.post,
    //           {
    //             id: doc.id,
    //             name: doc.data().name,
    //             genre: doc.data().genre,
    //             img: doc.data().img,
    //             placeName: doc.data().placeName,
    //             geometry: doc.data().geometry,
    //             startTime: doc.data().startTime,
    //             endTime: doc.data().endTime,
    //             money: doc.data().money,
    //             isRecruit: doc.data().isRecruit,
    //             isNew,
    //           },
    //         ];
    //       });
    //     });
    // },

    async getUserKeepJobs() {
      const that = this;
      await users
        .doc(this.uid)
        .collection('job')
        .doc('keep')
        .get()
        .then((doc) => {
          const keeps = doc.data().id;
          keeps.forEach((jobId) => {
            jobs
              .doc(jobId)
              .get()
              .then((doc) => {
                // const now = dayjs();
                // const newDate = dayjs(doc.data().createdAt.toDate()).locale('ja').add(1, 'week');
                // const isNew = dayjs(now).isBefore(newDate);

                that.keep = [
                  ...that.keep,
                  {
                    id: doc.id,
                    img: doc.data().img,
                    genre: doc.data().genre,
                    placeName: doc.data().placeName,
                    money: doc.data().money,
                    remark: doc.data().remark,
                    geometry: doc.data().geometry,
                    startTime1: doc.data().startTime1,
                    endTime1: doc.data().endTime1,
                    startTime2: doc.data().startTime2,
                    endTime2: doc.data().endTime2,
                    startTime3: doc.data().startTime3,
                    endTime3: doc.data().endTime3,
                    isPublic: doc.data().isPublic,
                    poster: doc.data().uid,
                    contactEmail: doc.data().contactEmail,
                    contactPhone: doc.data().contactPhone,
                    contactRemark: doc.data().contactRemark,
                  },
                ];
                console.log(that.keep);
              });
          });
        });
    },
    // async getUserReplyJobs() {
    //   const that = this;
    //   await users
    //     .doc(this.uid)
    //     .collection('job')
    //     .doc('reply')
    //     .get()
    //     .then((doc) => {
    //       const replies = doc.data().id;
    //       console.log(replies);
    //       replies.forEach((jobId) => {
    //         jobs
    //           .doc(jobId)
    //           .get()
    //           .then((doc) => {
    //             that.reply = [...that.reply, doc.data()];
    //             console.log(doc.data());
    //           });
    //       });
    //     });
    // },
    tojobDetail(obj) {
      const that = this;
      console.log(obj);
      async function assignment() {
        await that.$store.dispatch('job/getRecruitDetail', obj);
      }
      assignment().then(this.$router.push({ name: 'timeline-job-detailJob' }));
    },
  },
};
</script>

<style scoped>
.posted-job-wrap {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}
.newchip {
  margin-top: 12px;
  margin-left: 4px;
}
.no-newchip {
  margin-top: 12px;
  margin-left: 12px;
}
</style>
