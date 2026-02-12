import { withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { C as CaptionedImage$2, _ as _sfc_main$1 } from './vcode-DI0Nwo0O.mjs';
import { i as useRoute, j as useApiFetch } from './server.mjs';
import { u as useAsyncData } from './asyncData-6ijb75O1.mjs';
import { u as useHead } from './v3-CgnvIXc3.mjs';
import './ExtLink-Ipqsfa0G.mjs';
import './Icon-xL9_OgMt.mjs';
import './nuxt-link-ByRaPiMR.mjs';
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
import './AudioPlayer-DSX_ItL1.mjs';
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
    const route = useRoute();
    const apiFetch = useApiFetch();
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "people:profile",
      async () => {
        try {
          return await apiFetch(`/api/persons/${route.params.url}`);
        } catch (error) {
          console.log(error);
          return { person: void 0 };
        }
      },
      { watch: [() => route.params.url] }
    )), __temp = await __temp, __restore(), __temp);
    const person = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.person;
    });
    useHead(() => {
      var _a, _b;
      return {
        title: ((_a = person.value) == null ? void 0 : _a.full_name) || ((_b = person.value) == null ? void 0 : _b.alias) || "People"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}>`);
      if (unref(person)) {
        _push(`<div>`);
        _push(ssrRenderComponent(unref(CaptionedImage$2), {
          style: unref(person).profile_image ? null : { display: "none" },
          float: "right",
          rounding: "10px",
          src: "/" + unref(person).profile_image
        }, null, _parent));
        _push(`<h1>${ssrInterpolate(unref(person).full_name || unref(person).alias)}</h1>`);
        if (unref(person).bio && unref(person).bio.parsed) {
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            body: unref(person).bio.parsed
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/people/[url]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BqSj5aLA.mjs.map
