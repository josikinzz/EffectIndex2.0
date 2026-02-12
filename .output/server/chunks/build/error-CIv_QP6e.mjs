import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const _imports_0 = "" + buildAssetsURL("error.CZFK08xJ.png");
const _sfc_main = {
  layout: "blog",
  props: {
    error: {
      type: [Object, Error],
      default: void 0
    }
  }
  // you can set a custom layout for the error page
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "errorPageContainer" }, _attrs))} data-v-d9419dd6>`);
  if ($props.error.statusCode === 404) {
    _push(`<div class="errorMessageContainer" data-v-d9419dd6><div style="${ssrRenderStyle({})}" data-v-d9419dd6><h1 data-v-d9419dd6> 404 </h1><p data-v-d9419dd6>${ssrInterpolate($props.error.message ? $props.error.message : "")}</p></div></div>`);
  } else if ($props.error.statusCode === 401) {
    _push(`<div class="errorMessageContainer" data-v-d9419dd6><h1 data-v-d9419dd6> 401 </h1><p data-v-d9419dd6> You&#39;re not allowed everywhere. </p></div>`);
  } else {
    _push(`<div data-v-d9419dd6><h1 data-v-d9419dd6> Uh oh. </h1><p data-v-d9419dd6> Something bad happened. </p></div>`);
  }
  _push(`<div class="backContainer" data-v-d9419dd6><img${ssrRenderAttr("src", _imports_0)} style="${ssrRenderStyle({ "height": "350px" })}" alt="Indy, the Effect Index mascot, looking concerned." data-v-d9419dd6><p data-v-d9419dd6>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Return to Effect Index `);
      } else {
        return [
          createTextVNode(" Return to Effect Index ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/error.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const error = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-d9419dd6"]]);

export { error as default };
//# sourceMappingURL=error-CIv_QP6e.mjs.map
