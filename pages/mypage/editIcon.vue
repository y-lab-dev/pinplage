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
      <img v-if="previousIcon" :src="previousIcon" />
    </v-avatar>
    <v-card v-if="previousIcon">
      <vue-cropper
        ref="cropper"
        :guides="false"
        :view-mode="2"
        drag-mode="crop"
        :auto-crop-area="1.0"
        :min-container-width="300"
        :min-container-height="300"
        :background="false"
        :rotatable="false"
        :src="previousIcon"
        :img-style="{ width: '90%', height: '90%' }"
        :aspect-ratio="cropper.side / cropper.vertical"
      ></vue-cropper>
      <v-btn @click="cropImage"></v-btn>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      previousIcon: null,
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
  created() {},
  methods: {
    setImage(e) {
      console.log(e);
      // const file = event.target.files[0];
      const reader = new FileReader();
      console.log(reader);
      reader.onload = (event) => {
        this.previousIcon = event.target.result;
      };
      reader.readAsDataURL(e);
    },
    cropImage() {
      this.imageAfter.src = this.$refs.cropper.getCroppedCanvas().toDataURL();
      // this.currenUser.icon = this.cropData.cropImg;
      this.imageAfter.BlobFile = this.dataURLtoBlob(this.imageAfter.src);
      console.log(this.imageAfter.BlobFile);
      this.previousIcon = this.imageAfter.src;
    },
    dataURLtoBlob(dataURL) {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    },
  },
};
</script>
