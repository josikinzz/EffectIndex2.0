<template>
  <FrontpagePanel
    icon="file-signature.svg"
    title="Featured Reports"
    description="Recommended firsthand accounts of hallucinogenic experiences"
  >
    <template v-slot:content>
      <div class="featuredReports">
        <featured-report
          v-for="report in featuredReports"
          :key="report.id"
          :title="report.title"
          :author="report.subject.name"
          :slug="report.slug"
          :substances="report.substances"
        />
      </div>
    </template>
    <template v-slot:stub>
      For more, see the <nuxt-link to="/reports/">
        reports section.
      </nuxt-link>
    </template>
  </FrontpagePanel>
</template>

<script>
import FrontpagePanel from '@/components/home/Panel';
import FeaturedReport from '@/components/home/FeaturedReport';
import lodash from 'lodash';

const { shuffle } = lodash;

export default {
  components: {
    FeaturedReport,
    FrontpagePanel
  },

  props: {
    numberOfReports: {
      type: Number,
      default: 3
    }
  },

  computed: {
    reports() {
      return this.$store.state.reports.list;
    },
    featuredReports() {
      const shuffledReports = shuffle(this.reports.filter((report) => report.featured));
      const maxReports = this.numberOfReports;
      return shuffledReports.length >= maxReports ? shuffledReports.slice(0, maxReports) : shuffledReports;
    }
  }
};
</script>

<style scoped>
  .reportsContainer {
    padding: 12px;
  }

  .featuredReports {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }

  .featuredReport {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.75em 0.5em;
    margin: 0;
  }

  .featuredReport:not(:last-child) {
    border-bottom: 1px solid #DDD;
  }

  .featuredReport :deep(.reportInfo) {
    line-height: 1.1em;
    flex: 1;
    padding-right: 6px;
  }

  .featuredReport :deep(.reportSubstance) {
    flex: 1;
    line-height: 1em;
    padding-left: 6px;
  }

  .featuredReport :deep(.reportAuthor) {
    font-size: 0.9em;
    font-style: italic;
  }

  .featuredReport :deep(.reportSubstanceName) {
    font-size: 1em;
    color: #666;
  }

  .featuredReport :deep(.reportSubstanceDoseRoa) {
    font-size: 11pt;
    color: #666;
  }

  .featuredReport:hover {
    background-color: rgb(245, 245, 245);
  }
</style>
