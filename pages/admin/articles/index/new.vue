<template>
  <div class="pageContent">
    <hr>
    <article-editor
      :people="people"
      @new-post="submitPost"
    />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

import ArticleEditor from '@/components/articles/ArticleEditor.vue';

const apiFetch = useApiFetch();

const { data } = await useAsyncData('admin:articles:new', async () => {
  try {
    return await apiFetch(`/api/persons`);
  } catch (error) {
    console.log(error);
    return { people: [] };
  }
});

const people = computed(() => data.value?.people ?? []);

const submitPost = async (article) => {
  await apiFetch('/api/articles', { method: 'POST', body: { article } });
};
</script>
