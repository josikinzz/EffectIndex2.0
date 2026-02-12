import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
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
    ExtLink: __nuxt_component_1,
    Icon: __nuxt_component_0
  },
  head() {
    return {
      title: "Copyright Disclaimer"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_ext_link = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-060c514e><h1 data-v-060c514e> Copyright Disclaimer `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "copyright.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p data-v-060c514e> EffectIndex.com and its materials, including all indexing-related and written content, are available under the `);
  _push(ssrRenderComponent(_component_ext_link, { href: "https://creativecommons.org/licenses/by-nc-sa/4.0/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Creative Commons Attribution-ShareAlike License `);
      } else {
        return [
          createTextVNode(" Creative Commons Attribution-ShareAlike License ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` for non-commercial use. Additional terms may apply; contact <a href="mailto:effectindex@gmail.com" data-v-060c514e> effectindex@gmail.com </a> for more information and commercial inquiries. </p><p data-v-060c514e> All replications, multimedia, and non-SEI artwork belong to their original creators and are protected by international copyright laws. Artwork used without the creator&#39;s permission is reproduced at diminished quality and assumed to constitute &quot;fair use&quot; for educational and non-profit purposes. If you would like your artwork removed or reattributed, please contact <a href="mailto:effectindex@gmail.com" data-v-060c514e> effectindex@gmail.com </a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/copyright-disclaimer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const copyrightDisclaimer = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-060c514e"]]);

export { copyrightDisclaimer as default };
//# sourceMappingURL=copyright-disclaimer-f29oaDqP.mjs.map
