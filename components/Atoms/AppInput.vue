<template>
  <div class="input-place">
    <input
      class="input-text"
      :type="inputType"
      :value="inputValue"
      :placeholder="inputPlaceholder"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>
<script>
export default {
  props: {
    inputType: {
      type: String,
      required: true,
      default: '',
    },
    inputValue: {
      type: String,
      required: true,
      default: '',
    },
    inputPlaceholder: {
      type: String,
      required: true,
      default: '',
    },
  },
};
</script>
<style scoped>
.input-place {
  text-align: center;
}
.input-text {
  border: 1px solid #61d4b3;
  border-radius: 25px;
  width: 300px;
  outline: none;
}
</style>
