<template>
  <div class="pageContent">
    <Icon
      filename="file-invoice.svg"
      class="categoryIcon"
    />
    <h1> Articles </h1>
    <p class="intro">
      This index contains a range of articles on a variety of different topics, each of which are relevant to the field of Subjective Effect Documentation or psychonautics as a whole.
    </p>
    <article-view-selector
      :selected="viewMode"
      @selectView="changeView"
    />
    <ul
      v-if="sortedArticles && (viewMode === 'publishDate')"
      class="article-list"
    >
      <article-list-item
        v-for="article in sortedArticles"
        :key="article._id"
        :article="article"
      />
    </ul>
    <div v-else-if="viewMode === 'author'">
      <div
        v-for="author in sortedAuthors"
        :key="author._id"
        class="author-articles"
      >
        <author-info :author="author" />
        <ul class="article-list">
          <article-list-item
            v-for="article in articlesByAuthor(author._id)"
            :key="article._id"
            :article="article"
          />
        </ul>
      </div>
    </div>
    <ul
      v-else-if="viewMode === 'title'"
      class="article-list"
    >
      <article-list-item
        v-for="article in articlesSortedByTitle"
        :key="article._id"
        :article="article"
      />
    </ul>
  </div>
</template>

<script setup>
import ArticleListItem from '@/components/articles/ArticleListItem';
import ArticleViewSelector from '@/components/articles/ArticleViewSelector';
import AuthorInfo from '@/components/articles/AuthorInfo';
import Icon from '@/components/Icon';

const viewMode = ref('publishDate');
const sortDirection = ref(true);

const apiFetch = useApiFetch();
const { data } = await useAsyncData('articles:index', () => apiFetch('/api/articles'));

const articles = computed(() => data.value?.articles ?? []);
const authors = computed(() => data.value?.authors ?? []);

const sortedAuthors = computed(() => {
  return sortDirection.value ? authors.value : authors.value.slice().reverse();
});

const sortedArticles = computed(() => {
  return sortDirection.value ? articles.value : articles.value.slice().reverse();
});

const articlesSortedByTitle = computed(() => {
  const byTitle = articles.value
    .slice()
    .sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase());
  return sortDirection.value ? byTitle : byTitle.reverse();
});

const changeView = (mode) => {
  if (mode === viewMode.value) sortDirection.value = !sortDirection.value;
  else viewMode.value = mode;
};

const articlesByAuthor = (id) => {
  return articles.value.filter(article =>
    article.authors.some(articleAuthor => articleAuthor._id === id)
  );
};
</script>

<style scoped>
  .article-list {
    list-style: none;
    padding-left: 0;
  }

  .author-articles:not(:last-child) {
    margin-bottom: 25px;
    padding-bottom: 25px;
  }
  .articleViewSelector {
    margin-bottom: 25px;
  }
</style>
