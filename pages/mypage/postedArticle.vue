<template>
  <div>
    <v-tabs v-model="postedTab" grow color="#61d4b3">
      <v-tab>記事へのコメント</v-tab>
    </v-tabs>

    <v-tabs-items v-model="postedTab">
      <v-tab-item>
        <comment-thread v-for="(item, index) in comments" :key="index" v-bind="item" />
      </v-tab-item>
    </v-tabs-items>
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
      postedTab: '',
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
