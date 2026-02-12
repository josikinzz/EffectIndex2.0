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
      title: "Smell and Taste Effects"
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
  _push(` - Smell and Taste effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "utensils.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p><b>Smell and taste effects</b> are defined as any subjective effect that directly alters either a person&#39;s sense of smell or taste. </p><p> This page lists the various smell and taste effects that can occur under the influence of certain psychoactive compounds. </p><hr>`);
  _push(ssrRenderComponent(_component_EffectList, {
    effects: $options.effects,
    tags: ["smell and taste"]
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories/index/smell-and-taste-effects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const smellAndTasteEffects = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { smellAndTasteEffects as default };
//# sourceMappingURL=smell-and-taste-effects-CBOWMOij.mjs.map
