<template>
  <v-btn
    rounded
    color="teal accent-4"
    class="white--text"
    outlined
    :type="buttonType"
    :disabled="buttonDisabled"
    @click="buttonMethod"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    buttonType: {
      type: String,
      required: true,
    },
    buttonMethod: {
      type: Function,
      required: true,
    },
    buttonDisabled: {
      type: Boolean,
      required: false,
    },
  },
};
</script>
