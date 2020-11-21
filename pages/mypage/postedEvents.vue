<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿したイベント</v-tab>
      <!-- <v-tab></v-tab> -->
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>
        <event-card v-for="(item, index) in postedEvents" v-cloak :key="index" v-bind="item" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import EventCard from '~/components/molecules/EventCard';
export default {
  layout: 'onlyBack',
  components: {
    EventCard,
  },
  data() {
    return {
      postedTab: '',
      postedEvents: [],
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
    }),
  },
  created() {
    this.getUserEvent().then(console.log(this.post));
  },
  methods: {
    async getUserEvent() {
      const that = this;
      const events = firebase.firestore().collection('events');
      await events
        .orderBy('createdAt', 'desc')
        .where('poster', '==', this.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.data());
            that.postedEvents = [
              ...that.postedEvents,
              {
                id: doc.id,
                title: doc.data().title,
                type: doc.data().type,
                img: doc.data().img,
                placeName: doc.data().placeName,
                geometry: doc.data().geometry,
                date: doc.data().date,
                holdDate: doc.data().date,
                cancel: doc.data().cancel,
                interest: doc.data().interest,
              },
            ];
          });
        });
    },
  },
};
</script>
