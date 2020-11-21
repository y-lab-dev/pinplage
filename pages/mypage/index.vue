<template>
  <div style="height: 100%">
    <section id="user-top">
      <div class="granim-back">
        <granim
          :granim-height="granim.height"
          :granim-width="granim.width"
          :granim-gradients="granim.gradients"
        />
        <v-card
          class="granim-card d-flex justify-center"
          elevation="0"
          width="100vw"
          height="30vh"
          color="rgba(255,255,255,0)"
        >
          <v-btn icon dark class="user-settings" @click="pushPage('mypage/editAccount')">
            <v-icon dark>mdi-account-edit-outline</v-icon>
          </v-btn>
          <v-card-actions>
            <v-list color="rgba(0,0,0,0)">
              <v-list-item class="justify-center">
                <div class="user-icon-back-back">
                  <div class="user-icon-back">
                    <v-avatar color="white" :size="iconSize">
                      <v-img :src="icon"></v-img>
                    </v-avatar>
                  </div>
                </div>
              </v-list-item>
              <v-list-item class="justify-center">
                <v-row class="white--text mx-auto">
                  <v-col class="white--text text-center">
                    <p class="user-name bold mobile-font-size">
                      {{ name }}
                    </p>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card-actions>
        </v-card>
        <div class="user-info">
          <my-achievement :point="userPoint" />
        </div>
      </div>
    </section>
    <div class="user-career">
      <v-card class="mx-5 rounded-pill">
        <v-tabs v-model="userTab" class="px-3" background-color="transparent" grow color="#78dabe">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in items" :key="item" :ripple="false">
            <p class="user-tab-title">{{ item }}</p>
          </v-tab>
        </v-tabs>
      </v-card>

      <v-tabs-items v-model="userTab" class="mt-5 mx-5">
        <v-tab-item>
          <v-card>
            <user-posted-contents />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <user-point-log></user-point-log>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import granim from '~/components/Atoms/Granim';
import MyAchievement from '~/components/Organisms/MyPageAchievement';
import UserPostedContents from '~/components/Organisms/MyPagePostedContents';
import UserPointLog from '~/components/Organisms/MyPagePointLog';
export default {
  layout: 'protected',
  components: {
    granim,
    MyAchievement,
    UserPostedContents,
    UserPointLog,
  },
  data() {
    return {
      userInfo: {},
      granim: {
        height: '30vh',
        width: '100vw',
        gradients: [
          // for spring
          // ['#85FFBD', '#FFFB7D'],
          // ['#FFFB7D', '#85FFBD'],
          // for Autumn
          ['#F71810', '#FCCE22'],
          ['#F4DD2E', '#F3EC0E'],
        ],
      },
      userTab: null,
      userPoint: 0,
      items: ['ユーザー履歴'],
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    };
  },
  computed: {
    iconSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return 80;
      } else {
        return 140;
      }
    },
    cardInfoTitleSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return 90;
      } else {
        return 50;
      }
    },
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  created() {
    const that = this;
    const users = firebase.firestore().collection('users');
    users
      .doc(that.uid)
      .get()
      .then((doc) => {
        that.userPoint = doc.data().point;
      })
      .then(() => {
        that.isCreated = true;
      });
  },
  methods: {
    pushPage(link) {
      this.$router.push(link);
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
  margin-bottom: 20px;
}
.granim-card {
  position: absolute;
}
.user-settings {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  padding-left: 2px;
}
.mobile-font-size {
  font-size: 1.3rem;
}
.desktop-font-size {
  font-size: 2rem;
}
.user-name {
  position: relative;
  font-size: 1rem;
}
.user-info {
  position: absolute;
  width: 100vw;
  top: 25.5vh;
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
}
.user-career {
  margin-top: 5vh;
  margin-left: 1vw;
  margin-right: 1vw;
}
.user-tab-title {
  font-size: 0.8rem;
  margin-bottom: 0;
}
.v-tabs-slider {
  display: none;
}
.v-tab--active::before {
  opacity: 0 !important;
}
</style>
