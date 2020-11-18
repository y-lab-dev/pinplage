<template>
  <div>
    <place-search />
  </div>
</template>
<script>
import placeSearch from '~/components/organisms/PlaceSearch';
export default {
  layout: 'protected',
  components: placeSearch,
};
</script>
