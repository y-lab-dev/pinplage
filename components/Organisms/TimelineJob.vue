<template>
  <div>
    <v-card v-for="item in jobArray" :key="item.id" :elevation="2" @click="tojobDetail(item)">
      <v-chip v-if="item.isRecruit" class="ma-2" color="red" outlined> 募集中 </v-chip>
      <v-chip v-if="!item.isRecruit" class="ma-2" color="primary" outlined> 募集締切 </v-chip>
      <div class="d-flex justify-space-around">
        <v-img height="20vh" width="1%" v-show="item.img" :src="item.img"></v-img>
        <div>
          <v-card-title
            ><span class="blue--text text--darken-3">{{ item.name }}</span></v-card-title
          >
          <v-card-subtitle>{{ item.genre }}</v-card-subtitle>
        </div>
      </div>
      <v-list-item>
        <v-icon size="25" left>mdi-currency-cny</v-icon>
        <v-list-item-content>時給{{ item.money }}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-icon size="25" left>mdi-clock-time-three-outline</v-icon>
        <v-list-item-content
          >勤務時間帯 {{ item.startTime }}-{{ item.endTime }}</v-list-item-content
        >
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
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
          that.jobArray = [
            ...that.jobArray,
            {
              id: doc.id,
              name: doc.data().name,
              genre: doc.data().genre,
              img: doc.data().img,
              place: doc.data().place,
              startTime: doc.data().startTime,
              endTime: doc.data().endTime,
              money: doc.data().money,
              isRecruit: doc.data().isRecruit,
            },
          ];
        });
      });
  },
  methods: {
    tojobDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('job/getId', obj);
      }
      assignment().then(this.$router.push('timeline/job/detailjob'));
    },
  },
};
</script>
