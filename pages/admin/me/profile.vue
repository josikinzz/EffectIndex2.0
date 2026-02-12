<template>
  <div class="pageContent">
    <h1> Your Profile </h1>
    <person-details
      :person="person"
      @update="updateProfile"
      @submit="saveProfile"
    />
  </div>
</template>

<script setup>
import PersonDetails from '@/components/people/PersonDetails';

definePageMeta({ middleware: 'auth' });
useHead({ title: "Your Profile" });

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const { data } = await useAsyncData('admin:me', async () => {
  try {
    const { person } = await apiFetch('/api/persons/me');
    return { person: person ? person : undefined };
  } catch (error) {
    console.log(error);
    return { person: undefined };
  }
});

const person = computed(() => data.value?.person);

const updateProfile = async (payload) => {
  try {
    await apiFetch('/api/persons/me', { method: 'POST', body: { person: payload } });
    $toast?.success?.('Your profile was successfully updated.', { timeout: 2000 });
  } catch (error) {
    console.log(error);
    $toast?.error?.('There was an error updating your profile.', { timeout: 2000 });
  }
};

const saveProfile = async (payload) => {
  try {
    await apiFetch('/api/persons/me', { method: 'POST', body: { person: payload } });
    $toast?.success?.('Your profile was successfully saved.', { timeout: 2000 });
  } catch (error) {
    console.log(error);
    $toast?.error?.('There was an error saving your profile.', { timeout: 2000 });
  }
};
</script>
