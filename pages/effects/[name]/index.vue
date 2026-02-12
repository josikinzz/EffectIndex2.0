<template>
  <div class="pageContent">
    <article>
      <Icon
        :filename="icon"
        class="categoryIcon"
      />
      <h1>
        {{ effect.name }}
        <client-only>
          <nuxt-link
            v-if="$auth.hasScope('edit-effects') || $auth.hasScope('admin-effects')"
            :to="'/admin/effects/' + effect.url"
            append
          >
            <Icon
              filename="edit.svg"
              style="display: inline-block; margin-left: 10px; height: 20px; width: 20px;"
              color="#27635d"
            />
          </nuxt-link>
        </client-only>
      </h1>
      <vcode
        v-if="hasSection('description')"
        :data="effect"
        :body="effect.description"
      />

      <client-only>
        <div
          v-if="hasSection('replications')"
          class="effect__gallery"
        >
          <hr>
          <h3 id="replication-gallery">
            Replication Gallery
          </h3>
          <light-box
            :image-set="effect.replications"
            :order="effect.gallery_order"
            base="/img/gallery/"
          />
        </div>

        <div
          v-if="hasSection('audio_replications')"
        >
          <hr>
          <h3
            id="audio-replications"
            style="margin-bottom: 2em;"
          >
            Audio Replications
          </h3>
          <audio-player
            v-for="(replication, index) in effect.audio_replications"
            :key="index"
            :src="`/audio/${replication.resource}`"
            :title="replication.title"
            :artist="replication.artist"
          />
        </div>
      </client-only>

      <div v-if="hasSection('analysis')">
        <hr>
        <h3 id="analysis">
          Analysis
        </h3>
        <vcode
          :body="effect.analysis"
        />
      </div>

      <div
        v-if="hasSection('style_variations')"
      >
        <hr>
        <h3 id="style-variations">
          Style Variations
        </h3>
        <vcode
          :body="effect.style_variations"
        />
      </div>

      <div v-if="hasSection('personal_commentary')">
        <hr>
        <h3 id="personal-commentary">
          Personal Commentary
        </h3>
        <vcode
          :body="effect.personal_commentary"
        />
      </div>

      <div v-if="hasSection('related_reports')">
        <hr>
        <h3 id="related-reports">
          Related Reports
        </h3>
        <related-reports
          :reports="effect.related_reports"
        />
      </div>

      <div v-if="hasSection('external_links')">
        <hr>
        <div v-if="hasSection('see_also')">
          <h3 id="see-also">
            See Also
          </h3>
          <ul>
            <li
              v-for="(link, index) in effect.see_also"
              :key="index"
            >
              <nuxt-link
                :to="link.location"
              >
                {{ link.title }}
              </nuxt-link>
            </li>
          </ul>
        </div>

        <div v-if="hasSection('external_links')">
          <h3 id="external-links">
            External Links
          </h3>
          <ul>
            <li
              v-for="(link, index) in effect.external_links"
              :key="index"
            >
              <ext-link :href="link.url">
                {{ link.title }}
              </ext-link>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="hasSection('citations')">
        <hr>
        <h3 id="references">
          References
        </h3>
        <citation-list :citations="effect.citations" />
      </div>

      <div v-if="hasSection('tags')">
        <hr>
        <h3> Tags </h3>
        <tag
          v-for="tag in effect.tags"
          :key="tag"
          :value="tag"
        />
      </div>

      <div v-if="hasSection('contributors')">
        <hr>
        <h3 id="contributors">
          Contributors
        </h3>
        <p> The following people contributed to the content of this article: </p>
        <span
          v-for="contributor in effect.contributors"
          :key="contributor"
          class="contributor"
        >
          <nuxt-link :to="'/profiles/' + contributor">{{ contributor }}</nuxt-link>
        </span>
      </div>
    </article>
  </div>
</template>

<script setup>
import CitationList from "@/components/CitationList";
import LightBox from "@/components/gallery/LightBox";
import ExtLink from "@/components/ExtLink";
import Tag from "@/components/effects/Tag";
import AudioPlayer from "@/components/replications/audio/AudioPlayer";
import Icon from '@/components/Icon';
import RelatedReports from '@/components/effects/RelatedReports';

definePageMeta({ scrollToTop: true });

const route = useRoute();
const apiFetch = useApiFetch();
const defaultEffect = {
  name: '',
  summary_raw: '',
  social_media_image: '',
  tags: [],
  citations: [],
  see_also: [],
  external_links: [],
  contributors: [],
  replications: [],
  audio_replications: [],
  gallery_order: [],
  description: {},
  analysis: {},
  style_variations: {},
  personal_commentary: {},
  related_reports: []
};

const { data, error } = await useAsyncData(
  'effects:detail',
  async () => {
    const { effect } = await apiFetch(`/api/effects/${route.params.name}`);
    if (!effect) {
      throw createError({ statusCode: 404, statusMessage: 'Effect not found' });
    }
    return { effect };
  },
  { watch: [() => route.params.name] }
);

if (error.value) {
  throw error.value;
}

const effect = computed(() => data.value?.effect ?? defaultEffect);

const icon = computed(() => {
  const tags = effect.value.tags;

  const icons = {
    cognitive: "user",
    visual: "eye",
    auditory: "volume-up",
    tactile: "hand-paper",
    disconnective: "chain",
    multisensory: "cogs",
    uncomfortable: "frown",
    physical: "heart-rate",
    gustatory: "utensils",
    olfactory: "utensils",
  };

  if (Array.isArray(tags)) {
    for (let tag in icons) {
      if (tags.indexOf(tag) > -1) return icons[tag] + '.svg';
    }
  }

  return "user.svg";
});

useHead(() => ({
  title: effect.value.name,
  meta: [
    { name: 'description', hid: 'description', content: effect.value.summary_raw },
    { name: 'og:title', hid: 'og:title', content: `Effect Index - ${effect.value.name}` },
    { name: 'og:description', hid: 'og:description', content: effect.value.summary_raw },
    { name: 'og:image', hid: 'og:image', content: effect.value.social_media_image },
    { name: 'twitter:title', hid: 'twitter:title', content: `Effect Index - ${effect.value.name}` },
    { name: 'twitter:description', hid: 'twitter:description', content: effect.value.summary_raw },
    { name: 'twitter:image', hid: 'twitter:image', content: effect.value.social_media_image },
  ]
}));

const hasSection = (name) => {
  const current = effect.value;
  if (name in current) {
    const section = current[name];
    if (Array.isArray(section)) {
      if (section.length > 0) return true;
    } else if (typeof section === 'string') {
      if (section.length > 0) return true;
    } else if (section && typeof section === 'object') {
      if (section.raw && section.raw.length > 0) return true;
    }
  }
  return false;
};

const { $scrollTo } = useNuxtApp();
const scrollToSection = (section) => {
  if (!section || typeof $scrollTo !== 'function') return;
  setTimeout(() => $scrollTo('#' + section), 750);
};

onMounted(() => {
  scrollToSection(route.query.s);
});

watch(() => route.query.s, (value) => {
  scrollToSection(value);
});
</script>

<style>
.tagList {
  list-style: none;
}

hr {
  clear: both;
}

.contributor::after {
  content: ", ";
}

.contributor:last-of-type::after {
  content: "";
}
</style>
