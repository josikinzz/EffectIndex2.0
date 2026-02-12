import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { C as CaptionedImage$2 } from './vcode-DI0Nwo0O.mjs';
import { L as LongSummary } from './LongSummary-BOfGDk6f.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import './ExtLink-Ipqsfa0G.mjs';
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
    CaptionedImage: CaptionedImage$2,
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
      title: "Visual Psychedelic Effects"
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
  const _component_captioned_image = CaptionedImage$2;
  const _component_long_summary = resolveComponent("long-summary");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent effectCategories" }, _attrs))}><div>`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "eye.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`<h1> Visual Effects of Psychedelics </h1>`);
  _push(ssrRenderComponent(_component_captioned_image, {
    border: "true",
    src: "/img/gallery/In_the_tree_by_Eddie_calz.jpg",
    float: "right",
    width: "300",
    title: "In the Tree",
    artist: "Eddie Calz",
    top: "true"
  }, null, _parent));
  _push(`<div class="categoryDescription"><p> This article breaks down the subjective visual effects of the psychedelic experience into simple and easy to understand descriptions with accompanying image replications. This is done without resorting to metaphors, analogies, or personal trip reports. </p><p> These descriptions are not specific to any particular substance but are applicable to the effects which commonly occur in various forms under the influence of almost any psychedelic compound. This includes, but is not limited to, both classical and research chemical psychedelics, such as: </p><p style="${ssrRenderStyle({ "font-style": "italic" })}"> LSD, Psilocybin mushrooms, DMT, Ayahuasca, Mescaline, 5-MeO-MiPT, 2C-B, LSA, AL-LAD, ALD-52, 1P-LSD, 2C-B-Fly, 2C-C, 2C-D, 2C-E, 2C-P, 4-AcO-DMT, 4-HO-MET, 4-HO-MiPT, 5-MeO-DMT, DPT, and DOC. </p><p> The article begins with a description of the simpler effects and works its way up towards more complex experiences as it progresses. Individual effects are also summarized with a link to their full article. </p></div></div><hr><div><div class="effectsContainer"><h3 class="titleContainer"> Visual Amplifications `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "arrow-up.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Visual amplifications </b> are defined as any subjective effect that increases, enhances, or intensifies a facet of a person&#39;s sense of sight. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "visual", "enhancement"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Visual Distortions `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "distortions.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Visual distortions </b> are any subjective effect which alters and changes the perception or appearance of pre-existing visual data without adding any entirely new content. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "visual", "distortion"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Geometric Patterns `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "geometry.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Geometric patterns </b> are defined as any subjective effect that introduces complex arrays of shapes, colours, symbols, patterns, geometry, form constants, and fractals to one&#39;s field of vision. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "visual", "geometric"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Hallucinatory States `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "dragon.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Hallucinatory states </b> are any subjective effect which changes the perception or appearance of pre-existing visual data by adding entirely new content in a manner which is similar to that of dreams. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("psychedelic", "visual", "hallucinatory state"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><h3> See Also </h3><ul><li><a href="/summaries/psychedelics/cognitive"> Cognitive Psychedelic Effects </a></li><li><a href="/summaries/psychedelics/miscellaneous"> Miscellaneous Psychedelic Effects </a></li></ul></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/summaries/index/psychedelics/visual.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const visual = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { visual as default };
//# sourceMappingURL=visual-Bx-dVhEQ.mjs.map
