<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <div>
          <div class="title">パスワード再設定</div>
          <input-text
            :input-type="inputType"
            :input-placeholder="mailPlaceholder"
            :input-value="email"
            @input="email = $event"
          ></input-text>
          <div class="validation-email">{{ emailValidation }}</div>
          <reset-button
            :button-method="reset"
            :button-type="buttonType"
            :button-disabled="resetValidation"
            >リセット</reset-button
          >
          <nuxt-link to="login">ログイン</nuxt-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import InputText from '~/components/Atoms/AppInput';
import ResetButton from '~/components/Atoms/AppButton';
import firebase from '~/plugins/firebase';
export default {
  components: {
    InputText,
    ResetButton,
  },
  data() {
    return {
      email: '',
      inputType: 'text',
      buttonType: 'submit',
      mailPlaceholder: '静大メール',
      emailValidation: '',
      resetValidation: true,
    };
  },
  watch: {
    email(val) {
      if (val.length === 0) {
        this.emailValidation = 'メールアドレスを入力してください';
        this.resetValidation = true;
      } else if (
        !new RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(s.)?(inf.)?shizuoka.ac.jp|yuhashi.laboratory@gmail.com/
        ).test(val)
      ) {
        this.emailValidation = '静大メールのみ可能です';
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
          alert('パスワードの再設定メールを送信しました');
        })
        .then(function () {
          that.$router.push({ name: 'login' });
        })
        .catch((err) => {
          alert(err);
        });
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
</style>
