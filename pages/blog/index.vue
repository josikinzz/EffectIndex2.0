<template>
  <div class="pageContent blog">
    <blog-post
      v-for="post in blogPosts"
      :key="post._id"
      :post="post"
      @delete-post="deletePost"
    />
  </div>
</template>

<script setup>
import BlogPost from "@/components/blog/Post.vue";

definePageMeta({ scrollToTop: true });
useHead({ title: "Blog" });

const { $store } = useNuxtApp();
await useAsyncData('blog:posts', () => $store.dispatch("blog/getPosts"));

const blogPosts = computed(() => $store.state.blog.posts);

const deletePost = async (id) => {
  await $store.dispatch("blog/deletePost", id);
};
</script>


<style>
.blogPost {
  padding-bottom: 2em;
  margin-bottom: 3em;
  border-bottom: 1px solid #ddd;
}

.blogPost:last-of-type {
  border-bottom: 0;
}
</style>
