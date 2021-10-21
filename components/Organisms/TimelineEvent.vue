<template>
  <div class="events-view">
    <event-card v-for="(item, index) in eventArray" :key="index" v-bind="item" />
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
import EventCard from '~/components/Molecules/EventCard';

const event = firebase.firestore().collection('events');
export default {
  components: {
    EventCard,
  },
  data() {
    return {
      eventArray: [],
    };
  },
  created() {
    const that = this;
    event
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.eventArray = [
            ...that.eventArray,
            {
              id: doc.id,
              title: doc.data().title,
              type: doc.data().type,
              img: doc.data().img,
              placeName: doc.data().placeName,
              geometry: doc.data().geometry,
              date: doc.data().date,
              holdDate: doc.data().date,
              startDate: doc.data().startDate,
              finishDate: doc.data().finishDate,
              cancel: doc.data().cancel,
              interest: doc.data().interest,
              createdAt: doc.data().createdAt,
            },
          ];
        });
      });
  },
};
</script>
<style scoped>
.events-view {
  max-width: 550px;
  margin: auto;
}
</style>
