<template>
  <div class="pageContent admin redirects">
    <h1> Redirects </h1>
    <ul class="redirects-list">
      <redirect-input
        ref="redirectInput"
        @submit="submitRedirect"
      />
      <redirect-list-item
        v-for="redirect in redirects"
        :key="redirect._id"
        :redirect="redirect"
        @delete="deleteRedirect"
        @update="updateRedirect"
      />
    </ul>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });
useHead({ title: "Manage Redirects" });

import RedirectListItem from '@/components/redirects/RedirectListItem';
import RedirectInput from '@/components/redirects/RedirectInput';

const apiFetch = useApiFetch();
const { $store, $toast } = useNuxtApp();
const redirectInput = ref(null);

const { data, refresh } = await useAsyncData('admin:redirects', async () => {
  try {
    const { redirects } = await apiFetch('/api/redirects');
    return { redirects };
  } catch (error) {
    console.log(error);
    return { redirects: [] };
  }
});

const redirects = computed(() => data.value?.redirects ?? []);

const loadRedirects = async () => {
  await refresh();
};

const submitRedirect = async (redirect) => {
  try {
    await apiFetch('/api/redirects', { method: 'POST', body: { redirect } });
    redirectInput.value?.clearFields?.();
    $toast?.success?.('The redirect was successfully added.', { timeout: 2000 });
    await $store.dispatch('redirects/get');
    await loadRedirects();
  } catch (error) {
    $toast?.error?.('There was an error adding the redirect.', { timeout: 2000 });
    console.log(error);
  }
};

const deleteRedirect = async (id) => {
  try {
    await apiFetch(`/api/redirects/${id}`, { method: 'DELETE' });
    $toast?.success?.('The redirect was successfully deleted.', { timeout: 2000 });
    await $store.dispatch('redirects/get');
    await loadRedirects();
  } catch (error) {
    $toast?.error?.('There was an error deleting the redirect.', { timeout: 2000 });
    console.log(error);
  }
};

const updateRedirect = async (redirect) => {
  const { _id } = redirect;
  try {
    await apiFetch(`/api/redirects/${_id}`, { method: 'PUT', body: { redirect } });
    $toast?.success?.('The redirect was successfully updated.', { timeout: 2000 });
    await $store.dispatch('redirects/get');
    await loadRedirects();
  } catch (error) {
    $toast?.error?.('There was an error updating the redirect.', { timeout: 2000 });
    console.log(error);
  }
};
</script>

<style scoped>
  .redirects-list {
    width: 100%;
    padding-left: 0;
    list-style: none;
  }
</style>
