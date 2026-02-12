<template>
  <input
    type="date"
    :value="date"
    @change="handleChange"
  >
</template>

<script>
export default {
  emits: ['update:modelValue', 'input'],
  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    publicationDate: {
      type: String,
      default: undefined
    }
  },

  computed: {
    date() {
      const value = this.modelValue !== undefined ? this.modelValue : this.publicationDate;
      return value ? new Date(value).toISOString().substring(0, 10) : undefined;
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

<style scoped>
  input[type="date"] {
    padding: 0.55em;
  }
</style>
