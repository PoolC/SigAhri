<template>
  <label>
    {{ label }}
    <input :type="type"
           :value="value"
           :placeholder="placeholder"
           :disabled="disabled"
           @change="$emit('change', $event.target.value)"
    />
  </label>
</template>

<script>
export default {
  name: 'InputBox',
  props: {
    label: String,
    type: String,
    value: String,
    placeholder: String,
    disabled: Boolean,
  },
};
</script>
