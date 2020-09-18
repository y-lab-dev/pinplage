<template>
  <div class="textarea-place">
    <textarea
      color="#61d4b3"
      class="textarea-text"
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
  width: 300px;
  outline: none;
}
</style>
