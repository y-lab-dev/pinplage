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
import Thread from '~/components/Organisms/TimelineThread';

export default {
  layout: 'protected',
  components: {
    Thread,
  },
  data() {
    return {
      model: 'tab-1',
    };
  },
};
</script>
