import { _ as _export_sfc, a as useNuxtApp, e as __nuxt_component_1, d as useSearchStore } from './server.mjs';
import { withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, resolveComponent, createTextVNode, createSlots, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList, resolveDirective, withDirectives, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrGetDirectiveProps } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import lodash from 'lodash';
import { mapState } from 'pinia';
import fecha from 'fecha';
import { _ as __nuxt_component_1$1 } from './ExtLink-Ipqsfa0G.mjs';
import { F as FrontpageArticle } from './FrontpageArticle-Bn1vWTPN.mjs';
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
import 'vue-router';
import 'markdown-it';
import './ArticleListItem-CXUX1AI_.mjs';
import './Tag-ptDmqwln.mjs';

const { debounce } = lodash;
const _sfc_main$d = {
  components: {
    Icon: __nuxt_component_0
  },
  computed: {
    ...mapState(useSearchStore, {
      searchInput: "input",
      searchResults: "results"
    })
  },
  watch: {
    searchResults: {
      deep: true,
      handler(results) {
        var _a;
        const totalResults = (_a = results == null ? void 0 : results.total_results) != null ? _a : 0;
        if (totalResults > 0) {
          this.$router.push("/search");
        }
      }
    }
  },
  methods: {
    changeSearchInput(e) {
      const searchStore = useSearchStore();
      searchStore.change_input(e.target.value);
      this.performSearch();
    },
    performSearch: debounce(function() {
      const searchStore = useSearchStore();
      searchStore.search(this.searchInput);
    }, 400, { trailing: true }),
    clear() {
      const searchStore = useSearchStore();
      searchStore.clear_input();
      this.$refs.searchInput.focus();
    }
  }
};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "searchBox" }, _attrs))} data-v-5fb90819><div class="inputContainer" data-v-5fb90819><div class="spyglass" data-v-5fb90819>`);
  _push(ssrRenderComponent(_component_Icon, { filename: "search.svg" }, null, _parent));
  _push(`</div><input${ssrRenderAttr("value", _ctx.searchInput)} type="text" placeholder="Search" class="searchInput" data-v-5fb90819><div class="clearButton" style="${ssrRenderStyle(_ctx.searchInput ? null : { display: "none" })}" data-v-5fb90819>`);
  _push(ssrRenderComponent(_component_Icon, { filename: "times-circle.svg" }, null, _parent));
  _push(`</div></div></div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/SearchBox.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const SearchBox = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$c], ["__scopeId", "data-v-5fb90819"]]);
const _sfc_main$c = {
  components: {
    SearchBox
  },
  data() {
    return {
      hiddenIntro: false
    };
  },
  computed: {
    effectCount() {
      return this.$store.state.effects.list.length;
    }
  },
  methods: {
    toggleIntro() {
      this.hiddenIntro = !this.hiddenIntro;
    }
  }
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_search_box = resolveComponent("search-box");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "description" }, _attrs))} data-v-8d780645>`);
  _push(ssrRenderComponent(_component_search_box, null, null, _parent));
  _push(`<p data-v-8d780645><span class="bold" data-v-8d780645> Effect Index, </span> which is currently under construction, is a resource dedicated to establishing the field of formalised subjective effect documentation. It is the home of the `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/effects/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Subjective Effect Index `);
      } else {
        return [
          createTextVNode(" Subjective Effect Index ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` (SEI), which contains ${ssrInterpolate($options.effectCount)} effect descriptions that exist to serve as a comprehensive map of all potential experiences that can occur under the influence of any class of psychoactive compound, particularly hallucinogens. </p><div class="hiddenIntro" style="${ssrRenderStyle($data.hiddenIntro ? null : { display: "none" })}" data-v-8d780645><p data-v-8d780645> The effects identified here are accompanied by detailed descriptions of how it feels to experience them. These are written in an objective and `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/documentation-style-guide" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` consistent writing style `);
      } else {
        return [
          createTextVNode(" consistent writing style ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` based upon phenomenological observation and avoids the use of metaphor or analogy. The descriptions also strive to use language that is as simple and understandable as possible. This has been done with the hope that they will serve as a universal terminology that allows people to describe and discuss that which was previously considered ineffable. </p><p data-v-8d780645> These effects are organised into categories based on the sense affected and their behaviour. Many of these are further broken down into levels, subcomponents, and variations in style, which can occur across different substances. Detailed `);
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
  _push(` are included whenever possible to supplement the text descriptions in the form of images, audio clips, and animations. </p></div><div style="${ssrRenderStyle({ "display": "inline-block" })}" class="whiteButton" data-v-8d780645> read ${ssrInterpolate($data.hiddenIntro ? "less" : "more")}</div>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    style: { "display": "inline-block", "margin-left": "1em" },
    class: "pageContent whiteButton",
    to: "/about"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` About Us `);
      } else {
        return [
          createTextVNode(" About Us ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Description.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const Description = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$b], ["__scopeId", "data-v-8d780645"]]);
const _sfc_main$b = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: void 0
    }
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "frontpagePanel" }, _attrs))} data-v-b240fc90><div class="frontpagePanelHeader" data-v-b240fc90><div class="frontpagePanelTitleContainer" data-v-b240fc90><h1 class="frontpagePanelTitle" data-v-b240fc90>${ssrInterpolate($props.title)}</h1><div class="frontpagePanelDescription" data-v-b240fc90>${ssrInterpolate($props.description)}</div></div>`);
  _push(ssrRenderComponent(_component_Icon, {
    style: $props.icon ? null : { display: "none" },
    filename: $props.icon,
    class: "frontpagePanelIcon"
  }, null, _parent));
  _push(`</div><div class="content" data-v-b240fc90>`);
  ssrRenderSlot(_ctx.$slots, "content", { class: "content" }, null, _push, _parent);
  _push(`</div><div class="stub" style="${ssrRenderStyle(_ctx.$slots.stub ? null : { display: "none" })}" data-v-b240fc90>`);
  ssrRenderSlot(_ctx.$slots, "stub", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Panel.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const FrontpagePanel = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$a], ["__scopeId", "data-v-b240fc90"]]);
const _sfc_main$a = {
  components: {
    FrontpagePanel
  },
  computed: {
    featuredEffects() {
      return this.$store.state.effects.list.filter((effect) => effect.featured);
    },
    visualEffects() {
      return this.featuredEffects.filter((effect) => effect.tags.includes("visual"));
    },
    cognitiveEffects() {
      return this.featuredEffects.filter((effect) => effect.tags.includes("cognitive"));
    },
    miscellaneousEffects() {
      return this.featuredEffects.filter((effect) => effect.tags.includes("miscellaneous"));
    }
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FrontpagePanel = resolveComponent("FrontpagePanel");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_FrontpagePanel, mergeProps({
    icon: "eye.svg",
    title: "Featured Effects",
    description: "A selection of subjective effects that best represent the SEI",
    class: "featuredEffects"
  }, _attrs), {
    content: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="featuredEffectsListContainer" data-v-a391e08d${_scopeId}><div class="featuredEffectsCategory" data-v-a391e08d${_scopeId}><h4 data-v-a391e08d${_scopeId}> Visual Effects </h4><!--[-->`);
        ssrRenderList($options.visualEffects, (effect, index2) => {
          _push2(`<a${ssrRenderAttr("href", `/effects/${effect.url}`)} data-v-a391e08d${_scopeId}>${ssrInterpolate(effect.name)}${ssrInterpolate(index2 < $options.visualEffects.length - 1 ? " \u22C5 " : "")}</a>`);
        });
        _push2(`<!--]--></div><div class="featuredEffectsCategory" data-v-a391e08d${_scopeId}><h4 data-v-a391e08d${_scopeId}> Cognitive Effects </h4><!--[-->`);
        ssrRenderList($options.cognitiveEffects, (effect, index2) => {
          _push2(`<a${ssrRenderAttr("href", `/effects/${effect.url}`)} data-v-a391e08d${_scopeId}>${ssrInterpolate(effect.name)}${ssrInterpolate(index2 < $options.cognitiveEffects.length - 1 ? " \u22C5 " : "")}</a>`);
        });
        _push2(`<!--]--></div><div class="featuredEffectsCategory" data-v-a391e08d${_scopeId}><h4 data-v-a391e08d${_scopeId}> Miscellaneous Effects </h4><!--[-->`);
        ssrRenderList($options.miscellaneousEffects, (effect, index2) => {
          _push2(`<a${ssrRenderAttr("href", `/effects/${effect.url}`)} data-v-a391e08d${_scopeId}>${ssrInterpolate(effect.name)}${ssrInterpolate(index2 < $options.miscellaneousEffects.length - 1 ? " \u22C5 " : "")}</a>`);
        });
        _push2(`<!--]--></div></div>`);
      } else {
        return [
          createVNode("div", { class: "featuredEffectsListContainer" }, [
            createVNode("div", { class: "featuredEffectsCategory" }, [
              createVNode("h4", null, " Visual Effects "),
              (openBlock(true), createBlock(Fragment, null, renderList($options.visualEffects, (effect, index2) => {
                return openBlock(), createBlock("a", {
                  key: effect._id,
                  href: `/effects/${effect.url}`
                }, toDisplayString(effect.name) + toDisplayString(index2 < $options.visualEffects.length - 1 ? " \u22C5 " : ""), 9, ["href"]);
              }), 128))
            ]),
            createVNode("div", { class: "featuredEffectsCategory" }, [
              createVNode("h4", null, " Cognitive Effects "),
              (openBlock(true), createBlock(Fragment, null, renderList($options.cognitiveEffects, (effect, index2) => {
                return openBlock(), createBlock("a", {
                  key: effect._id,
                  href: `/effects/${effect.url}`
                }, toDisplayString(effect.name) + toDisplayString(index2 < $options.cognitiveEffects.length - 1 ? " \u22C5 " : ""), 9, ["href"]);
              }), 128))
            ]),
            createVNode("div", { class: "featuredEffectsCategory" }, [
              createVNode("h4", null, " Miscellaneous Effects "),
              (openBlock(true), createBlock(Fragment, null, renderList($options.miscellaneousEffects, (effect, index2) => {
                return openBlock(), createBlock("a", {
                  key: effect._id,
                  href: `/effects/${effect.url}`
                }, toDisplayString(effect.name) + toDisplayString(index2 < $options.miscellaneousEffects.length - 1 ? " \u22C5 " : ""), 9, ["href"]);
              }), 128))
            ])
          ])
        ];
      }
    }),
    stub: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` For more, see the `);
        _push2(ssrRenderComponent(_component_nuxt_link, { to: "/effects/" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` Subjective Effect Index. `);
            } else {
              return [
                createTextVNode(" Subjective Effect Index. ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createTextVNode(" For more, see the "),
          createVNode(_component_nuxt_link, { to: "/effects/" }, {
            default: withCtx(() => [
              createTextVNode(" Subjective Effect Index. ")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedEffects.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const FeaturedEffects = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$9], ["__scopeId", "data-v-a391e08d"]]);
const _sfc_main$9 = {
  props: {
    title: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: ""
    },
    slug: {
      type: String,
      default: ""
    },
    substances: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    substance() {
      if (!this.substances.length) return { name: "", dose: "", roa: "" };
      else if (this.substances.length > 1) return { name: "Combination", dose: "", roa: "" };
      else {
        const [substance] = this.substances;
        const { name, dose, roa } = substance;
        return { name, dose, roa };
      }
    }
  }
};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "featuredReport" }, _attrs))}><div class="reportInfo"><div class="reportTitle"><a${ssrRenderAttr("href", `/reports/${$props.slug}`)}>${ssrInterpolate($props.title)}</a></div><div class="reportAuthor"> by <span class="reportAuthor">${ssrInterpolate($props.author)}</span></div></div><div class="reportSubstance"><div class="reportSubstanceName">${ssrInterpolate($options.substance.name)}</div><div class="reportSubstanceDoseRoa">${ssrInterpolate($options.substance.dose)} ${ssrInterpolate($options.substance.roa)}</div></div></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedReport.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const FeaturedReport = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$8]]);
const { shuffle: shuffle$2 } = lodash;
const _sfc_main$8 = {
  components: {
    FeaturedReport,
    FrontpagePanel
  },
  props: {
    numberOfReports: {
      type: Number,
      default: 3
    }
  },
  computed: {
    reports() {
      return this.$store.state.reports.list;
    },
    featuredReports() {
      const shuffledReports = shuffle$2(this.reports.filter((report) => report.featured));
      const maxReports = this.numberOfReports;
      return shuffledReports.length >= maxReports ? shuffledReports.slice(0, maxReports) : shuffledReports;
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FrontpagePanel = resolveComponent("FrontpagePanel");
  const _component_featured_report = resolveComponent("featured-report");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_FrontpagePanel, mergeProps({
    icon: "file-signature.svg",
    title: "Featured Reports",
    description: "Recommended firsthand accounts of hallucinogenic experiences"
  }, _attrs), {
    content: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="featuredReports" data-v-f653ade4${_scopeId}><!--[-->`);
        ssrRenderList($options.featuredReports, (report) => {
          _push2(ssrRenderComponent(_component_featured_report, {
            key: report.id,
            title: report.title,
            author: report.subject.name,
            slug: report.slug,
            substances: report.substances
          }, null, _parent2, _scopeId));
        });
        _push2(`<!--]--></div>`);
      } else {
        return [
          createVNode("div", { class: "featuredReports" }, [
            (openBlock(true), createBlock(Fragment, null, renderList($options.featuredReports, (report) => {
              return openBlock(), createBlock(_component_featured_report, {
                key: report.id,
                title: report.title,
                author: report.subject.name,
                slug: report.slug,
                substances: report.substances
              }, null, 8, ["title", "author", "slug", "substances"]);
            }), 128))
          ])
        ];
      }
    }),
    stub: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` For more, see the `);
        _push2(ssrRenderComponent(_component_nuxt_link, { to: "/reports/" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` reports section. `);
            } else {
              return [
                createTextVNode(" reports section. ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createTextVNode(" For more, see the "),
          createVNode(_component_nuxt_link, { to: "/reports/" }, {
            default: withCtx(() => [
              createTextVNode(" reports section. ")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedReports.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const FeaturedReports = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$7], ["__scopeId", "data-v-f653ade4"]]);
const { shuffle: shuffle$1 } = lodash;
const _sfc_main$7 = {
  components: {
    Icon: __nuxt_component_0,
    FrontpagePanel
  },
  data() {
    return {
      index: void 0
    };
  },
  computed: {
    featuredReplications() {
      const featuredReplicationFilter = (replication) => (replication.type === "image" || replication.type === "gfycat") && replication.featured;
      const featuredReplications = this.$store.state.replications.list.filter(featuredReplicationFilter);
      return shuffle$1(featuredReplications);
    },
    replication() {
      if (this.featuredReplications.length) {
        return this.index === void 0 ? this.featuredReplications[0] : this.featuredReplications[this.index];
      } else return {};
    },
    effects() {
      return this.$store.state.effects.list;
    },
    replicatedEffects() {
      if (!this.replication) return [];
      let replicatedEffectIDs = this.replication.associated_effects;
      if (!replicatedEffectIDs) return [];
      let replicatedEffects = this.effects.filter((effect) => replicatedEffectIDs.includes(effect._id));
      return replicatedEffects;
    },
    imageUrl() {
      if (this.replication.type === "image") {
        console.log(this.replication.resource);
        return this.replication.resource;
      } else return void 0;
    },
    modalData() {
      return {
        type: "image",
        resource: this.replication.resource
      };
    },
    properIntroduction() {
      let firstEffect = this.replicatedEffects[0];
      const nonplurl = "A replication of ";
      const plurl = "A replication of an ";
      const exceptions = [
        "Autonomous entity",
        "Internal hallucination",
        "External hallucination"
      ];
      if (firstEffect && exceptions.includes(this.replicatedEffects[0].name)) return plurl;
      return nonplurl;
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit("modal/set_data", this.modalData);
      this.$store.commit("modal/toggle");
    },
    nextImage() {
      if (this.index === void 0) this.index = 0;
      let maxIndex = this.featuredReplications.length - 1;
      if (this.index < maxIndex) this.index = this.index + 1;
      else this.index = 0;
    },
    previousImage() {
      if (this.index === void 0) this.index = 0;
      let maxIndex = this.featuredReplications.length - 1;
      if (this.index > 0) this.index = this.index - 1;
      else this.index = maxIndex;
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FrontpagePanel = resolveComponent("FrontpagePanel");
  const _component_Icon = __nuxt_component_0;
  const _component_nuxt_link = __nuxt_component_0$1;
  const _directive_touch = resolveDirective("touch");
  _push(ssrRenderComponent(_component_FrontpagePanel, mergeProps({
    icon: "images.svg",
    title: "Featured Replications",
    description: "Artistic representations of specific subjective effects"
  }, _attrs), {
    content: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div${ssrRenderAttrs(mergeProps({
          style: "background-image: url('" + $options.imageUrl + "');",
          class: "replicationImage"
        }, ssrGetDirectiveProps(_ctx, _directive_touch, $options.nextImage, "swipe", { left: true }), ssrGetDirectiveProps(_ctx, _directive_touch, $options.previousImage, "swipe", { right: true })))} data-v-2787c4f0${_scopeId}>`);
        if ($options.replication && $options.replication.type === "gfycat") {
          _push2(`<div style="${ssrRenderStyle({ "position": "relative", "height": "300px" })}" data-v-2787c4f0${_scopeId}><iframe${ssrRenderAttr("src", `https://streamable.com/e/${$options.replication.resource}?autoplay=1&loop=1`)} frameborder="0" scrolling="no" width="100%" height="100%" style="${ssrRenderStyle({ "position": "absolute", "top": "-5px", "left": "0" })}" allowfullscreen data-v-2787c4f0${_scopeId}></iframe></div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<div class="replicationControls previous" data-v-2787c4f0${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Icon, {
          filename: "chevron-double-left.svg",
          color: "white"
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="replicationControls next" data-v-2787c4f0${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Icon, {
          filename: "chevron-double-right.svg",
          color: "white"
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="replicationImageDescription" data-v-2787c4f0${_scopeId}>${ssrInterpolate($options.properIntroduction)} <!--[-->`);
        ssrRenderList($options.replicatedEffects, (effect, i) => {
          _push2(`<span class="replicationEffect" data-v-2787c4f0${_scopeId}>`);
          if (i > 0 && i === $options.replicatedEffects.length - 1) {
            _push2(`<span data-v-2787c4f0${_scopeId}> and </span>`);
          } else if (i > 0) {
            _push2(`<span data-v-2787c4f0${_scopeId}>,</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(ssrRenderComponent(_component_nuxt_link, {
            to: "/effects/" + effect.url
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`${ssrInterpolate(effect.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(effect.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          _push2(`</span>`);
        });
        _push2(`<!--]--><div class="replicationArtist" data-v-2787c4f0${_scopeId}> by ${ssrInterpolate($options.replication.artist)}</div></div></div>`);
      } else {
        return [
          withDirectives((openBlock(), createBlock("div", {
            style: "background-image: url('" + $options.imageUrl + "');",
            class: "replicationImage",
            onClick: $options.toggleModal
          }, [
            $options.replication && $options.replication.type === "gfycat" ? (openBlock(), createBlock("div", {
              key: 0,
              style: { "position": "relative", "height": "300px" }
            }, [
              createVNode("iframe", {
                src: `https://streamable.com/e/${$options.replication.resource}?autoplay=1&loop=1`,
                frameborder: "0",
                scrolling: "no",
                width: "100%",
                height: "100%",
                style: { "position": "absolute", "top": "-5px", "left": "0" },
                allowfullscreen: ""
              }, null, 8, ["src"])
            ])) : createCommentVNode("", true),
            createVNode("div", {
              class: "replicationControls previous",
              onClick: withModifiers($options.previousImage, ["stop"])
            }, [
              createVNode(_component_Icon, {
                filename: "chevron-double-left.svg",
                color: "white"
              })
            ], 8, ["onClick"]),
            createVNode("div", {
              class: "replicationControls next",
              onClick: withModifiers($options.nextImage, ["stop"])
            }, [
              createVNode(_component_Icon, {
                filename: "chevron-double-right.svg",
                color: "white"
              })
            ], 8, ["onClick"]),
            createVNode("div", {
              class: "replicationImageDescription",
              onClick: withModifiers(() => {
              }, ["stop"])
            }, [
              createTextVNode(toDisplayString($options.properIntroduction) + " ", 1),
              (openBlock(true), createBlock(Fragment, null, renderList($options.replicatedEffects, (effect, i) => {
                return openBlock(), createBlock("span", {
                  key: effect._id,
                  class: "replicationEffect"
                }, [
                  i > 0 && i === $options.replicatedEffects.length - 1 ? (openBlock(), createBlock("span", { key: 0 }, " and ")) : i > 0 ? (openBlock(), createBlock("span", { key: 1 }, ",")) : createCommentVNode("", true),
                  createVNode(_component_nuxt_link, {
                    to: "/effects/" + effect.url
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(effect.name), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"])
                ]);
              }), 128)),
              createVNode("div", { class: "replicationArtist" }, " by " + toDisplayString($options.replication.artist), 1)
            ], 8, ["onClick"])
          ], 12, ["onClick"])), [
            [
              _directive_touch,
              $options.nextImage,
              "swipe",
              { left: true }
            ],
            [
              _directive_touch,
              $options.previousImage,
              "swipe",
              { right: true }
            ]
          ])
        ];
      }
    }),
    stub: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` For more, see the `);
        _push2(ssrRenderComponent(_component_nuxt_link, { to: "/replications/" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` replications gallery. `);
            } else {
              return [
                createTextVNode(" replications gallery. ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createTextVNode(" For more, see the "),
          createVNode(_component_nuxt_link, { to: "/replications/" }, {
            default: withCtx(() => [
              createTextVNode(" replications gallery. ")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedReplications.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const FeaturedReplications = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-2787c4f0"]]);
const _sfc_main$6 = {
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
    },
    authors() {
      const { authors } = this.article;
      let str = "";
      if (authors) {
        authors.forEach((author, index2) => {
          str += author.full_name;
          if (index2 < authors.length - 2) {
            str += ", ";
          } else if (index2 < authors.length - 1) {
            str += " and ";
          }
        });
      }
      return str;
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "featuredArticle" }, _attrs))}><div class="articleTitle"><a${ssrRenderAttr("href", `/articles/${$props.article.slug}`)}>${ssrInterpolate($props.article.title)}</a></div><div class="articleAuthors"> by ${ssrInterpolate($options.authors)}</div><div class="articleInfo"><div class="publicationDate">${ssrInterpolate($options.publicationDate)}</div><div class="separator"> \xB7 </div><div class="articleLength">${ssrInterpolate($options.readTime)} min read </div></div><p class="articleDescription">${ssrInterpolate($props.article.short_description)}</p></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedArticle.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const FeaturedArticle = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5]]);
const { shuffle } = lodash;
const _sfc_main$5 = {
  components: {
    FeaturedArticle,
    FrontpagePanel
  },
  props: {
    numberOfArticles: {
      type: Number,
      default: 1
    }
  },
  computed: {
    articles() {
      return this.$store.state.articles.list;
    },
    featuredArticles() {
      const shuffled = shuffle(this.articles.filter((article) => article.featured));
      const maxArticles = this.numberOfArticles;
      return shuffled.length >= maxArticles ? shuffled.slice(0, maxArticles) : shuffled;
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FrontpagePanel = resolveComponent("FrontpagePanel");
  const _component_featured_article = resolveComponent("featured-article");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_FrontpagePanel, mergeProps({
    icon: "file-invoice.svg",
    title: "Featured Article",
    description: "Analyses that go beyond individual subjective effects"
  }, _attrs), {
    content: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="featuredArticles" data-v-a6c26ec4${_scopeId}><!--[-->`);
        ssrRenderList($options.featuredArticles, (article) => {
          _push2(ssrRenderComponent(_component_featured_article, {
            key: article.id,
            article
          }, null, _parent2, _scopeId));
        });
        _push2(`<!--]--></div>`);
      } else {
        return [
          createVNode("div", { class: "featuredArticles" }, [
            (openBlock(true), createBlock(Fragment, null, renderList($options.featuredArticles, (article) => {
              return openBlock(), createBlock(_component_featured_article, {
                key: article.id,
                article
              }, null, 8, ["article"]);
            }), 128))
          ])
        ];
      }
    }),
    stub: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` For more, see the `);
        _push2(ssrRenderComponent(_component_nuxt_link, { to: "/articles/" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` articles section. `);
            } else {
              return [
                createTextVNode(" articles section. ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createTextVNode(" For more, see the "),
          createVNode(_component_nuxt_link, { to: "/articles/" }, {
            default: withCtx(() => [
              createTextVNode(" articles section. ")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedArticles.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const FeaturedArticles = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-a6c26ec4"]]);
const _sfc_main$4 = {
  name: "FeaturedSponsor",
  components: {
    FrontpagePanel,
    ExtLink: __nuxt_component_1$1
  },
  props: {
    sponsorName: {
      type: String,
      default: void 0
    },
    sponsorIconPath: {
      type: String,
      default: void 0
    },
    sponsorLink: {
      type: String,
      default: void 0
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FrontpagePanel = resolveComponent("FrontpagePanel");
  const _component_ext_link = __nuxt_component_1$1;
  if ($props.sponsorName) {
    _push(ssrRenderComponent(_component_FrontpagePanel, mergeProps({
      icon: "heart.svg",
      title: `Thank you ${$props.sponsorName}!`,
      class: "featuredSponsorPanel"
    }, _attrs), createSlots({
      content: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<div class="featuredSponsor" data-v-d30b1f4d${_scopeId}>`);
          if ($props.sponsorIconPath && $props.sponsorLink) {
            _push2(`<div data-v-d30b1f4d${_scopeId}>`);
            _push2(ssrRenderComponent(_component_ext_link, { href: $props.sponsorLink }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", $props.sponsorIconPath)}${ssrRenderAttr("alt", `${$props.sponsorName} logo`)} class="sponsorIcon" data-v-d30b1f4d${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: $props.sponsorIconPath,
                      alt: `${$props.sponsorName} logo`,
                      class: "sponsorIcon"
                    }, null, 8, ["src", "alt"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          return [
            createVNode("div", { class: "featuredSponsor" }, [
              $props.sponsorIconPath && $props.sponsorLink ? (openBlock(), createBlock("div", { key: 0 }, [
                createVNode(_component_ext_link, { href: $props.sponsorLink }, {
                  default: withCtx(() => [
                    createVNode("img", {
                      src: $props.sponsorIconPath,
                      alt: `${$props.sponsorName} logo`,
                      class: "sponsorIcon"
                    }, null, 8, ["src", "alt"])
                  ]),
                  _: 1
                }, 8, ["href"])
              ])) : createCommentVNode("", true)
            ])
          ];
        }
      }),
      _: 2
    }, [
      $props.sponsorLink ? {
        name: "stub",
        fn: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Thank you to our wonderful sponsor, `);
            _push2(ssrRenderComponent(_component_ext_link, { href: $props.sponsorLink }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate($props.sponsorName)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString($props.sponsorName), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Thank you to our wonderful sponsor, "),
              createVNode(_component_ext_link, { href: $props.sponsorLink }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString($props.sponsorName), 1)
                ]),
                _: 1
              }, 8, ["href"])
            ];
          }
        }),
        key: "0"
      } : void 0
    ]), _parent));
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedSponsor.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const FeaturedSponsor = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-d30b1f4d"]]);
const _sfc_main$3 = {
  components: {
    FrontpagePanel
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FrontpagePanel = resolveComponent("FrontpagePanel");
  _push(ssrRenderComponent(_component_FrontpagePanel, mergeProps({
    icon: "flask.svg",
    title: "Substance Summaries",
    description: "Hallucinogenic substance classes, broken down and described"
  }, _attrs), {
    content: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<ul class="summaryList" data-v-41962cc5${_scopeId}><li class="summaryItem" data-v-41962cc5${_scopeId}><span style="${ssrRenderStyle({ "color": "#333" })}" data-v-41962cc5${_scopeId}> Psychedelics: </span><a href="/summaries/psychedelics/visual" data-v-41962cc5${_scopeId}> Visual, </a><a href="/summaries/psychedelics/cognitive" data-v-41962cc5${_scopeId}> Cognitive, </a><a href="/summaries/psychedelics/miscellaneous" data-v-41962cc5${_scopeId}> Miscellaneous </a></li><li class="summaryItem" data-v-41962cc5${_scopeId}><a href="/summaries/dissociatives" data-v-41962cc5${_scopeId}> Dissociatives </a></li><li class="summaryItem" data-v-41962cc5${_scopeId}><a href="/summaries/deliriants" data-v-41962cc5${_scopeId}> Deliriants </a></li></ul>`);
      } else {
        return [
          createVNode("ul", { class: "summaryList" }, [
            createVNode("li", { class: "summaryItem" }, [
              createVNode("span", { style: { "color": "#333" } }, " Psychedelics: "),
              createVNode("a", { href: "/summaries/psychedelics/visual" }, " Visual, "),
              createVNode("a", { href: "/summaries/psychedelics/cognitive" }, " Cognitive, "),
              createVNode("a", { href: "/summaries/psychedelics/miscellaneous" }, " Miscellaneous ")
            ]),
            createVNode("li", { class: "summaryItem" }, [
              createVNode("a", { href: "/summaries/dissociatives" }, " Dissociatives ")
            ]),
            createVNode("li", { class: "summaryItem" }, [
              createVNode("a", { href: "/summaries/deliriants" }, " Deliriants ")
            ])
          ])
        ];
      }
    }),
    stub: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` For more, see the <a href="/articles/" data-v-41962cc5${_scopeId}> articles section. </a>`);
      } else {
        return [
          createTextVNode(" For more, see the "),
          createVNode("a", { href: "/articles/" }, " articles section. ")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/SubstanceSummaries.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SubstanceSummaries = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-41962cc5"]]);
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "column" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Column.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "columns" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Columns.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Columns = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { $store } = useNuxtApp();
    const formatFailure = (reason) => {
      var _a, _b, _c, _d, _e, _f;
      const statusCode = (reason == null ? void 0 : reason.statusCode) || ((_a = reason == null ? void 0 : reason.response) == null ? void 0 : _a.status) || ((_b = reason == null ? void 0 : reason.data) == null ? void 0 : _b.statusCode);
      const errorName = ((_d = (_c = reason == null ? void 0 : reason.data) == null ? void 0 : _c.error) == null ? void 0 : _d.name) || (reason == null ? void 0 : reason.name) || "Error";
      const message = ((_f = (_e = reason == null ? void 0 : reason.data) == null ? void 0 : _e.error) == null ? void 0 : _f.message) || (reason == null ? void 0 : reason.statusMessage) || (reason == null ? void 0 : reason.message) || "Unknown error";
      return `${statusCode ? `${statusCode} ` : ""}${errorName}: ${message}`;
    };
    const { data: prefetchData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home:prefetch", async () => {
      const prefetchTasks = [
        { label: "effects", promise: $store.dispatch("effects/get") },
        { label: "replications", promise: $store.dispatch("replications/featured") },
        { label: "reports", promise: $store.dispatch("reports/get") },
        { label: "articles", promise: $store.dispatch("articles/get") }
      ];
      const results = await Promise.allSettled(prefetchTasks.map((task) => task.promise));
      const failed = results.map((result, index2) => ({ result, label: prefetchTasks[index2].label })).filter((entry) => entry.result.status === "rejected");
      if (failed.length === 0) {
        return { message: "" };
      }
      const failureDetails = failed.map((entry) => `${entry.label} (${formatFailure(entry.result.reason)})`).join("; ");
      return {
        message: `Some homepage content is unavailable. ${failureDetails}. Check /api/health for database status when running locally.`
      };
    })), __temp = await __temp, __restore(), __temp);
    const prefetchMessage = computed(() => {
      var _a;
      return ((_a = prefetchData.value) == null ? void 0 : _a.message) || "";
    });
    computed(() => {
      return $store.state.replications.list.filter((replication) => replication.type === "image");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-cdb62676>`);
      _push(ssrRenderComponent(unref(Description), null, null, _parent));
      if (unref(prefetchMessage)) {
        _push(`<div class="dataWarning" data-v-cdb62676>${ssrInterpolate(unref(prefetchMessage))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(FrontpageArticle), null, null, _parent));
      _push(ssrRenderComponent(unref(Columns), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Column), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FeaturedSponsor), {
                    "sponsor-name": "Emergence Benefactors",
                    "sponsor-link": "https://ebenefactors.org/",
                    "sponsor-icon-path": "/ebenefactors.png"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(SubstanceSummaries), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FeaturedEffects), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FeaturedArticles), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(FeaturedSponsor), {
                      "sponsor-name": "Emergence Benefactors",
                      "sponsor-link": "https://ebenefactors.org/",
                      "sponsor-icon-path": "/ebenefactors.png"
                    }),
                    createVNode(unref(SubstanceSummaries)),
                    createVNode(unref(FeaturedEffects)),
                    createVNode(unref(FeaturedArticles))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Column), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_client_only, null, {}, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FeaturedReports), { "number-of-reports": 8 }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_client_only, null, {
                      default: withCtx(() => [
                        createVNode(unref(FeaturedReplications))
                      ]),
                      _: 1
                    }),
                    createVNode(unref(FeaturedReports), { "number-of-reports": 8 })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Column), null, {
                default: withCtx(() => [
                  createVNode(unref(FeaturedSponsor), {
                    "sponsor-name": "Emergence Benefactors",
                    "sponsor-link": "https://ebenefactors.org/",
                    "sponsor-icon-path": "/ebenefactors.png"
                  }),
                  createVNode(unref(SubstanceSummaries)),
                  createVNode(unref(FeaturedEffects)),
                  createVNode(unref(FeaturedArticles))
                ]),
                _: 1
              }),
              createVNode(unref(Column), null, {
                default: withCtx(() => [
                  createVNode(_component_client_only, null, {
                    default: withCtx(() => [
                      createVNode(unref(FeaturedReplications))
                    ]),
                    _: 1
                  }),
                  createVNode(unref(FeaturedReports), { "number-of-reports": 8 })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cdb62676"]]);

export { index as default };
//# sourceMappingURL=index-47v_1Cw3.mjs.map
