<template>
  <div>
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
