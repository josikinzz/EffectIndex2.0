import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as _export_sfc, a as useNuxtApp } from './server.mjs';
import { u as useHead } from './v3-CgnvIXc3.mjs';
import { u as useAsyncData } from './asyncData-6ijb75O1.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Contributors" });
    const { $store } = useNuxtApp();
    [__temp, __restore] = withAsyncContext(() => useAsyncData("profiles:list", () => $store.dispatch("profiles/get"))), await __temp, __restore();
    const profiles = computed(() => $store.state.profiles.list);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-427e1331><h1 data-v-427e1331> People `);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "users.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`</h1><p data-v-427e1331> This page lists the profiles of the Effect Index team and various dedicated individuals who have contributed significant amounts of work to this project. </p><ul class="profileList" data-v-427e1331><!--[-->`);
      ssrRenderList(unref(profiles), (profile) => {
        _push(`<li class="profileListItem" data-v-427e1331>`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: "/profiles/" + profile.username
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", "/img/profiles/cropped/" + profile.profileImageCropped)}${ssrRenderAttr("alt", profile.username)} class="profileImage" data-v-427e1331${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: "/img/profiles/cropped/" + profile.profileImageCropped,
                  alt: profile.username,
                  class: "profileImage"
                }, null, 8, ["src", "alt"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="profile__username" data-v-427e1331>${ssrInterpolate(profile.username)}</span></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profiles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-427e1331"]]);

export { index as default };
//# sourceMappingURL=index-IUwXYgyr.mjs.map
