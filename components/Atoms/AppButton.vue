<template>
  <v-btn
    class="button-color"
    rounded
    color-text="white"
    @click="buttonMethod"
    :type="buttonType"
    :disabled="buttonDisabled"
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
