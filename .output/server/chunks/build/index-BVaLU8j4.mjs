import { ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { A as ArticleListItem } from './ArticleListItem-CXUX1AI_.mjs';
import { _ as _export_sfc, j as useApiFetch } from './server.mjs';
import { A as AuthorInfo } from './Tag-ptDmqwln.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { u as useAsyncData } from './asyncData-6ijb75O1.mjs';
import 'fecha';
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
import './nuxt-link-ByRaPiMR.mjs';

const _sfc_main$1 = {
  props: {
    selected: {
      type: String,
      default: ""
    }
  },
  methods: {
    by(view) {
      this.$emit("selectView", view);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "articleViewSelector" }, _attrs))} data-v-087508a6><a class="${ssrRenderClass({ selected: $props.selected === "publishDate" })}" tabindex="0" data-v-087508a6> publish date </a><a class="${ssrRenderClass({ selected: $props.selected === "author" })}" tabindex="0" data-v-087508a6> author </a><a class="${ssrRenderClass({ selected: $props.selected === "title" })}" tabindex="0" data-v-087508a6> title </a></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/articles/ArticleViewSelector.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ArticleViewSelector = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-087508a6"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const viewMode = ref("publishDate");
    const sortDirection = ref(true);
    const apiFetch = useApiFetch();
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("articles:index", () => apiFetch("/api/articles"))), __temp = await __temp, __restore(), __temp);
    const articles = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.articles) != null ? _b : [];
    });
    const authors = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.authors) != null ? _b : [];
    });
    const sortedAuthors = computed(() => {
      return sortDirection.value ? authors.value : authors.value.slice().reverse();
    });
    const sortedArticles = computed(() => {
      return sortDirection.value ? articles.value : articles.value.slice().reverse();
    });
    const articlesSortedByTitle = computed(() => {
      const byTitle = articles.value.slice().sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase());
      return sortDirection.value ? byTitle : byTitle.reverse();
    });
    const changeView = (mode) => {
      if (mode === viewMode.value) sortDirection.value = !sortDirection.value;
      else viewMode.value = mode;
    };
    const articlesByAuthor = (id) => {
      return articles.value.filter(
        (article) => article.authors.some((articleAuthor) => articleAuthor._id === id)
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-caec8461>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "file-invoice.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`<h1 data-v-caec8461> Articles </h1><p class="intro" data-v-caec8461> This index contains a range of articles on a variety of different topics, each of which are relevant to the field of Subjective Effect Documentation or psychonautics as a whole. </p>`);
      _push(ssrRenderComponent(unref(ArticleViewSelector), {
        selected: unref(viewMode),
        onSelectView: changeView
      }, null, _parent));
      if (unref(sortedArticles) && unref(viewMode) === "publishDate") {
        _push(`<ul class="article-list" data-v-caec8461><!--[-->`);
        ssrRenderList(unref(sortedArticles), (article) => {
          _push(ssrRenderComponent(unref(ArticleListItem), {
            key: article._id,
            article
          }, null, _parent));
        });
        _push(`<!--]--></ul>`);
      } else if (unref(viewMode) === "author") {
        _push(`<div data-v-caec8461><!--[-->`);
        ssrRenderList(unref(sortedAuthors), (author) => {
          _push(`<div class="author-articles" data-v-caec8461>`);
          _push(ssrRenderComponent(unref(AuthorInfo), { author }, null, _parent));
          _push(`<ul class="article-list" data-v-caec8461><!--[-->`);
          ssrRenderList(articlesByAuthor(author._id), (article) => {
            _push(ssrRenderComponent(unref(ArticleListItem), {
              key: article._id,
              article
            }, null, _parent));
          });
          _push(`<!--]--></ul></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(viewMode) === "title") {
        _push(`<ul class="article-list" data-v-caec8461><!--[-->`);
        ssrRenderList(unref(articlesSortedByTitle), (article) => {
          _push(ssrRenderComponent(unref(ArticleListItem), {
            key: article._id,
            article
          }, null, _parent));
        });
        _push(`<!--]--></ul>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-caec8461"]]);

export { index as default };
//# sourceMappingURL=index-BVaLU8j4.mjs.map
