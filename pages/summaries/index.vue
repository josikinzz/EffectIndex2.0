<template>
  <NuxtPage />
</template>

<script setup>
const { $store } = useNuxtApp();
await useAsyncData('summaries:effects', () => $store.dispatch('effects/get'));
</script>
