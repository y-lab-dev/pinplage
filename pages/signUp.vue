<template>
  <v-container>
    <v-row align-content="center">
      <v-col cols="12" md="8" sm="6">
        <div class="title">アカウント作成</div>
        <input-text
          :input-type="inputType"
          :input-placeholder="mailPlaceholder"
          :input-value="email"
          @input="email = $event"
        ></input-text>
        <div class="validation-email">{{ emailValidation }}</div>

        <input-text
          :input-type="inputType"
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
            >新規登録</sign-up-button
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
import InputText from '~/components/Atoms/AppInput';
import SignUpButton from '~/components/Atoms/AppButton';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputText,
    SignUpButton,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      mailPlaceholder: '静大メール（○○@shizuoka.ac.jp）',
      passwordPlaceholder: 'パスワード（英数字6文字以上）',
      email: '',
      password: '',
      emailValidation: '',
      passwordValidation: '',
      completedEmail: false,
      completedPassword: false,
      loginValidation: true,
    };
  },
  watch: {
    email(val) {
      if (val.length === 0) {
        this.emailValidation = 'メールアドレスを入力してください';
        this.completedEmail = false;
        this.check();
      } else if (
        !new RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(s.)?(inf.)?shizuoka.ac.jp|yuhashi.laboratory@gmail.com/
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
          firebase.auth().languageCode = 'ja';
          user.user.sendEmailVerification().then(() => {
            firebase
              .auth()
              .onAuthStateChanged((user) => {
                if (user) {
                  that.saveUserData(user);
                }
              })
              .then(() => {
                that.$router.push({ name: 'timeline' });
              });
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    saveUserData(val) {
      const user = firebase.firestore().collection('users');

      user.doc(val.uid).set({
        email: val.email,
        name: '',
        icon: '',
        userToken: '',
      });
    },
    check() {
      if (this.completedEmail === true && this.completedPassword === true) {
        this.loginValidation = false;
      } else {
        this.loginValidation = true;
      }
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
