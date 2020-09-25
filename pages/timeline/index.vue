<template>
  <div>
    <v-tabs v-model="model" color="#61d4b3" class="tabs" grow center-active show-arrows>
      <v-tab href="#tab-1">スレッド</v-tab>
      <v-tab href="#tab-2">知恵袋</v-tab>
      <v-tab href="#tab-3">アルバイト</v-tab>
      <v-tab href="#tab-4">周辺施設</v-tab>
      <v-tab href="#tab-5">イベント</v-tab>
      <v-tab href="#tab-6">鈴鈴</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <thread></thread>
      </v-tab-item>
      <v-tab-item value="tab-2"></v-tab-item>
      <v-tab-item value="tab-3"></v-tab-item>
      <v-tab-item value="tab-4"></v-tab-item>
      <v-tab-item value="tab-5"></v-tab-item>
      <v-tab-item value="tab-6"></v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import firebase from '~/plugins/firebase';
import Thread from '~/components/Organisms/TimelineThread';
const threads = firebase.firestore().collection('threads');
export default {
  layout: 'protected',
  components: {
    Thread,
  },
  data() {
    return {
      model: 'tab-1',
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
              date: doc.data().date,
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
      assignment().then(this.$router.push({ name: 'timeline-thread-detailThread' }));
    },
  },
};
</script>
