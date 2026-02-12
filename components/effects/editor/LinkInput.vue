<template>
  <div class="effectEditor__linkInput">
    <div class="urlTitleContainer">
      <div class="urlContainer">
        <label> URL </label>
        <input v-model="urlInput">
      </div>

      <div class="titleContainer">
        <label> Title </label>
        <input v-model="titleInput">
      </div>
    </div>

    <div class="descriptionContainer">
      <label> Description </label>
      <input v-model="descriptionInput">
    </div>
    
    <button 
      class="addButton"
      @click="addLink"
    >
      Add
    </button>
    <button class="clearButton">
      Clear
    </button>

    <ul class="linkList">
      <li
        v-for="(link, index) in currentValue" 
        :key="link.url"
        class="linkListItem"
      > 
        <ext-link :href="link.url">
          {{ link.title }}
        </ext-link>
        <span
          v-show="link.description"
          class="descriptionSeparator"
        > - </span>
        <span class="description">
          {{ link.description }}
        </span>
        <a 
          class="removeLink"
          @click="removeLink(index)"
        > (remove) </a>
      </li>
    </ul>
  </div>
</template>

<script>
import ExtLink from "@/components/ExtLink.vue";

export default {
  components: {
    ExtLink
  },
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
      urlInput: "",
      titleInput: "",
      descriptionInput: ""
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    }
  },
  methods: {
    addLink() {
      let newValue = this.currentValue.slice();
      newValue.push({
        url: this.urlInput,
        title: this.titleInput,
        description: this.descriptionInput
      });

      this.$emit("update:modelValue", newValue);
      this.$emit("input", newValue);
      this.clearInputs();
    },
    removeLink(index) {
      let newValue = this.currentValue.slice();
      newValue.splice(index, 1);
      this.$emit("update:modelValue", newValue);
      this.$emit("input", newValue);
      this.clearInputs();
    },
    clearInputs() {
      (this.urlInput = ""),
        (this.titleInput = ""),
        (this.descriptionInput = "");
    }
  }
};
</script>

<style scoped>
.urlTitleContainer {
  display: flex;
  flex-direction: row;
}

.urlContainer {
  flex: 1;
}

.titleContainer {
  flex: 2;
  margin-left: 1em;
}

.effectEditor__linkInput label {
  margin: 0;
}

label {
  font-size: 14px;
  text-transform: unset;
}

input {
  height: 35px;
  border: 1px solid #ccc;
  width: 100%;
  padding: 5px;
}

input[type="checkbox"] {
  width: auto;
}

button {
  margin-right: 1em;
}

.addButton {
  background-color: #dfd;
}

.descriptionContainer {
  margin-top: 1em;
}

.linkList {
  margin-top: 1em;
  list-style: none;
}

.linkListItem {
  color: #333;
}

.removeLink {
  color: red;
  opacity: 0.7;
  font-style: italic;
  font-size: 14px;
}
</style>
