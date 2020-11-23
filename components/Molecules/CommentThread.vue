<template>
  <div>
    <v-card :elevation="0">
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="commenterIcon"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="py-0">
          <v-list-item-title v-text="commenterName"></v-list-item-title>
          <v-list-item-subtitle v-text="createdAt"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item-content class="ml-4 pt-0">
        {{ content }}
      </v-list-item-content>
      <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
export default {
  props: {
    commentId: {
      required: true,
      type: String,
    },
    commenter: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    createdAt: {
      required: true,
      type: String,
      default: null,
    },
  },
  data() {
    return {
      commenterName: '',
      commenterIcon: '',
    };
  },
  created() {
    const that = this;
    const commnterInfo = firebase.firestore().collection('users').doc(this.commenter);
    commnterInfo.get().then((doc) => {
      const userData = doc.data();
      that.commenterName = userData.name;
      that.commenterIcon = userData.icon;
    });
  },
};
</script>
