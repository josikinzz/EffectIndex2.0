<template>
  <FrontpagePanel
    icon="flask.svg"
    title="Substance Summaries"
    description="Hallucinogenic substance classes, broken down and described"
  >
    <template
      v-slot:content 
    >
      <ul class="summaryList">
        <li class="summaryItem">
          <span style="color: #333;"> Psychedelics: </span>
          <a href="/summaries/psychedelics/visual">
            Visual,
          </a>
          <a href="/summaries/psychedelics/cognitive">
            Cognitive,
          </a>
          <a href="/summaries/psychedelics/miscellaneous">
            Miscellaneous
          </a>
        </li>
        <li class="summaryItem">
          <a href="/summaries/dissociatives">
            Dissociatives
          </a>
        </li>
        <li class="summaryItem">
          <a href="/summaries/deliriants">
            Deliriants
          </a>
        </li>
      </ul>
    </template>
    <template v-slot:stub>
      For more, see the <a href="/articles/">
        articles section.
      </a>
    </template>
  </FrontpagePanel>
</template>

<script>
import FrontpagePanel from '@/components/home/Panel';

export default {
  components: {
    FrontpagePanel
  }
};
</script>

<style scoped>

  .summaryContent {
    background-image: linear-gradient(to top, #F8F8F8 95%, #DDD 100%);
  }

  .summaryList {
    color: #DDD;
    padding: 12px;
    padding-left: calc(12px + 1em);
    margin: 0;
    width: 100%; 
  }

  .substanceSummaries {
    font-size: 13pt;
  }

  .summaryItem span {
    color: black;
  }

  .summaryItem:not(:first-child) {
    margin-top: 0.5em;
  }
</style>
