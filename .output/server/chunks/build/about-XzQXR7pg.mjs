import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  components: {
    ExtLink: __nuxt_component_1,
    Icon: __nuxt_component_0
  },
  head() {
    return {
      title: "About"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_ext_link = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1> About `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "heart.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p> Effect Index serves as the platform for the `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Subjective Effect Index (SEI), `);
      } else {
        return [
          createTextVNode(" Subjective Effect Index (SEI), ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` a resource containing formalised documentation of the vast number of distinct subjective states that may occur under the influence of hallucinogens. We strive to comprehensively document and describe the wide variety of potential hallucinogenic experiences. The SEI is presented in an easily readable format that contains not only descriptions, but also image, video, and audio `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/replications" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` replications `);
      } else {
        return [
          createTextVNode(" replications ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` of these effects. </p><p> We believe that in pioneering formalised subjective effect documentation, we may demystify the psychedelic experience. This has the potential to allow hallucinogen usage to become more culturally acceptable, better understood, and create a platform on top of which these substances may be more easily studied. </p><p> Effect Index was initially founded as a side project on 30 June, 2017 by `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/profiles/Josie" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Josie Kins, `);
      } else {
        return [
          createTextVNode(" Josie Kins, ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` the founder of `);
  _push(ssrRenderComponent(_component_ext_link, { href: "http://www.psychonautwiki.org" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` PsychonautWiki `);
      } else {
        return [
          createTextVNode(" PsychonautWiki ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` and `);
  _push(ssrRenderComponent(_component_ext_link, { href: "http://disregardeverythingisay.com/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` DisregardEverythingISay. `);
      } else {
        return [
          createTextVNode(" DisregardEverythingISay. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` It serves as a platform for content that has been in constant development for the previous six years on these sites. However, the aforementioned content is now hosted on its own dedicated platform with the hope of further spreading the documentation and creating a universal terminology set that gives people the vernacular to fully describe experiences that were previously considered ineffable. </p><p> If you find this project interesting, we encourage you to join our active communities within both our `);
  _push(ssrRenderComponent(_component_ext_link, { href: "http://reddit.com/r/replications" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` subreddit `);
      } else {
        return [
          createTextVNode(" subreddit ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` and our `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/discord" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Discord. `);
      } else {
        return [
          createTextVNode(" Discord. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { about as default };
//# sourceMappingURL=about-XzQXR7pg.mjs.map
