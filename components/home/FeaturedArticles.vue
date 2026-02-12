<template>
  <FrontpagePanel
    icon="file-invoice.svg"
    title="Featured Article"
    description="Analyses that go beyond individual subjective effects"
  >
    <template v-slot:content>
      <div class="featuredArticles">
        <featured-article
          v-for="article in featuredArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </template>
    <template v-slot:stub>
      For more, see the <nuxt-link to="/articles/">
        articles section.
      </nuxt-link>
    </template>
  </FrontpagePanel>
</template>

<script>
import FrontpagePanel from '@/components/home/Panel';
import FeaturedArticle from '@/components/home/FeaturedArticle';
import lodash from 'lodash';

const { shuffle } = lodash;

export default {
  components: {
    FeaturedArticle,
    FrontpagePanel
  },

  props: {
    numberOfArticles: {
      type: Number,
      default: 1
    }
  },

  computed: {
    articles() {
      return this.$store.state.articles.list;
    },
    featuredArticles() {
      const shuffled = shuffle(this.articles.filter((article) => article.featured));
      const maxArticles = this.numberOfArticles;
      return shuffled.length >= maxArticles ? shuffled.slice(0, maxArticles) : shuffled;
    }
  }
};
</script>

<style scoped>
  .articlesContainer {
    padding: 12px;
  }

  .featuredArticles {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }

  .featuredArticle {
    padding: 0.75em 0.5em;
    margin: 0;
  }

  .featuredArticle:not(:last-child) {
    border-bottom: 1px solid #DDD;
  }

  .featuredArticle :deep(.articleDescription) {
    margin: 0;
    margin-top: 1em;
    font-size: 0.95em;
    font-style: italic;
    color: #666;
  }

  .featuredArticle :deep(.articleAuthors) {
    font-size: 0.9em;
    font-style: italic;
  }

  .featuredArticle :deep(.articleInfo) {
    display: flex;
    flex-direction: row;
    font-size: 0.9em;
    color: #AAA;
  }

  .featuredArticle :deep(.articleInfo .separator) {
    margin: 0 5px;
  }

  .featuredArticle:hover {
    background-color: rgb(245, 245, 245);
  }
</style>
