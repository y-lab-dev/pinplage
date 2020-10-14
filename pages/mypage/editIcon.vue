<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col>
          <v-card v-if="!overlay" max-width="90vw" height="10vh">
            <v-card-text>
              <v-file-input
                type="file"
                accept="image/*"
                outlined
                placeholder="画像を選択してください"
                prepend-icon="mdi-image-edit-outline"
                label="アイコン編集"
                @change="setImage"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay class="crop-card-card" :absolute="true" opacity="1" :value="overlay">
      <v-card v-if="overlay" class="crop-card" height="100%">
        <vue-cropper
          ref="cropper"
          class="crop"
          :guides="false"
          :view-mode="cropperViewMode"
          :high-light="false"
          drag-mode="move"
          :auto-crop-area="1.0"
          :background="false"
          :rotatable="true"
          :scalable="true"
          :crop-box-resizable="false"
          :crop-box-movable="false"
          :src="previousIcon"
          :aspect-ratio="1 / 1"
          :min-crop-box-height="windowSize.width"
          :min-crop-box-width="windowSize.width"
          :min-canvas-height="windowSize.width"
          :min-canvas-width="windowSize.width"
          :min-container-height="windowSize.width"
          :min-container-width="windowSize.width"
          :modal="true"
        ></vue-cropper>
      </v-card>
      <v-footer fixed>
        <v-btn @click="rechooseImage">画像を選び直す</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="cropImage">変更を保存する</v-btn>
      </v-footer>
    </v-overlay>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import VueCropper from 'vue-cropperjs';
import firebase from '~/plugins/firebase';
import 'cropperjs/dist/cropper.css';

export default {
  layout: 'onlyBack',
  components: {
    VueCropper,
  },
  data() {
    return {
      overlay: false,
      windowSize: {
        height: '',
        width: '',
      },
      previousIcon: '',
      imageType: '',
      imageName: '',
      cropper: {
        side: 1,
        vertical: 1,
      },
      imageAfter: {
        name: null,
        src: null,
        BlobFile: null,
      },
      cropperViewMode: 0,
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
  created() {
    this.windowSize = {
      width: this.$vuetify.breakpoint.width * 0.95,
    };
  },
  methods: {
    setImage(e) {
      const img = new Image();
      img.onload = () => {
        const size = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        URL.revokeObjectURL(img.src);
        if (size.height > size.width) {
          this.cropperViewMode = 2;
          this.overlay = true;
        } else {
          this.cropperViewMode = 3;
          this.overlay = true;
        }
      };
      img.src = URL.createObjectURL(e);

      const reader = new FileReader();
      this.imageType = e.type;
      this.imageName = e.name;
      console.log(e);

      reader.onload = (event) => {
        this.previousIcon = event.target.result;
        console.log(event);
      };
      reader.readAsDataURL(e);
    },
    cropImage() {
      this.previousIcon = this.$refs.cropper
        .getCroppedCanvas({ width: 100, height: 100 })
        .toDataURL(this.imageType);
      this.imageAfter.BlobFile = this.dataURLtoBlob(this.previousIcon);
      this.changeIcon();
    },
    dataURLtoBlob(dataURL) {
      const convert = require('dataurl-to-blob');
      return convert(dataURL);
    },
    changeIcon() {
      const that = this;
      const image = this.imageAfter.BlobFile;
      const users = firebase.firestore().collection('users').doc(this.uid);
      const storageRef = firebase.storage().ref(`user/icon/${this.uid}`).child(this.imageName);

      storageRef.put(image).then(() => {
        storageRef.getDownloadURL().then((url) => {
          async function storeCommit() {
            await that.$store.commit('user/changeIcon', url);
          }
          storeCommit().then(() => {
            that.$router.go(-1);
          });
          users.update({ icon: url });
        });
      });
    },
    rechooseImage() {
      this.overlay = false;
    },
  },
};
</script>

<style>
.cropper-view-box,
.cropper-face {
  border-radius: 50%;
}
.crop-card {
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.crop-card-card {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cropper-container {
  overflow: hidden;
}
</style>
