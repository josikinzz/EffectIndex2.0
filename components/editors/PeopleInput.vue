<template>
  <div class="peopleInput">
    <div class="controlsContainer">
      <select v-model="selected">
        <option
          v-for="person in people"
          :key="person._id"
          :value="person"
        >
          {{ person.full_name }}
        </option>
      </select>
      <button @click="addPerson">
        Add
      </button>
      <button @click="clear">
        Clear
      </button>
    </div>
    <div
      v-for="(person, index) in currentValue"
      :key="index"
      class="person"
    >
      {{ person.full_name }}
      <button @click="removePerson(index)">
        (Remove)
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['update:modelValue', 'input'],
  props: {
    people: {
      type: Array,
      default: () => ([])
    },
    modelValue: {
      type: Array,
      default: undefined
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      selected: undefined
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    }
  },
  methods: {
    addPerson(e) {
      const next = [this.selected, ...this.currentValue];
      this.$emit('update:modelValue', next);
      this.$emit('input', next);
    },
    removePerson(index) {
      const next = this.currentValue.filter((person, i) => index !== i);
      this.$emit('update:modelValue', next);
      this.$emit('input', next);
    },
    clear() {
      this.$emit('update:modelValue', []);
      this.$emit('input', []);
    }
  }
};
</script>

<style scoped>
  .peopleInput .controlsContainer {
    display: flex;
    align-items: center;
  }

 .peopleInput .controlsContainer button {
   padding: 0.25em;
   width: 50px;
   margin: 0 10px;
 }

 .peopleInput .person {
   font-weight: bold;
 }

 .peopleInput .person button {
   width: 100px;
   padding: 0.25em;
   margin: 0;
   color: red;
   border: none;
   background-color: transparent;
 }


</style>
