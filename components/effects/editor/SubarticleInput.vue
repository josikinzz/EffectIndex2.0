<template>
  <div class="subarticleInput">
    <form 
      class="inputContainer"
      @submit.prevent="addSubarticle"
    >
      <input
        v-model="title"
        name="title"
        placeholder="Title"
        class="effectEditor__input subarticleInput__title"
      >
      <input
        v-model="id"
        placeholder="Id"
        name="id"
        class="effectEditor__input subarticleInput__id"
      >
      <button type="Submit">
        Add
      </button>
    </form>
    

    <div class="valueContainer">
      <ul class="subarticleInput__list">
        <li 
          v-for="(subarticle, index) in currentValue"
          :key="index"
          class="subarticleInput__listItem"
        >
          {{ subarticle.title }} : {{ subarticle.id }}
          <span class="subarticleInput__icons">
            <a @click="moveArticleUp(index)"> <Icon
              filename="arrow-up.svg"
              class="subarticleInput__icon"
            /> </a>
            <a @click="moveArticleDown(index)"> <Icon
              filename="arrow-down.svg"
              class="subarticleInput__icon"
            /> </a>
            <a @click="deleteArticle(index)"> <Icon
              filename="times-circle.svg"
              color="red"
              class="subarticleInput__icon"
            /> </a>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon';


export default {
  components: {
    Icon
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
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    }
  },
  data() {
    return {
      title: "",
      id: ""
    };
  },
  methods: {
    addSubarticle() {
      let currentList = this.currentValue.slice();

      currentList.push({
        title: this.title,
        id: this.id
      });

      this.$emit('update:modelValue', currentList);
      this.$emit('input', currentList);

      this.clearInputs();
    },

    moveArticleUp(index) {
      let currentList = this.currentValue.slice();

      if (index > 0) {
        let temp = currentList[index - 1];
        currentList[index - 1] = currentList[index];
        currentList[index] = temp;
      }

      this.$emit('update:modelValue', currentList);
      this.$emit('input', currentList);
    },

    moveArticleDown(index) {
      let currentList = this.currentValue.slice();

      if (index < (currentList.length - 1)) {
        let temp = currentList[index + 1];
        currentList[index + 1] = currentList[index];
        currentList[index] = temp;
      }

      this.$emit('update:modelValue', currentList);
      this.$emit('input', currentList);
    },

    deleteArticle(index) {
      let currentList = this.currentValue.slice();
      currentList.splice(index, 1);
      this.$emit('update:modelValue', currentList);
      this.$emit('input', currentList);
    },
    clearInputs() {
      this.title = "";
      this.id = "";
    }
  }
};
</script>

<style scoped>

  .subarticleInput__title {
    width: 300px;
    display: inline-block;
    margin-right: 1em;
  }

  .subarticleInput__id {
    display: inline-block;
    width: 200px;
    margin-right: 1em;
  }

  .subarticleInput__list {
    margin-top: 1em;
    list-style: none;
  }

  .subarticleInput__listItem {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }

  .subarticleInput__listItem:not(:last-child) {
    border-bottom: 1px solid #CCC;
  }

  .subarticleInput__icons {
    padding-left: 2em;
    
  }

  .subarticleInput__icon {
    display: inline-block;
    height: 1em;
    width: 1em;
    opacity: 0.6;
  }

  .subarticleInput__icon:hover {
    opacity: 1;
  }

  .subarticleInput__icons .subarticleInput__icon {
    padding: 0 0.5em;
  }
</style>
