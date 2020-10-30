<template>
  <v-card tile :elevation="2" @click="toThreadDetail()">
    <v-img v-show="img" :src="img" height="200px"></v-img>
    <v-card-title>
      <p>
        名前：<span class="teal--text text--darken-1 font-weight-bold">{{ name }} </span>
      </p>
    </v-card-title>
    <v-card-subtitle>{{ formatedDay }}</v-card-subtitle>
    <v-list-item>
      <v-list-item-content>{{ content }}</v-list-item-content>
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
