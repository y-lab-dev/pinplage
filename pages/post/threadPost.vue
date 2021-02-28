<template>
  <v-container class="post-thread-back" style="height: 100%" fluid>
    <template>
      <Modal
        :modal-title="modalTitle"
        :modal-text="modalText"
        :modal-button="buttonText"
        :modal-toggle="modal"
        @changeValue="clickModal()"
      />
    </template>
    <v-row justify="center">
      <v-card width="90vw" color="white">
        <v-container class="py-0">
          <v-row justify="center">
            <v-col cols="5">
              <v-img height="auto" :src="require('~/assets/timeline/thread.png')"></v-img>
            </v-col>
            <v-col cols="6" align-self="center">
              <v-row>
                <v-col cols="12" class="pa-0">
                  <p class="catchphrase">静大生に自由に</p>
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
                :button-disabled="content == ''"
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
import Modal from '~/components/Molecules/AppModal';
import firebase from '~/plugins/firebase';
const threads = firebase.firestore().collection('threads');

export default {
  layout: 'protected',
  components: {
    InputText,
    InputTextarea,
    InputImage,
    PostButton,
    Modal,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      imgPath: 'threads/image',
      namePlaceholder: '名前',
      contentPlaceholder: '※テキストを入力',
      imgLabel: '画像',
      name: '',
      content: '',
      img: '',
      type: 'thread',
      college: 'shizuoka-h',
      modal: false,
      modalTitle: '',
      modalText: '',
      buttonText: '',
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email' }),
  },
  methods: {
    post() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp.now();
      const db = firebase.firestore();
      const user = db.collection('users');
      if (this.name === '') {
        this.name = '名無し';
      }

      threads
        .add({
          name: that.name,
          content: that.content,
          img: that.img,
          createdAt: timestamp,
          read: true,
          uid: that.uid,
          email: that.email,
          type: that.type,
          college: that.college,
        })
        .then((doc) => {
          user
            .doc(this.uid)
            .collection('thread')
            .doc('post')
            .update({
              id: firebase.firestore.FieldValue.arrayUnion(doc.id),
            })
            .then(() => {
              that.modal = !this.modal;
              that.modalTitle = 'プラージュ獲得';
              that.modalText =
                '５プラージュ獲得しました！(反映されるまで少し時間がかかる場合がございます)';
              that.buttonText = 'Ok';
            })
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err) => {
          alert(err);
        });
    },
    imgAdd(url) {
      this.img = url;
    },
    clickModal() {
      this.modal = !this.modal;
      this.$router.push({ name: 'timeline' });
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
