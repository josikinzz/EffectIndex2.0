import { withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { B as BlogPost } from './Post-CrUmV-X5.mjs';
import { a as useNuxtApp } from './server.mjs';
import { u as useHead } from './v3-CgnvIXc3.mjs';
import { u as useAsyncData } from './asyncData-6ijb75O1.mjs';
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
    useHead({ title: "Blog" });
    const { $store } = useNuxtApp();
    [__temp, __restore] = withAsyncContext(() => useAsyncData("blog:posts", () => $store.dispatch("blog/getPosts"))), await __temp, __restore();
    const blogPosts = computed(() => $store.state.blog.posts);
    const deletePost = async (id) => {
      await $store.dispatch("blog/deletePost", id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent blog" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(blogPosts), (post) => {
        _push(ssrRenderComponent(BlogPost, {
          key: post._id,
          post,
          onDeletePost: deletePost
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dx1IKLvH.mjs.map
