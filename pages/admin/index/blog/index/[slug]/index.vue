<template>
  <div>
    <hr>
    <post-editor
      :post="post"
      @edit-post="submitPost"
    />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

import PostEditor from '@/components/blog/PostEditor.vue';

const route = useRoute();
const router = useRouter();
const { $store } = useNuxtApp();

const { data } = await useAsyncData(
  'admin:blog:post',
  async () => {
    const { post } = await $store.dispatch('blog/getPost', route.params.slug);
    return { post };
  },
  { watch: [() => route.params.slug] }
);

const post = computed(() => data.value?.post);

const submitPost = async (payload) => {
  payload._id = post.value?._id;
  await $store.dispatch('blog/updatePost', payload);
  router.push('/blog');
};
</script>
