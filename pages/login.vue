<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="title">ログイン</div>
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
          <nuxt-link to="signUp"><sign-in-button>新規登録</sign-in-button></nuxt-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Cookies from 'js-cookie';
import InputText from '~/components/Atoms/AppInput';
import SignInButton from '~/components/Atoms/AppButton';
import Modal from '~/components/Molecules/AppModal';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputText,
    SignInButton,
    Modal,
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
        this.completedEmail = false;
        this.check();
      } else if (
        !new RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(s.)?(inf.)?(coop.)?shizuoka.ac.jp|yuhashi.laboratory@gmail.com|akuz2013zuka.2013@gmail.com|pinplage.dev@gmail.com|ylab.dev.test@gmail.com/
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
    if (Cookies.get('email') && Cookies.get('pass')) {
      this.email = Cookies.get('email');
      this.password = Cookies.get('pass');
    } else if (Cookies.get('email')) {
      this.email = Cookies.get('email');
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
              this.modal = !this.modal;
              this.modalTitle = '認証エラー';
              this.modalText =
                '認証メールを確認してください。認証メールが届かない場合は、迷惑メールフォルダの確認もお願いします。';
              this.buttonText = 'Ok';
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
        .catch(() => {
          this.modal = !this.modal;
          this.modalTitle = 'エラー';
          this.modalText =
            'メールアドレスまたはパスワードが違います。メールアドレスで認証がまだの場合は、迷惑メールフォルダを確認してください。';
          this.buttonText = 'Ok';
        });
    },
    check() {
      if (this.completedEmail === true && this.completedPassword === true) {
        this.loginValidation = false;
      } else {
        this.loginValidation = true;
      }
    },
    clickModal() {
      this.modal = !this.modal;
    },
  },
};
</script>
<style scoped>
.title {
  text-align: center;
  margin-top: 85px;
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
  text-decoration: none;
}
</style>
