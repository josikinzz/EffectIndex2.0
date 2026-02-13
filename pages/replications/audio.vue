<template>
  <div class="pageContent">
    <Icon
      filename="volume-up.svg"
      class="categoryIcon"
    />
    <h1> Auditory Effect Replications </h1>
    <div>
      <audio-replication
        v-for="replication in audioReplications"
        :key="replication._id"
        :replication="replication"
      />
    </div>
  </div>
</template>

<script setup>
import AudioReplication from "@/components/replications/audio/AudioReplication";
import Icon from '@/components/Icon';

useHead({ title: "Audio Replications" });

const { $store } = useNuxtApp();
await useAsyncData('replications:audio', async () => {
  // Trigger both actions before awaiting to keep Nuxt composable context intact.
  await Promise.all([
    $store.dispatch("replications/get"),
    $store.dispatch("effects/get")
  ]);
  return {};
});

const audioReplications = computed(() => {
  return $store.state.replications.list.filter(
    (replication) => (replication.type === 'audio')
  );
});
</script>
