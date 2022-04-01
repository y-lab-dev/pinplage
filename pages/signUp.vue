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
          <template v-if="modalAppRule">
            <AppRule class="app-rule-modal" />
          </template>
          <div class="checkbox">
            <v-checkbox v-model="checkbox" color="#61d4b3"></v-checkbox>
            <div class="app-rule-text" @click="pushAppRule()">
              <span class="important">{{ appRule }}</span>
              に同意する
            </div>
          </div>
          <div class="sign-up-button-place mt-8">
            <sign-up-button
              :button-method="signUp"
              :button-type="buttonType"
              :button-disabled="loginValidation"
              >新規登録する</sign-up-button
            >
          </div>
          <div class="to-login">
            <nuxt-link to="login"><sign-up-button>ログインはこちら</sign-up-button></nuxt-link>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import InputText from '~/components/Atoms/AppInput';
import SignUpButton from '~/components/Atoms/AppButton';
import AppRule from '~/components/Molecules/AppRule';
import Modal from '~/components/Molecules/AppModal';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputText,
    SignUpButton,
    AppRule,
    Modal,
  },
  data() {
    return {
      nameType: 'text',
      inputType: 'text',
      passwordType: 'password',
      buttonType: 'submit',
      namePlaceholder: 'ユーザ名',
      mailPlaceholder: 'メールアドレス（○○@shizuoka.ac.jp）',
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
      modalAppRule: false,
      checkbox: false,
      appRule: '利用規約',
    };
  },
  watch: {
    name(val) {
      if (val.length >= 1) {
        this.nameValidation = '';
        this.completedName = true;
        this.check();
      } else {
        this.nameValidation = '1文字以上を入力してください。';
        this.completedName = false;
        this.check();
      }
    },
    email(val) {
      if (val.length === 0) {
        this.emailValidation = 'メールアドレスを入力してください。';
        this.completedEmail = false;
        this.check();
      } else if (
        !new RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(s.)?(inf.)?(coop.)?shizuoka.ac.jp|yuhashi.laboratory@gmail.com|akuz2013zuka.2013@gmail.com|pinplage.dev@gmail.com|ylab.dev.test@gmail.com/
        ).test(val)
      ) {
        this.emailValidation = '静大メールアドレス（○○@shizuoka.ac.jp）のみ使用可能です';
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
        this.passwordValidation = '英数字6文字以上で入力してください';
        this.completedPassword = false;
        this.check();
      }
    },
    checkbox(value) {
      if (value) {
        this.check();
      } else {
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
        this.completedPassword === true &&
        this.checkbox
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
    pushAppRule() {
      this.modalAppRule = !this.modalAppRule;
    },
  },
};
</script>
<style scoped>
.sign-up-button-place {
  text-align: center;
}
.to-login {
  text-align: center;
  margin-top: 150px;
  text-decoration: none;
}
.app-rule-modal {
  width: 90%;
}
.checkbox {
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  display: flex;
}
.app-rule-text {
  margin-top: 20px;
}
.important {
  text-decoration: underline;
  cursor: pointer;
  color: #61d4b3;
}
</style>
<style scoped src="@/assets/login.css"></style>
