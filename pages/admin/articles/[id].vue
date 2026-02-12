<template>
  <article-editor
    v-if="article"
    class="pageContent"
    :article="article"
    :people="people"
  />
</template>

<script setup>
import ArticleEditor from '@/components/articles/ArticleEditor';

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const apiFetch = useApiFetch();

const { data } = await useAsyncData(
  'admin:article',
  async () => {
    try {
      const { article } = await apiFetch(`/api/articles/admin/${route.params.id}`);
      const { people } = await apiFetch(`/api/persons`);
      return { article, people };
    } catch (error) {
      console.log(error);
      return { article: undefined, people: [] };
    }
  },
  { watch: [() => route.params.id] }
);

const article = computed(() => data.value?.article);
const people = computed(() => data.value?.people ?? []);
</script>
