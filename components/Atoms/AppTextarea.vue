<template>
  <div class="textarea-place">
    <textarea
      color="#61d4b3"
      style="max-width: 450px"
      class="textarea-text px-3 py-1"
      :value="textareaValue"
      :placeholder="textareaPlaceholder"
      @input="$emit('input', $event.target.value)"
    ></textarea>
  </div>
</template>
<script>
export default {
  props: {
    textareaValue: {
      type: String,
      required: true,
      default: '',
    },
    textareaPlaceholder: {
      type: String,
      required: true,
      default: '',
    },
  },
};
</script>
<style scoped>
.textarea-place {
  text-align: center;
}
.textarea-text {
  border: 1px solid #61d4b3;
  width: 80vw;
  outline: none;
}
</style>
