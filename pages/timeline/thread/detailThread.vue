<template>
  <div class="detail-thread-wrap">
    <v-card tile :elevation="1" class="mb-2">
      <viewer :images="threadObject.img">
        <template v-for="src in threadObject.img">
          <img v-show="src" :key="src" class="top-img" :src="src" />
        </template>
      </viewer>
      <v-card-title class="teal--text text--darken-1 font-weight-bold text-subtitle-1 px-2 py-3">
        {{ threadObject.content }}</v-card-title
      >
      <v-card-subtitle class="pa-0 py-3 text-caption px-2"
        >{{ threadObject.name }}さん：{{ threadObject.date }}</v-card-subtitle
      >
    </v-card>
    <v-list class="pt-0">
      <v-list-item-title class="font-weight-bold ml-3"
        ><v-icon class="mr-2">mdi-comment-multiple</v-icon>コメント</v-list-item-title
      >
    </v-list>
    <template v-if="isReply">
      <thread-comment
        v-for="(item, index) in replyArray"
        :key="item.commentId"
        v-bind="replyArray[index]"
        :class="`index-${index}`"
      ></thread-comment>
    </template>
    <template v-if="!isReply"
      ><p class="ml-3">このスレッドにまだコメントはありません。</p>
    </template>
    <v-divider></v-divider>
    <div class="pb-6">
      <v-list>
        <v-list-item-title class="font-weight-bold ml-3"
          ><v-icon class="mr-2">mdi-comment-plus</v-icon>コメント投稿</v-list-item-title
        >
      </v-list>
      <input-text
        :input-type="inputType"
        :input-placeholder="namePlaceholder"
        :input-value="name"
        @input="name = $event"
      ></input-text>
      <input-textarea
        :textarea-placeholder="contentPlaceholder"
        :textarea-value="content"
        @input="content = $event"
      ></input-textarea>
      <div class="reply-button mt-2">
        <post-button
          :button-method="reply"
          :button-type="buttonType"
          :button-disabled="content == ''"
          >投稿</post-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import InputText from '~/components/Atoms/AppInput';
import InputTextarea from '~/components/Atoms/AppTextarea';
import PostButton from '~/components/Atoms/AppButton';
import ThreadComment from '~/components/Organisms/ThreadComment';

const threads = firebase.firestore().collection('threads');

export default {
  layout: 'onlyBack',
  components: {
    InputText,
    InputTextarea,
    PostButton,
    ThreadComment,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      namePlaceholder: '名前',
      contentPlaceholder: 'テキストを入力',
      isReply: false,
      threadObject: [],
      replyArray: [],
      name: '',
      content: '',
      commentNumber: 1,
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email', id: 'thread/id' }),
  },
  created() {
    const that = this;
    threads
      .doc(this.id)
      .get()
      .then((doc) => {
        that.threadObject = {
          id: doc.id,
          name: doc.data().name,
          content: doc.data().content,
          img: [doc.data().img],
          date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
        };
      })
      .catch((err) => {
        alert(err);
      });

    threads
      .doc(this.id)
      .collection('reply')
      .orderBy('createdAt', 'asc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            that.replyArray = [
              ...that.replyArray,
              {
                commentId: doc.id,
                commentNumber: that.commentNumber,
                name: doc.data().name,
                content: doc.data().content,
                date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
              },
            ];
            that.isReply = true;
            that.commentNumber++;
          }
        });
      })
      .catch((err) => {
        alert(err);
      });
  },
  methods: {
    scrollToElement(index) {
      this.$nextTick(() => {
        const newAnswerDOM = this.$el.getElementsByClassName(`index-${index}`)[0];
        newAnswerDOM.scrollIntoView({ behavior: 'smooth' });
      });
    },
    reply() {
      const that = this;
      const user = firebase
        .firestore()
        .collection('users')
        .doc(this.uid)
        .collection('thread')
        .doc('reply');
      const timestamp = firebase.firestore.Timestamp.now();
      if (this.name === '') {
        this.name = '名無し';
      }

      const comment = {
        commentId: timestamp.toDate().toString(),
        name: that.name,
        commentNumber: that.commentNumber++,
        content: that.content,
        date: dayjs(timestamp.toDate()).locale('ja').format('YY/MM/DD HH:mm'),
      };

      threads
        .doc(this.id)
        .collection('reply')
        .add({
          name: that.name,
          content: that.content,
          createdAt: timestamp,
          read: true,
          uid: that.uid,
          email: that.email,
        })
        .then((doc) => {
          that.name = '';
          that.content = '';
          that.isReply = true;
          user
            .update({ id: firebase.firestore.FieldValue.arrayUnion(doc.id) })
            .then(() => {
              that.replyArray = [...that.replyArray, comment];
              that.scrollToElement(that.replyArray.length - 1);
            })
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
<style scoped>
.detail-thread-wrap {
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}
.top-img {
  width: 100%;
  height: 30vh;
  object-fit: cover;
}
.reply-button {
  text-align: center;
}
.content-textarea {
  border-radius: 25px;
}
</style>
