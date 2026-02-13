<template>
  <div class="pageContent tripReports">
    <Icon
      filename="file-signature.svg"
      class="categoryIcon"
    />
    <h1> Trip Reports </h1>

    <p>
      The <strong>trip reports section</strong> of Effect Index exists to showcase our collection of high quality, consistently formatted trip reports that describe the subjective experiences our community members undergo while under the influence of various
      hallucinogenic substances.
      These reports are then used as anecdotal accounts that further support the existence of the various documented states within our <nuxt-link to="/effects">
        Subjective Effect Index.
      </nuxt-link>
    </p>
    <view-selector
      :selected="viewMode.name"
      @selectView="selectView"
    />

    <div v-if="viewMode.name === 'substance'">
      <div
        v-for="(substance, index) in sortedSubstances.filter(substance => substance !== 'Combinations')"
        :key="index"
        class="report__substanceList"
      >
        <h3> {{ substance }} </h3>
        <div class="report__reportItemContainer">
          <report-item
            v-for="report in filterReportsBySubstance(substance)"
            :key="report._id"
            :report="report"
            :profile-name="hasProfile(report.subject.name)"
          />
        </div>
      </div>

      <div
        v-if="sortedSubstances.indexOf('Combinations') > 0"
        class="report__substanceList"
      >
        <h3> Combinations </h3>
        <div class="report__reportItemContainer">
          <report-item
            v-for="report in filterReportsBySubstance('Combinations')"
            :key="report._id"
            :report="report"
            :profile-name="hasProfile(report.subject.name)"
          />
        </div>
      </div>
    </div>

    <div v-else-if="viewMode.name === 'title'">
      <report-item
        v-for="report in reportsByTitle"
        :key="report._id"
        :report="report"
        :profile-name="hasProfile(report.subject.name)"
      />
    </div>

    <div v-else-if="viewMode.name === 'author'">
      <div
        v-for="(author, index) in sortedAuthors"
        :key="index"
        class="report__substanceList"
      >
        <h3>
          <nuxt-link
            v-if="hasProfile(author)"
            :to="'/profiles/' + author"
          >
            {{ author }}
          </nuxt-link>
          <span v-else> {{ author }} </span>
        </h3>
        <div class="report__reportItemContainer">
          <report-item
            v-for="report in filterReportsByAuthor(author)"
            :key="report._id"
            :report="report"
            :profile-name="hasProfile(report.subject.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import reportItem from "@/components/reports/reportList__item";
import viewSelector from "@/components/reports/reportList__viewSelector";
import Icon from '@/components/Icon';
import lodash from 'lodash';

const { sortBy } = lodash;

useHead({ title: "Trip Reports" });

const { $store } = useNuxtApp();
await useAsyncData('reports:list', async () => {
  // Trigger both actions before awaiting to keep Nuxt composable context intact.
  await Promise.all([
    $store.dispatch("reports/get"),
    $store.dispatch("profiles/get")
  ]);
  return {};
});

const viewMode = reactive({
  name: "substance",
  direction: true
});

const reports = computed(() => $store.state.reports.list.filter((report) => !report.unpublished));
const profileNames = computed(() => $store.state.profiles.list.map(profile => profile.username));

const substances = computed(() => {
  const substanceList = new Set();
  reports.value.forEach(report => {
    if (report.substances.length > 1) substanceList.add("Combinations");
    else
      report.substances.forEach(substance =>
        substanceList.add(substance.name)
      );
  });
  return Array.from(substanceList);
});

const authors = computed(() => {
  const authorList = new Set();
  reports.value.forEach(report => {
    authorList.add(report.subject.name);
  });
  return Array.from(authorList);
});

const sortedSubstances = computed(() => {
  const sorted = sortBy(substances.value);
  return viewMode.direction ? sorted : sorted.reverse();
});

const sortedAuthors = computed(() => {
  const sorted = sortBy(authors.value);
  return viewMode.direction ? sorted : sorted.reverse();
});

const reportsByTitle = computed(() => {
  const sorted = sortBy(reports.value, ["title"]);
  return viewMode.direction ? sorted : sorted.reverse();
});

const reportsByTripDate = computed(() => {
  const sorted = sortBy(reports.value, report => report.subject.trip_date);
  return viewMode.direction ? sorted : sorted.reverse();
});

const hasProfile = (name) => {
  return profileNames.value[profileNames.value.indexOf(name)];
};

const filterReportsBySubstance = (name) => {
  return name === 'Combinations'
    ? reports.value.filter((report) => Array.isArray(report.substances) && report.substances.length > 1)
    : reports.value.filter((report) => Array.isArray(report.substances) && report.substances.find((substance) => substance.name === name));
};

const filterReportsByAuthor = (author) => {
  return reports.value.filter(report => report.subject.name === author);
};

const selectView = (view) => {
  if (viewMode.name === view)
    viewMode.direction = !viewMode.direction;
  else viewMode.name = view;
};
</script>

<style>
.tripReports p:last-of-type {
  padding-bottom: 1em;
}

.report__substanceList {
  margin: 2em 0;
}

.report__substanceList:first-child {
  margin-top: 0;
}
</style>
