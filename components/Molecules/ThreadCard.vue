<template>
  <v-card tile class="ma-2" :elevation="2" @click="toThreadDetail()">
    <v-container v-if="type === 'thread'" class="py-0">
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
    <v-container v-if="type === 'pr'" class="pa-0 d-flex justify-center">
      <span class="pr-name">[PR]</span>
      <img :src="img" class="pr-img" />
    </v-container>
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
    name: {
      required: true,
      type: String,
    },
    content: {
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
      if (this.type === 'pr') {
        window.open('https://www.planetwalker.biz/accounts/sign_in');
        firebase.analytics().logEvent('PlanetWalkerAd_view', { property: 'PlanetWalkerAd_view' });
        return;
      }
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
      firebase.analytics().logEvent('threadDetail_view', { property: 'threadDetail_view' });
    },
  },
};
</script>

<style scoped>
.pr-cc {
  text-align: center;
  margin-bottom: 0;
  font-size: 1.2rem;
  font-family: serif;
}
.pr-card {
  position: relative;
}
.pr-name {
  position: absolute;
  top: 8%;
  right: 3%;
  font-size: 0.8rem;
  font-family: serif;
  color: white;
}
.pr-img {
  width: 100%;
  max-height: 10vh;
}
@media screen and (min-width: 500px) {
  .pr-img {
    max-height: 13vh;
  }
}
@media screen and (min-width: 600px) {
  .pr-img {
    max-height: 15vh;
  }
}
</style>
