<template>
  <div>
    <ais-instant-search :search-client="searchClient" index-name="nuxtSample">
      <ais-search-box placeholder="検索" />
      <ais-hits>
        <ul slot-scope="{ items }">
          <ol v-for="item in items" :key="item.objectID" @click="toPlaceDetail(item)">
            <v-card class="box"> {{ item.name }} {{ item.memo }} </v-card>
          </ol>
        </ul>
      </ais-hits>
    </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch';

export default {
  layout: 'protected',
  data() {
    return {
      searchClient: algoliasearch('JTR6FS61GK', 'c5890ad740da895502fba89087a01e1a'),
    };
  },
  methods: {
    toPlaceDetail(obj) {
      const self = this;
      async function assignment() {
        await self.$store.commit('place/getId', obj.placeId);
      }
      assignment().then(this.$router.push({ name: 'timeline-place-detailPlace' }));
    },
  },
};
</script>

<style scoped>
.box {
  margin: 4px;
}
</style>
