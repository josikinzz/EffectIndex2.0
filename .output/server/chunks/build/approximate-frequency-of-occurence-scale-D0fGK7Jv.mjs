import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
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
    Icon: __nuxt_component_0
  },
  head() {
    return {
      title: "Approximate Frequency of Occurence Scale"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1> Approximate Frequency of Occurence Scale `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "percent.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p> This rating scale serves as a tool for providing approximations of the likelihood that a given subjective effect will occur. </p><p> It is primarily used within our substance documentation articles that can be found among substance articles `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/articles/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` here. `);
      } else {
        return [
          createTextVNode(" here. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</p><ul><li><b>Rare</b> - At this frequency, the effect typically only occurs spontaneously for a small percentage of people. It may also never arise for many people, no matter how many times they use the substance. </li><li><b>Uncommon</b> - At this frequency, the effect will typically occur at some point over the course of multiple experiences, but will usually be absent more often than not. </li><li><b>Commmon</b> - At this frequency, the effect typically occurs for people during most of their experiences, but is often slightly inconsistent in its occurrence.</li><li><b>Frequent</b> - At this frequency, the effect typically occurs for most people during all of their experiences, to the extent that it is unusual if it does not happen.</li><li><b>Near-universal</b> - At this frequency, the effect typically occurs for the vast majority of people during their experiences. However, there is still always the possibility that it may not happen for certain individuals. </li></ul><hr><h3>See Also</h3><ul><li>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/methodology/duration-terminology" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Duration terminology `);
      } else {
        return [
          createTextVNode(" Duration terminology ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Subjective Effect Index `);
      } else {
        return [
          createTextVNode(" Subjective Effect Index ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/articles/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Articles `);
      } else {
        return [
          createTextVNode(" Articles ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/methodology/approximate-frequency-of-occurence-scale.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const approximateFrequencyOfOccurenceScale = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { approximateFrequencyOfOccurenceScale as default };
//# sourceMappingURL=approximate-frequency-of-occurence-scale-D0fGK7Jv.mjs.map
