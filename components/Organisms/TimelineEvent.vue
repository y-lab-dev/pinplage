<template>
  <div>
    <v-card
      v-for="item in eventArray"
      :key="item.id"
      class="mt-2 mx-2"
      :elevation="5"
      @click="toDetail(item)"
    >
      <v-img v-if="item.img" class="white--text align-end" height="200px" :src="item.img"></v-img>
      <v-card-title class="title">{{ item.title }}</v-card-title>
      <v-card-subtitle>{{ item.placeName }}</v-card-subtitle>
      <v-list-item>
        <v-chip v-if="now == item.holdDate" color="#ff3912" text-color="white">開催日</v-chip>
        <v-chip v-if="now > item.holdDate" color="#7d7af5" text-color="white">開催済み</v-chip>
        <v-chip v-if="now < item.holdDate" color="#6cc75a" text-color="white">未開催</v-chip>
        <v-list-item-content class="ml-2">
          {{ item.date }}
        </v-list-item-content>
        <v-row align="center" justify="end">
          <v-icon class="mr-1" style="color: #ea5532">mdi-thumb-up</v-icon>
          <!-- <span class="subheading mr-2">{{ item.interestedUserNumber }}</span> -->
        </v-row>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';

const event = firebase.firestore().collection('events');
export default {
  data() {
    return {
      eventArray: [],
      now: dayjs().format('YYYY-MM-DD'),
    };
  },
  created() {
    const that = this;
    event
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.eventArray = [
            ...that.eventArray,
            {
              id: doc.id,
              title: doc.data().title,
              type: doc.data().type,
              img: doc.data().img,
              placeName: doc.data().placeName,
              date: doc.data().date,
              holdDate: doc.data().date,
            },
          ];
        });
      });
  },
  methods: {
    toDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('event/getId', obj);
      }
      assignment().then(this.$router.push('timeline/event/detailEvent'));
    },
  },
};
</script>
