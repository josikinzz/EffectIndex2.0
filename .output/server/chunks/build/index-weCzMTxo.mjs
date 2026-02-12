import { i as useRoute, a as useNuxtApp, e as __nuxt_component_1, g as createError, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_1$1 } from './ExtLink-Ipqsfa0G.mjs';
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

const _sfc_main$7 = {
  components: {
    Icon: __nuxt_component_0$1
  },
  props: {
    header: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    headerColour: {
      type: String,
      default: "#FFFFFF"
    },
    icon: {
      type: String,
      default: "user.svg"
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  const _component_Icon = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "report__textBox" }, _attrs))} data-v-626c55a7><h2 style="${ssrRenderStyle({ backgroundColor: $props.headerColour })}" class="report__textBoxHeader" data-v-626c55a7>`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: $props.icon,
    style: { "height": "1em", "width": "1.2em" }
  }, null, _parent));
  _push(` ${ssrInterpolate($props.header)}</h2><div class="report__textBoxText" data-v-626c55a7>${(_a = _ctx.$md.render($props.text)) != null ? _a : ""}</div></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__textBox.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const TextBox = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-626c55a7"]]);
const _sfc_main$6 = {
  components: {
    ExtLink: __nuxt_component_1$1,
    Icon: __nuxt_component_0$1
  },
  props: {
    subject: {
      type: Object,
      default: () => ({})
    },
    profile: {
      type: Object,
      default: void 0
    }
  },
  computed: {
    filteredSubjectProperties() {
      const order = ["name", "trip_date", "age", "setting", "gender", "height", "weight", "medications"];
      return Object.keys(this.subject).filter((key) => key !== "pdf_url" && this.subject[key] !== "").sort((x, y) => order.indexOf(x) - order.indexOf(y));
    }
  },
  methods: {
    propertyLabel(property) {
      const properties = {
        name: "Name",
        trip_date: "Trip Date",
        age: "Age",
        setting: "Setting",
        gender: "Gender",
        height: "Height",
        weight: "Weight",
        medications: "Medications"
      };
      return properties[property];
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$1;
  const _component_ext_link = __nuxt_component_1$1;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "report__infoBox" }, _attrs))} data-v-69b11ef9><h2 class="report__infoBoxHeader" data-v-69b11ef9>`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "user.svg",
    style: { "height": "1em", "width": "1.2em", "padding-right": "10px" }
  }, null, _parent));
  _push(` Context </h2><div class="report__infoBoxItemContainer" data-v-69b11ef9><!--[-->`);
  ssrRenderList($options.filteredSubjectProperties, (property) => {
    _push(`<div class="report__infoBoxItem" data-v-69b11ef9><template data-v-69b11ef9><div class="label" data-v-69b11ef9>${ssrInterpolate($options.propertyLabel(property))}: </div><div class="value" data-v-69b11ef9>${ssrInterpolate($props.subject[property])}</div></template></div>`);
  });
  _push(`<!--]-->`);
  if ($props.subject.pdf_url) {
    _push(`<div class="tracker_pdf" data-v-69b11ef9>`);
    _push(ssrRenderComponent(_component_ext_link, {
      href: $props.subject.pdf_url
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Subjective Effect Tracker PDF `);
        } else {
          return [
            createTextVNode(" Subjective Effect Tracker PDF ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></section>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__subjectBox.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const SubjectBox = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-69b11ef9"]]);
const _sfc_main$5 = {
  components: {
    Icon: __nuxt_component_0$1
  },
  props: {
    substances: {
      type: Array,
      default: () => []
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$1;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "report__infoBox" }, _attrs))}><h2 class="report__infoBoxHeader">`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "capsules.svg",
    class: "categoryIcon",
    style: { "height": "1em", "width": "1.4em", "padding-right": "10px" }
  }, null, _parent));
  _push(` Substances </h2><div class="report__infoBoxTableContainer"><table class="report__infoBoxTable" style="${ssrRenderStyle($props.substances.length ? null : { display: "none" })}"><thead><tr class="report__infoBoxTableHeader"><td> Name </td> <td> Dosage </td> <td> Route of Administration </td></tr></thead><tbody><!--[-->`);
  ssrRenderList($props.substances, (substance, index) => {
    _push(`<tr><td class="report__infoBoxTableName">${ssrInterpolate(substance.name)}</td><td class="report__infoBoxTableDose">${ssrInterpolate(substance.dose)}</td><td class="report__infoBoxTableRoA">${ssrInterpolate(substance.roa)}</td></tr>`);
  });
  _push(`<!--]--></tbody></table></div></section>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__substancesBox.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const SubstancesBox = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$4 = {
  props: {
    log: {
      type: Array,
      default: () => []
    },
    headerColour: {
      type: String,
      default: "#FFFFFF"
    },
    header: {
      type: String,
      default: "Log"
    }
  },
  methods: {
    trimmedMarkdown(text) {
      if (!text) return "";
      let rendered = this.$md.render(text);
      if (rendered) rendered = rendered.trim();
      return rendered;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "report__logBox" }, _attrs))} data-v-486d456c><h2 style="${ssrRenderStyle({ backgroundColor: $props.headerColour })}" class="report__logBoxHeader" data-v-486d456c>${ssrInterpolate($props.header)}</h2><div class="report__logBoxContainer" data-v-486d456c><div style="${ssrRenderStyle({ backgroundColor: $props.headerColour })}" class="outer" data-v-486d456c><div class="inner rotate" data-v-486d456c>${ssrInterpolate($props.header)}</div></div><div class="content" data-v-486d456c><!--[-->`);
  ssrRenderList($props.log, (item, index) => {
    var _a;
    _push(`<div class="logItem" data-v-486d456c>`);
    if (item.time) {
      _push(`<div class="logTime" data-v-486d456c>${ssrInterpolate(item.time)}: </div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="logDescription" data-v-486d456c>${(_a = $options.trimmedMarkdown(item.description)) != null ? _a : ""}</div></div>`);
  });
  _push(`<!--]--></div></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__logBox.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LogBox = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-486d456c"]]);
const _sfc_main$3 = {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    clickTag(value) {
      this.$router.push("/search?q=" + value);
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "tag" }, _attrs))} data-v-50ee07e4>${ssrInterpolate($props.value)}</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__tag.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Tag = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-50ee07e4"]]);
const _sfc_main$2 = {
  components: {
    Icon: __nuxt_component_0$1
  },
  props: {
    effects: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: "Name"
    },
    icon: {
      type: String,
      default: "eye.svg"
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$1;
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "category" }, _attrs))}><div class="titleContainer">`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: $props.icon,
    style: { "height": "35px", "width": "35px" }
  }, null, _parent));
  _push(`<h2>${ssrInterpolate($props.name)}</h2></div><ul class="effectList"><!--[-->`);
  ssrRenderList($props.effects, (effect) => {
    _push(`<li>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: `/effects/${effect.url}`,
      class: "effect"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate(effect.name)}`);
        } else {
          return [
            createTextVNode(toDisplayString(effect.name), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</li>`);
  });
  _push(`<!--]--></ul></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__relatedEffectsCategory.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const RelatedEffectsCategory = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {
  components: {
    RelatedEffectsCategory,
    Icon: __nuxt_component_0$1
  },
  props: {
    effects: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    sensoryEffects() {
      return this.effects.filter((effect) => effect.tags.includes("sensory"));
    },
    physicalEffects() {
      return this.effects.filter((effect) => effect.tags.includes("physical"));
    },
    cognitiveEffects() {
      return this.effects.filter((effect) => effect.tags.includes("cognitive"));
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$1;
  const _component_related_effects_category = resolveComponent("related-effects-category");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "reportRelatedEffects" }, _attrs))}><div class="header">`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "sitemap.svg",
    style: { "height": "1em", "width": "1.2em", "margin-right": "10px" }
  }, null, _parent));
  _push(`<h1 class="title"> Related Effects </h1></div><div class="categories"><p class="description"> This trip report seems to include the following subjective effects: </p>`);
  if ($options.sensoryEffects.length > 0) {
    _push(ssrRenderComponent(_component_related_effects_category, {
      effects: $options.sensoryEffects,
      name: "Sensory",
      icon: "eye.svg"
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  if ($options.cognitiveEffects.length > 0) {
    _push(ssrRenderComponent(_component_related_effects_category, {
      effects: $options.cognitiveEffects,
      background: "#EEE",
      name: "Cognitive",
      icon: "user.svg"
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  if ($options.physicalEffects.length > 0) {
    _push(ssrRenderComponent(_component_related_effects_category, {
      effects: $options.physicalEffects,
      name: "Physical",
      icon: "heart-rate.svg"
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/report__relatedEffects.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RelatedEffects = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { $store } = useNuxtApp();
    const defaultReport = {
      _id: "",
      title: "",
      tags: [],
      subject: { name: "", trip_date: "" },
      person: null,
      substances: [],
      introduction: "",
      conclusion: "",
      onset: [],
      peak: [],
      offset: [],
      related_effects: []
    };
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "reports:detail",
      async () => {
        const report2 = await $store.dispatch("reports/getReportBySlug", route.params.slug);
        if (!report2) {
          throw createError({ statusCode: 404, statusMessage: "That report does not exist." });
        }
        await $store.dispatch("profiles/get");
        return { report: report2 };
      },
      { watch: [() => route.params.slug] }
    )), __temp = await __temp, __restore(), __temp);
    const report = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.report) || defaultReport;
    });
    const profile = computed(() => {
      const profiles = $store.state.profiles.list;
      return profiles.find((profile2) => profile2.username === report.value.subject.name);
    });
    const description = computed(() => {
      const substances = report.value.substances.map((substance) => substance.name);
      const substanceList = substances.join(", ");
      return `A ${substanceList} report from ${report.value.subject.name} on Effect Index.`;
    });
    const hasRelatedEffects = computed(() => {
      return report.value.related_effects && report.value.related_effects.length > 0;
    });
    useHead(() => ({
      title: report.value.title,
      meta: [
        { name: "description", hid: "description", content: description.value },
        { name: "og:title", hid: "og:title", content: `Effect Index - Trip Report - ${report.value.title} by ${report.value.subject.name}` },
        { name: "og:description", hid: "og:description", content: description.value },
        { name: "twitter:title", hid: "twitter:title", content: `Effect Index - Trip Report - ${report.value.title} by ${report.value.subject.name}` },
        { name: "twitter:description", hid: "twitter:description", content: description.value }
      ]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_1;
      const _component_nuxt_link = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "report" }, _attrs))}><div class="report__headerContainer"><div class="report__headerTitleContainer"><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "row", "align-items": "center" })}"><h1 class="report__title" style="${ssrRenderStyle({ "margin-bottom": "0" })}">${ssrInterpolate(unref(report).title)}</h1>`);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`</div><div class="report__titleAuthor" style="${ssrRenderStyle(unref(report).subject.name ? null : { display: "none" })}">`);
      if (unref(report).person) {
        _push(`<span> by `);
        if (unref(report).person.profile_url) {
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: `/people/${unref(report).person.profile_url}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(report).person.full_name || unref(report).person.alias)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(report).person.full_name || unref(report).person.alias), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<span>${ssrInterpolate(unref(report).person.full_name || unref(report).person.alias)}</span>`);
        }
        _push(`</span>`);
      } else if (unref(profile)) {
        _push(`<span> by `);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: "/profiles/" + unref(profile).username
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(report).subject.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(report).subject.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</span>`);
      } else {
        _push(`<span> by ${ssrInterpolate(unref(report).subject.name)}</span>`);
      }
      _push(`</div></div><div class="report__tagsContainer"><!--[-->`);
      ssrRenderList(unref(report).tags, (tag, index) => {
        _push(ssrRenderComponent(unref(Tag), {
          key: index,
          value: tag
        }, null, _parent));
      });
      _push(`<!--]--></div></div><div class="report__topSection">`);
      _push(ssrRenderComponent(unref(SubjectBox), {
        profile: unref(profile),
        subject: unref(report).subject
      }, null, _parent));
      _push(ssrRenderComponent(unref(SubstancesBox), {
        substances: unref(report).substances
      }, null, _parent));
      _push(`</div>`);
      if (unref(report).introduction) {
        _push(ssrRenderComponent(unref(TextBox), {
          text: unref(report).introduction,
          icon: "sun.svg",
          "header-colour": "#EEE",
          header: "Introduction"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="report__logsContainer">`);
      if (unref(report).onset.length) {
        _push(ssrRenderComponent(unref(LogBox), {
          log: unref(report).onset,
          "header-colour": "#DDFFDD",
          header: "Onset"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(report).peak.length) {
        _push(ssrRenderComponent(unref(LogBox), {
          log: unref(report).peak,
          "header-colour": "#FFDDDD",
          header: "Peak"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(report).offset.length) {
        _push(ssrRenderComponent(unref(LogBox), {
          log: unref(report).offset,
          "header-colour": "#DDDDFF",
          header: "Offset"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(report).conclusion) {
        _push(ssrRenderComponent(unref(TextBox), {
          text: unref(report).conclusion,
          icon: "moon.svg",
          "header-colour": "#EEE",
          header: "Conclusion / Aftermath"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(hasRelatedEffects)) {
        _push(ssrRenderComponent(unref(RelatedEffects), {
          effects: unref(report).related_effects
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-weCzMTxo.mjs.map
