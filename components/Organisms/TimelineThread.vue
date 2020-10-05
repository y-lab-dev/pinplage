<template>
  <div>
    <v-card v-for="item in threadArray" :key="item.id" :elevation="2" @click="toThreadDetail(item)">
      <v-img v-show="item.img" :src="item.img"></v-img>
      <v-card-title>{{ item.content }}</v-card-title>
      <v-card-subtitle>{{ item.name }}</v-card-subtitle>
      <v-list-item>
        <v-list-item-content class="date">{{ item.date }}</v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';

const threads = firebase.firestore().collection('threads');
export default {
  data() {
    return {
      threadArray: [],
      inputType: 'text',
      buttonType: 'submit',
      namePlaceholder: '名前（匿名）',
      contentPlaceholder: '内容',
    };
  },
  created() {
    const that = this;
    threads
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.threadArray = [
            ...that.threadArray,
            {
              id: doc.id,
              name: doc.data().name,
              content: doc.data().content,
              img: doc.data().img,
              date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
            },
          ];
        });
      });
  },
  methods: {
    toThreadDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('thread/getId', obj);
      }
      assignment().then(this.$router.push('timeline/thread/detailThread'));
    },
  },
};
</script>
