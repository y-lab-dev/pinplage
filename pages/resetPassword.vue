<template>
  <v-container>
    <v-row align-content="center">
      <v-col cols="6">
        <div class="bg">
          <div class="bg-main">
            <p><img src="~/assets/login.png" width="70%" /></p>
            <h1>浜キャン生のための<br />モバイルキャンパスアプリ</h1>
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="main">
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
          that.modalText = 'パスワードの再設定メールを送信しました。';
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
.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(rgb(45, 168, 170), rgb(54, 170, 55));
}
.bg-main {
  height: 97%;
  display: -ms-grid;
  display: grid;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
}
.bg-main p {
  margin-bottom: -200px;
}
.bg-main h1 {
  font-size: 32px;
  font-weight: normal;
  color: #fff;
}
.main {
  position: fixed;
  left: 50%;
  top: 0;
  width: 50%;
  height: 100%;
}
.title {
  text-align: center;
  margin-top: 65px;
  margin-bottom: 30px;
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
