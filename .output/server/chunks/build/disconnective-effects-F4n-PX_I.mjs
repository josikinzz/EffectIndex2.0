import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
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
    Icon: __nuxt_component_0
  },
  scrollToTop: true,
  head() {
    return {
      title: "Disconnective Effects"
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
  _push(` - Disconnective Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "disconnective.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p><b>Disconnective effects</b> are defined as any subjective effect that feels as if it disconnects one from the external environment, their senses, and/or their consciousness. </p><p> These effects are typically associated with `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects/dissociative-intensity-scale" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` dissociative hallucinogens `);
      } else {
        return [
          createTextVNode(" dissociative hallucinogens ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` and likely occur due to the way in which these compounds function as NMDA receptor antagonists. This means they bind to receptors in the brain but do not activate them, thus blocking other neurotransmitters from doing so. The result is a dose-dependent decrease in the passing of electrical signals across the brain and an overall disconnection of neurons, which leads to states of disconnection between conscious parts of the brain and its sensory organs. </p><p> This page lists the various disconnective effects that can occur under the influence of certain psychoactive compounds. </p><hr>`);
  _push(ssrRenderComponent(_component_EffectList, {
    effects: $options.effects,
    tags: ["disconnective"]
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories/index/disconnective-effects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const disconnectiveEffects = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { disconnectiveEffects as default };
//# sourceMappingURL=disconnective-effects-F4n-PX_I.mjs.map
