<template>
  <div>
    <article-card
      v-for="(item, index) in articleArray"
      :key="item.id"
      v-bind="articleArray[index]"
    ></article-card>
  </div>
</template>
<script>
import firebase from '~/plugins/firebase';
import ArticleCard from '~/components/Organisms/ArticleCard';

export default {
  components: {
    ArticleCard,
  },
  data() {
    return {
      articleArray: [],
    };
  },
  created() {
    const that = this;
    const article = firebase.firestore().collection('articles');

    article
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          that.articleArray = [
            ...that.articleArray,
            {
              id: doc.id,
              title: doc.data().title,
              date: doc.data().createdAt.toDate(),
              category: doc.data().category,
              canRead: doc.data().canRead,
              like: doc.data().like,
              mainImg: doc.data().mainImg,
              provider: doc.data().provider,
              range: doc.data().range,
              views: doc.data().views,
              author: doc.data().author,
            },
          ];
        });
      })
      .catch((err) => {
        alert(err);
      });
  },
};
</script>
