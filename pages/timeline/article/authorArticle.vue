<template>
  <div class="author-wrap">
    <v-container class="author-article-back" style="height: 100%" fluid>
      <v-row justify="center">
        <v-col>
          <v-card flat :elevation="3">
            <v-img height="100px" :src="authorIcon"></v-img>
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="authorIcon"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ authorName | authorText }}
                  <v-chip
                    v-if="articleNumbers >= 5"
                    class="mb-1"
                    color="#000000"
                    label
                    text-color="white"
                    x-small
                    >PRO</v-chip
                  >
                </v-list-item-title>
                <!-- <v-list-item-subtitle style="white-space: pre-wrap; word-wrap: break-word">{{
                authorInfo
              }}</v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
            <v-spacer></v-spacer>
            <v-divider></v-divider>
          </v-card>
          <v-card
            v-for="item in authorArticleArray"
            :key="item.articleId"
            flat
            class="mt-2 mx-1"
            :elevation="3"
            @click="toDetail(item)"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.createdAt }}</v-list-item-subtitle>
              </v-list-item-content>
              <img width="70px" height="50px" :src="item.mainImg" />
            </v-list-item> </v-card
        ></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'protected',
  filters: {
    authorText(val) {
      if (val.length > 12) {
        return val.substring(0, 12) + '...';
      } else {
        return val;
      }
    },
  },
  data() {
    return {
      authorArticleArray: [],
      articleNumbers: 0,
      authorName: '',
      authorIcon: '',
    };
  },
  computed: {
    ...mapGetters({ authorId: 'article/author' }),
  },
  created() {
    const that = this;
    const article = firebase.firestore().collection('articles');
    const user = firebase.firestore().collection('users');
    const authorUserData = user.doc(this.authorId);

    article
      .orderBy('createdAt', 'desc')
      .where('author', '==', this.authorId)
      .get()
      .then((snapshot) => {
        that.articleNumbers = snapshot.size;
        snapshot.forEach((doc) => {
          that.authorArticleArray = [
            ...that.authorArticleArray,
            {
              id: doc.id,
              title: doc.data().title,
              createdAt: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YYYY/MM/DD'),
              canRead: doc.data().canRead,
              mainImg: doc.data().mainImg,
              category: doc.data().category,
            },
          ];
        });
      })
      .catch(function (err) {
        alert(err);
      });

    authorUserData
      .get()
      .then((doc) => {
        that.authorName = doc.data().name;
        that.authorIcon = doc.data().icon;
      })
      .catch(function (err) {
        alert(err);
      });
  },
  methods: {
    toDetail(obj) {
      const that = this;
      async function assignment() {
        await that.$store.commit('article/getData', obj);
      }
      assignment().then(this.$router.push('detailArticle'));
    },
  },
};
</script>
<style scoped>
.author-article-back {
  background-color: #e7e7e75e;
}
.author-wrap {
  max-width: 600px;
  margin: 0 auto;
}
</style>
