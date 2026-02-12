import { i as useRoute, j as useApiFetch, g as createError, e as __nuxt_component_1, _ as _export_sfc } from './server.mjs';
import { _ as _sfc_main$2 } from './vcode-DI0Nwo0O.mjs';
import { withAsyncContext, computed, mergeProps, unref, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import fecha from 'fecha';
import { T as Tag, A as AuthorInfo } from './Tag-ptDmqwln.mjs';
import { C as CitationList } from './CitationList-B6Hefy37.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';
import './ExtLink-Ipqsfa0G.mjs';
import './Icon-xL9_OgMt.mjs';
import './nuxt-link-ByRaPiMR.mjs';
import './AudioPlayer-DSX_ItL1.mjs';

const _sfc_main$1 = {
  components: {
    AuthorInfo
  },
  props: {
    article: {
      type: Object,
      default: void 0
    }
  },
  computed: {
    publicationDate() {
      if (this.article) {
        const publicationDate = this.article.publication_date;
        return publicationDate ? fecha.format(new Date(publicationDate), "dddd, MMMM DD YYYY") : void 0;
      } else {
        return void 0;
      }
    },
    readTime() {
      if (this.article && this.article.body && this.article.body.length) {
        const { length } = this.article.body;
        return Math.round(length / 1200);
      } else {
        return "Unknown";
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_author_info = resolveComponent("author-info");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "byline" }, _attrs))} data-v-8aeb8033><div class="articleInfo" data-v-8aeb8033><div class="publicationDate" data-v-8aeb8033>${ssrInterpolate($options.publicationDate)}</div><div class="separator" data-v-8aeb8033> \xB7 </div><div class="articleLength" data-v-8aeb8033>${ssrInterpolate($options.readTime)} min read </div></div><div class="authors" data-v-8aeb8033><!--[-->`);
  ssrRenderList($props.article.authors, (author) => {
    _push(ssrRenderComponent(_component_author_info, {
      key: author._id,
      author
    }, null, _parent));
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/articles/Byline.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Byline = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8aeb8033"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const defaultArticle = {
      title: void 0,
      subtitle: void 0,
      _id: void 0,
      citations: [],
      tags: [],
      authors: [],
      short_description: "",
      social_media_image: "",
      body: {
        parsed: []
      }
    };
    const route = useRoute();
    const apiFetch = useApiFetch();
    const { data: articleData, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "article",
      () => apiFetch(`/api/articles/${route.params.slug}`),
      { watch: [() => route.params.slug] }
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) {
      throw createError({ statusCode: 404, statusMessage: "That article could not be found." });
    }
    const article = computed(() => {
      var _a, _b;
      return (_b = (_a = articleData.value) == null ? void 0 : _a.article) != null ? _b : defaultArticle;
    });
    const names = (authors) => {
      if (Array.isArray(authors) && authors.length) {
        let title = "- ";
        authors.forEach((author, index) => {
          title += author.full_name;
          if (index < authors.length - 1) title += ", ";
        });
        return title;
      }
      return "";
    };
    useHead(() => {
      const current = article.value;
      if (!current) return {};
      return {
        title: `${current.title} ${names(current.authors)}`,
        meta: [
          { name: "description", hid: "description", content: current.short_description },
          { name: "og:title", hid: "og:title", content: `${current.title} ${names(current.authors)} - EffectIndex` },
          { name: "og:description", hid: "og:description", content: current.short_description },
          { name: "og:image", hid: "og:image", content: current.social_media_image },
          { name: "twitter:title", hid: "twitter:title", content: `${current.title} ${names(current.authors)} - EffectIndex` },
          { name: "twitter:description", hid: "twitter:description", content: current.short_description },
          { name: "twitter:image", hid: "twitter:image", content: current.social_media_image }
        ]
      };
    });
    const hasSection = (name) => {
      const current = article.value;
      if (current && name in current) {
        const section = current[name];
        if (Array.isArray(section) && section.length > 0) return true;
        if (typeof section === "string" && section.length > 0) return true;
      }
      return false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_1;
      const _component_vcode = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><article class="article">`);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`<h1 class="title">${ssrInterpolate(unref(article).title)}</h1><h2 class="subtitle">${ssrInterpolate(unref(article).subtitle)}</h2>`);
      _push(ssrRenderComponent(unref(Byline), { article: unref(article) }, null, _parent));
      _push(`<hr style="${ssrRenderStyle({ "margin": "2em 0" })}"><div class="body">`);
      _push(ssrRenderComponent(_component_vcode, {
        body: unref(article).body
      }, null, _parent));
      _push(`</div>`);
      if (hasSection("citations")) {
        _push(`<div class="citations"><hr><h3> References </h3>`);
        _push(ssrRenderComponent(unref(CitationList), {
          citations: unref(article).citations
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("tags")) {
        _push(`<div class="tags"><hr><h3> Tags </h3><!--[-->`);
        ssrRenderList(unref(article).tags, (tag) => {
          _push(ssrRenderComponent(unref(Tag), {
            key: tag,
            value: tag
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CQI981s-.mjs.map
