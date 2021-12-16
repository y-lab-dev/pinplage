<template>
  <div class="jobs-view">
    <v-card
      v-for="item in jobArray"
      :key="item.id"
      class="mt-2 mx-2"
      :elevation="4"
      @click="tojobDetail(item)"
    >
      <v-chip v-show="item.isNew" color="green" small outlined class="ml-3 mt-3"> NEW </v-chip>
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
      <v-card-title class="pl-3 pt-3 text-subtitle-1 font-weight-bold blue--text text--darken-3">{{
        item.name
      }}</v-card-title>
      <v-card-subtitle class="pl-3 pb-3 text-caption">{{ item.genre }}</v-card-subtitle>
      <v-container>
        <v-row>
          <v-col cols="6" class="py-0">
            <v-img
              v-show="item.img"
              height="16vh"
              width="44vw"
              class="ml-3 mb-3"
              :src="item.img"
            ></v-img>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item class="pl-0">
              <v-icon size="20" left>mdi-currency-cny</v-icon>
              <v-list-item-content class="caption py-0">{{ item.money }}</v-list-item-content>
            </v-list-item>
            <v-list-item class="pl-0">
              <v-icon size="20" left>mdi-map-marker</v-icon>
              <v-list-item-content class="caption">{{ item.placeName }}</v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';

const jobs = firebase.firestore().collection('jobs');
export default {
  data() {
    return {
      jobArray: [],
    };
  },
  created() {
    const that = this;
    jobs
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const now = dayjs();
          const newDate = dayjs(doc.data().createdAt.toDate()).locale('ja').add(1, 'week');
          const isNew = dayjs(now).isBefore(newDate);
          that.jobArray = [
            ...that.jobArray,
            {
              id: doc.id,
              name: doc.data().name,
              genre: doc.data().genre,
              img: doc.data().img,
              placeName: doc.data().placeName,
              geometry: doc.data().geometry,
              startTime: doc.data().startTime,
              endTime: doc.data().endTime,
              money: doc.data().money,
              isRecruit: doc.data().isRecruit,
              isNew,
            },
          ];
        });
      });
  },
  methods: {
    tojobDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('job/getData', obj);
      }
      assignment().then(this.$router.push('timeline/job/detailjob'));
      firebase.analytics().logEvent('jobDetail_view', { property: 'jobDetail_view' });
    },
  },
};
</script>
<style scoped>
.newchip {
  margin-top: 12px;
  margin-left: 4px;
}
.no-newchip {
  margin-top: 12px;
  margin-left: 12px;
}
.jobs-view {
  max-width: 550px;
  margin: auto;
}
</style>
