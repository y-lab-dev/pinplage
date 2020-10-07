<template>
  <div>
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
          color="rgba(255,255,255,0)"
        >
          <v-card-actions>
            <v-list color="rgba(0,0,0,0)">
              <v-list-item class="justify-center">
                <v-list-item-avatar class="userIcon" :size="iconSize">
                  <v-img :src="userInfo.userIcon"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-list-item class="justify-center">
                <v-row class="white--text mx-auto">
                  <v-col class="white--text text-center">
                    <p class="user-name bold mobile-font-size">
                      {{ userInfo.userName }}
                    </p>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card-actions>
        </v-card>
        <div class="user-info">
          <my-achievement></my-achievement>
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
            <user-favorites />
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
import firebase from '~/plugins/firebase';
import granim from '~/components/Atoms/Granim';
import MyAchievement from '~/components/organisms/MyPageAchievement';
import UserPostedContents from '~/components/Organisms/MyPagePostedContents';
import UserFavorites from '~/components/Organisms/MyPageFavoriteItems';
import UserPointLog from '~/components/Organisms/MyPagePointLog';
export default {
  layout: 'protected',
  components: {
    granim,
    MyAchievement,
    UserPostedContents,
    UserFavorites,
    UserPointLog,
  },
  data() {
    return {
      userInfo: {},
      granim: {
        height: '30vh',
        width: '100vw',
        gradients: [
          ['#85FFBD', '#FFFB7D'],
          ['#FFFB7D', '#85FFBD'],
        ],
      },
      userTab: null,
      items: ['投稿一覧', 'お気に入り', 'pp獲得履歴'],
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
    userEmail() {
      return this.$store.getters['user/email'];
    },
  },
  created() {
    this.$store.state.user.email = 'kaji.takahiro.17@shizuoika.ac.jp';
    const that = this;
    const userData = firebase.firestore().collection('userData');
    userData
      // .doc(that.userEmail)
      .doc('kaji.takahiro.17@shizuoka.ac.jp')
      .get()
      .then((doc) => {
        that.userInfo = doc.data();
        console.log(that.userInfo);
      })
      .then(() => {
        that.isCreated = true;
      });
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
