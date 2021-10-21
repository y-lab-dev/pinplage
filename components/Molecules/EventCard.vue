<template>
  <v-card class="mt-2 mx-2" :elevation="5" @click="toDetail">
    <v-img v-if="img" class="white--text align-end event-img" :src="img"></v-img>
    <v-card-subtitle v-if="cancel" class="red--text pb-0"
      >このイベントが中止になりました</v-card-subtitle
    >
    <div class="event-card-contents">
      <v-card-title class="title">{{ title }}</v-card-title>
      <v-card-subtitle>{{ placeName }}</v-card-subtitle>
      <v-card-text v-if="createTime > updatedPoint" class="text--secondary"
        >{{ startTime }} 〜 {{ finishTime }}</v-card-text
      >
    </div>
    <!-- アプデ前のイベントの詳細 -->
    <v-list-item v-if="createTime < updatedPoint">
      <v-chip v-if="now == holdDate" color="#ff3912" text-color="white">開催日</v-chip>
      <v-chip v-if="now > holdDate" color="#7d7af5" text-color="white">開催済み</v-chip>
      <v-chip v-if="now < holdDate" color="#6cc75a" text-color="white">未開催</v-chip>
      <v-list-item-content class="ml-2">
        {{ date }}
      </v-list-item-content>
      <v-row align="center" justify="end">
        <v-icon class="mr-1" style="color: #ea5532">mdi-thumb-up</v-icon>
        <span v-if="interest" class="subheading mr-2">{{ interest }}</span>
      </v-row>
    </v-list-item>
    <!-- アプデ後のイベントの詳細 -->
    <v-list-item v-else>
      <v-chip v-if="now > finishDate" color="#7d7af5" text-color="white">開催済み</v-chip>
      <v-chip v-if="now < startDate" color="#6cc75a" text-color="white">未開催</v-chip>
      <v-chip v-else color="#ff3912" text-color="white">開催中</v-chip>
      <v-list-item-content class="date-view ml-2"> </v-list-item-content>
      <v-row align="center" justify="end">
        <v-icon class="mr-1" style="color: #ea5532">mdi-thumb-up</v-icon>
        <span v-if="interest" class="subheading mr-2">{{ interest }}</span>
      </v-row>
    </v-list-item>
  </v-card>
</template>

<script>
import firebase from 'firebase';
import dayjs from 'dayjs';
export default {
  props: {
    id: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    img: {
      required: false,
      type: String,
      default: '',
    },
    placeName: {
      required: true,
      type: String,
    },
    geometry: {
      required: true,
      type: Object,
    },
    date: {
      required: true,
      type: String,
    },
    holdDate: {
      required: true,
      type: String,
    },
    startDate: {
      required: true,
      type: String,
    },
    finishDate: {
      required: true,
      type: String,
    },
    cancel: {
      required: true,
      type: Boolean,
    },
    interest: {
      required: true,
      type: Number,
    },
    createdAt: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      updatedPoint: '2021-07-20',
      now: dayjs().format('YYYY-MM-DD HH:mm'),
      startTime: dayjs(this.startDate).format('YYYY年MM月DD日 HH:mm'),
      finishTime: dayjs(this.finishDate).format('YYYY年MM月DD日 HH:mm'),
      createTime: dayjs(this.createdAt.toDate()).format('YYYY-MM-DD HH:mm'),
    };
  },
  methods: {
    toDetail() {
      const obj = {
        id: this.id,
        title: this.title,
        type: this.type,
        img: this.img,
        placeName: this.placeName,
        geometry: this.geometry,
        date: this.date,
        holdDate: this.date,
        startDate: this.startDate,
        finishDate: this.finishDate,
        cancel: this.cancel,
        interest: this.interest,
        createdAt: this.createdAt,
      };
      const that = this;
      async function assignment() {
        await that.$store.commit('event/getData', obj);
      }
      assignment().then(this.$router.push({ name: 'timeline-event-detailEvent' }));
      firebase.analytics().logEvent('eventDetail_view', { property: 'eventDetail_view' });
    },
  },
};
</script>
<style>
.event-img {
  height: 200px;
}
@media screen and (min-width: 960px) {
  .event-img {
    height: 230px;
  }
}
.v-card__text,
.v-card__subtitle {
  padding: 1px 1px 1px 16px;
  font-size: 13px;
}
</style>
