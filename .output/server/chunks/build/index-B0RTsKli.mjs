import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { withAsyncContext, reactive, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { R as RelatedReportItem } from './reportList__item-D2QDlvjC.mjs';
import { a as useNuxtApp, _ as _export_sfc } from './server.mjs';
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
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-6730decd><a class="${ssrRenderClass({ selected: $props.selected === "substance" })}" tabindex="0" data-v-6730decd> substance </a><a class="${ssrRenderClass({ selected: $props.selected === "title" })}" tabindex="0" data-v-6730decd> title </a><a class="${ssrRenderClass({ selected: $props.selected === "author" })}" tabindex="0" data-v-6730decd> author </a></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/reportList__viewSelector.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const viewSelector = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6730decd"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { sortBy } = lodash;
    useHead({ title: "Trip Reports" });
    const { $store } = useNuxtApp();
    [__temp, __restore] = withAsyncContext(async () => useAsyncData("reports:list", async () => {
      await $store.dispatch("reports/get");
      await $store.dispatch("profiles/get");
      return {};
    })), await __temp, __restore();
    const viewMode = reactive({
      name: "substance",
      direction: true
    });
    const reports = computed(() => $store.state.reports.list.filter((report) => !report.unpublished));
    const profileNames = computed(() => $store.state.profiles.list.map((profile) => profile.username));
    const substances = computed(() => {
      const substanceList = /* @__PURE__ */ new Set();
      reports.value.forEach((report) => {
        if (report.substances.length > 1) substanceList.add("Combinations");
        else
          report.substances.forEach(
            (substance) => substanceList.add(substance.name)
          );
      });
      return Array.from(substanceList);
    });
    const authors = computed(() => {
      const authorList = /* @__PURE__ */ new Set();
      reports.value.forEach((report) => {
        authorList.add(report.subject.name);
      });
      return Array.from(authorList);
    });
    const sortedSubstances = computed(() => {
      const sorted = sortBy(substances.value);
      return viewMode.direction ? sorted : sorted.reverse();
    });
    const sortedAuthors = computed(() => {
      const sorted = sortBy(authors.value);
      return viewMode.direction ? sorted : sorted.reverse();
    });
    const reportsByTitle = computed(() => {
      const sorted = sortBy(reports.value, ["title"]);
      return viewMode.direction ? sorted : sorted.reverse();
    });
    computed(() => {
      const sorted = sortBy(reports.value, (report) => report.subject.trip_date);
      return viewMode.direction ? sorted : sorted.reverse();
    });
    const hasProfile = (name) => {
      return profileNames.value[profileNames.value.indexOf(name)];
    };
    const filterReportsBySubstance = (name) => {
      return name === "Combinations" ? reports.value.filter((report) => Array.isArray(report.substances) && report.substances.length > 1) : reports.value.filter((report) => Array.isArray(report.substances) && report.substances.find((substance) => substance.name === name));
    };
    const filterReportsByAuthor = (author) => {
      return reports.value.filter((report) => report.subject.name === author);
    };
    const selectView = (view) => {
      if (viewMode.name === view)
        viewMode.direction = !viewMode.direction;
      else viewMode.name = view;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent tripReports" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "file-signature.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`<h1> Trip Reports </h1><p> The <strong>trip reports section</strong> of Effect Index exists to showcase our collection of high quality, consistently formatted trip reports that describe the subjective experiences our community members undergo while under the influence of various hallucinogenic substances. These reports are then used as anecdotal accounts that further support the existence of the various documented states within our `);
      _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Subjective Effect Index. `);
          } else {
            return [
              createTextVNode(" Subjective Effect Index. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p>`);
      _push(ssrRenderComponent(unref(viewSelector), {
        selected: unref(viewMode).name,
        onSelectView: selectView
      }, null, _parent));
      if (unref(viewMode).name === "substance") {
        _push(`<div><!--[-->`);
        ssrRenderList(unref(sortedSubstances).filter((substance) => substance !== "Combinations"), (substance, index) => {
          _push(`<div class="report__substanceList"><h3>${ssrInterpolate(substance)}</h3><div class="report__reportItemContainer"><!--[-->`);
          ssrRenderList(filterReportsBySubstance(substance), (report) => {
            _push(ssrRenderComponent(unref(RelatedReportItem), {
              key: report._id,
              report,
              "profile-name": hasProfile(report.subject.name)
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(sortedSubstances).indexOf("Combinations") > 0) {
          _push(`<div class="report__substanceList"><h3> Combinations </h3><div class="report__reportItemContainer"><!--[-->`);
          ssrRenderList(filterReportsBySubstance("Combinations"), (report) => {
            _push(ssrRenderComponent(unref(RelatedReportItem), {
              key: report._id,
              report,
              "profile-name": hasProfile(report.subject.name)
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(viewMode).name === "title") {
        _push(`<div><!--[-->`);
        ssrRenderList(unref(reportsByTitle), (report) => {
          _push(ssrRenderComponent(unref(RelatedReportItem), {
            key: report._id,
            report,
            "profile-name": hasProfile(report.subject.name)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(viewMode).name === "author") {
        _push(`<div><!--[-->`);
        ssrRenderList(unref(sortedAuthors), (author, index) => {
          _push(`<div class="report__substanceList"><h3>`);
          if (hasProfile(author)) {
            _push(ssrRenderComponent(_component_nuxt_link, {
              to: "/profiles/" + author
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(author)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(author), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<span>${ssrInterpolate(author)}</span>`);
          }
          _push(`</h3><div class="report__reportItemContainer"><!--[-->`);
          ssrRenderList(filterReportsByAuthor(author), (report) => {
            _push(ssrRenderComponent(unref(RelatedReportItem), {
              key: report._id,
              report,
              "profile-name": hasProfile(report.subject.name)
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B0RTsKli.mjs.map
