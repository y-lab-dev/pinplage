<template>
  <div>
    <nuxt-link to="login">ログイン</nuxt-link>
    <nuxt-link to="/timeline">タイムライン</nuxt-link>
    <nuxt-link to="/search">検索</nuxt-link>
    <nuxt-link to="/post">投稿</nuxt-link>
    <nuxt-link to="/timetable">時間割</nuxt-link>
    <nuxt-link to="/mypage">マイページ</nuxt-link>
  </div>
</template>
<script>
export default {
  middleware: 'autoLogin',
};
</script>
