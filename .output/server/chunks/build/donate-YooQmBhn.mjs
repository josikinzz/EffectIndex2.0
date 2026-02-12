import { withAsyncContext, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { F as FrontpageArticle } from './FrontpageArticle-Bn1vWTPN.mjs';
import { u as useHead } from './v3-CgnvIXc3.mjs';
import { _ as _export_sfc, a as useNuxtApp } from './server.mjs';
import { u as useAsyncData } from './asyncData-6ijb75O1.mjs';
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
import './ArticleListItem-CXUX1AI_.mjs';
import './Tag-ptDmqwln.mjs';
import './nuxt-link-ByRaPiMR.mjs';
import 'fecha';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const _imports_0 = publicAssetsURL("/ei-donate.png");
const _imports_1 = publicAssetsURL("/eth_qrcode.png");
const _sfc_main = {
  __name: "donate",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Donate" });
    const { $store } = useNuxtApp();
    [__temp, __restore] = withAsyncContext(() => useAsyncData("donate:articles", () => $store.dispatch("articles/get"))), await __temp, __restore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-377443d7><h1 data-v-377443d7> Donate `);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "heart.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`</h1>`);
      _push(ssrRenderComponent(unref(FrontpageArticle), null, null, _parent));
      _push(`<img class="float" height="350px"${ssrRenderAttr("src", _imports_0)} data-v-377443d7><p data-v-377443d7> If you would be interested in contributing to the Effect Index project we have a number of donation options available. The funds will be used for hosting costs and enable us to devote more of our time to Subjective Effect Documentation. </p><p data-v-377443d7> Any contribution is greatly appreciated! </p><h3 data-v-377443d7> Options </h3><ul data-v-377443d7><li data-v-377443d7><b data-v-377443d7>Patreon</b> - `);
      _push(ssrRenderComponent(unref(__nuxt_component_1), { href: "https://www.patreon.com/JosieKins" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Effect Index Patreon `);
          } else {
            return [
              createTextVNode(" Effect Index Patreon ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-377443d7><b data-v-377443d7>TeeSpring</b> - `);
      _push(ssrRenderComponent(unref(__nuxt_component_1), { href: "https://teespring.com/stores/effectindex" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Merchandise Store `);
          } else {
            return [
              createTextVNode(" Merchandise Store ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-377443d7><b data-v-377443d7>Paypal</b> - effectindex@gmail.com </li></ul><h3 data-v-377443d7> Ethereum </h3><div class="crypto-donation" data-v-377443d7><a href="https://etherscan.io/address/0xaaAcEF54d563CE7d3Cff5bE5cBeEcAbAf5816f78" target="_blank" data-v-377443d7><img${ssrRenderAttr("src", _imports_1)} width="132" height="132" data-v-377443d7></a><h2 data-v-377443d7><a href="https://etherscan.io/address/0xaaAcEF54d563CE7d3Cff5bE5cBeEcAbAf5816f78" target="_blank" data-v-377443d7> 0xaaAcEF54d563CE7d3Cff5bE5cBeEcAbAf5816f78 </a></h2></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/donate.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const donate = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-377443d7"]]);

export { donate as default };
//# sourceMappingURL=donate-YooQmBhn.mjs.map
