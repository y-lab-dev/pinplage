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
          width="90vh"
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
                    <p
                      v-if="isCreated"
                      class="user-name bold"
                      :class="[
                        $vuetify.breakpoint.smAndDown ? 'mobile-font-size' : 'desktop-font-size',
                      ]"
                    >
                      {{ userInfo.userName }}
                    </p>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card-actions>
        </v-card>
      </div>
    </section>
    <div class="user-info">
      <my-achievement></my-achievement>
    </div>
    <!-- <v-container>
      <v-row justify="space-around">
        <v-col v-for="item in user" :key="item.title" cols="6">
          <v-card height="200px">
            <v-card-title>{{ item.title }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>-->
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
import granim from '~/components/atoms/Granim';
import MyAchievement from '~/components/organisms/MyPageAchievement';
export default {
  layout: 'protected',
  components: {
    granim,
    MyAchievement,
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
      isCreated: false,
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
  },
  created() {
    const that = this;
    const userData = firebase.firestore().collection('userData');
    userData
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
  position: relative;
  top: -8vh;
}
</style>
