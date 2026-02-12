<template>
  <div class="pageContent">
    <client-only>
      <effect-editor
        :effect="effect"
        @edit-effect="submitEffect"
        @update-effect="updateEffect"
      />
    </client-only>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

import EffectEditor from "@/components/effects/editor/EffectEditor";

const route = useRoute();
const router = useRouter();
const apiFetch = useApiFetch();
const { $store, $toast } = useNuxtApp();

const { data } = await useAsyncData(
  'admin:effect',
  async () => {
    try {
      const { effect } = await apiFetch(`/api/effects/${route.params.name}`);
      return { effect };
    } catch (error) {
      console.log(error);
      return { effect: undefined };
    }
  },
  { watch: [() => route.params.name] }
);

const effect = computed(() => data.value?.effect);

const submitEffect = async (payload) => {
  const submitted = await $store.dispatch("effects/update", payload);
  $toast?.success?.('The effect has been successfully updated.', { timeout: 2000 });
  router.push("/effects/" + submitted.url);
};

const updateEffect = async (payload) => {
  await $store.dispatch("effects/update", payload);
  $toast?.success?.('The effect has been successfully updated.', { timeout: 2000 });
};
</script>
