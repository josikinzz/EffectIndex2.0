import { i as useRoute, j as useApiFetch, a as useNuxtApp, e as __nuxt_component_1, g as createError, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as _sfc_main$2 } from './vcode-DI0Nwo0O.mjs';
import { withAsyncContext, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { C as CitationList } from './CitationList-B6Hefy37.mjs';
import { _ as __nuxt_component_1$1 } from './ExtLink-Ipqsfa0G.mjs';
import { T as Tag } from './Tag-ByD8obid.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { R as RelatedReportItem } from './reportList__item-D2QDlvjC.mjs';
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
import './AudioPlayer-DSX_ItL1.mjs';

const _sfc_main$1 = {
  components: {
    RelatedReportItem
  },
  props: {
    reports: {
      type: Array,
      default: () => []
    },
    maxReports: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    sortedReports() {
      const featured = this.reports.filter((report) => report.featured);
      const unfeatured = this.reports.filter((report) => !report.featured);
      return [...featured, ...unfeatured];
    },
    limitedReports() {
      return this.expanded ? this.sortedReports : this.sortedReports.slice(0, this.maxReports);
    }
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_related_report_item = resolveComponent("related-report-item");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "relatedReports" }, _attrs))}><p>This effect seems to be mentioned within the following trip reports:</p><!--[-->`);
  ssrRenderList($options.limitedReports, (report) => {
    _push(ssrRenderComponent(_component_related_report_item, {
      key: report._id,
      report
    }, null, _parent));
  });
  _push(`<!--]-->`);
  if ($options.sortedReports.length > $props.maxReports && !$data.expanded) {
    _push(`<button class="expandButton whiteButton"> Show ${ssrInterpolate($options.sortedReports.length - $props.maxReports)} more reports... </button>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/RelatedReports.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RelatedReports = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const apiFetch = useApiFetch();
    const defaultEffect = {
      name: "",
      summary_raw: "",
      social_media_image: "",
      tags: [],
      citations: [],
      see_also: [],
      external_links: [],
      contributors: [],
      replications: [],
      audio_replications: [],
      gallery_order: [],
      description: {},
      analysis: {},
      style_variations: {},
      personal_commentary: {},
      related_reports: []
    };
    const { data, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "effects:detail",
      async () => {
        const { effect: effect2 } = await apiFetch(`/api/effects/${route.params.name}`);
        if (!effect2) {
          throw createError({ statusCode: 404, statusMessage: "Effect not found" });
        }
        return { effect: effect2 };
      },
      { watch: [() => route.params.name] }
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) {
      throw error.value;
    }
    const effect = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.effect) != null ? _b : defaultEffect;
    });
    const icon = computed(() => {
      const tags = effect.value.tags;
      const icons = {
        cognitive: "user",
        visual: "eye",
        auditory: "volume-up",
        tactile: "hand-paper",
        disconnective: "chain",
        multisensory: "cogs",
        uncomfortable: "frown",
        physical: "heart-rate",
        gustatory: "utensils",
        olfactory: "utensils"
      };
      if (Array.isArray(tags)) {
        for (let tag in icons) {
          if (tags.indexOf(tag) > -1) return icons[tag] + ".svg";
        }
      }
      return "user.svg";
    });
    useHead(() => ({
      title: effect.value.name,
      meta: [
        { name: "description", hid: "description", content: effect.value.summary_raw },
        { name: "og:title", hid: "og:title", content: `Effect Index - ${effect.value.name}` },
        { name: "og:description", hid: "og:description", content: effect.value.summary_raw },
        { name: "og:image", hid: "og:image", content: effect.value.social_media_image },
        { name: "twitter:title", hid: "twitter:title", content: `Effect Index - ${effect.value.name}` },
        { name: "twitter:description", hid: "twitter:description", content: effect.value.summary_raw },
        { name: "twitter:image", hid: "twitter:image", content: effect.value.social_media_image }
      ]
    }));
    const hasSection = (name) => {
      const current = effect.value;
      if (name in current) {
        const section = current[name];
        if (Array.isArray(section)) {
          if (section.length > 0) return true;
        } else if (typeof section === "string") {
          if (section.length > 0) return true;
        } else if (section && typeof section === "object") {
          if (section.raw && section.raw.length > 0) return true;
        }
      }
      return false;
    };
    const { $scrollTo } = useNuxtApp();
    const scrollToSection = (section) => {
      if (!section || typeof $scrollTo !== "function") return;
      setTimeout(() => $scrollTo("#" + section), 750);
    };
    watch(() => route.query.s, (value) => {
      scrollToSection(value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_1;
      const _component_nuxt_link = __nuxt_component_0$1;
      const _component_vcode = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><article>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: unref(icon),
        class: "categoryIcon"
      }, null, _parent));
      _push(`<h1>${ssrInterpolate(unref(effect).name)} `);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`</h1>`);
      if (hasSection("description")) {
        _push(ssrRenderComponent(_component_vcode, {
          data: unref(effect),
          body: unref(effect).description
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      if (hasSection("analysis")) {
        _push(`<div><hr><h3 id="analysis"> Analysis </h3>`);
        _push(ssrRenderComponent(_component_vcode, {
          body: unref(effect).analysis
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("style_variations")) {
        _push(`<div><hr><h3 id="style-variations"> Style Variations </h3>`);
        _push(ssrRenderComponent(_component_vcode, {
          body: unref(effect).style_variations
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("personal_commentary")) {
        _push(`<div><hr><h3 id="personal-commentary"> Personal Commentary </h3>`);
        _push(ssrRenderComponent(_component_vcode, {
          body: unref(effect).personal_commentary
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("related_reports")) {
        _push(`<div><hr><h3 id="related-reports"> Related Reports </h3>`);
        _push(ssrRenderComponent(unref(RelatedReports), {
          reports: unref(effect).related_reports
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("external_links")) {
        _push(`<div><hr>`);
        if (hasSection("see_also")) {
          _push(`<div><h3 id="see-also"> See Also </h3><ul><!--[-->`);
          ssrRenderList(unref(effect).see_also, (link, index) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_nuxt_link, {
              to: link.location
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(link.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(link.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (hasSection("external_links")) {
          _push(`<div><h3 id="external-links"> External Links </h3><ul><!--[-->`);
          ssrRenderList(unref(effect).external_links, (link, index) => {
            _push(`<li>`);
            _push(ssrRenderComponent(unref(__nuxt_component_1$1), {
              href: link.url
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(link.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(link.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("citations")) {
        _push(`<div><hr><h3 id="references"> References </h3>`);
        _push(ssrRenderComponent(unref(CitationList), {
          citations: unref(effect).citations
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("tags")) {
        _push(`<div><hr><h3> Tags </h3><!--[-->`);
        ssrRenderList(unref(effect).tags, (tag) => {
          _push(ssrRenderComponent(unref(Tag), {
            key: tag,
            value: tag
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasSection("contributors")) {
        _push(`<div><hr><h3 id="contributors"> Contributors </h3><p> The following people contributed to the content of this article: </p><!--[-->`);
        ssrRenderList(unref(effect).contributors, (contributor) => {
          _push(`<span class="contributor">`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: "/profiles/" + contributor
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(contributor)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(contributor), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</span>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/effects/[name]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-0iPjuG9Y.mjs.map
