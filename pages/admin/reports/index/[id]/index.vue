<template>
  <div class="pageContent">
    <hr>
    <report-editor
      :report="reportData"
      :visibility="sectionVisibility"
      @edit-report="updateReport"
    />
  </div>
</template>

<script setup>
import ReportEditor from '@/components/reports/editor/ReportEditor';

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const { $store, $toast } = useNuxtApp();

const { data } = await useAsyncData(
  'admin:report:detail',
  async () => {
    try {
      const { reportData, sectionVisibility } = await $store.dispatch('reports/getReportById', route.params.id);
      return { reportData, sectionVisibility };
    } catch (error) {
      console.log(error);
      return { reportData: undefined, sectionVisibility: undefined };
    }
  },
  { watch: [() => route.params.id] }
);

const reportData = computed(() => data.value?.reportData);
const sectionVisibility = computed(() => data.value?.sectionVisibility);

const updateReport = async (report) => {
  try {
    await $store.dispatch('reports/update', report);
    $toast?.success?.('The report has been successfully updated.', { timeout: 2000 });
  } catch (error) {
    console.log(error);
  }
};
</script>
