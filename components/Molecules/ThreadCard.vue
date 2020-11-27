<template>
  <v-card tile class="ma-2" :elevation="2" @click="toThreadDetail()">
    <v-container class="py-0">
      <v-row v-if="img">
        <v-col cols="3">
          <v-avatar class="ma-3" size="60" tile>
            <v-img :src="img"></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="9">
          <v-card-title class="teal--text text--darken-1 font-weight-bold text-subtitle-1 pa-0">
            {{ content }}
          </v-card-title>
          <v-card-subtitle class="pa-0 pt-3 text-caption">{{ formatedDay }}</v-card-subtitle>
        </v-col>
      </v-row>
      <v-row v-if="!img">
        <v-col cols="12">
          <v-card-title class="teal--text text--darken-1 font-weight-bold text-subtitle-1 pa-0">
            {{ content }}
          </v-card-title>
          <v-card-subtitle class="pa-0 pt-3 text-caption">{{ formatedDay }}</v-card-subtitle>
        </v-col>
      </v-row>
    </v-container>
    <!-- <v-img v-show="img" :src="img" height="200px"></v-img> -->
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
    name: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    img: {
      required: false,
      type: String,
      default: '',
    },
    date: {
      required: true,
      type: Date,
      default: '',
    },
  },
  computed: {
    formatedDay() {
      const createdDay = this.date;
      return dayjs(createdDay).locale('ja').format('YY/MM/DD HH:mm:ss');
    },
  },
  methods: {
    toThreadDetail() {
      const that = this;
      const obj = {
        id: this.id,
        name: this.name,
        content: this.content,
        img: this.img,
        date: this.date,
      };
      async function assignment() {
        await that.$store.commit('thread/getId', obj);
      }
      assignment().then(this.$router.push({ name: 'timeline-thread-detailThread' }));
    },
  },
};
</script>
