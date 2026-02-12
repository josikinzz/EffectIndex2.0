<template>
  <div class="pageContent">
    <replication-editor
      :replication="replication"
      @edit-replication="submitReplication"
    />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

import ReplicationEditor from "@/components/replications/ReplicationEditor";

const route = useRoute();
const router = useRouter();
const { $store, $toast } = useNuxtApp();

const { data } = await useAsyncData(
  'admin:replication',
  async () => {
    const { replication } = await $store.dispatch("replications/getReplication", route.params.name);
    return { replication };
  },
  { watch: [() => route.params.name] }
);

const replication = computed(() => data.value?.replication);

const submitReplication = async (payload) => {
  await $store.dispatch("replications/update", payload);
  $toast?.success?.('The replication has been successfully saved.', { timeout: 2000 });
  router.push("/admin/replications");
};
</script>
