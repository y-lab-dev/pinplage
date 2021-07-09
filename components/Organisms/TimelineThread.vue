<template>
  <div class="threads-view">
    <thread-card v-for="item in threadArray" :key="item.id" v-bind="item" />
  </div>
</template>
<script>
import ThreadCard from '~/components/Molecules/ThreadCard';
import firebase from '~/plugins/firebase';

const threads = firebase.firestore().collection('threads');
export default {
  components: {
    ThreadCard,
  },
  data() {
    return {
      threadArray: [],
      inputType: 'text',
      buttonType: 'submit',
      namePlaceholder: '名前（匿名）',
      contentPlaceholder: '内容',
    };
  },
  created() {
    const that = this;
    threads
      .orderBy('createdAt', 'desc')
      .where('college', '==', 'shizuoka-h')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().type === 'pr') {
            that.threadArray = [
              {
                id: doc.id,
                name: doc.data().name,
                content: doc.data().content,
                img: doc.data().img,
                date: doc.data().createdAt.toDate(),
                type: doc.data().type,
              },
              ...that.threadArray,
            ];
            return;
          }
          that.threadArray = [
            ...that.threadArray,
            {
              id: doc.id,
              name: doc.data().name,
              content: doc.data().content,
              img: doc.data().img,
              date: doc.data().createdAt.toDate(),
              type: doc.data().type,
            },
          ];
        });
      });
  },
};
</script>
<style scoped>
.threads-view {
  max-width: 550px;
}
</style>
