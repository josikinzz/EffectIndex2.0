<template>
  <select 
    :value="currentValue"
    @change="handleChange"
  >
    <option value="published">
      Published
    </option>
    <option value="unpublished">
      Unpublished
    </option>
    <option value="draft">
      Draft
    </option>
    <option value="unlisted">
      Unlisted
    </option>
  </select>
</template>

<script>
export default {
  emits: ['update:modelValue', 'input'],
  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    publicationStatus: {
      type: String,
      default: undefined
    }
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.publicationStatus;
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('update:modelValue', e.target.value);
      this.$emit('input', e.target.value);
    }
  }
};
</script>
