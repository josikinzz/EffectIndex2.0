<template>
  <div class="pageContent blog">
    <blog-post
      v-if="post"
      :post="post"
      @delete-post="deletePost"
    />

    <nuxt-link to="/blog">
      ... back
    </nuxt-link>
  </div>
</template>

<script setup>
import BlogPost from "@/components/blog/Post.vue";

const route = useRoute();
const router = useRouter();
const { $store } = useNuxtApp();

const { data } = await useAsyncData(
  'blog:post',
  async () => {
    try {
      return await $store.dispatch("blog/getPost", route.params.slug);
    } catch (err) {
      throw createError({ statusCode: 404, statusMessage: err?.message || 'Post not found' });
    }
  },
  { watch: [() => route.params.slug] }
);

const post = computed(() => data.value?.post);

useHead(() => ({
  title: post.value?.title || "Blog"
}));

const deletePost = async (id) => {
  await $store.dispatch("blog/deletePost", id);
  router.push("/blog/");
};
</script>


<style scoped>
.blogPost {
  padding-bottom: 2em;
  margin-bottom: 3em;
  border-bottom: 1px solid #ddd;
}

.blogPost:last-of-type {
  border-bottom: 0;
}
</style>
