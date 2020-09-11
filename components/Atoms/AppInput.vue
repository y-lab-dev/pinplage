<template>
  <v-text-field
    color="#61d4b3"
    :type="inputType"
    :value="inputValue"
    :label="inputLabel"
    :prepend-icon="inputIcon"
    @input="$emit('input', $event.target.value)"
  ></v-text-field>
</template>
<script>
export default {
  props: {
    inputType: {
      type: String,
      required: true,
    },
    inputValue: {
      type: String,
      required: true,
    },
    inputLabel: {
      type: String,
      required: true,
    },
    inputIcon: {
      type: String,
      required: false,
    },
  },
};
</script>
