<template>
  <div class="pageContent">
    <h1>
      Search
      <Icon
        filename="search.svg"
        class="categoryIcon"
      />
    </h1>

    <div class="inputContainer">
      <input
        ref="searchInputRef"
        :value="searchInput"
        type="text"
        class="searchInput"
        @input="changeSearchInput"
      >
      <div
        v-show="searchInput.length"
        class="clearButton"
        @click="clear"
      >
        <Icon
          filename="times-circle.svg"
          style="height: 1.25em; width: 1.25em;"
        />
      </div>
    </div>

    <div
      v-show="results"
      class="searchResults"
    >
      <hr>

      <div
        v-if="effectResults"
        class="effectResults"
      >
        <h1> Effects - {{ effectResults.length + (effectResults.length > 1 ? ' results' : ' result') }} </h1>
        <effect-result
          v-for="effect in effectResults"
          :key="effect._id"
          :effect="effect"
        />
      </div>

      <ul
        v-if="articleResults"
        class="articleResults"
      >
        <h1>
          Articles - {{ articleResults.length + (articleResults.length > 1 ? ' results' : ' result') }}
        </h1>
        <article-list-item
          v-for="article in articleResults"
          :key="article._id"
          :article="article"
        />
      </ul>

      <div
        v-if="reportResults"
        class="effectResults"
      >
        <h1> Reports - {{ reportResults.length + (reportResults.length > 1 ? ' results' : ' result') }} </h1>
        <report-result
          v-for="report in reportResults"
          :key="report._id"
          :report="report"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import EffectResult from "@/components/search/EffectResult";
import ReportResult from "@/components/search/ReportResult";
import ArticleListItem from "@/components/articles/ArticleListItem";
import Icon from '@/components/Icon';
import lodash from 'lodash';

const { debounce } = lodash;

definePageMeta({ scrollToTop: true });
useHead({ title: "Search" });

const route = useRoute();
const { $store } = useNuxtApp();
const searchInputRef = ref(null);

await useAsyncData(
  'search:prefetch',
  async () => {
    if (route.query.q) {
      await $store.dispatch('search/search', route.query.q);
      $store.commit('search/change_input', route.query.q);
    } else {
      $store.commit('search/clear_input');
    }
    return {};
  },
  { watch: [() => route.query.q] }
);

const effectResults = computed(() => $store.state.search.results.effects);
const reportResults = computed(() => $store.state.search.results.reports);
const articleResults = computed(() => $store.state.search.results.articles);
const searchInput = computed(() => $store.state.search.input);
const results = computed(() => effectResults.value || reportResults.value || articleResults.value);

const performSearch = debounce(() => {
  $store.dispatch('search/search', searchInput.value);
}, 400, { trailing: true });

const changeSearchInput = (e) => {
  $store.commit('search/change_input', e.target.value);
  performSearch();
};

const clear = () => {
  $store.commit('search/clear_input');
  searchInputRef.value?.focus();
};

onMounted(() => {
  searchInputRef.value?.focus();
});

onUnmounted(() => {
  $store.commit('search/clear_input');
});
</script>

<style scoped>

  input {
    font-family: "titillium web", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
    width: 100%;
    border: none;
  }

  .inputContainer {
    position: relative;
    min-width: 250px;
    max-width: 600px;
    border: 1px solid #CCCCCC;
    padding: 6px 12px;
  }

  .searchInput {
    font-size: 16pt;
    max-width: 92%;
  }

  .searchInput:focus {
    outline: none;
  }

  .clearButton {
    position: absolute;
    right: 8px;
    top: calc(50% - 12px);
    opacity: 0.4;
    cursor: pointer;
    height: 25px;
    width: 25px;
  }

  .clearButton:hover {
    opacity: 0.7;
  }

  .articleResults {
    list-style: none;
    padding-left: 0;
    font-size: unset;
  }

</style>
