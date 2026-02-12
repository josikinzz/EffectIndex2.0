import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
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

const _imports_0 = publicAssetsURL("/indy_iphone_edited.png");
const _sfc_main = {
  components: {
    ExtLink: __nuxt_component_1,
    Icon: __nuxt_component_0
  },
  head() {
    return {
      title: "Discord"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_ext_link = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-039cee1d><h1 data-v-039cee1d> Discord Chat `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "discord.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><iframe class="float" src="https://discordapp.com/widget?id=543908157165142037&amp;theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" data-v-039cee1d></iframe><p data-v-039cee1d> The official Effect Index community is hosted on Discord and may be joined `);
  _push(ssrRenderComponent(_component_ext_link, { href: "https://discord.gg/VSm5bF7" }, {
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
  _push(`</p><p data-v-039cee1d> This a semi-private community and is not primarily for general conversation; instead, it aims to be a place of discussion and co-operation for progressing the field of formalised subjective effect documentation. For this reason, we tend to only invite people who genuinely want to contribute to the project. This can include anyone from proofreaders, trip reporters, web developers, programmers, replicators, artists, and more. </p><p data-v-039cee1d> If you have an interest in contributing to and taking part in our community&#39;s various projects, please contact us within the public waiting room channel and tell us why you are interested in this project. Thanks! </p><h3 data-v-039cee1d> Rules </h3><ul class="rulesList" data-v-039cee1d><li data-v-039cee1d>You must be at least 18+ years old.</li><li data-v-039cee1d>Please be polite and reasonable.</li><li data-v-039cee1d>You may not discuss any drug sources. Not even in DMs.</li><li data-v-039cee1d>Keep specific topics within their relevant channels.</li><li data-v-039cee1d>This community is inclusive and does not accept any kind of racism, homophobia, sexism, transphobia, ableism, general hatefulness, etc, etc. </li><li data-v-039cee1d>This community is relatively Safe For Work (SFW), please do not post overtly sexual or edgy content. This includes hornyposting and excessive shitposting.</li></ul><img height="350px" class="left"${ssrRenderAttr("src", _imports_0)} data-v-039cee1d></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/discord.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const discord = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-039cee1d"]]);

export { discord as default };
//# sourceMappingURL=discord-B_83lMuJ.mjs.map
