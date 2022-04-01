<template>
  <div>
    <template>
      <Dialog
        :dialog-title="dialogTitle"
        :dialog-text="dialogText"
        :dialog-button="buttonText"
        :dialog-cancel="cancelButtonText"
        :dialog-toggle="dialog"
        @changeSelect="clickDialog()"
        @changeValue="logout()"
      />
    </template>
    <v-list>
      <template v-for="(item, index) in settings">
        <v-list-item :key="item.name" class="my-1" @click="pushPage(settings[index].link)">
          <v-list-item-icon class="ml-3">
            <v-icon color="rgba(0,0,0,0.6)" v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="item-title">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index < settings.length - 1" :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import Dialog from '~/components/Molecules/AppDialog';
export default {
  middleware: 'authenticated',
  layout: 'protected',
  components: { Dialog },
  data() {
    return {
      settings: [
        { name: '利用規約', icon: 'mdi-file-outline', link: 'setting-rule' },
        { name: 'ログアウト', icon: 'mdi-logout', link: 'logout' },
      ],
      dialog: false,
      dialogTitle: 'ログアウト',
      dialogText: '本当にログアウトしますか？',
      buttonText: 'OK',
      cancelButtonText: 'キャンセル',
    };
  },
  methods: {
    pushPage(link) {
      if (link === 'logout') {
        this.dialog = !this.dialog;
      } else {
        this.$router.push({ name: link });
      }
    },
    logout() {
      Cookies.remove('accessToken');
      this.$store.commit('user/logout');
      this.$router.push({ name: 'login' });
    },
    clickDialog() {
      this.dialog = !this.dialog;
    },
  },
};
</script>
