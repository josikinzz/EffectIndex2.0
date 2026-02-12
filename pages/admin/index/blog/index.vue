<template>
  <div class="pageContent blogManagement">
    <h1> Blog </h1>
    <nuxt-link 
      class="blogManagement__link"
      to="/admin/blog/list"
    >
      List Posts
    </nuxt-link>
    <nuxt-link 
      class="blogManagement__link"
      to="/admin/blog/new"
    >
      New Post
    </nuxt-link>
    <NuxtPage />
  </div>
</template>

<script>
definePageMeta({ middleware: 'auth' })

  export default {
    head() {
      return {
        title: "Modify Blog"
      };
    }
  };
</script>

<style scoped>
  .blogManagement__link {
    display: inline-block;
    margin-right: 2em;
  }
</style>
