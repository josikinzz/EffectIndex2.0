<template>
  <div>
    <hr>
    <table style="width: 100%;">
      <thead>
        <tr style="font-weight: bold;">
          <td> Author </td>
          <td> Date Published </td>
          <td> Title </td>
          <td />
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="article in articles"
          :key="article._id"
        >
          <td>
            <span
              v-for="(author, index) in article.authors"
              :key="index"
            > {{ author.full_name || author.alias }} </span>
          </td>
          <td>
            {{ formatDate(article.publication_date) }}
          </td>
          <td> 
            <nuxt-link :to="'/articles/' + article.slug">
              {{ article.title }}
            </nuxt-link>
          </td>
          <td style="display: flex; justify-content: flex-end;">
            <nuxt-link :to="'/admin/articles/' + article._id">
              <Icon
                filename="edit.svg"
                style="cursor: pointer; height: 1em; width: 1em; padding-right: 2em;"
              /> 
            </nuxt-link> 
            <a @click="deleteArticle(article._id)"> 
              <Icon
                filename="times.svg"
                style="height: 1em; width: 1em; cursor: pointer;"
                color="red"
              />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Icon from '@/components/Icon';
import fecha from "fecha";

definePageMeta({ middleware: 'auth' });

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const { data, refresh } = await useAsyncData('admin:articles', async () => {
  const { articles } = await apiFetch('/api/articles/admin');
  return { articles };
});

const articles = computed(() => data.value?.articles ?? []);

const loadArticles = async () => {
  await refresh();
};

const formatDate = (date) => {
  return date ? fecha.format(new Date(date), "dddd, MMMM DD YYYY") : undefined;
};

const deleteArticle = async (id) => {
  if (!confirm('Really delete?')) return;
  try {
    await apiFetch(`/api/articles/${id}`, { method: 'DELETE' });
    $toast?.success?.('The report has been successfully deleted.', { timeout: 2000 });
    await loadArticles();
  } catch (error) {
    const message = error?.data?.message || error?.response?._data?.message;
    if ($toast?.error) {
      $toast.error(message || 'There was an error deleting the article.', { timeout: 2000 });
    } else {
      console.log(error);
    }
  }
};
</script>
