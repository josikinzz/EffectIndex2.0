<template>
  <article class="report">
    <div class="report__headerContainer">
      <div class="report__headerTitleContainer">
        <div style="display: flex; flex-direction: row; align-items: center;">
          <h1
            class="report__title"
            style="margin-bottom: 0;"
          >
            {{ report.title }}
          </h1>
          <client-only>
            <div
              v-if="$auth.loggedIn"
            >
              <nuxt-link
                :to="`/admin/reports/${report._id}`"
              >
                <Icon
                  style="height: 20px; width: 20px; opacity: 0.6; margin-left: 15px;"
                  filename="edit.svg"
                />
              </nuxt-link>
            </div>
          </client-only>
        </div>
        <div
          v-show="report.subject.name"
          class="report__titleAuthor"
        >
          <span v-if="report.person">
            by
            <nuxt-link
              v-if="report.person.profile_url"
              :to="`/people/${report.person.profile_url}`"
            > {{ report.person.full_name || report.person.alias }} </nuxt-link>
            <span v-else> {{ report.person.full_name || report.person.alias }} </span>
          </span>
          <span v-else-if="profile">
            by <nuxt-link :to="'/profiles/' + profile.username"> {{ report.subject.name }} </nuxt-link>
          </span>
          <span v-else>
            by {{ report.subject.name }}
          </span>
        </div>
      </div>
      <div class="report__tagsContainer">
        <tag
          v-for="(tag, index) in report.tags"
          :key="index"
          :value="tag"
        />
      </div>
    </div>

    <div class="report__topSection">
      <subject-box
        :profile="profile"
        :subject="report.subject"
      />
      <substances-box :substances="report.substances" />
    </div>

    <text-box
      v-if="report.introduction"
      :text="report.introduction"
      icon="sun.svg"
      header-colour="#EEE"
      header="Introduction"
    />

    <div class="report__logsContainer">
      <log-box
        v-if="report.onset.length"
        :log="report.onset"
        header-colour="#DDFFDD"
        header="Onset"
      />

      <log-box
        v-if="report.peak.length"
        :log="report.peak"
        header-colour="#FFDDDD"
        header="Peak"
      />

      <log-box
        v-if="report.offset.length"
        :log="report.offset"
        header-colour="#DDDDFF"
        header="Offset"
      />
    </div>

    <text-box
      v-if="report.conclusion"
      :text="report.conclusion"
      icon="moon.svg"
      header-colour="#EEE"
      header="Conclusion / Aftermath"
    />

    <related-effects
      v-if="hasRelatedEffects"
      :effects="report.related_effects"
    />
  </article>
</template>

<script setup>
import TextBox from "@/components/reports/report__textBox";
import SubjectBox from "@/components/reports/report__subjectBox";
import SubstancesBox from "@/components/reports/report__substancesBox";
import LogBox from "@/components/reports/report__logBox";
import Tag from "@/components/reports/report__tag";
import RelatedEffects from "@/components/reports/report__relatedEffects";
import Icon from "@/components/Icon";

definePageMeta({ scrollToTop: true });

const route = useRoute();
const { $store } = useNuxtApp();

const defaultReport = {
  _id: '',
  title: '',
  tags: [],
  subject: { name: '', trip_date: '' },
  person: null,
  substances: [],
  introduction: '',
  conclusion: '',
  onset: [],
  peak: [],
  offset: [],
  related_effects: []
};

const { data } = await useAsyncData(
  'reports:detail',
  async () => {
    const report = await $store.dispatch("reports/getReportBySlug", route.params.slug);
    if (!report) {
      throw createError({ statusCode: 404, statusMessage: "That report does not exist." });
    }
    await $store.dispatch("profiles/get");
    return { report };
  },
  { watch: [() => route.params.slug] }
);

const report = computed(() => data.value?.report || defaultReport);

const profile = computed(() => {
  const profiles = $store.state.profiles.list;
  return profiles.find(profile => profile.username === report.value.subject.name);
});

const description = computed(() => {
  const substances = report.value.substances.map((substance) => substance.name);
  const substanceList = substances.join(', ');
  return `A ${substanceList} report from ${report.value.subject.name} on Effect Index.`;
});

const hasRelatedEffects = computed(() => {
  return report.value.related_effects && (report.value.related_effects.length > 0);
});

useHead(() => ({
  title: report.value.title,
  meta: [
    { name: 'description', hid: 'description', content: description.value },
    { name: 'og:title', hid: 'og:title', content: `Effect Index - Trip Report - ${report.value.title} by ${report.value.subject.name}` },
    { name: 'og:description', hid: 'og:description', content: description.value },
    { name: 'twitter:title', hid: 'twitter:title', content: `Effect Index - Trip Report - ${report.value.title} by ${report.value.subject.name}` },
    { name: 'twitter:description', hid: 'twitter:description', content: description.value },
  ]
}));
</script>

<style>
.report {
  color: #333;
}

.report a {
  color: #3d9991;
}

h1 {
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 15px;
}

.report__title {
  margin: 0;
  padding: 0;
}

.report__titleAuthor {
  padding: 0.25em 0;
}

.report__titleAuthor a {
  text-decoration: none;
}

.report__headerContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.25em;
}

.report__tagsContainer {
  display: inline-block;
}

.report .icon {
  padding-right: 0.4em;
  opacity: 0.6;
  font-size: 30px;
}

.report__infoBox:first-child {
  margin-left: 0;
}

.report__infoBox:last-child {
  margin-right: 0;
}

.report__textBox {
  margin: 1em 0;
  background-color: #fbfbfb;
  border: 1px solid #cccccc;
}

.report__textBoxText {
  white-space: pre-wrap;
}

.report ul, .report ol {
  white-space: normal;
}

.report__textBoxText {
  padding: 1em;
}

.report__textBoxHeader {
  font-weight: 400;
  background-color: #eee;
  border-bottom: 1px solid #cccccc;
  padding: 0.25em 0.5em;
  font-size: 21px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.report__topSection {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  padding-bottom: 0.25em;
}

.report__infoBox {
  margin: 0.5em;
  background-color: #fbfbfb;
  overflow: hidden;
  border: 1px solid #cccccc;
  min-width: 300px;
  flex: 1;
}

.report__infoBoxHeader {
  padding: 0.25em 0.5em;
  font-weight: 400;
  display: flex;
  background-color: #eee;
  font-size: 21px;
  border-bottom: 1px solid #cccccc;
  align-items: center;
}

.report__infoBoxTableContainer {
  padding: 0.5em;
}

.report__infoBoxTable {
  width: 100%;
}

.report__infoBoxTable {
  border-collapse: collapse;
}

.report__infoBoxTableHeader {
  font-weight: bold;
  border-bottom: 1.5px solid #ccc;
}

.report__infoBoxTable td {
  padding: 0.25em;
}

.report__logsContainer {
  margin: 1em 0;
}

.report__logBox {
  border: 1px solid #cccccc;
  overflow: hidden;
  margin-bottom: 0.5em;
  background-color: #fbfbfb;
}

@media (max-width: 600px) {
  .report__headerContainer {
    flex-direction: column;
  }

  .report__topSection {
    display: block;
  }

  .report__infoBox {
    margin: 1em 0;
  }

  .report__infoBoxHeader {
    padding: 0.25em;
  }
}
</style>
