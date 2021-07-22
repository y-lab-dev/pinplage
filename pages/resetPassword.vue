<template>
  <v-container>
    <v-row align-content="center">
      <v-col cols="12">
        <div class="title">パスワード再設定</div>
        <template>
          <Modal
            :modal-title="modalTitle"
            :modal-text="modalText"
            :modal-button="buttonText"
            :modal-toggle="modal"
            @changeValue="clickModal()"
          />
        </template>
        <input-text
          :input-type="inputType"
          :input-placeholder="mailPlaceholder"
          :input-value="email"
          @input="email = $event"
        ></input-text>
        <div class="validation-email">{{ emailValidation }}</div>
        <div class="reset-button-place mt-4 mb-2">
          <reset-button
            :button-method="reset"
            :button-type="buttonType"
            :button-disabled="resetValidation"
            >リセットする</reset-button
          >
        </div>
        <br />
        <div class="to-login">
          <nuxt-link to="login"><reset-button>ログイン画面へ</reset-button></nuxt-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Cookies from 'js-cookie';
import InputText from '~/components/Atoms/AppInput';
import ResetButton from '~/components/Atoms/AppButton';
import Modal from '~/components/Molecules/AppModal';
import firebase from '~/plugins/firebase';
export default {
  components: {
    InputText,
    ResetButton,
    Modal,
  },
  data() {
    return {
      email: '',
      inputType: 'text',
      buttonType: 'submit',
      mailPlaceholder: 'メールアドレス（○○@shizuoka.ac.jp）',
      emailValidation: '',
      resetValidation: true,
      modal: false,
      modalTitle: '',
      modalText: '',
      buttonText: '',
    };
  },
  watch: {
    email(val) {
      if (val.length === 0) {
        this.emailValidation = 'メールアドレスを入力してください';
        this.resetValidation = true;
      } else if (
        !new RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(s.)?(inf.)?(coop.)?shizuoka.ac.jp|yuhashi.laboratory@gmail.com|akuz2013zuka.2013@gmail.com|pinplage.dev@gmail.com|ylab.dev.test@gmail.com/
        ).test(val)
      ) {
        this.emailValidation = '静大メールアドレス（○○@shizuoka.ac.jp）のみ使用可能です';
        this.resetValidation = true;
      } else {
        this.emailValidation = '';
        this.resetValidation = false;
      }
    },
  },
  methods: {
    reset() {
      const that = this;
      const auth = firebase.auth();
      const emailAddress = this.email;

      firebase.auth().languageCode = 'ja';
      auth
        .sendPasswordResetEmail(emailAddress)
        .then(() => {
          Cookies.remove('pass');
          that.modal = !that.modal;
          that.modalTitle = 'パスワード再設定';
          that.modalText = 'パスワードの再設定メールを送信しました';
          that.buttonText = 'OK';
        })
        .catch((err) => {
          alert(err);
        });
    },
    clickModal() {
      this.modal = !this.modal;
      this.$router.push({ name: 'login' });
    },
  },
};
</script>
<style scoped>
.title {
  text-align: center;
  margin-top: 65px;
}
.validation-email {
  text-align: center;
  color: #e81123;
}
.reset-button-place {
  text-align: center;
}
.to-login {
  text-align: center;
  margin-top: 150px;
  text-decoration: none;
}
</style>
