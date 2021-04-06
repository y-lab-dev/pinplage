<template>
  <div class="post-items">
    <v-container class="py-0 post-items" fluid>
      <v-row class="post-items" align-content="center">
        <v-col cols="6" class="post-card-left">
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
            <v-card>
              <v-img
                class="white--text"
                height="27vh"
                :src="require('~/assets/post/threadPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-right">
          <nuxt-link to="post/wisdomPost">
            <v-card>
              <v-img
                class="white--text"
                height="27vh"
                :src="require('~/assets/post/wisdomPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-left">
          <nuxt-link to="post/reviewPost">
            <v-card @click="$store.commit('place/getId', '')">
              <v-img
                class="white--text"
                height="27vh"
                :src="require('~/assets/post/reviewPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-right">
          <v-card @click="clickModal">
            <v-img
              class="white--text"
              height="27vh"
              :src="require('~/assets/post/circlePost.jpg')"
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="6" class="post-card-left">
          <nuxt-link to="post/eventPost">
            <v-card>
              <v-img
                class="white--text"
                height="27vh"
                :src="require('~/assets/post/eventPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" class="post-card-right">
          <nuxt-link to="post/jobPost">
            <v-card>
              <v-img
                class="white--text"
                height="27vh"
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
<style scoped>
.post-items {
  height: 100%;
}
.post-card-left {
  padding-left: 18px;
  padding-right: 9px;
  padding-bottom: 0;
}
.post-card-right {
  padding-left: 9px;
  padding-right: 18px;
  padding-bottom: 0;
}
@media only screen and (max-device-width: 550px) {
  .white--text {
    height: 24vh;
  }
}
</style>
