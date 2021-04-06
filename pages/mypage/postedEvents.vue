<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3" class="posted-tabs">
      <v-tab>投稿したイベント</v-tab>
    </v-tabs>
    <div class="posted-events-wrap">
      <v-tabs-items v-model="postedTab">
        <v-tab-item>
          <div v-if="!postedEvents.length">
            <prompt-card
              :link="'post-eventPost'"
              :image="require('~/assets/timeline/event.png')"
              :message="'初めてのイベントを投稿してみませんか？'"
            />
          </div>
          <event-card v-for="(item, index) in postedEvents" v-cloak :key="index" v-bind="item" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import EventCard from '~/components/Molecules/EventCard';
import PromptCard from '~/components/Molecules/PromptCard';

export default {
  layout: 'onlyBack',
  components: {
    EventCard,
    PromptCard,
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
<style scoped>
.posted-events-wrap {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}
</style>
