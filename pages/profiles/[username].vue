<template>
  <div class="pageContent">
    <div v-if="profile.username">
      <h1>{{ profile.username }}</h1>
      <profile-image
        :filename="profile.profileImageFull"
        :username="profile.username"
      />
      <!-- eslint-disable-next-line -->
      <div v-if="profile.body" v-html="$md.render(profile.body)"
      />
      <div
        v-if="replications.length > 0"
        style="clear: both; margin-top: 2em;"
      >
        <hr>
        <h3>Replications</h3>
        <light-box
          :image-set="replications"
          base="/img/gallery/"
        />
      </div>
    </div>
    <div v-else>
      <h1>Profile not found</h1>
    </div>
  </div>
</template>

<script setup>
import ProfileImage from "@/components/profiles/ProfileImage.vue";
import LightBox from "@/components/gallery/LightBox.vue";

definePageMeta({ scrollToTop: true });

const route = useRoute();
const { $store } = useNuxtApp();

const { data } = await useAsyncData(
  'profiles:detail',
  async () => {
    const username = route.params.username;
    const { profile } = await $store.dispatch("profiles/getProfileByName", username);
    if (!profile) {
      return { profile: {}, replications: [] };
    }
    const { replications } = await $store.dispatch(
      "replications/getReplicationsByArtist",
      username
    );
    return { profile, replications };
  },
  { watch: [() => route.params.username] }
);

const profile = computed(() => data.value?.profile || {});
const replications = computed(() => data.value?.replications || []);

useHead(() => ({
  title: profile.value?.username || 'Profile',
  meta: [
    { name: 'description', hid: 'description', content: `Profile of Effect Index contributor ${profile.value?.username || ''}` },
    { name: 'og:title', hid: 'og:title', content: `Effect Index - ${profile.value?.username || ''}` },
    { name: 'og:description', hid: 'og:description', content: `Profile of Effect Index contributor ${profile.value?.username || ''}` },
    { name: 'og:image', hid: 'og:image', content: profile.value?.profileImageFull ? `/img/profiles/${profile.value.profileImageFull}` : undefined },
    { name: 'twitter:title', hid: 'twitter:title', content: `Effect Index - ${profile.value?.username || ''}` },
    { name: 'twitter:description', hid: 'twitter:description', content: `Profile of Effect Index contributor ${profile.value?.username || ''}` },
    { name: 'twitter:image', hid: 'twitter:image', content: profile.value?.profileImageFull ? `/img/profiles/${profile.value.profileImageFull}` : undefined },
  ].filter((meta) => meta.content)
}));
</script>
