<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({ title: "Categories" });

const { $store } = useNuxtApp();
await useAsyncData('categories:effects', () => $store.dispatch("effects/get"));
</script>
