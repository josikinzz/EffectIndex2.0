import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { L as LongSummary } from './LongSummary-BOfGDk6f.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import './nuxt-link-ByRaPiMR.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'module';
import './vcode-DI0Nwo0O.mjs';
import './ExtLink-Ipqsfa0G.mjs';
import './AudioPlayer-DSX_ItL1.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const _sfc_main = {
  components: {
    LongSummary,
    Icon: __nuxt_component_0
  },
  scrollToTop: true,
  data() {
    return {
      linkedEffect: this.$route.query.e
    };
  },
  head() {
    return {
      title: "Miscellaneous Psychedelic Effects"
    };
  },
  computed: {
    effects() {
      return this.$store.state.effects.list;
    }
  },
  watch: {
    "$route.query.e"(value) {
      this.linkedEffect = value;
      if (value) {
        this.$scrollTo(`#${value}`);
      }
    }
  },
  mounted() {
    if (this.linkedEffect) {
      this.$scrollTo(`#${this.linkedEffect}`);
    }
  },
  methods: {
    filterEffectsByTag(...tags) {
      return this.effects.filter(
        (effect) => tags.every((tag) => effect.tags.indexOf(tag) > -1)
      );
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_long_summary = resolveComponent("long-summary");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent effectCategories" }, _attrs))}><div>`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "cogs.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`<h1> Miscellaneous Effects of Psychedelics </h1><div class="categoryDescription"><p> This article breaks down the subjective miscellaneous effects of the psychedelic experience into simple and easy to understand descriptions with accompanying image replications. This is done without resorting to metaphor, analogy, or personal trip reports. </p><p> These descriptions are not specific to any particular substance but are applicable to the effects which commonly occur in various forms under the influence of almost any psychedelic compound. This includes, but is not limited to, both classical and research chemical psychedelics, such as: </p><p style="${ssrRenderStyle({ "font-style": "italic" })}"> LSD, Psilocybin mushrooms, DMT, Ayahuasca, Mescaline, 5-MeO-MiPT, 2C-B, LSA, AL-LAD, ALD-52, 1P-LSD, 2C-B-Fly, 2C-C, 2C-D, 2C-E, 2C-P, 4-AcO-DMT, 4-HO-MET, 4-HO-MiPT, 5-MeO-DMT, DPT, and DOC. </p><p> The article begins with a description of the simpler effects and works its way up towards more complex experiences as it progresses. Individual effects are also summarized with a link to their full article. </p></div></div><hr><div class="effectsContainer"><h3 class="titleContainer"> Auditory Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "volume-up.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Auditory effects </b> are any subjective effect which directly alters a person&#39;s sense of hearing. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "miscellaneous", "auditory"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Tactile Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "hand-paper.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Tactile effects </b> are any subjective effect which directly alters a person&#39;s sense of touch. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "miscellaneous", "tactile"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Multisensory Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "cogs.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Multisensory effects </b> are any subjective effect which directly alters two or more senses simultaneously. <br> <br> Although some hallucinatory effects may affect multiple senses at one time they are usually not categorized as &#39;multisensory effects&#39; unless they do so consistently. For example, while experiences with autonomous entities may sometimes have a tactile component to them, more often than not they are primarily a visual experience and are therefore classified as such. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "miscellaneous", "multisensory"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Physical Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "heart-rate.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Physical effects </b> are any subjective effect which directly affects an aspect of a person&#39;s physical body. <br> <br> Although many uncomfortable physical effects also technically fit into this definition, they are excluded from this category of effects as they have their own defining qualities which standard physical effects do not. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "miscellaneous", "physical").filter((effect) => !effect.tags.includes("uncomfortable")), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Uncomfortable Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "frown.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"> An <b> uncomfortable physical effect </b> is any substance-induced alteration of a person&#39;s physical state which is unpleasant, undesirable, painful, or otherwise a source of distress. In most cases they indicate a temporary part of a substance&#39;s interaction with the body. However, in certain contexts, they can also indicate the need for attention or even medical treatment if they become dangerously severe. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "miscellaneous", "uncomfortable"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><h3> See Also </h3><ul><li><a href="/summaries/psychedelics/cognitive"> Cognitive Psychedelic Effects </a></li><li><a href="/summaries/psychedelics/visual"> Visual Psychedelic Effects </a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/summaries/index/psychedelics/miscellaneous.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const miscellaneous = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { miscellaneous as default };
//# sourceMappingURL=miscellaneous-Bx788E2x.mjs.map
