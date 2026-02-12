<template>
  <ul class="effectInput">
    <li 
      v-for="effect in effects"
      :key="effect._id"
      class="effectInputItem"
    >
      <input 
        type="checkbox"
        :checked="selectedEffects.includes(effect._id)"
        @change="toggleSelection(effect._id)"
      >
      {{ effect.name }}
    </li>
  </ul>
</template>

<script>
export default {
  emits: ['update:modelValue', 'input'],
  props: {
    modelValue: {
      type: Array,
      default: undefined
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      effects: [],
      selectedEffects: this.modelValue !== undefined ? this.modelValue : this.value
    };
  },
  watch: {
    modelValue(value) {
      this.selectedEffects = value;
    },
    value(value) {
      if (this.modelValue === undefined) {
        this.selectedEffects = value;
      }
    }
  },
  mounted() {
    this.loadEffects();
  },
  methods: {
    async loadEffects() {
      try {
        const apiFetch = useApiFetch();
        const { effects } = await apiFetch('/api/effects');
        this.effects = effects;
      } catch (error) {
        console.log(error);
      }
    },
    toggleSelection(id) {
      this.selectedEffects = this.selectedEffects.includes(id) ?
      this.selectedEffects.filter(effectId => effectId !== id) :
      [...this.selectedEffects, id];
      this.$emit('update:modelValue', this.selectedEffects);
      this.$emit('input', this.selectedEffects);
    }
  }
};
</script>

<style scoped>
  .effectInput {
    list-style: none;
    columns: 4;
    padding-left: 0;
  }

  .effectInputItem {
    margin: 2px 0;
  }
</style>
