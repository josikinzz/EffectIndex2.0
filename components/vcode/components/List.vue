<template>
  <ul
    v-if="!ordered"
    :class="listStyle"
  >
    <slot />
  </ul>
  <ol v-else>
    <slot />
  </ol>
</template>

<script>
export default {
  props: {
    ordered: {
      type: Boolean,
      default: false
    },
    listStyle: {
      type: String,
      default: "disc"
    }
  }
};
</script>

<style scoped>


  ul.circle {
    list-style: disc;
  }

  ul.none {
    list-style: none;
    padding-left: 0;
  }

  ul :deep(li),
  ol :deep(li) {
    margin: 0.5em 0;
  }

  ul.square {
    list-style: square;
  }

  ul.dash {
    list-style: none;
  }

  ul.dash :deep(li)::before {
    content: "\2013";
    position: relative;
    left: -10px;
  }
</style>
