<template>
  <div class="pageContent">
    <h1> The Team </h1>
    <people-profile-list :people="people" />
  </div>
</template>

<script setup>
import PeopleProfileList from "@/components/people/PeopleProfileList";

const apiFetch = useApiFetch();
const { data } = await useAsyncData('people:featured', async () => {
  try {
    return await apiFetch('/api/persons/featured');
  } catch (error) {
    console.log(error);
    return { people: [] };
  }
});

const people = computed(() => data.value?.people ?? []);

useHead({ title: "People" });
</script>

<style scoped>
.peopleList {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.personContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.personContainer .personName {
  font-weight: bold;
}

.personContainer:not(:first-child) {
  margin-left: 5px;
}
</style>
