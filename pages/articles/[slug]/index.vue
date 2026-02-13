<template>
  <div class="pageContent">
    <article
      class="article"
    >
      <client-only>
        <admin-toolbar
          v-if="$auth.hasScope('editor')"
          :item-id="article._id"
          item-url="/admin/articles"
        />
      </client-only>

      <h1 class="title">
        {{ article.title }}
      </h1>
      <h2 class="subtitle">
        {{ article.subtitle }}
      </h2>

      <byline :article="article" />

      <hr style="margin: 2em 0;">

      <div class="body">
        <vcode
          :body="article.body"
        />
      </div>

      <div
        v-if="hasSection('citations')"
        class="citations"
      >
        <hr>
        <h3> References </h3>
        <citation-list :citations="article.citations" />
      </div>

      <div
        v-if="hasSection('tags')"
        class="tags"
      >
        <hr>
        <h3> Tags </h3>
        <tag
          v-for="tag in article.tags"
          :key="tag"
          :value="tag"
        />
      </div>
    </article>
  </div>
</template>

<script setup>
import AdminToolbar from '@/components/AdminToolbar';
import Byline from '@/components/articles/Byline';
import CitationList from '@/components/CitationList';
import Tag from '@/components/articles/Tag';

const defaultArticle = {
  title: undefined,
  subtitle: undefined,
  _id: undefined,
  citations: [],
  tags: [],
  authors: [],
  short_description: '',
  social_media_image: '',
  body: {
    parsed: []
  }
};

const route = useRoute();
const apiFetch = useApiFetch();
const { data: articleData, error } = await useAsyncData(
  `article:${String(route.params.slug || '')}`,
  () => apiFetch(`/api/articles/${route.params.slug}`),
  { watch: [() => route.params.slug] }
);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'That article could not be found.' });
}

const article = computed(() => articleData.value?.article ?? defaultArticle);

const names = (authors) => {
  if (Array.isArray(authors) && authors.length) {
    let title = '- ';
    authors.forEach((author, index) => {
      title += author.full_name;
      if (index < authors.length - 1) title += ', ';
    });
    return title;
  }
  return '';
};

useHead(() => {
  const current = article.value;
  if (!current) return {};
  return {
    title: `${current.title} ${names(current.authors)}`,
    meta: [
      { name: 'description', hid: 'description', content: current.short_description },
      { name: 'og:title', hid: 'og:title', content: `${current.title} ${names(current.authors)} - EffectIndex` },
      { name: 'og:description', hid: 'og:description', content: current.short_description },
      { name: 'og:image', hid: 'og:image', content: current.social_media_image },
      { name: 'twitter:title', hid: 'twitter:title', content: `${current.title} ${names(current.authors)} - EffectIndex` },
      { name: 'twitter:description', hid: 'twitter:description', content: current.short_description },
      { name: 'twitter:image', hid: 'twitter:image', content: current.social_media_image },
    ]
  };
});

const hasSection = (name) => {
  const current = article.value;
  if (current && name in current) {
    const section = current[name];
    if (Array.isArray(section) && section.length > 0) return true;
    if (typeof section === "string" && section.length > 0) return true;
  }
  return false;
};
</script>

<style>
.article > .title {
  font-size: 30px;
  font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, "Segoe UI";
}

.article > .subtitle {
  color: #999;
  font-weight: normal;
  letter-spacing: unset;
  font-size: 25px;
}

.article .body p {
  line-height: 1.5em;
}

.article ul li {
  color:#757575;
  margin: 1em 0;
}

.article h1.title {
  font-size: 35px;
  margin-bottom: 0;
}

.article h2, .article h3, .article h4 {
  margin: 1em 0;
}

.article h2 {
  font-size: 32px;
  letter-spacing: 1px;
}

.article h3 {
  font-size: 28px;
  text-transform: none;
}

.article h4 {
  font-size: 24.5px;
  text-transform: uppercase;
  letter-spacing: unset;
}



</style>
