import { _ as _export_sfc, e as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import fecha from 'fecha';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    post: {
      type: Object,
      default: void 0
    },
    loggedIn: {
      type: String,
      default: ""
    }
  },
  methods: {
    formatDate(date) {
      return fecha.format(new Date(date), "dddd MMMM DD YYYY");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  const _component_client_only = __nuxt_component_1;
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "blogPost" }, _attrs))} data-v-a709086a>`);
  _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
  _push(`<h4 class="blogPost__date" data-v-a709086a>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/blog/" + $props.post.slug + "/",
    style: { "text-decoration": "none" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($options.formatDate($props.post.datetime))}`);
      } else {
        return [
          createTextVNode(toDisplayString($options.formatDate($props.post.datetime)), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h4><h1 class="blogPost__title" data-v-a709086a>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/blog/" + $props.post.slug + "/",
    style: { "text-decoration": "none" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($props.post.title)}`);
      } else {
        return [
          createTextVNode(toDisplayString($props.post.title), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h1><div class="blogPost__body" data-v-a709086a>${(_a = _ctx.$md.render($props.post.body)) != null ? _a : ""}</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blog/Post.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BlogPost = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a709086a"]]);

export { BlogPost as B };
//# sourceMappingURL=Post-CrUmV-X5.mjs.map
