<template>
  <div class="pageContent">
    <Icon
      filename="images.svg"
      class="categoryIcon"
    />
    <h1> Replications </h1>
    <p>
      <span class="bold"> Replications </span> are image, video, and audio recreations of the sensory experiences produced by various subjective effects that a user may encounter under the influence of hallucinogens. Replications may be created intentionally or unintentionally, as long as they accurately convey the effect being shown. They serve the purpose of documenting certain experiences in a level of detail that descriptive language is incapable of describing.
    </p>
    <p>
      This page will serve as a dedicated index of as many replication examples as possible in the form of images, animations, and videos. These are primarily sourced from our <a href="https://reddit.com/r/replications">subreddit,</a> through dedicated artists, and from various sources throughout the internet. The artist is credited for each replication whenever possible. However, if you would like your artwork removed or its link altered, please do not hesitate to contact us at <a href="mailto:effectindex@gmail.com"> effectindex@gmail.com </a>
    </p>

    <hr>

    <h3
      ref="lightbox"
      style="text-align: center;"
    >
      <nuxt-link
        v-if="selected_effect.url"
        :to="'/effects/' + selected_effect.url"
      >
        {{ selected_effect.name }}
      </nuxt-link>
      <span v-else>
        {{ selected_effect.name || 'No effect selected' }}
      </span>
    </h3>

    <light-box
      :image-set="image_set"
      :order="gallery_order"
      base="/img/gallery/"
      @listEnd="switchEffect"
      @listStart="switchEffect(true)"
    />

    <hr>
    <h3> Effect Galleries </h3>
    <effect-selector
      :effects="replicated_effects"
      :selected="selected_effect_id"
      @effectSelected="scroll"
    />
  </div>
</template>

<script setup>
import EffectSelector from "@/components/EffectSelector.vue";
import LightBox from "@/components/gallery/LightBox.vue";
import Icon from '@/components/Icon';

useHead({ title: "Replications" });

const { $store, $scrollTo } = useNuxtApp();
const lightbox = ref(null);

await useAsyncData('replications:gallery', () => $store.dispatch("gallery/get"));

const replicated_effects = computed(() => $store.state.gallery.replicated_effects);
const replications = computed(() => $store.state.gallery.replications);
const selected_effect_id = computed(() => $store.state.gallery.selected_effect_id);

const selected_effect = computed(() => {
  const selected = replicated_effects.value.find(val => val._id === selected_effect_id.value);
  return selected || {};
});

const image_set = computed(() => {
  return replications.value.filter(
    (replication) => replication.associated_effects.includes(selected_effect_id.value)
  );
});

const gallery_order = computed(() => {
  const selected = replicated_effects.value.find(
    (effect) => (effect._id === selected_effect_id.value)
  );
  return selected ? selected.gallery_order : undefined;
});

const current_index = computed(() => {
  return replicated_effects.value.findIndex(
    val => val._id === selected_effect_id.value
  );
});

const scroll = () => {
  if (typeof $scrollTo === 'function') {
    $scrollTo(lightbox.value, 800);
  }
};

const switchEffect = (prev) => {
  if (!replicated_effects.value.length) return;

  if (!prev) {
    const index = ((current_index.value + 1) >= replicated_effects.value.length)
      ? 0
      : current_index.value + 1;
    $store.dispatch("gallery/setGallerySelectedEffect", replicated_effects.value[index]._id);
  } else {
    const index = ((current_index.value - 1) <= 0)
      ? replicated_effects.value.length - 1
      : current_index.value - 1;
    $store.dispatch("gallery/setGallerySelectedEffect", replicated_effects.value[index]._id);
  }
};
</script>
