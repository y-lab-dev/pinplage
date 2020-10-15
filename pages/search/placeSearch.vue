<template>
  <div>
    <ais-instant-search :search-client="searchClient" index-name="places">
      <ais-search-box placeholder="検索" />
      <ais-hits>
        <ul slot-scope="{ items }">
          <ol v-for="item in items" :key="item.objectID" @click="toPlaceDetail(item)">
            <v-card class="box">
              <h4>{{ item.name }}</h4>
              <rating
                :read-only="true"
                :star-size="20"
                :rating-result="item.rating"
                :increment="0.1"
              ></rating>
              <v-img v-show="item.mainImgUrl" :src="item.mainImgUrl" class="photo"></v-img>
              <p>{{ item.vincinty }}</p>
            </v-card>
          </ol>
        </ul>
      </ais-hits>
    </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch';
import Rating from '~/components/molecules/Rating';

export default {
  layout: 'protected',
  components: {
    Rating,
  },
  data() {
    return {
      searchClient: algoliasearch('ZI3A3BYLFT', 'dd660cd8b43da0cc68310ac6a365438b'),
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
ul {
  padding-left: 1px;
  padding-right: 1px;
}

ol {
  padding-left: 4px;
  padding-right: 4px;
}

.box {
  margin: 4px;
}

.photo {
  max-width: 160px;
  max-height: 120px;
}
</style>
