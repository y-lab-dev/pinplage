<template>
  <v-btn
    rounded
    width="80vw"
    max-width="450px"
    class="white--text button-color"
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
<style scoped>
.button-color {
  background: linear-gradient(to right, #36aa37 0%, #2da8aa 50%);
  opacity: 0.6;
}
</style>
