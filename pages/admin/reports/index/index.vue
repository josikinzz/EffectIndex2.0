<template>
  <div>
    <hr>
    <h3> Reports </h3>
    <table class="reportListTable">
      <thead>
        <tr>
          <td> Title </td>
          <td> Author </td>
          <td> Tags </td>
          <td />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="report in reports"
          :key="report._id"
        >
          <td>
            <nuxt-link :to="'/reports/' + report.slug">
              {{ report.title }}
            </nuxt-link>
          </td>
          <td> {{ report.subject ? report.subject.name : '' }} </td>
          <td>
            <span
              v-for="tag in report.tags"
              :key="tag"
              class="reportTag"
            >
              {{ tag }}
            </span>
          </td>
          <td style="display: flex;">
            <nuxt-link :to="'/admin/reports/' + report._id">
              <Icon
                filename="edit.svg"
                style="cursor: pointer; height: 1em; width: 1em; padding-right: 2em;"
              />
            </nuxt-link>
            <a @click="deleteReport(report._id)">
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

definePageMeta({ middleware: 'auth' });

const apiFetch = useApiFetch();
const { $store, $toast } = useNuxtApp();

const { data, refresh } = await useAsyncData('admin:reports', async () => {
  try {
    const { reports } = await apiFetch('/api/reports/admin');
    return { reports };
  } catch (error) {
    $toast?.error?.('There was an error fetching the reports.', { timeout: 2000 });
    return { reports: [] };
  }
});

const reports = computed(() => data.value?.reports ?? []);

const loadReports = async () => {
  await refresh();
};

const deleteReport = async (id) => {
  if (!confirm('Really delete?')) return;
  try {
    await $store.dispatch('reports/delete', id);
    $toast?.success?.('The report has been successfully deleted.', { timeout: 2000 });
    await loadReports();
  } catch (error) {
    const message = error?.data?.message || error?.response?._data?.message;
    if ($toast?.error) {
      $toast.error(message || 'There was an error deleting the report.', { timeout: 2000 });
    } else {
      console.log(error);
    }
  }
};
</script>

<style>
.reportListTable {
  width: 100%;
}
</style>
