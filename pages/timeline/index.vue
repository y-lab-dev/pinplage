<template>
  <div>
    <v-tabs v-model="model" color="#61d4b3" class="tabs" grow center-active show-arrows>
      <v-tab href="#tab-1">スレッド</v-tab>
      <v-tab href="#tab-2">知恵袋 </v-tab>
      <v-tab href="#tab-3">アルバイト</v-tab>
      <v-tab href="#tab-4">周辺施設</v-tab>
      <v-tab href="#tab-5">イベント</v-tab>
      <v-tab href="#tab-6">鈴鈴</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <v-card
          v-for="item in threadArray"
          :key="item.id"
          :elevation="2"
          @click="toThreadDetail(item)"
        >
          <v-card-title>
            {{ item.content }}
          </v-card-title>
          <v-card-subtitle>{{ item.name }}</v-card-subtitle>
          <v-list-item>
            <v-list-item-content class="date">
              {{ item.date }}
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-2"> </v-tab-item>
      <v-tab-item value="tab-3"> </v-tab-item>
      <v-tab-item value="tab-4"> </v-tab-item>
      <v-tab-item value="tab-5"> </v-tab-item>
      <v-tab-item value="tab-6"> </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import firebase from '~/plugins/firebase';

const threads = firebase.firestore().collection('threads');
export default {
  layout: 'protected',
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
