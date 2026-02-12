<template>
  <div class="pageContent">
    <div v-if="person">
      <captioned-image
        v-show="person.profile_image"
        float="right"
        rounding="10px"
        :src="'/' + person.profile_image"
      />
      <h1> {{ person.full_name || person.alias }} </h1>
      <vcode
        v-if="person.bio && person.bio.parsed"
        :body="person.bio.parsed"
      />
    </div>
  </div>
</template>

<script setup>
import vcode from "@/components/vcode/vcode";
import CaptionedImage from "@/components/CaptionedImage";

const route = useRoute();
const apiFetch = useApiFetch();
const { data } = await useAsyncData(
  'people:profile',
  async () => {
    try {
      return await apiFetch(`/api/persons/${route.params.url}`);
    } catch (error) {
      console.log(error);
      return { person: undefined };
    }
  },
  { watch: [() => route.params.url] }
);

const person = computed(() => data.value?.person);

useHead(() => ({
  title: person.value?.full_name || person.value?.alias || 'People'
}));
</script>
