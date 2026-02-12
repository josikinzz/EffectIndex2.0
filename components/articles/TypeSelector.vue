<template>
  <div>
    <div class="buttonContainer">
      <input 
        v-model="type"
        type="radio"
        name="articleType"
        value="viscidcode"
        @change="handleChange"
      >
      <label for="viscidcode"> Viscidcode </label>
    </div>

    <div class="buttonContainer">
      <input 
        v-model="type"
        type="radio"
        name="articleType"
        value="markdown"
        @change="handleChange"
      >
      <label for="markdown"> Markdown Only </label>
    </div>

    <div class="buttonContainer">
      <input 
        v-model="type"
        type="radio"
        name="articleType"
        value="html"
        @change="handleChange"
      >
      <label for="html"> Raw HTML </label>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['update:modelValue', 'input'],
  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
  },
  
  data () {
    return {
      type: this.modelValue !== undefined ? this.modelValue : this.value
    };
  },
  watch: {
    modelValue(value) {
      this.type = value;
    },
    value(value) {
      if (this.modelValue === undefined) {
        this.type = value;
      }
    }
  },

  methods: {
    handleChange(e) {
      this.$emit('update:modelValue', this.type);
      this.$emit('input', this.type);
    }
  }
};
</script>

<style scoped>
label {
  margin-left: 5px;
}
</style>
