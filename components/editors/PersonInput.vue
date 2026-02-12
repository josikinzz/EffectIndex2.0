<template>
  <div class="personInput">
    <select
      v-model="selected"
      @change="changed"
    >
      <option
        v-for="person in people"
        :key="person._id"
        :value="person._id"
      >
        {{ personName(person) }}
      </option>
    </select>

    <button @click="clear">
      Clear
    </button>
  </div>
</template>

<script>
export default {
  emits: ['update:modelValue', 'input', 'clear'],
  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    value: {
      type:  String,
      default: undefined
    }
  },
  data() {
    return {
      people: [],
      selected: this.modelValue !== undefined ? this.modelValue : this.value
    };
  },
  watch: {
    modelValue(value) {
      this.selected = value;
    },
    value(value) {
      if (this.modelValue === undefined) {
        this.selected = value;
      }
    }
  },
  mounted() {
    this.loadPeople();
  },
  methods: {
    async loadPeople() {
      try {
        const apiFetch = useApiFetch();
        /* Will only respond with public profiles */
        const { people } = await apiFetch('/api/persons');
        this.people = people;
      } catch (error) {
        console.log(error);
      }
    },
    changed() {
      this.$emit('update:modelValue', this.selected);
      this.$emit('input', this.selected);
    },
    clear() {
      this.selected = undefined;
      this.$emit('update:modelValue', this.selected);
      this.$emit('input', this.selected);
      this.$emit('clear');
    },
    personName(person) {
      const { full_name, alias } = person;
      return `${full_name ? full_name : ''}${full_name && alias ? ' ' : ''}${alias ? '\"' + alias + '\"' : ''}`;
    }
  }
};
</script>

<style> 
.personInput button {
  padding: 0.5em;
  margin: 0;
}
</style>
