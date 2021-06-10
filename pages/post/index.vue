<template>
  <div class="post-items-wrap">
    <v-container class="py-0 post-items" fluid>
      <v-row class="post-items" align-content="center" align="center">
        <v-col cols="6" sm="4" md="4" class="post-card-left">
          <template>
            <Modal
              :modal-title="modalTitle"
              :modal-text="modalText"
              :modal-button="buttonText"
              :modal-toggle="modal"
              @changeValue="clickModal()"
            />
          </template>
          <nuxt-link to="post/threadPost">
            <v-card max-width="170px">
              <v-img
                class="white--text post-img"
                height="24vh"
                max-width="170px"
                :src="require('~/assets/post/threadPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-right">
          <nuxt-link to="post/wisdomPost">
            <v-card max-width="170px">
              <v-img
                class="white--text post-img"
                height="24vh"
                max-width="170px"
                :src="require('~/assets/post/wisdomPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-left">
          <nuxt-link to="post/reviewPost">
            <v-card max-width="170px" @click="$store.commit('place/getId', '')">
              <v-img
                class="white--text post-img"
                height="24vh"
                max-width="170px"
                :src="require('~/assets/post/reviewPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-right">
          <v-card max-width="170px" @click="clickModal">
            <v-img
              class="white--text post-img"
              height="24vh"
              max-width="170px"
              :src="require('~/assets/post/circlePost.jpg')"
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-left">
          <nuxt-link to="post/eventPost">
            <v-card max-width="170px">
              <v-img
                class="white--text post-img"
                height="24vh"
                max-width="170px"
                :src="require('~/assets/post/eventPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-right">
          <nuxt-link to="post/jobPost">
            <v-card max-width="170px">
              <v-img
                class="white--text post-img"
                height="24vh"
                max-width="170px"
                :src="require('~/assets/post/jobPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Modal from '~/components/Molecules/AppModal';

export default {
  layout: 'protected',
  components: {
    Modal,
  },
  data() {
    return {
      modal: false,
      modalTitle: 'サークル投稿について',
      modalText: 'サークルに関する情報投稿できる機能は現在準備中です。今しばらくお待ち下さい。',
      buttonText: 'OK',
    };
  },
  methods: {
    clickModal() {
      this.modal = !this.modal;
    },
  },
};
</script>
<style>
.post-items-wrap {
  height: 100%;
  max-height: 500px;
  max-width: 600px;
  margin: 0 auto;
}
@media screen and (min-width: 600px) {
  .post-items-wrap {
    margin-top: 7%;
    margin-bottom: auto;
  }
}
@media screen and (min-width: 400px) and (max-width: 450px) {
  .post-items-wrap {
    margin-left: 5vw;
    margin-right: 5vw;
  }
}
@media screen and (min-width: 451px) and (max-width: 470px) {
  .post-items-wrap {
    margin-left: 7vw;
    margin-right: 7vw;
  }
}
@media screen and (min-width: 471px) and (max-width: 500px) {
  .post-items-wrap {
    margin-left: 9vw;
    margin-right: 9vw;
  }
}
@media screen and (min-width: 501px) and (max-width: 530px) {
  .post-items-wrap {
    margin-left: 11vw;
    margin-right: 11vw;
  }
}
@media screen and (min-width: 531px) and (max-width: 560px) {
  .post-items-wrap {
    margin-left: 13vw;
    margin-right: 13vw;
  }
}
@media screen and (min-width: 561px) and (max-width: 600px) {
  .post-items-wrap {
    margin-left: 15vw;
    margin-right: 15vw;
  }
}
</style>
