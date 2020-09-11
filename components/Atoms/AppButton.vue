<template>
  <v-btn
    class="button-color"
    rounded
    color-text="white"
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
      default: false,
    },
  },
};
</script>
