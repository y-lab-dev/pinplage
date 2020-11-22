<template>
  <v-container>
    <v-row align-content="center">
      <v-col cols="12">
        <div class="title">アカウント作成</div>
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
          :input-type="nameType"
          :input-placeholder="namePlaceholder"
          :input-value="name"
          @input="name = $event"
        ></input-text>
        <div class="validation-email">{{ nameValidation }}</div>

        <input-text
          :input-type="inputType"
          :input-placeholder="mailPlaceholder"
          :input-value="email"
          @input="email = $event"
        ></input-text>
        <div class="validation-email">{{ emailValidation }}</div>

        <input-text
          :input-type="passwordType"
          :input-placeholder="passwordPlaceholder"
          :input-value="password"
          @input="password = $event"
        ></input-text>
        <div class="validation-password">{{ passwordValidation }}</div>
        <div class="sign-up-button-place mt-8">
          <sign-up-button
            :button-method="signUp"
            :button-type="buttonType"
            :button-disabled="loginValidation"
            >新規登録する</sign-up-button
          >
        </div>
        <div class="to-login">
          <nuxt-link to="login">アカウントをお持ちの方</nuxt-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Cookies from 'js-cookie';
import InputText from '~/components/Atoms/AppInput';
import SignUpButton from '~/components/Atoms/AppButton';
import Modal from '~/components/Molecules/AppModal';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputText,
    SignUpButton,
    Modal,
  },
  data() {
    return {
      nameType: 'text',
      inputType: 'text',
      passwordType: 'password',
      buttonType: 'submit',
      namePlaceholder: 'ユーザ名',
      mailPlaceholder: '静大メール（○○@shizuoka.ac.jp）',
      passwordPlaceholder: 'パスワード（英数字6文字以上）',
      name: '',
      email: '',
      password: '',
      nameValidation: '',
      emailValidation: '',
      passwordValidation: '',
      completedName: false,
      completedEmail: false,
      completedPassword: false,
      loginValidation: true,
      modal: false,
      modalTitle: '',
      modalText: '',
      buttonText: '',
    };
  },
  watch: {
    name(val) {
      if (val.length >= 1) {
        this.nameValidation = '';
        this.completedName = true;
        this.check();
      } else {
        this.nameValidation = '1文字以上を入力してください';
        this.completedName = false;
        this.check();
      }
    },
    email(val) {
      if (val.length === 0) {
        this.emailValidation = 'メールアドレスを入力してください';
        this.completedEmail = false;
        this.check();
      } else if (
        !new RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(s.)?(inf.)?(coop.)?shizuoka.ac.jp|yuhashi.laboratory@gmail.com/
        ).test(val)
      ) {
        this.emailValidation = '静大メールを入力してください';
        this.completedEmail = false;
        this.check();
      } else {
        this.emailValidation = '';
        this.completedEmail = true;
        this.check();
      }
    },
    password(val) {
      if (val.length >= 6) {
        this.passwordValidation = '';
        this.completedPassword = true;
        this.check();
      } else {
        this.passwordValidation = '英数字６文字以上で入力してください';
        this.completedPassword = false;
        this.check();
      }
    },
  },
  methods: {
    signUp() {
      const that = this;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          user = firebase.auth().currentUser;
          firebase.auth().languageCode = 'ja';
          user.sendEmailVerification().then(async function () {
            await firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                that.saveUserData(user);
                Cookies.set('email', that.email, { expires: 365 });
                Cookies.set('password', that.password, { expires: 365 });
              }
              that.modal = !that.modal;
              that.modalTitle = '登録完了';
              that.modalText =
                '登録したメールアドレスに認証メールを送信しました。ログインするために認証してください。';
              that.buttonText = 'Ok';
            });
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    saveUserData(val) {
      const db = firebase.firestore();
      const user = db.collection('users');

      user
        .doc(val.uid)
        .set({
          email: val.email,
          name: this.name,
          icon:
            'https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/user%2Ficon%2FdefaultIcon%2FS__46546947.jpg?alt=media&token=872c7955-4673-472f-a184-5c51717dcee1',
          userToken: '',
          point: 0,
        })
        .then(() => {
          db.collection('users').doc(val.uid).collection('job').doc('post').set({ id: [] });
          db.collection('users').doc(val.uid).collection('job').doc('reply').set({ id: [] });
          db.collection('users').doc(val.uid).collection('job').doc('keep').set({ id: [] });
          db.collection('users').doc(val.uid).collection('review').doc('post').set({ id: [] });
          db.collection('users').doc(val.uid).collection('review').doc('reply').set({ id: [] });
          db.collection('users').doc(val.uid).collection('event').doc('post').set({ id: [] });
          db.collection('users').doc(val.uid).collection('event').doc('reply').set({ id: [] });
          db.collection('users').doc(val.uid).collection('event').doc('join').set({ id: [] });
          db.collection('users').doc(val.uid).collection('event').doc('interest').set({ id: [] });
          db.collection('users').doc(val.uid).collection('article').doc('post').set({ id: [] });
          db.collection('users').doc(val.uid).collection('article').doc('reply').set({ id: [] });
          db.collection('users').doc(val.uid).collection('article').doc('favorite').set({ id: [] });
          db.collection('users').doc(val.uid).collection('thread').doc('post').set({ id: [] });
          db.collection('users').doc(val.uid).collection('thread').doc('reply').set({ id: [] });
          db.collection('users').doc(val.uid).collection('wisdom').doc('post').set({ id: [] });
          db.collection('users').doc(val.uid).collection('wisdom').doc('reply').set({ id: [] });
          db.collection('users').doc(val.uid).collection('wisdom').doc('likedPost').set({ id: [] });
          db.collection('users')
            .doc(val.uid)
            .collection('wisdom')
            .doc('likedReply')
            .set({ id: [] });
          db.collection('users').doc(val.uid).collection('place').doc('favorite').set({ id: [] });
          db.collection('users').doc(val.uid).collection('point').doc('log').set({ point: [] });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    check() {
      if (
        this.completedName === true &&
        this.completedEmail === true &&
        this.completedPassword === true
      ) {
        this.loginValidation = false;
      } else {
        this.loginValidation = true;
      }
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
  color: red;
}
.validation-password {
  text-align: center;
  color: red;
}
.sign-up-button-place {
  text-align: center;
}
.to-login {
  text-align: center;
  margin-top: 200px;
  text-decoration: underline;
}
</style>
