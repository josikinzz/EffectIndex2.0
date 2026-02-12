import { C as CaptionedImage$2 } from './vcode-DI0Nwo0O.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { L as LongSummary } from './LongSummary-BOfGDk6f.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const _imports_0 = publicAssetsURL("/icons/deliriant.svg");
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
      title: "Deliriant Effects"
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
  const _component_captioned_image = CaptionedImage$2;
  const _component_Icon = __nuxt_component_0;
  const _component_long_summary = resolveComponent("long-summary");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent effectCategories" }, _attrs))}><div><img${ssrRenderAttr("src", _imports_0)} class="fa categoryIcon"><h1> Subjective Effects of Deliriants </h1>`);
  _push(ssrRenderComponent(_component_captioned_image, {
    border: true,
    src: "/img/gallery/deliriants.jpg",
    align: "right",
    width: "300",
    title: "700mg Diphenhydramine",
    artist: "Stas Constantine",
    top: "true"
  }, null, _parent));
  _push(`<div class="categoryDescription"><p><b> Deliriants </b> are a class of hallucinogen that are unique in that they offer solid hallucinations which display themselves seamlessly into waking consciousness, similar to fully formed dreams. These hallucinations are also characterised by delusions and psychosis as they are most often immediately accepted as reality by the person experiencing them. In contrast, classical psychedelics and dissociatives have progressive levels of multiple all-encompassing sensory effects before reaching the level of concrete hallucination. They also rarely induce psychosis, with most people maintaining an understanding that they are simply under the influence of a substance throughout any hallucinations which they undergo. </p><p> Outside of these delirious external hallucinations, deliriant trips are primarily characterised by incredibly uncomfortable and often dangerous physical side effects alongside deep feelings of fear, anxiety, and confusion. It is because of this that deliriant substances hold no therapeutic or recreational potential and are instead merely curiosities that should not be experimented with by any but the most experienced of psychonauts. </p><p> This article breaks down the subjective effects of the deliriant experience into simple and easy to understand descriptions with accompanying image replications. This is done without resorting to metaphor, analogy, or personal trip reports. </p><p> These descriptions are not specific to any particular substance but are applicable to the effects which commonly occur in various forms under the influence of almost any deliriant compound. This includes, but is not limited to, both synthetic and plant based deliriants, such as: </p><p><i> diphenhydramine (DPH), datura, atropine, hyoscyamine, scopolamine, dimenhydrinate, doxylamine, benzydamine, elemicin, brugmansia, atropa belladonna, hyoscyamus niger, mandragora officinarum </i></p><p> Individual effects are also summarized with a prominent link to their full article. </p></div></div><hr><div class="effectsContainer"><h3 class="titleContainer"> Visual Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "eye.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Visual effects </b> are any subjective experience which directly alters a person&#39;s sense of sight. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("deliriant", "visual"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Auditory Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "volume-up.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Auditory effects </b> are any subjective effect which directly alters a person&#39;s sense of hearing. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("deliriant", "auditory"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Tactile Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "paper.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Tactile effects </b> are any subjective effect which directly alters a person&#39;s sense of touch. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("deliriant", "tactile"), (effect, i) => {
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
  ssrRenderList($options.filterEffectsByTag("deliriant", "multisensory"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Cognitive Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "user.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"><b> Cognitive effects </b> are any subjective experience which directly alter or introduce new content to an element of a person&#39;s cognition. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("deliriant", "cognitive"), (effect, i) => {
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
  _push(`</h3><p class="actionDescription"><b> Physical effects </b> are any subjective experience which directly affects an aspect of a person&#39;s physical body. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("deliriant", "physical").filter((effect) => !effect.tags.includes("uncomfortable")), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Uncomfortable Physical Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "frown.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"> An <b> uncomfortable physical effect </b> is any substance-induced alteration of a person&#39;s physical state which is unpleasant, undesirable, painful, or otherwise a source of distress. In most cases they indicate a temporary part of a substance&#39;s interaction with the body. However, in certain contexts, they can also indicate the need for attention or even medical treatment if they become dangerously severe. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("deliriant", "uncomfortable"), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><h3> See Also </h3><ul><li><a href="/summaries/psychedelics/visual"> Visual Psychedelic Effects </a></li><li><a href="/summaries/dissociatives/"> Dissociative Subjective Effects </a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/summaries/index/deliriants/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-mDP6EQ7W.mjs.map
