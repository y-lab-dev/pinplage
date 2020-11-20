<template>
  <div>
    <comment-thread v-for="(item, index) in comments" :key="index" v-bind="item" />
    <!-- <div v-for="(item, index) in comments" :key="index">{{ item }}</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import CommentThread from '~/components/molecules/CommentThread';
export default {
  layout: 'onlyBack',
  components: {
    CommentThread,
  },
  data() {
    return {
      comments: [],
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    // const that =this;
    // const userUid = this.uid;
    // const userInfo = firebase.firestore().collection('users').doc(userUid);
    // userInfo
    //   .collection('article')
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       // console.log(doc.id);
    //       // console.log(doc.data());
    //     });
    //   });
    this.getUserArticleComment();
  },
  methods: {
    async getUserArticleComment() {
      const that = this;
      await firebase
        .firestore()
        .collectionGroup('comment')
        .where('commenter', '==', this.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            that.comments = [
              ...that.comments,
              {
                commentId: doc.id,
                commenter: doc.data().commenter,
                content: doc.data().content,
                createdAt: dayjs(doc.data().createdAt.toDate())
                  .locale('ja')
                  .format('YY/MM/DD HH:mm:ss'),
              },
            ];
          });
        });
    },
  },
};
</script>
