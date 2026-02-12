import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { L as LongSummary } from './LongSummary-BOfGDk6f.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const _imports_0 = publicAssetsURL("/icons/disconnective.svg");
const _sfc_main = {
  name: "Dissociatives",
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
      title: "Dissociative Effects"
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
    },
    getEffectsInSpecificOrder(...names) {
      let effects = [];
      names.forEach((name) => {
        let foundEffect = this.effects.find((effect) => effect.name.toLowerCase() === name.toLowerCase());
        if (foundEffect) effects.push(foundEffect);
      });
      return effects;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_long_summary = resolveComponent("long-summary");
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent effectCategories" }, _attrs))}><div><img style="${ssrRenderStyle({ "opacity": "0.6" })}" class="fa categoryIcon"${ssrRenderAttr("src", _imports_0)}><h1> Subjective Effects of Dissociatives </h1><div class="categoryDescription"><p><b> Dissociatives </b> are a class of hallucinogen which distort perceptions of sight and sound to produce feelings of disconnection, detachment, and dissociation from the environment and self. These effects occur due to the way in which these compounds function as NMDA receptor antagonists. This means they bind to receptors in the brain but do not activate them, thus blocking other neurotransmitters from doing so. The result is a dose-dependent decrease in the passing of electrical signals across the brain and an overall disconnection of neurons, which leads to states of disconnection between conscious parts of the brain and its sensory organs. </p><p> This article breaks down the subjective effects of the dissociative experience into simple and easy to understand descriptions with accompanying image replications. This is done without resorting to metaphor, analogy, or personal trip reports. </p><p> These descriptions are not specific to any particular substance but are applicable to the effects which commonly occur in various forms under the influence of almost any dissociative compound. This includes, but is not limited to, both classical and research chemical dissociatives, such as: </p><p><i> Ketamine, MXE, PCP, DXM, DCK, 3-MeO-PCP, O-PCE, 3-HO-PCE, 3-HO-PCP, 3-MeO-PCE, 4-MeO-PCP, PCE, Diphenidine, Ephenidine, Methoxphenidine </i></p><p> Individual effects are also summarized with a prominent link to their full article. </p></div></div><hr><div class="effectsContainer"><h3 class="titleContainer"> Disconnective Effects <img style="${ssrRenderStyle({ "opacity": "0.8" })}" class="actionIcon"${ssrRenderAttr("src", _imports_0)}></h3><p class="actionDescription"><b> Disconnective effects </b> are any subjective effect which feels as if it detaches or disconnects one from the external environment, their senses, and their consciousness. <br> <br> These effects are typically associated with dissociative hallucinogens and likely occur due to the way in which these compounds function as NMDA receptor antagonists. This means they bind to the receptor, but do not activate it and block other neurotransmitters from doing so. The result is a dose-dependent decrease in the passing of electrical signals across the brain and an overall disconnection of neurons, which leads to states of disconnection between conscious parts of the brain and its sensory organs. </p><!--[-->`);
  ssrRenderList($options.getEffectsInSpecificOrder(
    "physical disconnection",
    "cognitive disconnection",
    "visual disconnection",
    "detachment plateaus"
  ), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><div class="effectsContainer"><h3 class="titleContainer"> Miscellaneous Sensory Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "cogs.svg",
    class: "actionIcon"
  }, null, _parent));
  _push(`</h3><p class="actionDescription"> In this context, <b> miscellaneous sensory effects </b> are any subjective experience which alters a person&#39;s visual, tactile, or gustatory senses. </p><!--[-->`);
  ssrRenderList($options.filterEffectsByTag("dissociative", "sensory").filter((effect) => effect.tags.indexOf("disconnective") === -1), (effect, i) => {
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
  ssrRenderList($options.filterEffectsByTag("dissociative", "cognitive").filter((effect) => !effect.tags.includes("disconnective")), (effect, i) => {
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
  ssrRenderList($options.filterEffectsByTag("dissociative", "physical").filter((effect) => !effect.tags.includes("uncomfortable")), (effect, i) => {
    _push(ssrRenderComponent(_component_long_summary, {
      key: effect._id,
      index: i,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></div><h3> See Also </h3><ul><li><a href="/summaries/psychedelics/visual"> Visual Psychedelic Effects </a></li><li><a href="/summaries/deliriants/"> Deliriant Subjective Effects </a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/summaries/index/dissociatives/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-4XH0mkoR.mjs.map
