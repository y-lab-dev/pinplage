<template>
  <div>
    <v-card v-for="item in threadArray" :key="item.id" :elevation="2">
      <viewer :images="item.img">
        <template v-for="src in item.img">
          <img class="top-img" :src="src" :key="src" />
        </template>
      </viewer>
      <v-card-title>{{ item.content }} </v-card-title>
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
        >返信</post-button
      >
    </v-card>
    <template v-if="isReply">
      <v-card v-for="item in replyArray" :key="item.id" :elevation="1">
        <v-card-title class="text-subtitle-2"> {{ item.number }}:{{ item.content }} </v-card-title>
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
import { mapGetters } from 'vuex';
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
      nameCompleted: false,
      contentCompleted: false,
      postValidation: true,
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
        that.threadArray = [
          ...that.threadArray,
          {
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            img: [doc.data().img],
            date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
          },
        ];
        console.log('that.threadArray: ', that.threadArray);
      })
      .catch((err) => {
        alert(err);
      });

    let i = 1;
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
                id: doc.id,
                number: i,
                name: doc.data().name,
                content: doc.data().content,
                date: dayjs(doc.data().createdAt.toDate()).locale('ja').format('YY/MM/DD HH:mm:ss'),
              },
            ];
            that.isReply = true;
            i++;
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
        .doc(this.id)
        .collection('reply')
        .doc()
        .set({
          name: that.name,
          content: that.content,
          createdAt: timestamp,
          read: true,
          uid: that.uid,
          email: that.email,
        })
        .then(() => {
          that.$router.push('/timeline');
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
  width: 100vw;
}
</style>
