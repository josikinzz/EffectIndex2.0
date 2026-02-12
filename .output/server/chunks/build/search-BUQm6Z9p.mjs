import { ref, withAsyncContext, computed, mergeProps, unref, resolveComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { T as Tag } from './Tag-ByD8obid.mjs';
import { _ as _export_sfc, i as useRoute, a as useNuxtApp } from './server.mjs';
import { A as ArticleListItem } from './ArticleListItem-CXUX1AI_.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import lodash from 'lodash';
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
import './Tag-ptDmqwln.mjs';
import 'fecha';

const _sfc_main$2 = {
  components: {
    Tag
  },
  props: {
    effect: {
      type: Object,
      default: () => ({})
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_tag = resolveComponent("tag");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "searchResult" }, _attrs))}><h3>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/effects/" + $props.effect.url
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($props.effect.name)}`);
      } else {
        return [
          createTextVNode(toDisplayString($props.effect.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h3><div>${(_a = _ctx.$md.render($props.effect.summary_raw)) != null ? _a : ""}</div><!--[-->`);
  ssrRenderList($props.effect.tags, (tag, index) => {
    _push(ssrRenderComponent(_component_tag, {
      key: index,
      value: tag
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/search/EffectResult.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const EffectResult = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {
  components: {
    Tag
  },
  props: {
    report: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    substance() {
      const report = this.report;
      return report.substances.length > 1 ? { name: "Combination", dose: "", roa: "" } : report.substances[0];
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_tag = resolveComponent("tag");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "searchResult" }, _attrs))}><div class="topContainer"><div class="titleAuthor"><h3>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/reports/" + $props.report.slug
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($props.report.title)}`);
      } else {
        return [
          createTextVNode(toDisplayString($props.report.title), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h3><span class="author"> by ${ssrInterpolate($props.report.subject.name)}</span></div><div class="substanceDose"><div class="substance">${ssrInterpolate($options.substance.name)}</div><div class="dose">${ssrInterpolate($options.substance.dose)} ${ssrInterpolate($options.substance.roa)}</div></div></div><!--[-->`);
  ssrRenderList($props.report.tags, (tag, index) => {
    _push(ssrRenderComponent(_component_tag, {
      key: index,
      value: tag
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/search/ReportResult.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ReportResult = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "search",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { debounce } = lodash;
    useHead({ title: "Search" });
    const route = useRoute();
    const { $store } = useNuxtApp();
    ref(null);
    [__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "search:prefetch",
      async () => {
        if (route.query.q) {
          await $store.dispatch("search/search", route.query.q);
          $store.commit("search/change_input", route.query.q);
        } else {
          $store.commit("search/clear_input");
        }
        return {};
      },
      { watch: [() => route.query.q] }
    )), await __temp, __restore();
    const effectResults = computed(() => $store.state.search.results.effects);
    const reportResults = computed(() => $store.state.search.results.reports);
    const articleResults = computed(() => $store.state.search.results.articles);
    const searchInput = computed(() => $store.state.search.input);
    const results = computed(() => effectResults.value || reportResults.value || articleResults.value);
    debounce(() => {
      $store.dispatch("search/search", searchInput.value);
    }, 400, { trailing: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-21830e0e><h1 data-v-21830e0e> Search `);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "search.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`</h1><div class="inputContainer" data-v-21830e0e><input${ssrRenderAttr("value", unref(searchInput))} type="text" class="searchInput" data-v-21830e0e><div class="clearButton" style="${ssrRenderStyle(unref(searchInput).length ? null : { display: "none" })}" data-v-21830e0e>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "times-circle.svg",
        style: { "height": "1.25em", "width": "1.25em" }
      }, null, _parent));
      _push(`</div></div><div class="searchResults" style="${ssrRenderStyle(unref(results) ? null : { display: "none" })}" data-v-21830e0e><hr data-v-21830e0e>`);
      if (unref(effectResults)) {
        _push(`<div class="effectResults" data-v-21830e0e><h1 data-v-21830e0e> Effects - ${ssrInterpolate(unref(effectResults).length + (unref(effectResults).length > 1 ? " results" : " result"))}</h1><!--[-->`);
        ssrRenderList(unref(effectResults), (effect) => {
          _push(ssrRenderComponent(unref(EffectResult), {
            key: effect._id,
            effect
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(articleResults)) {
        _push(`<ul class="articleResults" data-v-21830e0e><h1 data-v-21830e0e> Articles - ${ssrInterpolate(unref(articleResults).length + (unref(articleResults).length > 1 ? " results" : " result"))}</h1><!--[-->`);
        ssrRenderList(unref(articleResults), (article) => {
          _push(ssrRenderComponent(unref(ArticleListItem), {
            key: article._id,
            article
          }, null, _parent));
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(reportResults)) {
        _push(`<div class="effectResults" data-v-21830e0e><h1 data-v-21830e0e> Reports - ${ssrInterpolate(unref(reportResults).length + (unref(reportResults).length > 1 ? " results" : " result"))}</h1><!--[-->`);
        ssrRenderList(unref(reportResults), (report) => {
          _push(ssrRenderComponent(unref(ReportResult), {
            key: report._id,
            report
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const search = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-21830e0e"]]);

export { search as default };
//# sourceMappingURL=search-BUQm6Z9p.mjs.map
