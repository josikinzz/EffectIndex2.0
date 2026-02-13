<template>
  <div class="pageContent">
    <Description />
    <div
      v-if="prefetchMessage"
      class="dataWarning"
    >
      {{ prefetchMessage }}
    </div>
    <FrontpageArticle />
    <Columns>
      <Column>
        <FeaturedSponsor
          sponsor-name="Emergence Benefactors"
          sponsor-link="https://ebenefactors.org/"
          sponsor-icon-path="/ebenefactors.png"
        />
        <SubstanceSummaries />
        <FeaturedEffects />
        <FeaturedArticles />
      </Column>
      <Column>
        <client-only>
          <FeaturedReplications />
        </client-only>
        <FeaturedReports
          :number-of-reports="8"
        />
      </Column>
    </Columns>
  </div>
</template>

<script setup>
import Description from '@/components/home/Description';
import FeaturedEffects from '@/components/home/FeaturedEffects';
import FeaturedReports from '@/components/home/FeaturedReports';
import FeaturedReplications from '@/components/home/FeaturedReplications';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import FeaturedSponsor from '@/components/home/FeaturedSponsor';
import FrontpageArticle from "@/components/home/FrontpageArticle";
import SubstanceSummaries from '@/components/home/SubstanceSummaries';
import Column from '@/components/home/Column';
import Columns from '@/components/home/Columns';

definePageMeta({ scrollToTop: true });

const { $store } = useNuxtApp();
const formatFailure = (reason) => {
  const statusCode = reason?.statusCode || reason?.response?.status || reason?.data?.statusCode;
  const errorName = reason?.data?.error?.name || reason?.name || 'Error';
  const message = reason?.data?.error?.message || reason?.statusMessage || reason?.message || 'Unknown error';

  return `${statusCode ? `${statusCode} ` : ''}${errorName}: ${message}`;
};

const runHomePrefetch = async (onlyMissing = false) => {
  const tasks = [
    {
      label: 'effects',
      needsFetch: () => !$store.state.effects.list.length,
      promise: () => $store.dispatch("effects/get")
    },
    {
      label: 'replications',
      needsFetch: () => !$store.state.replications.list.length,
      promise: () => $store.dispatch("replications/featured")
    },
    {
      label: 'reports',
      needsFetch: () => !$store.state.reports.list.length,
      promise: () => $store.dispatch("reports/get")
    },
    {
      label: 'articles',
      needsFetch: () => !$store.state.articles.list.length,
      promise: () => $store.dispatch("articles/get")
    }
  ].filter((task) => !onlyMissing || task.needsFetch());

  if (tasks.length === 0) {
    return { message: '' };
  }

  const results = await Promise.allSettled(tasks.map((task) => task.promise()));
  const failed = results
    .map((result, index) => ({ result, label: tasks[index].label }))
    .filter((entry) => entry.result.status === 'rejected');

  if (failed.length === 0) {
    return { message: '' };
  }

  const failureDetails = failed
    .map((entry) => `${entry.label} (${formatFailure(entry.result.reason)})`)
    .join('; ');

  return {
    message: `Some homepage content is unavailable. ${failureDetails}. ` +
      `Check /api/health for database status when running locally.`
  };
};

const { data: prefetchData } = await useAsyncData('home:prefetch', async () => {
  return runHomePrefetch(false);
}, {
  // Route payload hydration from non-home pages can overwrite shared store lists
  // with empty arrays; disable async-data cache reuse so home prefetch always runs.
  getCachedData: () => null
});

const clientPrefetchMessage = ref('');

onMounted(async () => {
  const { message } = await runHomePrefetch(true);
  clientPrefetchMessage.value = message || '';
});

const prefetchMessage = computed(() => {
  return clientPrefetchMessage.value || prefetchData.value?.message || '';
});

const imageReplications = computed(() => {
  return $store.state.replications.list.filter((replication) => replication.type === 'image');
});
</script>

<style scoped>

.column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.column:not(:last-child) {
  margin-right: 1em;
}

.columns {
  display: flex;
  flex-direction: row;
}

.dataWarning {
  border: 1px solid #e0c289;
  background: #fff7e5;
  color: #5c471a;
  margin: 0 0 1em;
  padding: 0.75em 1em;
}

@media(max-width: 800px) {
  .columns {
    flex-direction: column;
  }

  .column:not(:last-child) {
    margin-right: 0em;
  }

  .column {
    margin-bottom: 1em;
  }
}
</style>
