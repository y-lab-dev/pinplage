<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="title">ログイン</div>
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
        <div class="login-button-place mt-8 mb-2">
          <sign-in-button
            :button-method="login"
            :button-type="buttonType"
            :button-disabled="loginValidation"
            >ログインする</sign-in-button
          >
        </div>
        <div class="password-forget text-caption mt-4">
          <nuxt-link to="resetPassword">パスワードを忘れた方へ</nuxt-link>
        </div>
        <div class="sign-up">
          <nuxt-link to="signUp">新規登録</nuxt-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Cookies from 'js-cookie';
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
      passwordType: 'password',
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
  created() {
    if (Boolean(Cookies.get('email')) && Boolean(Cookies.get('password'))) {
      this.email = Cookies.get('email');
      this.password = Cookies.get('password');
    }
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
              this.$store.dispatch('user/login', {
                uid: user.uid,
                email: user.email,
                password: this.password,
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
.login-button-place {
  text-align: center;
}
.password-forget {
  text-align: center;
  text-decoration: underline;
}
.sign-up {
  text-align: center;
  margin-top: 200px;
  text-decoration: underline;
}
</style>
