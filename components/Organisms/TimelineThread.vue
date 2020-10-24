<template>
  <div>
    <v-card
      v-for="item in threadArray"
      :key="item.id"
      tile
      :elevation="2"
      @click="toThreadDetail(item)"
    >
      <v-img v-show="item.img" :src="item.img" height="200px"></v-img>
      <v-card-title
        ><p>
          名前：<span class="teal--text text--darken-1 font-weight-bold">{{ item.name }} </span>
        </p></v-card-title
      >
      <v-card-subtitle>{{ item.date }}</v-card-subtitle>
      <v-list-item>
        <v-list-item-content>{{ item.content }}</v-list-item-content>
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
