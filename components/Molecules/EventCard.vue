<template>
  <v-card class="mt-2 mx-2" :elevation="5" @click="toDetail">
    <v-img v-if="img" class="white--text align-end" height="200px" :src="img"></v-img>
    <v-card-subtitle v-if="cancel" class="red--text pb-0"
      >このイベントが中止になりました</v-card-subtitle
    >
    <v-card-title class="title">{{ title }}</v-card-title>
    <v-card-subtitle>{{ placeName }}</v-card-subtitle>
    <v-list-item>
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
  </v-card>
</template>

<script>
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
    cancel: {
      required: true,
      type: Boolean,
    },
    interest: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      now: dayjs().format('YYYY-MM-DD'),
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
        cancel: this.cancel,
        interest: this.interest,
      };
      const that = this;
      async function assignment() {
        await that.$store.commit('event/getData', obj);
      }
      assignment().then(this.$router.push({ name: 'timeline-event-detailEvent' }));
    },
  },
};
</script>
