<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <v-card>
          <v-card-text>
            <div class="title">Pin Plage ログイン</div>
            <input-text
              :input-type="inputType"
              :input-placeholder="mailPlaceholder"
              :input-value="email"
              @input="email = $event"
            ></input-text>
            <input-text
              :input-type="inputType"
              :input-placeholder="passwordPlaceholder"
              :input-value="password"
              @input="password = $event"
            ></input-text>
            <sign-in-button
              :button-method="login"
              :button-type="buttonType"
              :button-disabled="loginValidation"
              >ログイン</sign-in-button
            >
            <nuxt-link to="reset_password">パスワードを忘れた方へ</nuxt-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import InputText from '~/components/atoms/AppInput';
import SignInButton from '~/components/atoms/AppButton';
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
      loginValidation: false,
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          alert('ログイン成功');
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('user: ', user);
              this.$store.dispatch('user/login', {
                uid: user.uid,
                email: user.email,
              });
              this.$router.push({ name: 'mypage' });
            }
          });
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
};
</script>
<style scoped>
.title {
  text-align: center;
}
</style>
