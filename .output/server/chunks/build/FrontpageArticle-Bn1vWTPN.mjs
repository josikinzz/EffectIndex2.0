import { A as ArticleListItem } from './ArticleListItem-CXUX1AI_.mjs';
import { resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  components: {
    ArticleListItem
  },
  computed: {
    articles() {
      return this.$store.state.articles.list;
    },
    pinnedArticle() {
      const articles = this.articles.filter((article) => article.frontpage);
      return articles[0];
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_article_list_item = resolveComponent("article-list-item");
  if ($options.pinnedArticle) {
    _push(`<div${ssrRenderAttrs(_attrs)} data-v-942afbe3><ul class="frontpage-article" data-v-942afbe3>`);
    _push(ssrRenderComponent(_component_article_list_item, {
      key: $options.pinnedArticle._id,
      article: $options.pinnedArticle,
      "show-featured-icon": false,
      "show-tags": false
    }, null, _parent));
    _push(`</ul></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FrontpageArticle.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FrontpageArticle = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-942afbe3"]]);

export { FrontpageArticle as F };
//# sourceMappingURL=FrontpageArticle-Bn1vWTPN.mjs.map
