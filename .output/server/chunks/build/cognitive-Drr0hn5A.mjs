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
      title: "Cognitive Psychedelic Effects"
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
    filename: "user.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`<h1> Cognitive Effects of Psychedelics </h1><div class="categoryDescription"><p> This article breaks down the subjective cognitive effects of the psychedelic experience into simple and easy to understand descriptions with accompanying image replications. This is done without resorting to metaphor, analogy, or personal trip reports. </p><p> These descriptions are not specific to any particular substance but are applicable to the effects which commonly occur in various forms under the influence of almost any psychedelic compound. This includes, but is not limited to, both classical and research chemical psychedelics, such as: </p><p style="${ssrRenderStyle({ "font-style": "italic" })}"> LSD, Psilocybin mushrooms, DMT, Ayahuasca, Mescaline, 5-MeO-MiPT, 2C-B, LSA, AL-LAD, ALD-52, 1P-LSD, 2C-B-Fly, 2C-C, 2C-D, 2C-E, 2C-P, 4-AcO-DMT, 4-HO-MET, 4-HO-MiPT, 5-MeO-DMT, DPT, and DOC. </p><p> The article begins with a description of the simpler effects and works its way up towards more complex experiences as it progresses. Individual effects are also summarized with a link to their full article. </p></div></div><hr><div class="effectsContainer"><h3 class="titleContainer"> Cognitive Amplifications `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "arrow-up.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Cognitive amplifications </b> are defined as any subjective effect that increases, enhances, or intensifies a facet of a person&#39;s sense of cognition. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "cognitive", "enhancement"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Cognitive Suppressions `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "arrow-down.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Cognitive suppressions </b> are any subjective effect which decreases or lowers the intensity of an aspect of a person&#39;s cognition. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "cognitive", "suppression"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Novel States `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "lightbulb.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"> A <b> novel cognitive state </b> is any cognitive effect which does not merely amplify or suppress familiar states of mind, but rather induces an experience that is qualitatively different from that of ordinary consciousness. <br> <br> Although many transpersonal and psychological effects also technically fit into this definition, they are excluded from this category of effects as they have their own defining qualities which standard novel states do not. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "cognitive", "novel"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Psychological States `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "psychological.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Psychological effects </b> are any cognitive effect that is either established within the psychological literature or arises as a result of the complex interplay between other more simplistic components such as cognitive enhancements and suppressions. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "cognitive", "psychological state"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Transpersonal States `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "infinity.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Transpersonal states </b> are any subjective effect which feels as if it alters a person&#39;s cognition in a manner which relates to or contains information regarding their place in the universe, the inner workings of reality or consciousness, and the context of their existence. The fullest manifestation of these effects fall under what are sometimes called &quot;peak&quot;, &quot;transcendent&quot; or &quot;transformative&quot; experiences. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "cognitive", "transpersonal state"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><h3> See Also </h3><ul><li><a href="/summaries/psychedelics/visual"> Visual Psychedelic Effects </a></li><li><a href="/summaries/psychedelics/miscellaneous"> Miscellaneous Psychedelic Effects </a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/summaries/index/psychedelics/cognitive.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cognitive = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { cognitive as default };
//# sourceMappingURL=cognitive-Drr0hn5A.mjs.map
