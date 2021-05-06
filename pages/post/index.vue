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
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/threadPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-right">
          <nuxt-link to="post/wisdomPost">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/wisdomPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-left">
          <nuxt-link to="post/reviewPost">
            <v-card @click="$store.commit('place/getId', '')">
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/reviewPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-right">
          <v-card @click="clickModal">
            <v-img
              class="white--text"
              height="24vh"
              :src="require('~/assets/post/circlePost.jpg')"
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-left">
          <nuxt-link to="post/eventPost">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
                :src="require('~/assets/post/eventPost.jpg')"
              ></v-img>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="6" sm="4" md="4" class="post-card-right">
          <nuxt-link to="post/jobPost">
            <v-card>
              <v-img
                class="white--text"
                height="24vh"
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
}
@media screen and (min-width: 600px) {
  .post-items-wrap {
    margin-top: 20%;
    margin-bottom: auto;
  }
}
</style>
