<template>
  <div class="role-input">
    <h3> Roles: </h3>
    <ul
      v-if="currentValue"
      class="user-role-list"
    >
      <li
        v-for="(role, index) in currentValue"
        :key="index"
        class="role-list-item"
      >
        <span class="role"> {{ role }} </span>
        <a @click="removeRole(index)">
          <icon
            filename="times.svg"
            color="red"
          />
        </a>
      </li>
    </ul>
    <h3> Available Roles: </h3>
    <ul class="add-roles">
      <li
        v-for="(role, index) in filteredRoles"
        :key="index"
      >
        <a @click="giveRole(role)"> {{ role }} </a>
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
      selectedRole: undefined,
      availableRoles: ['admin', 'editor', 'reports', 'reports-moderator', 'effects',  'effects-moderator', 'replications', 'replications-moderator', 'articles', 'articles-moderator']
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    filteredRoles() {
      return this.availableRoles.filter(role => !this.currentValue.includes(role));
    }
  },
  methods: {
    addRole() {
      if (this.selectedRole) {
        const next = [...this.currentValue, this.selectedRole];
        this.$emit('update:modelValue', next);
        this.$emit('input', next);
      }
    },
    removeRole(index) {
      const next = this.currentValue.filter((role, i) => index !== i);
      this.$emit('update:modelValue', next);
      this.$emit('input', next);
    },
    giveRole(role) {
      if (!this.currentValue.includes(role)) {
        const next = [...this.currentValue, role];
        this.$emit('update:modelValue', next);
        this.$emit('input', next);
      }
    }
  }
};
</script>

<style scoped>
.icon {
  height: 1em;
  width: 1em;
}

ul.add-roles {
  padding-left: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.add-roles li {
  display: block;
  cursor: pointer;
  margin-right: 1em;
  white-space: nowrap;
}

.role-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333;
  color: #CCC;
  border-radius: 10px;
  text-align: center;
  padding: 5px 10px;
  margin: 0.5em 0;
}

.role-list-item:not(:first-child) {
  margin-right: 1em;
}

.role-list-item a {
  cursor: pointer;
}

.role-list-item .role {
  display: inline-block;
  margin-right: 0.5em;
}

.role {
  padding-bottom: 2px;
}

.user-role-list {
  display: flex;
  list-style: none;
  padding-left: 0;
  flex-wrap: wrap;
}

.user-role-list li {
  margin-right: 1em;
}
</style>
