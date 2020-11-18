<template>
  <div>
    <v-card tile :elevation="1">
      <v-card-title class="text-subtitle-2">
        <p>
          {{ commentNumber }} 名前：<span class="teal--text text--darken-1 font-weight-bold"
            >{{ name }}
          </span>
        </p></v-card-title
      >
      <v-card-subtitle>{{ date }}</v-card-subtitle>
      <v-list-item>
        <v-list-item-content>
          {{ content }}
        </v-list-item-content>
      </v-list-item>
    </v-card>
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
      required: true,
      type: Number,
    },
  },
};
</script>
