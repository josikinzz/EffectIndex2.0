<template>
  <div class="pageContent admin people">
    <h1> People </h1>
    <add-person
      @submit="newPerson"
    />
    <person
      v-for="person in people"
      :key="person._id"
      :person="person"
      @delete="deletePerson"
      @update="updatePerson"
      @saveMeta="saveMeta"
    />
  </div>
</template>

<script setup>
import AddPerson from '@/components/people/AddPerson';
import Person from '@/components/people/Person';

definePageMeta({ middleware: 'auth' });
useHead({ title: "Modify People" });

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const { data, refresh } = await useAsyncData('admin:people', async () => {
  try {
    const { people } = await apiFetch('/api/persons/all');
    return { people };
  } catch (error) {
    console.log(error);
    return { people: [] };
  }
});

const people = computed(() => data.value?.people ?? []);

const loadPeople = async () => {
  await refresh();
};

const newPerson = async (person) => {
  try {
    await apiFetch('/api/persons', { method: 'POST', body: { person } });
    $toast?.success?.('The person was successfully created.', { timeout: 2000 });
    await loadPeople();
  } catch (error) {
    $toast?.error?.('There was an error saving the person. Check console.', { timeout: 2000 });
    console.log(error);
  }
};

const updatePerson = async (person) => {
  try {
    await apiFetch(`/api/persons/${person._id}`, { method: 'PUT', body: { person } });
    $toast?.success?.('The person was successfully updated.', { timeout: 2000 });
    await loadPeople();
  } catch (error) {
    $toast?.error?.('There was an error updating the person. Check console.', { timeout: 2000 });
    console.log(error);
  }
};

const saveMeta = async (person) => {
  try {
    await apiFetch(`/api/persons/meta/${person._id}`, { method: 'PUT', body: { person } });
    $toast?.success?.('Person metadata was successfully saved.', { timeout: 2000 });
  } catch (error) {
    $toast?.error?.('Metadata was not successfully saved. Check console.', { timeout: 2000 });
    console.log(error);
  }
};

const deletePerson = async (person) => {
  try {
    if (!confirm('Really delete?')) return;
    await apiFetch(`/api/persons/${person._id}`, { method: 'DELETE' });
    await loadPeople();
  } catch (error) {
    $toast?.error?.('There was an error deleting the person. Check console.', { timeout: 2000 });
    console.log(error);
  }
};
</script>
