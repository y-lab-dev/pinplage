<template>
  <v-container class="pa-0" style="height: 100%">
    <v-row justify="center" align="center" no-gutters>
      <v-col cols="12" class="granim-back">
        <granim :granim-height="granim.height" :granim-width="granim.width" :granim-theme="theme" />
        <v-container class="granim-card-content">
          <v-row justify="center" no-gutters>
            <v-col cols="1"> </v-col>
            <v-col cols="3">
              <app-icon class="ma-auto" icon-size="80px" />
            </v-col>
            <v-col cols="1" align-self="end">
              <v-btn
                class="user-icon-setting"
                small
                icon
                dark
                @click="pushPage('/mypage/editIcon')"
              >
                <v-icon x-small dark>mdi-image-edit-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row no-gutters justify="end">
      <v-col class="ml-1" cols="12">
        <!-- <v-form ref="form" :readonly="true">
          <v-text-field v-model="userName" readnly label="ユーザーネーム"></v-text-field>
        </v-form> -->
        <v-list>
          <v-list-item class="pl-5" @click="pushPage('/mypage/editName')">
            <v-list-item-content>
              <v-list-item-subtitle>名前</v-list-item-subtitle>
              <v-list-item-title>{{ userName }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item class="pl-5" @click="pushPage('/mypage/selectTheme')">
            <v-list-item-content>
              <v-list-item-subtitle>マイページ着せ替え 現在：{{ theme }}</v-list-item-subtitle>
              <v-list-item-title>テーマを選択する</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
// import firebase from '~/plugins/firebase';
import granim from '~/components/Atoms/Granim';
import appIcon from '~/components/Organisms/AppIcon';
export default {
  layout: 'onlyBack',
  components: { granim, appIcon },
  data() {
    return {
      userName: null,
      granim: {
        height: '30vh',
        width: '100vw',
      },
      granimTheme: '',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
      theme: 'user/theme',
    }),
  },
  created() {
    this.userName = this.name;
  },
  methods: {
    pushPage(str) {
      this.$router.push(str);
    },
  },
};
</script>

<style scoped>
.granim-back {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.granim-card-content {
  position: absolute;
}
.user-icon-back {
  display: flex;
  width: 86px;
  height: 86px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
}
.user-icon-back-back {
  display: flex;
  width: 94px;
  height: 94px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(45deg, #2cc45e, #e6f938);
  margin-right: 0;
}
.user-icon-setting {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
