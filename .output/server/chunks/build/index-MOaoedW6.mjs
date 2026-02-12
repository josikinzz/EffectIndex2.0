import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const _sfc_main$1 = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    page: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: void 0
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "indexCategory" }, _attrs))} data-v-e0b0280e><h4 data-v-e0b0280e>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: `/categories/${$props.page}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($props.name)}`);
      } else {
        return [
          createTextVNode(toDisplayString($props.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  if ($props.icon) {
    _push(ssrRenderComponent(_component_Icon, { filename: $props.icon }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</h4><p data-v-e0b0280e>${ssrInterpolate($props.description)}</p></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/IndexCategory.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const IndexCategory = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-e0b0280e"]]);
const _sfc_main = {
  components: {
    Icon: __nuxt_component_0,
    IndexCategory
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_IndexCategory = resolveComponent("IndexCategory");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent effectCategories" }, _attrs))}><h1> Effect Categories `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "sitemap.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p> This page serves as an index of the various categories of effect found within our `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Subjective Effect Index. `);
      } else {
        return [
          createTextVNode(" Subjective Effect Index. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</p><hr>`);
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Visual Effects",
    description: "Visual effects are defined as any subjective effect that directly alters a person's sense of sight. ",
    page: "visual-effects",
    icon: "eye.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Visual Amplifications",
    description: "Visual amplifications are defined as any subjective effect that increases, enhances, accelerates, or intensifies a facet of a person's sense of sight.",
    page: "visual-amplifications",
    icon: "arrow-up.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Visual Suppressions",
    description: "Visual suppressions are defined as any subjective effect that decreases a person's ability to perceive the external environment through their sense of sight. ",
    page: "visual-suppressions",
    icon: "arrow-down.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Visual Distortions",
    description: "Visual distortions are defined as any subjective effect that alters the perception or appearance of pre-existing visual data without adding any entirely new content. ",
    page: "visual-distortions",
    icon: "distortions.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Geometric Patterns",
    description: "Geometric patterns are defined as any subjective effect that introduces complex arrays of shapes, colours, symbols, patterns, geometry, form constants, and fractals to one's field of vision. ",
    page: "geometric-patterns",
    icon: "geometry.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Hallucinatory Effects",
    description: "Hallucinatory states are defined as any subjective effect that changes the perception or appearance of pre-existing sensory data by adding entirely new content in a manner similar to that of dreams. ",
    page: "hallucinatory-states",
    icon: "dragon.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Auditory Effects",
    description: "Effects that directly alter a person's sense of hearing.",
    page: "auditory-effects",
    icon: "volume-up.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Smell & Taste Effects",
    description: "Smell and taste effects are defined as any subjective effect that directly alters either a person's sense of smell or taste.",
    page: "smell-and-taste-effects",
    icon: "utensils.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Tactile Effects",
    description: "Tactile effects are defined as any subjective effect that directly alters a person's sense of touch. ",
    page: "tactile-effects",
    icon: "hand-paper.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Multisensory Effects",
    description: "Multisensory effects are defined as any subjective effect that directly alters two or more senses at a time. ",
    page: "multisensory-effects",
    icon: "cogs.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Disconnective Effects",
    description: "Disconnective effects are defined as any subjective effect that feels as if it disconnects one from the external environment, their senses, and/or their consciousness. ",
    page: "disconnective-effects",
    icon: "disconnective.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Cognitive Effects",
    description: "Cognitive effects are subjective effects that directly alter or introduce new content to an element of a person's cognition. ",
    page: "cognitive-effects",
    icon: "user.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Cognitive Amplifications",
    description: "Cognitive amplifications are defined as any subjective effect that increases, enhances, accelerates, or intensifies a facet of a person's cognition. ",
    page: "cognitive-amplifications",
    icon: "arrow-up.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Cognitive Suppressions",
    description: "Cognitive suppressions are defined as any subjective effect that decreases the intensity of a facet of a person's cognition. ",
    page: "cognitive-suppressions",
    icon: "arrow-down.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Novel Cognitive States",
    description: "Novel cognitive states are defined as any cognitive effect that does not merely amplify or suppress familiar states of mind; rather, it induces an experience that is qualitatively different from that of ordinary consciousness. ",
    page: "novel-cognitive-states",
    icon: "lightbulb.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Psychological States",
    description: "Psychological states are defined as any cognitive effect that is either established within the psychological literature or arises as a result of the complex interplay between more simplistic components such as cognitive enhancements and suppressions.",
    page: "psychological-states",
    icon: "psychological.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Transpersonal States",
    description: "Transpersonal states are defined as any subjective effect that feels as if it alters a person's cognition in a manner that relates to their place in the universe, the inner workings of reality or consciousness, and/or the context of their existence. The highest manifestations of these effects fall under what are commonly known as 'peak', 'transcendent' or 'transformative' experiences. ",
    page: "transpersonal-states",
    icon: "infinity.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Physical Effects",
    description: "Physical effects are subjective effects that directly alter a person's perception of their physical body or its physiological functions. ",
    page: "physical-effects",
    icon: "heart-rate.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Physical Amplifications",
    description: "Physical amplifications are defined as any subjective effect that increases, enhances, accelerates, or intensifies a facet of a person's physical body.",
    page: "physical-amplifications",
    icon: "arrow-up.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Physical Suppressions",
    description: "Physical suppressions are defined as any subjective effect that decreases or reduces a facet of a person's physical body. ",
    page: "physical-suppressions",
    icon: "arrow-down.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Physical Alterations",
    description: "Physical alterations are defined as any subjective effect that changes a facet of a person's physical body in a manner which is not uncomfortable and does not involve a clearly definable enhancement or suppression.",
    page: "physical-alterations",
    icon: "cogs.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Uncomfortable Physical Effects",
    description: "Uncomfortable physical effects are defined as any substance-induced alteration of a person's physical state that is unpleasant, undesirable, painful, or otherwise a source of distress.",
    page: "uncomfortable-physical-effects",
    icon: "frown.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Cardiovascular Effects",
    description: "Cardiovascular effects are defined as any uncomfortable physical effect that relates to the heart and blood vessels. ",
    page: "cardiovascular-effects",
    icon: "heart.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Neurological Effects",
    description: "Neurological effects are defined as any uncomfortable physical effect that relates to the brain and its blood vessels. ",
    page: "neurological-effects",
    icon: "brain.svg"
  }, null, _parent));
  _push(ssrRenderComponent(_component_IndexCategory, {
    name: "Uncomfortable Bodily Effects",
    description: "Uncomfortable bodily effects are defined as any uncomfortable physical effect that relates to the overall body and cannot be categorized as cardiovascular or cerebrovascular.",
    page: "uncomfortable-bodily-effects",
    icon: "child.svg"
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories/index/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-MOaoedW6.mjs.map
