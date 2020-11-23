<template>
  <div>
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="questionerIcon"></v-img>
      </v-list-item-avatar>
      <v-list-item-content class="py-0">
        <v-list-item-title v-text="questionerName"></v-list-item-title>
        <v-list-item-subtitle v-text="createdAt"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item-content class="ml-4 pt-0">
      {{ content }}
    </v-list-item-content>
    <v-divider></v-divider>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
export default {
  props: {
    questionId: {
      required: true,
      type: String,
    },
    questioner: {
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
      questionerName: '',
      questionerIcon: '',
    };
  },
  created() {
    const that = this;
    const questionerInfo = firebase.firestore().collection('users').doc(this.questioner);
    questionerInfo.get().then((doc) => {
      const userData = doc.data();
      that.questionerName = userData.name;
      that.questionerIcon = userData.icon;
    });
  },
};
</script>
