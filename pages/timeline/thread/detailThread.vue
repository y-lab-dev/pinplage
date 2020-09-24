<template>
  <div>
    <v-card v-for="item in threadArray" :key="item.id" :elevation="2">
      <v-card-title>
        {{ item.content }}
      </v-card-title>
      <v-card-subtitle>{{ item.name }}</v-card-subtitle>
      <v-list-item>
        <v-list-item-content class="date">
          {{ item.date }}
        </v-list-item-content>
      </v-list-item>
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
      <post-button
        :button-method="reply"
        :button-type="buttonType"
        :button-disabled="postValidation"
        >投稿</post-button
      >
    </v-card>
    <template v-if="isReply">
      <v-card v-for="item in replyArray" :key="item.id" :elevation="2">
        <v-card-title>
          {{ item.content }}
        </v-card-title>
        <v-card-subtitle>{{ item.name }}</v-card-subtitle>
        <v-list-item>
          <v-list-item-content class="date">
            {{ item.date }}
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </template>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import firebase from '~/plugins/firebase';
import InputText from '~/components/Atoms/AppInput';
import InputTextarea from '~/components/Atoms/AppTextarea';
import PostButton from '~/components/Atoms/AppButton';

const threads = firebase.firestore().collection('threads');

export default {
  layout: 'protected',
  components: {
    InputText,
    InputTextarea,
    PostButton,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      namePlaceholder: '名前（匿名）',
      contentPlaceholder: '内容',
      isReply: false,
      threadArray: [],
      replyArray: [],
      name: '',
      content: '',
      postValidation: false,
    };
  },
  computed: {
    uid() {
      return this.$store.getters['user/uid'];
    },
  },
  created() {
    const that = this;
    threads
      .doc(that.$store.state.thread.threadId)
      .get()
      .then((doc) => {
        that.threadArray = [
          ...that.threadArray,
          {
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
          },
        ];
      })
      .catch((err) => {
        alert(err);
      });

    threads
      .doc(that.$store.state.thread.threadId)
      .collection('reply')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          if (doc.exists) {
            that.replyArray = [
              ...that.replyArray,
              {
                id: doc.id,
                name: doc.data().name,
                content: doc.data().content,
                date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
              },
            ];
            that.isReply = true;
          }
        });
      })
      .catch((err) => {
        alert(err);
      });
  },
  methods: {
    reply() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp.now();

      threads
        .doc(that.$store.state.thread.threadId)
        .collection('reply')
        .doc()
        .set({
          name: that.name,
          content: that.content,
          createdAt: timestamp,
          read: true,
          uid: that.uid,
        })
        .then(() => {
          that.$router.push({ name: 'timeline' });
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
