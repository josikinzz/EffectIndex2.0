<template>
  <div class="personDropdown">
    <select
      :value="currentValue"
      @change="handleChange"
    >
      <option
        :selected="!currentValue"
        disabled
        hidden
        value=""
      />
      <option
        v-for="p in people"
        :key="p._id"
        :value="p._id"
        :selected="currentValue === p._id"
      >
        {{ p.full_name }} 
        <template v-if="p.alias">
          ({{ p.alias }})
        </template>
      </option>
    </select>
    <a @click="clearPerson"> Clear </a>
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
    }
  },
  data() {
    return {
      people: []
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    }
  },
  mounted() {
    this.loadPeople();
  },
  methods: {
    async loadPeople() {
      try {
        const apiFetch = useApiFetch();
        const { people } = await apiFetch('/api/persons');
        this.people = people;
      } catch (error) {
        console.log(error);
      }
    },
    handleChange(e) {
      const { value } = e.target;
      const person = this.people.find(person => person._id === value);
      this.$emit('update:modelValue', person._id);
      this.$emit('input', person._id);
    },
    clearPerson() {
      this.$emit('update:modelValue', undefined);
      this.$emit('input', undefined);
    }
  }
};
</script>

<style scoped>
.personDropdown, .personDropdown select, .personDropdown option {
    outline: none;
}

.personDropdown select {
  padding: 0.5em;
  background-color: transparent;
  border: 1px solid #cccccc;
  margin-right: 1em;

}

.personDropdown option {
  background-color: transparent;
}
</style>
