import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { B as BlogPost } from './Post-CrUmV-X5.mjs';
import { _ as _export_sfc, i as useRoute, u as useRouter, a as useNuxtApp, g as createError } from './server.mjs';
import { u as useAsyncData } from './asyncData-6ijb75O1.mjs';
import { u as useHead } from './v3-CgnvIXc3.mjs';
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
import 'fecha';
import './Icon-xL9_OgMt.mjs';
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
    const router = useRouter();
    const { $store } = useNuxtApp();
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "blog:post",
      async () => {
        try {
          return await $store.dispatch("blog/getPost", route.params.slug);
        } catch (err) {
          throw createError({ statusCode: 404, statusMessage: (err == null ? void 0 : err.message) || "Post not found" });
        }
      },
      { watch: [() => route.params.slug] }
    )), __temp = await __temp, __restore(), __temp);
    const post = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.post;
    });
    useHead(() => {
      var _a;
      return {
        title: ((_a = post.value) == null ? void 0 : _a.title) || "Blog"
      };
    });
    const deletePost = async (id) => {
      await $store.dispatch("blog/deletePost", id);
      router.push("/blog/");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent blog" }, _attrs))} data-v-44a003c6>`);
      if (unref(post)) {
        _push(ssrRenderComponent(BlogPost, {
          post: unref(post),
          onDeletePost: deletePost
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_nuxt_link, { to: "/blog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ... back `);
          } else {
            return [
              createTextVNode(" ... back ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-44a003c6"]]);

export { index as default };
//# sourceMappingURL=index-ChRq_XY0.mjs.map
