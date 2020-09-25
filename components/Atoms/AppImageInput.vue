<template>
  <div>
    <v-img v-show="img.name" :src="img.url" height="200px"></v-img>
    <v-btn v-show="img.name" style="float: right" @click="imgDelete">
      <v-icon>mdi-delete-empty</v-icon>
    </v-btn>
    <v-file-input
      v-show="!img.name"
      color="#61d4b3"
      accept="image/png, image/jpeg, image/bmp"
      prepend-icon="mdi-camera"
      label="画像"
      :clearable="false"
      @change="imgAdd"
    ></v-file-input>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';

const crypto = require('crypto');
function md5hex(str /*: string */) {
  const md5 = crypto.createHash('md5');
  return md5.update(str, 'binary').digest('hex');
}
export default {
  data() {
    return {
      img: {
        name: '',
        url: '',
      },
    };
  },
  methods: {
    imgAdd(e) {
      const that = this;
      console.log(e);
      const imgName = e.name;

      const storageRef = firebase
        .storage()
        .ref('threads/image/' + md5hex(JSON.stringify(new Date())) + imgName);

      storageRef.put(e).then(function () {
        storageRef.getDownloadURL().then(function (url) {
          that.$emit('imgSubmit', url);
          that.img.url = url;
          that.img.name = imgName;
        });
      });
    },
    imgDelete() {
      this.img.url = '';
      this.img.name = '';
    },
  },
};
</script>
