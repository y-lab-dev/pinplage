<template>
  <div>
    <nuxt-link to="post/threadPost">スレッド投稿</nuxt-link>
    <nuxt-link to="post/wisdomPost">知恵袋投稿</nuxt-link>
    <nuxt-link to="post/eventPost">イベント投稿</nuxt-link>
    <nuxt-link to="post/placePost">周辺施設投稿</nuxt-link>
    <nuxt-link to="post/parttimeJobPost">アルバイト投稿</nuxt-link>
  </div>
</template>
<script>
export default {
  layout: 'protected',
};
</script>
