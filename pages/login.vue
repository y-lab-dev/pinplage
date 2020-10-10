<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" sm="6">
        <div class="title">Pin Plage ログイン</div>
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

        <sign-in-button
          :button-method="login"
          :button-type="buttonType"
          :button-disabled="loginValidation"
          >ログイン</sign-in-button
        >
        <nuxt-link to="resetPassword">パスワードを忘れた方へ</nuxt-link>
        <nuxt-link to="signUp">新規登録</nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import InputText from '~/components/Atoms/AppInput';
import SignInButton from '~/components/Atoms/AppButton';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputText,
    SignInButton,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      mailPlaceholder: '静大メール',
      passwordPlaceholder: 'パスワード',
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
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          firebase.auth().onAuthStateChanged(async (user) => {
            if (!user.emailVerified) {
              alert('認証メールを確認してください');
            } else {
              const token = await firebase.auth().currentUser.getIdToken(true);
              alert('ログイン成功');
              this.$store.dispatch('user/login', {
                uid: user.uid,
                email: user.email,
                token,
              });
              this.$store.dispatch('user/getUserInfo');
              this.$router.push({ name: 'timeline' });
            }
          });
        })
        .catch((error) => {
          alert('メールアドレスまたはパスワードが違います');
          console.log(error);
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
}
.validation-email {
  text-align: center;
  color: red;
}
.validation-password {
  text-align: center;
  color: red;
}
</style>
