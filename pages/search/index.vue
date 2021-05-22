<template>
  <div class="search-contents">
    <search-place />
  </div>
</template>
<script>
import searchPlace from '~/components/Organisms/SearchPlace';
export default {
  layout: 'protected',
  components: { searchPlace },
};
</script>
<style>
.search-contents {
  margin: 0 auto;
}
</style>
