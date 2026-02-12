<template>
  <div 
    class="markdown"
    v-html="$md.render(body ? body : '')"
  />
</template>

<script>
export default {
  props: {
    body: {
      type: String,
      default: undefined
    }
  }
};
</script>

<style scoped>
.markdown :deep(p:not(:last-child)),
.markdown :deep(ul:not(:last-child)) {
  margin-bottom: 1em;
}
</style>
