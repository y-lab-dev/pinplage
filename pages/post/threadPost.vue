<template>
  <v-container class="post-thread-back" style="height: 100%" fluid>
    <v-row justify="center">
      <v-card width="90vw" color="white">
        <v-container class="py-0">
          <v-row justify="center">
            <v-col cols="5">
              <v-img height="auto" :src="require('~/assets/post/threadPost.png')"></v-img>
            </v-col>
            <v-col cols="6" align-self="center">
              <v-row>
                <v-col cols="12" class="pa-0">
                  <p class="catchphrase">静大生に好きに自由に</p>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <p class="catchphrase">情報発信してみよう！</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
    <v-row class="mt-2" align="start" justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <p class="required-phrase">※は必須項目です</p>
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
            <input-image :img-path="imgPath" :label="imgLabel" @imgSubmit="imgAdd"></input-image>
            <div class="post-button">
              <post-button
                :button-method="post"
                :button-type="buttonType"
                :button-disabled="postValidation"
                >投稿</post-button
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import InputText from '~/components/Atoms/AppInput';
import InputTextarea from '~/components/Atoms/AppTextarea';
import InputImage from '~/components/Molecules/AppImageInput';
import PostButton from '~/components/Atoms/AppButton';
import firebase from '~/plugins/firebase';
const threads = firebase.firestore().collection('threads');

export default {
  layout: 'protected',
  components: {
    InputText,
    InputTextarea,
    InputImage,
    PostButton,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      imgPath: 'threads/image',
      namePlaceholder: '※名前',
      contentPlaceholder: '※テキストを入力',
      imgLabel: '画像',
      name: '',
      content: '',
      img: '',
      nameCompleted: false,
      contentCompleted: false,
      postValidation: true,
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email' }),
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
          img: that.img,
          createdAt: timestamp,
          read: true,
          uid: that.uid,
          email: that.email,
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
    imgAdd(url) {
      this.img = url;
    },
  },
};
</script>
<style scoped>
.post-thread-back {
  background-color: #e7e7e75e;
}
.required-phrase {
  margin-bottom: 0;
  margin-left: 4px;
  font-size: 0.8rem;
}
.post-button {
  text-align: center;
}
</style>
