import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { mergeProps, useSSRContext } from 'vue';
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
      title: "Contact"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1> Contact Us `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "envelope.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p> To collectively contact the staff members of this site, please email us at <a href="mailto:effectindex@gmail.com"> effectindex@gmail.com. </a> However, if you would like to contact the site founder directly, please refer to the contact information below: </p><ul><li><b>Discord</b> - josikinz#1066</li><li><b>Reddit</b> - /u/josikins</li><li><b>Email</b> - <a href="mailto:disregardeverythingisay@gmail.com"> disregardeverythingisay@gmail.com </a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { contact as default };
//# sourceMappingURL=contact-Crg3IRwH.mjs.map
