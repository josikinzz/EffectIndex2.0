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
      title: "Duration terminology"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1> Duration Terminology `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "clock.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p> The term <b>duration</b> refers to the length of time over which the subjective effects of a psychoactive compound manifest themselves. This can be further broken down into five distinct phases which are described and documented below: </p><ul><li><b>Total</b> - The total duration of a substance can be defined as the amount of time it takes for the drug\u2019s effects to completely wear off into sobriety. </li><li><b>Onset</b> - The onset of action is defined as the period of time until the first noticeable changes in perception become apparent. </li><li><b>Come up</b> - The \u201Ccome up\u201D is defined as the period between the first noticeable changes in perception and highest intensity of subjective effects. This is colloquially known as \u201Ccoming up.\u201D </li><li><b>Peak</b> - The peak can be defined as the height of intensity for the substance\u2019s effects. </li><li><b>Offset</b> - The offset can be defined as the amount of time between feeling the full effects and coming down into sobriety. This is colloquially known as \u201Ccoming down.\u201D </li><li><b>After effects</b> - The after effects can be defined as any residue effects which may last after the experience itself. This is colloquially known as a \u201Changover\u201D or an \u201Cafterglow\u201D depending on the substance. </li></ul><hr><h3>See Also</h3><ul><li>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/methodology/approximate-frequency-of-occurence-scale" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Approximate frequency of occurence scale `);
      } else {
        return [
          createTextVNode(" Approximate frequency of occurence scale ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/methodology/duration-terminology.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const durationTerminology = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { durationTerminology as default };
//# sourceMappingURL=duration-terminology-BGP6dnw8.mjs.map
