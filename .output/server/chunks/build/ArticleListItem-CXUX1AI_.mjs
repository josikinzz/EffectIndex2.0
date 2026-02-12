import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { T as Tag, A as AuthorInfo } from './Tag-ptDmqwln.mjs';
import fecha from 'fecha';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  components: {
    AuthorInfo,
    Tag,
    Icon: __nuxt_component_0
  },
  props: {
    article: {
      type: Object,
      default: () => ({
        name: void 0
      })
    },
    short: {
      type: Boolean,
      default: false
    },
    showFeaturedIcon: {
      type: Boolean,
      default: true
    },
    showAuthor: {
      type: Boolean,
      default: true
    },
    showTags: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    readTime() {
      if (this.article && this.article.body && this.article.body.length) {
        const { length } = this.article.body;
        return Math.round(length / 1200);
      } else {
        return void 0;
      }
    },
    hasTags() {
      const { article } = this;
      if (article) {
        const { tags } = article;
        return tags && tags.length;
      }
      return false;
    },
    publicationDate() {
      if (this.article) {
        const publicationDate = this.article.publication_date;
        return publicationDate ? fecha.format(new Date(publicationDate), "dddd, MMMM DD YYYY") : void 0;
      } else {
        return void 0;
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_icon = __nuxt_component_0;
  const _component_author_info = resolveComponent("author-info");
  const _component_tag = resolveComponent("tag");
  _push(`<li${ssrRenderAttrs(mergeProps({ class: "article-list-item" }, _attrs))} data-v-ba96c1d5><div class="column-container" data-v-ba96c1d5><div class="left-side" data-v-ba96c1d5><div class="titles" data-v-ba96c1d5><h3 data-v-ba96c1d5><a${ssrRenderAttr("href", `/articles/${$props.article.slug}`)} data-v-ba96c1d5>${ssrInterpolate($props.article.title)}</a>`);
  if ($props.article.featured && $props.showFeaturedIcon) {
    _push(ssrRenderComponent(_component_icon, { filename: "star.svg" }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</h3>`);
  if ($props.article.subtitle) {
    _push(`<h4 data-v-ba96c1d5>${ssrInterpolate($props.article.subtitle)}</h4>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="info" data-v-ba96c1d5>`);
  if ($options.publicationDate) {
    _push(`<div class="publication-date" data-v-ba96c1d5>${ssrInterpolate($options.publicationDate)}</div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.readTime) {
    _push(`<div class="read-time" data-v-ba96c1d5> \xB7 ${ssrInterpolate($options.readTime)} Minute Read </div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div><p class="short-description" style="${ssrRenderStyle($props.article.short_description ? null : { display: "none" })}" data-v-ba96c1d5>${ssrInterpolate($props.article.short_description)}</p></div><div class="right-side" style="${ssrRenderStyle($props.article.social_media_image ? null : { display: "none" })}" data-v-ba96c1d5><img${ssrRenderAttr("src", $props.article.social_media_image)} data-v-ba96c1d5></div></div><div class="bottom" style="${ssrRenderStyle($props.showAuthor || $props.showTags ? null : { display: "none" })}" data-v-ba96c1d5>`);
  if ($props.showAuthor) {
    _push(`<div class="authors" data-v-ba96c1d5><!--[-->`);
    ssrRenderList($props.article.authors, (author) => {
      _push(ssrRenderComponent(_component_author_info, {
        key: author._id,
        author,
        "social-media": false
      }, null, _parent));
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.showTags) {
    _push(`<div class="tags" data-v-ba96c1d5><!--[-->`);
    ssrRenderList($props.article.tags, (tag, index) => {
      _push(ssrRenderComponent(_component_tag, {
        key: index,
        value: tag
      }, null, _parent));
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></li>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/articles/ArticleListItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ArticleListItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ba96c1d5"]]);

export { ArticleListItem as A };
//# sourceMappingURL=ArticleListItem-CXUX1AI_.mjs.map
