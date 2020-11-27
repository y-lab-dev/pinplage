<template>
  <div>
    <v-card tile :elevation="0" class="py-3">
      <v-card-title class="text-subtitle-2 pa-0 pl-2">
        <p>
          {{ commentNumber }}:
          <span class="teal--text text--darken-1 font-weight-bold">{{ name }}</span
          >さん:{{ date }}
        </p></v-card-title
      >
      <v-card-subtitle class="font-weight-bold pa-0 pt-3 px-2">{{ content }}</v-card-subtitle>
    </v-card>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  props: {
    commentId: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    date: {
      required: true,
      type: String,
      default: null,
    },
    commentNumber: {
      required: false,
      type: Number,
      default: null,
    },
  },
};
</script>
