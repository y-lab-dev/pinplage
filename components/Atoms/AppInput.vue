<template>
  <div class="input-place ma-2">
    <input
      class="input-text px-3 py-1"
      style="max-width: 480px"
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
  width: 80vw;
  outline: none;
}
</style>
