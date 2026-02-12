<template>
  <div>
    <input
      v-model="contributorInputText"
      class="effectEditor__input"
      @keyup="changeInput"
    >
    <ul class="contributorList">
      <li 
        v-for="(contributor, index) in currentValue"
        :key="contributor"
        class="contributorListItem"
      >
        {{ contributor }}
        <div class="contributorListItem__removeIcon">
          <a @click="removeContributor(index)"> 
            <Icon
              filename="times-circle.svg"
            />
          </a>
        </div>
      </li>
    </ul>
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
  data() {
    return {
      contributorInputText: ""
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    }
  },
  methods: {
    changeInput(e) {
      if (e.keyCode === 13) {
        if (this.currentValue.indexOf(e.target.value) === -1) {
          const next = this.currentValue.concat([e.target.value.trim()]);
          this.$emit("update:modelValue", next);
          this.$emit("input", next);
        }
        this.contributorInputText = "";
      } else if (e.target.value.indexOf(",") > -1) {
        let arr = e.target.value
          .split(",")
          .map(val => val.trim())
          .filter(val => val.length > 0);

        let newValue = [];

        arr.forEach(contributor => {
          if (this.currentValue.indexOf(contributor) === -1) {
            newValue.push(contributor);
          }
        });

        const next = this.currentValue.concat(newValue);
        this.$emit("update:modelValue", next);
        this.$emit("input", next);
        this.contributorInputText = "";
      }
    },
    removeContributor(index) {
      let newArr = this.currentValue.slice();
      newArr.splice(index, 1);
      this.$emit("update:modelValue", newArr);
      this.$emit("input", newArr);
    }
  }
};
</script>

<style scoped>
.contributorListItem {
  display: inline-block;
  width: 200px;
  color: black;
  margin: 3px;
  padding: 7px;
}

.contributorListItem a {
  color: #555;
}

.contributorListItem a:hover {
  color: rgb(134, 19, 19);
}

.contributorList {
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  margin-top: 1em;
  padding: 0;
}

.contributorListItem__removeIcon {
  float: right;
}

.icon {
  height: 1em;
  width: 1em;
  opacity: 0.5;
}

.icon:hover {
  opacity: 1;
}
</style>
