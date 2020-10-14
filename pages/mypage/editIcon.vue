<template>
  <div>
    <!-- <v-avatar><img :src="previousIcon" /></v-avatar> -->
    <v-card>
      <v-form>
        <v-file-input
          type="file"
          accept="image/*"
          placeholder="アイコン用の画像を選択してください"
          prepend-icon="mdi-image-edit-outline"
          label="アイコン編集"
          show-size
          counter
          @change="setImage"
        />
      </v-form>
    </v-card>
    <v-avatar size="100px">
      <img v-if="previousIcon" ref="image" :src="previousIcon" />
    </v-avatar>
    <v-card v-if="previousIcon">
      <vue-cropper
        ref="cropper"
        :guides="false"
        :view-mode="1"
        :high-light="false"
        drag-mode="move"
        :auto-crop-area="1.0"
        :background="false"
        :rotatable="true"
        :crop-box-resizable="false"
        :crop-box-movable="false"
        :src="previousIcon"
        :aspect-ratio="1 / 1"
        :min-crop-box-height="300"
      ></vue-cropper>
      <v-btn @click="cropImage">切り抜き</v-btn>
      <v-btn @click="changeIcon">変更</v-btn>
    </v-card>
  </div>
</template>

// :
<script>
import { mapGetters } from 'vuex';
import VueCropper from 'vue-cropperjs';
import firebase from '~/plugins/firebase';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      previousIcon: '',
      imageType: '',
      cropper: {
        side: 1,
        vertical: 1,
      },
      imageAfter: {
        name: null,
        src: null,
        BlobFile: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      name: 'user/name',
      icon: 'user/icon',
    }),
  },
  methods: {
    setImage(e) {
      console.log(e);
      const reader = new FileReader();
      this.imageType = e.type;
      reader.onload = (event) => {
        this.previousIcon = event.target.result;
      };
      reader.readAsDataURL(e);
    },
    cropImage() {
      console.log(this.$refs.cropper.getCroppedCanvas({ width: 100, height: 100 }));
      this.previousIcon = this.$refs.cropper
        .getCroppedCanvas({ width: 100, height: 100 })
        .toDataURL(this.imageType);
      this.imageAfter.BlobFile = this.dataURLtoBlob(this.previousIcon);
      console.log(this.imageAfter.BlobFile);
    },
    dataURLtoBlob(dataURL) {
      const convert = require('dataurl-to-blob');
      return convert(dataURL);
    },
    changeIcon() {
      const that = this;
      const image = this.imageAfter.BlobFile;
      const users = firebase.firestore().collection('users').doc(this.uid);
      const storageRef = firebase.storage().ref('user/icon/' + 'test3');
      async function changeDatabase() {
        await storageRef.put(image).then(() => {
          storageRef.getDownloadURL().then((url) => {
            that.$store.commit('user/changeIcon', url);
            users.update({ icon: url });
          });
        });
      }
      changeDatabase().then(() => {
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style scoped>
.cropper-face {
  top: 10%;
  left: 15%;
  height: 75%;
  width: 70%;
  opacity: 0.3;
  border-radius: 100px;
  -webkit-border-radius: 100px;
  -moz-border-radius: 100px;
  background-color: #0089ff;
}
</style>
