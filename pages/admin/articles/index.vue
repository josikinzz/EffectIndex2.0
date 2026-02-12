<template>
  <div class="pageContent articleManagement">
    <h1> Articles </h1>
    <nuxt-link 
      class="articleManagement__link"
      to="/admin/articles"
    >
      Articles
    </nuxt-link>
    <nuxt-link 
      class="articleManagement__link"
      to="/admin/articles/new"
    >
      New Article
    </nuxt-link>
    <NuxtPage />
  </div>
</template>

<script>
definePageMeta({ middleware: 'auth' })

  export default {
    head() {
      return {
        title: "Article Management"
      };
    }
  };
</script>

<style scoped>
  .articleManagement__link {
    display: inline-block;
    margin-right: 2em;
  }
</style>
