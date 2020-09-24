<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <v-card>
          <v-card-text>
            <div class="title">スレッド</div>
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
              :button-method="post"
              :button-type="buttonType"
              :button-disabled="postValidation"
              >投稿</post-button
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import InputText from '~/components/Atoms/AppInput';
import InputTextarea from '~/components/Atoms/AppTextarea';
import PostButton from '~/components/Atoms/AppButton';
import firebase from '~/plugins/firebase';
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
      name: '',
      content: '',
      nameCompleted: false,
      contentCompleted: false,
      postValidation: true,
    };
  },
  computed: {
    uid() {
      return this.$store.getters['user/uid'];
    },
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
  methods: {
    post() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp.now();

      threads
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
.title {
  text-align: center;
}
</style>
