<template>
  <div class="tab">
    <slot />
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>

.tab {
  position: relative;
  border: 1px solid #DDD;
  border-bottom: 0;
  padding: 0.5em 0 0.25em 0;
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

@media (max-width: 500px) {
  .tab {
    padding: 0;
    border: 0;
  }
}


</style>
