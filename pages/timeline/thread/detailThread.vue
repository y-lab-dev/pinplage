<template>
  <div>
    <v-card tile :elevation="1" class="mb-2">
      <viewer :images="threadObject.img">
        <template v-for="src in threadObject.img">
          <img v-show="src" :key="src" class="top-img" :src="src" />
        </template>
      </viewer>
      <v-card-title
        ><p>
          名前：<span class="teal--text text--darken-1 font-weight-bold"
            >{{ threadObject.name }}
          </span>
        </p></v-card-title
      >
      <v-card-subtitle>{{ threadObject.date }}</v-card-subtitle>
      <v-list-item>
        <v-list-item-content>{{ threadObject.content }}</v-list-item-content>
      </v-list-item>
    </v-card>
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
          :button-disabled="postValidation"
          >投稿</post-button
        >
      </div>
    </div>
    <v-divider></v-divider>
    <v-list>
      <v-list-item-title class="font-weight-bold ml-3 mt-2"
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
  layout: 'protected',
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
      nameCompleted: false,
      contentCompleted: false,
      postValidation: true,
      commentNumber: 1,
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email', id: 'thread/id' }),
  },
  watch: {
    name(val) {
      if (val.length === 0) {
        this.nameCompleted = false;
        this.check();
      } else {
        this.nameCompleted = true;
        this.check();
      }
    },
    content(val) {
      if (val.length === 0) {
        this.contentCompleted = false;
        this.check();
      } else {
        this.contentCompleted = true;
        this.check();
      }
    },
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
    check() {
      if (this.nameCompleted === true && this.contentCompleted === true) {
        this.postValidation = false;
      } else {
        this.postValidation = true;
      }
    },
  },
};
</script>
<style scoped>
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
