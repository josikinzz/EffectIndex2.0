<template>
  <div class="action">
    <h4 
      v-show="title"
      class="actionTitle"
    >
      <a
        v-if="page"
        :href="page"
      >
        {{ title }} 
      </a>
      <template v-else>
        {{ title }}
      </template>
    </h4>
    <ul class="actionList">
      <li 
        v-for="effect in effects"
        :key="effect._id"
        class="effectTitle"
      >
        <a :href="`/effects/${effect.url}`">
          {{ effect.name }}
        </a>
        <ul 
          v-if="effect.subarticles && effect.subarticles.length"
          class="subarticleList"
        >
          <li 
            v-for="(subarticle, index) in effect.subarticles"
            :key="index"
            class="subarticleListItem"
          >
            <a :href="`/effects/${effect.url}?s=${subarticle.id}`">
              {{ subarticle.title }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: undefined
    },
    page: {
      type: String,
      default: undefined
    },
    effects: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>

.action {
  padding: 0.5em;
}

.action:not(:last-child) {
  border-bottom: 1px solid #DDD;
}
.actionList {
  color: #AAA;
  padding: 0;
  padding-left: 1em;
  margin: 0;
  font-size: 13pt;
  columns: 250px;
}

.subarticleList {
  padding-left: 1em;
  margin: 0;
}

.actionTitle {
  font-size: 13pt;
  font-family: 'Titillium Web',-apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Helvetica Neue, Arial, sans-serif;
  color: #444;
  margin: 0;
  margin-bottom: 0.5em;
}

.effectTitle {
  margin: 0;
  padding: 0;
  line-height: 1.5em;
  margin-bottom: 0.25em;
}

.actionList:first-child .categoryTitle {
  border-top: 0;
}

</style>
