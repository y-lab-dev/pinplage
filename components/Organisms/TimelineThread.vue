<template>
  <div>
    <thread-card v-for="item in threadArray" :key="item.id" v-bind="item" />
  </div>
</template>
<script>
import ThreadCard from '~/components/molecules/ThreadCard';
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
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.threadArray = [
            ...that.threadArray,
            {
              id: doc.id,
              name: doc.data().name,
              content: doc.data().content,
              img: doc.data().img,
              date: doc.data().createdAt.toDate(),
            },
          ];
        });
      });
  },
};
</script>
