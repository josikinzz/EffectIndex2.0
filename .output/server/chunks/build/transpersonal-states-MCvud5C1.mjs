import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
import { E as EffectList } from './EffectList-C9D0GNuL.mjs';
import { resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = {
  components: {
    EffectList,
    ExtLink: __nuxt_component_1,
    Icon: __nuxt_component_0
  },
  scrollToTop: true,
  head() {
    return {
      title: "Transpersonal States"
    };
  },
  computed: {
    effects() {
      return this.$store.state.effects.list;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Icon = __nuxt_component_0;
  const _component_ext_link = __nuxt_component_1;
  const _component_EffectList = resolveComponent("EffectList");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/categories/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Effect Categories `);
      } else {
        return [
          createTextVNode(" Effect Categories ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` - Transpersonal States `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "infinity.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p><b>Transpersonal states</b> are defined as any subjective state that feels as if it alters a person&#39;s cognition in a manner that relates to their place in the universe, the inner workings of reality or consciousness, and/or the context of their existence. The highest manifestations of these effects fall under what are commonly known as &quot;peak&quot;, &quot;transcendent&quot;, &quot;mystical&quot;, or &quot;transformative&quot; experiences. </p><p> These effects are typically associated with high dose `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects/psychedelic-intensity-scale" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` psychedelic `);
      } else {
        return [
          createTextVNode(" psychedelic ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` or `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects/dissociative-intensity-scale" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` dissociative `);
      } else {
        return [
          createTextVNode(" dissociative ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` experiences. They can occur regardless of the person&#39;s spiritual or religious beliefs and often have a distinct and lasting impact on the user&#39;s perspective of the world around them. During the experience of a substance-induced transpersonal state, the information conveyed is often felt to be a real and objective truth. However, the person will sometimes come to disagree with these supposed &quot;epiphanies&quot; once the effects of the substance have worn off. </p><p> The majority of effects listed within this category are largely relevant to the qualitative questions included within the `);
  _push(ssrRenderComponent(_component_ext_link, { href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3539773/#S2title" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Mystical Experiences Questionare, `);
      } else {
        return [
          createTextVNode(" Mystical Experiences Questionare, ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` a well established series of 30 standardized questions that has been developed as a scientific criteria for measuring the presence and intensity of hallucinogen induced mystical experiences. </p><p> It should also be noted that these mind-states are the least reproducible of all effects within the `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects/" }, {
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
  _push(` Simply taking more of a given substance does not necessarily increase the chances of having these states occur. Instead, they seem to rely more on contextual factors, such as the person&#39;s set and setting. </p><p> This page lists the various transpersonal effects that can occur under the influence of certain psychoactive compounds. </p><hr>`);
  _push(ssrRenderComponent(_component_EffectList, {
    effects: $options.effects,
    tags: ["transpersonal state"]
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories/index/transpersonal-states.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const transpersonalStates = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { transpersonalStates as default };
//# sourceMappingURL=transpersonal-states-MCvud5C1.mjs.map
