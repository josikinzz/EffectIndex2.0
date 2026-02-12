import { ref, watch, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { i as useRoute, a as useNuxtApp, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
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

const _sfc_main$7 = {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: [String, void 0],
      default: "All"
    }
  },
  methods: {
    selectTab(name) {
      this.$emit("selectTab", name);
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "tabsContainer" }, _attrs))} data-v-66a64b21><ul class="tabsList" data-v-66a64b21><!--[-->`);
  ssrRenderList($props.tabs, (tab, i) => {
    _push(`<li class="${ssrRenderClass([{ "selected": $props.activeTab === tab }, "tabsListItem"])}" data-v-66a64b21>${ssrInterpolate(tab)}</li>`);
  });
  _push(`<!--]--></ul>`);
  ssrRenderSlot(_ctx.$slots, $props.activeTab, { ref: "tab" }, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Tabs.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Tabs = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-66a64b21"]]);
const _sfc_main$6 = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "tab" }, _attrs))} data-v-5d6d514d>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Tab.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const Tab = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-5d6d514d"]]);
const _sfc_main$5 = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    page: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "categoryContainer" }, _attrs))} data-v-cf9878ac><h3 class="categoryTitle" data-v-cf9878ac>`);
  if ($props.page) {
    _push(ssrRenderComponent(_component_nuxt_link, { to: $props.page }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.title)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.title), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<!--[-->${ssrInterpolate($props.title)}<!--]-->`);
  }
  if ($props.icon) {
    _push(ssrRenderComponent(_component_Icon, {
      filename: $props.icon,
      class: "panelIcon"
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</h3><div class="actionContainer" data-v-cf9878ac>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Category.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Category = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-cf9878ac"]]);
const _sfc_main$4 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "column" }, _attrs))} data-v-8487d74c>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Column.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-8487d74c"]]);
const _sfc_main$3 = {
  props: {
    title: {
      type: String,
      default: void 0
    },
    page: {
      type: String,
      default: void 0
    },
    effects: {
      type: Array,
      default: () => []
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "action" }, _attrs))} data-v-adc8d605><h4 class="actionTitle" style="${ssrRenderStyle($props.title ? null : { display: "none" })}" data-v-adc8d605>`);
  if ($props.page) {
    _push(`<a${ssrRenderAttr("href", $props.page)} data-v-adc8d605>${ssrInterpolate($props.title)}</a>`);
  } else {
    _push(`<!--[-->${ssrInterpolate($props.title)}<!--]-->`);
  }
  _push(`</h4><ul class="actionList" data-v-adc8d605><!--[-->`);
  ssrRenderList($props.effects, (effect) => {
    _push(`<li class="effectTitle" data-v-adc8d605><a${ssrRenderAttr("href", `/effects/${effect.url}`)} data-v-adc8d605>${ssrInterpolate(effect.name)}</a>`);
    if (effect.subarticles && effect.subarticles.length) {
      _push(`<ul class="subarticleList" data-v-adc8d605><!--[-->`);
      ssrRenderList(effect.subarticles, (subarticle, index) => {
        _push(`<li class="subarticleListItem" data-v-adc8d605><a${ssrRenderAttr("href", `/effects/${effect.url}?s=${subarticle.id}`)} data-v-adc8d605>${ssrInterpolate(subarticle.title)}</a></li>`);
      });
      _push(`<!--]--></ul>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</li>`);
  });
  _push(`<!--]--></ul></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Actions.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Actions = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-adc8d605"]]);
const _sfc_main$2 = {
  data() {
    return {
      show: false
    };
  },
  computed: {
    effectCount() {
      return this.$store.state.effects.list.length;
    }
  },
  methods: {
    toggleText() {
      this.show = !this.show;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "descriptionContainer" }, _attrs))} data-v-3a928173><p data-v-3a928173> The <span style="${ssrRenderStyle({ "font-weight": "bold" })}" data-v-3a928173> Subjective Effect Index </span> is a set of articles designed to serve as a comprehensive catalogue and reference for the range of subjective effects that may occur under the influence of psychoactive substances and other psychonautic techniques. </p><div class="showMoreContainer" style="${ssrRenderStyle($data.show ? null : { display: "none" })}" data-v-3a928173><p data-v-3a928173> The effects listed here are accompanied by detailed descriptions on the subjective experiences of them. They are written in a consistent and formal `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/documentation-style-guide" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` writing style `);
      } else {
        return [
          createTextVNode(" writing style ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` that avoids the use of flowery metaphors or analogy; instead, they strive to use simple and accessible language. This is done with the hope that they will eventually serve as a universal terminology set that enables people to better communicate and share experiences that are, by nature, difficult to convey. </p><p data-v-3a928173> The Index is separated into ${ssrInterpolate($options.effectCount)} effects, which are organised into categories based on the senses they affect and their behavior. Many of these are further broken down into leveling systems, subcomponents, and style variations that may occur across different substances. Detailed image, video, and audio `);
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
  _push(` have been included wherever possible to supplement text-based descriptions. </p><p data-v-3a928173> The content within this Index is based on the collective experiences of our contributors, scientific literature, and individual case reports. The Index itself, as well as a majority of the content, was originally created by our site founder `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/profiles/Josie" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Josie Kins. `);
      } else {
        return [
          createTextVNode(" Josie Kins. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</p></div><div class="buttonContainer" data-v-3a928173><button class="whiteButton" data-v-3a928173>${ssrInterpolate($data.show ? "Read Less" : "Read More")}</button></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Description.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Description = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-3a928173"]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "blob" }, _attrs))} data-v-e90b9e47>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/index/Blob.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Blob = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e90b9e47"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Subjective Effect Index" });
    const route = useRoute();
    const { $store } = useNuxtApp();
    const activeTab = ref(route.query.type);
    watch(() => route.query.type, (type) => {
      activeTab.value = type;
    });
    [__temp, __restore] = withAsyncContext(async () => useAsyncData("effects:index", async () => {
      await $store.dispatch("effects/get");
      return true;
    })), await __temp, __restore();
    const effects = computed(() => $store.state.effects.list);
    const filterEffectsByTag = (...tags) => {
      return effects.value.filter(
        (effect) => tags.every((tag) => effect.tags.indexOf(tag) > -1)
      );
    };
    const selectTab = (name) => {
      activeTab.value = name;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "sitemap.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`<h1> Subjective Effect Index </h1>`);
      _push(ssrRenderComponent(unref(Description), null, null, _parent));
      _push(ssrRenderComponent(unref(Tabs), {
        tabs: ["All", "Sensory", "Cognitive", "Physical"],
        "active-tab": unref(activeTab),
        onSelectTab: selectTab
      }, {
        All: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Tab), { style: { "padding-top": "1em" } }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "eye.svg",
                          title: "Visual Effects",
                          page: "/categories/visual-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "amplification"),
                                title: "Amplifications",
                                page: "/categories/visual-amplifications"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "suppression"),
                                title: "Suppressions",
                                page: "/categories/visual-suppressions"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "distortion"),
                                title: "Distortions",
                                page: "/categories/visual-distortions"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "geometric"),
                                title: "Geometric Patterns",
                                page: "/categories/geometric-patterns"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "hallucinatory state"),
                                title: "Hallucinatory States",
                                page: "/categories/hallucinatory-states"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "amplification"),
                                  title: "Amplifications",
                                  page: "/categories/visual-amplifications"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "suppression"),
                                  title: "Suppressions",
                                  page: "/categories/visual-suppressions"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "distortion"),
                                  title: "Distortions",
                                  page: "/categories/visual-distortions"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "geometric"),
                                  title: "Geometric Patterns",
                                  page: "/categories/geometric-patterns"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "hallucinatory state"),
                                  title: "Hallucinatory States",
                                  page: "/categories/hallucinatory-states"
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "volume-up.svg",
                          title: "Auditory Effects",
                          page: "/categories/auditory-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("auditory")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("auditory")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "hand-paper.svg",
                          title: "Tactile Effects",
                          page: "/categories/tactile-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("tactile")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("tactile")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "utensils.svg",
                          title: "Smell & Taste Effects",
                          page: "/categories/smell-and-taste-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("gustatory"),
                                title: "Gustatory Effects"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("olfactory"),
                                title: "Olfactory Effects"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("gustatory"),
                                  title: "Gustatory Effects"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("olfactory"),
                                  title: "Olfactory Effects"
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "cogs.svg",
                          title: "Multisensory Effects",
                          page: "/categories/multisensory-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("multisensory")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("multisensory")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "eye.svg",
                            title: "Visual Effects",
                            page: "/categories/visual-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "amplification"),
                                title: "Amplifications",
                                page: "/categories/visual-amplifications"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "suppression"),
                                title: "Suppressions",
                                page: "/categories/visual-suppressions"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "distortion"),
                                title: "Distortions",
                                page: "/categories/visual-distortions"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "geometric"),
                                title: "Geometric Patterns",
                                page: "/categories/geometric-patterns"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "hallucinatory state"),
                                title: "Hallucinatory States",
                                page: "/categories/hallucinatory-states"
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "volume-up.svg",
                            title: "Auditory Effects",
                            page: "/categories/auditory-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("auditory")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "hand-paper.svg",
                            title: "Tactile Effects",
                            page: "/categories/tactile-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("tactile")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "utensils.svg",
                            title: "Smell & Taste Effects",
                            page: "/categories/smell-and-taste-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("gustatory"),
                                title: "Gustatory Effects"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("olfactory"),
                                title: "Olfactory Effects"
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "cogs.svg",
                            title: "Multisensory Effects",
                            page: "/categories/multisensory-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("multisensory")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "user.svg",
                          title: "Cognitive Effects",
                          page: "/categories/cognitive-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "amplification"),
                                page: "/categories/cognitive-amplifications",
                                title: "Amplifications"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "suppression"),
                                page: "/categories/cognitive-suppressions",
                                title: "Suppressions"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "novel"),
                                page: "/categories/novel-cognitive-states",
                                title: "Novel States"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "psychological state"),
                                page: "/categories/psychological-states",
                                title: "Psychological States"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "transpersonal state"),
                                page: "/categories/transpersonal-states",
                                title: "Transpersonal States"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "amplification"),
                                  page: "/categories/cognitive-amplifications",
                                  title: "Amplifications"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "suppression"),
                                  page: "/categories/cognitive-suppressions",
                                  title: "Suppressions"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "novel"),
                                  page: "/categories/novel-cognitive-states",
                                  title: "Novel States"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "psychological state"),
                                  page: "/categories/psychological-states",
                                  title: "Psychological States"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "transpersonal state"),
                                  page: "/categories/transpersonal-states",
                                  title: "Transpersonal States"
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "user.svg",
                            title: "Cognitive Effects",
                            page: "/categories/cognitive-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "amplification"),
                                page: "/categories/cognitive-amplifications",
                                title: "Amplifications"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "suppression"),
                                page: "/categories/cognitive-suppressions",
                                title: "Suppressions"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "novel"),
                                page: "/categories/novel-cognitive-states",
                                title: "Novel States"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "psychological state"),
                                page: "/categories/psychological-states",
                                title: "Psychological States"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "transpersonal state"),
                                page: "/categories/transpersonal-states",
                                title: "Transpersonal States"
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "heart-rate.svg",
                          title: "Physical Effects",
                          page: "/categories/physical-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "amplification"),
                                page: "/categories/physical-amplifications",
                                title: "Amplifications"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "suppression"),
                                page: "/categories/physical-suppressions",
                                title: "Suppressions"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "alteration"),
                                page: "/categories/physical-alterations",
                                title: "Alterations"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("uncomfortable", "bodily"),
                                page: "/categories/uncomfortable-bodily-effects",
                                title: "Uncomfortable bodily effects"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("uncomfortable", "cardiovascular"),
                                page: "/categories/cardiovascular-effects",
                                title: "Cardiovascular"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("uncomfortable", "neurological"),
                                page: "/categories/neurological-effects",
                                title: "Neurological"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "amplification"),
                                  page: "/categories/physical-amplifications",
                                  title: "Amplifications"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "suppression"),
                                  page: "/categories/physical-suppressions",
                                  title: "Suppressions"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "alteration"),
                                  page: "/categories/physical-alterations",
                                  title: "Alterations"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("uncomfortable", "bodily"),
                                  page: "/categories/uncomfortable-bodily-effects",
                                  title: "Uncomfortable bodily effects"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("uncomfortable", "cardiovascular"),
                                  page: "/categories/cardiovascular-effects",
                                  title: "Cardiovascular"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("uncomfortable", "neurological"),
                                  page: "/categories/neurological-effects",
                                  title: "Neurological"
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "heart-rate.svg",
                            title: "Physical Effects",
                            page: "/categories/physical-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "amplification"),
                                page: "/categories/physical-amplifications",
                                title: "Amplifications"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "suppression"),
                                page: "/categories/physical-suppressions",
                                title: "Suppressions"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "alteration"),
                                page: "/categories/physical-alterations",
                                title: "Alterations"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("uncomfortable", "bodily"),
                                page: "/categories/uncomfortable-bodily-effects",
                                title: "Uncomfortable bodily effects"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("uncomfortable", "cardiovascular"),
                                page: "/categories/cardiovascular-effects",
                                title: "Cardiovascular"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("uncomfortable", "neurological"),
                                page: "/categories/neurological-effects",
                                title: "Neurological"
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "eye.svg",
                          title: "Visual Effects",
                          page: "/categories/visual-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "amplification"),
                              title: "Amplifications",
                              page: "/categories/visual-amplifications"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "suppression"),
                              title: "Suppressions",
                              page: "/categories/visual-suppressions"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "distortion"),
                              title: "Distortions",
                              page: "/categories/visual-distortions"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "geometric"),
                              title: "Geometric Patterns",
                              page: "/categories/geometric-patterns"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "hallucinatory state"),
                              title: "Hallucinatory States",
                              page: "/categories/hallucinatory-states"
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "volume-up.svg",
                          title: "Auditory Effects",
                          page: "/categories/auditory-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("auditory")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "hand-paper.svg",
                          title: "Tactile Effects",
                          page: "/categories/tactile-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("tactile")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "utensils.svg",
                          title: "Smell & Taste Effects",
                          page: "/categories/smell-and-taste-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("gustatory"),
                              title: "Gustatory Effects"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("olfactory"),
                              title: "Olfactory Effects"
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "cogs.svg",
                          title: "Multisensory Effects",
                          page: "/categories/multisensory-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("multisensory")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "user.svg",
                          title: "Cognitive Effects",
                          page: "/categories/cognitive-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "amplification"),
                              page: "/categories/cognitive-amplifications",
                              title: "Amplifications"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "suppression"),
                              page: "/categories/cognitive-suppressions",
                              title: "Suppressions"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "novel"),
                              page: "/categories/novel-cognitive-states",
                              title: "Novel States"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "psychological state"),
                              page: "/categories/psychological-states",
                              title: "Psychological States"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "transpersonal state"),
                              page: "/categories/transpersonal-states",
                              title: "Transpersonal States"
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "heart-rate.svg",
                          title: "Physical Effects",
                          page: "/categories/physical-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "amplification"),
                              page: "/categories/physical-amplifications",
                              title: "Amplifications"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "suppression"),
                              page: "/categories/physical-suppressions",
                              title: "Suppressions"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "alteration"),
                              page: "/categories/physical-alterations",
                              title: "Alterations"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("uncomfortable", "bodily"),
                              page: "/categories/uncomfortable-bodily-effects",
                              title: "Uncomfortable bodily effects"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("uncomfortable", "cardiovascular"),
                              page: "/categories/cardiovascular-effects",
                              title: "Cardiovascular"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("uncomfortable", "neurological"),
                              page: "/categories/neurological-effects",
                              title: "Neurological"
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Tab), { style: { "padding-top": "1em" } }, {
                default: withCtx(() => [
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "eye.svg",
                        title: "Visual Effects",
                        page: "/categories/visual-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "amplification"),
                            title: "Amplifications",
                            page: "/categories/visual-amplifications"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "suppression"),
                            title: "Suppressions",
                            page: "/categories/visual-suppressions"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "distortion"),
                            title: "Distortions",
                            page: "/categories/visual-distortions"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "geometric"),
                            title: "Geometric Patterns",
                            page: "/categories/geometric-patterns"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "hallucinatory state"),
                            title: "Hallucinatory States",
                            page: "/categories/hallucinatory-states"
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "volume-up.svg",
                        title: "Auditory Effects",
                        page: "/categories/auditory-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("auditory")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "hand-paper.svg",
                        title: "Tactile Effects",
                        page: "/categories/tactile-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("tactile")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "utensils.svg",
                        title: "Smell & Taste Effects",
                        page: "/categories/smell-and-taste-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("gustatory"),
                            title: "Gustatory Effects"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("olfactory"),
                            title: "Olfactory Effects"
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "cogs.svg",
                        title: "Multisensory Effects",
                        page: "/categories/multisensory-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("multisensory")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "user.svg",
                        title: "Cognitive Effects",
                        page: "/categories/cognitive-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "amplification"),
                            page: "/categories/cognitive-amplifications",
                            title: "Amplifications"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "suppression"),
                            page: "/categories/cognitive-suppressions",
                            title: "Suppressions"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "novel"),
                            page: "/categories/novel-cognitive-states",
                            title: "Novel States"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "psychological state"),
                            page: "/categories/psychological-states",
                            title: "Psychological States"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "transpersonal state"),
                            page: "/categories/transpersonal-states",
                            title: "Transpersonal States"
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "heart-rate.svg",
                        title: "Physical Effects",
                        page: "/categories/physical-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "amplification"),
                            page: "/categories/physical-amplifications",
                            title: "Amplifications"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "suppression"),
                            page: "/categories/physical-suppressions",
                            title: "Suppressions"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "alteration"),
                            page: "/categories/physical-alterations",
                            title: "Alterations"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("uncomfortable", "bodily"),
                            page: "/categories/uncomfortable-bodily-effects",
                            title: "Uncomfortable bodily effects"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("uncomfortable", "cardiovascular"),
                            page: "/categories/cardiovascular-effects",
                            title: "Cardiovascular"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("uncomfortable", "neurological"),
                            page: "/categories/neurological-effects",
                            title: "Neurological"
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        Sensory: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Tab), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Blob), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p${_scopeId3}><b${_scopeId3}> Sensory effects </b> are subjective effects that directly alter a person&#39;s senses. These can include any combination of sight, sound, touch, taste, and smell. </p>`);
                      } else {
                        return [
                          createVNode("p", null, [
                            createVNode("b", null, " Sensory effects "),
                            createTextVNode(" are subjective effects that directly alter a person's senses. These can include any combination of sight, sound, touch, taste, and smell. ")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "eye.svg",
                          title: "Visual Effects",
                          page: "/categories/visual-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "amplification"),
                                title: "Amplifications",
                                page: "/categories/visual-amplifications"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "suppression"),
                                title: "Suppressions",
                                page: "/categories/visual-suppressions"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "distortion"),
                                title: "Distortions",
                                page: "/categories/visual-distortions"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "geometric"),
                                title: "Geometric Patterns",
                                page: "/categories/geometric-patterns"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("visual", "hallucinatory state"),
                                title: "Hallucinatory States",
                                page: "/categories/hallucinatory-states"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "amplification"),
                                  title: "Amplifications",
                                  page: "/categories/visual-amplifications"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "suppression"),
                                  title: "Suppressions",
                                  page: "/categories/visual-suppressions"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "distortion"),
                                  title: "Distortions",
                                  page: "/categories/visual-distortions"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "geometric"),
                                  title: "Geometric Patterns",
                                  page: "/categories/geometric-patterns"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("visual", "hallucinatory state"),
                                  title: "Hallucinatory States",
                                  page: "/categories/hallucinatory-states"
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "eye.svg",
                            title: "Visual Effects",
                            page: "/categories/visual-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "amplification"),
                                title: "Amplifications",
                                page: "/categories/visual-amplifications"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "suppression"),
                                title: "Suppressions",
                                page: "/categories/visual-suppressions"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "distortion"),
                                title: "Distortions",
                                page: "/categories/visual-distortions"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "geometric"),
                                title: "Geometric Patterns",
                                page: "/categories/geometric-patterns"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("visual", "hallucinatory state"),
                                title: "Hallucinatory States",
                                page: "/categories/hallucinatory-states"
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "volume-up.svg",
                          title: "Auditory Effects",
                          page: "/categories/auditory-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("auditory")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("auditory")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "hand-paper.svg",
                          title: "Tactile Effects",
                          page: "/categories/tactile-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("tactile")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("tactile")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "utensils.svg",
                          title: "Smell & Taste Effects",
                          page: "/categories/smell-and-taste-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("gustatory"),
                                title: "Gustatory Effects"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("olfactory"),
                                title: "Olfactory Effects"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("gustatory"),
                                  title: "Gustatory Effects"
                                }, null, 8, ["effects"]),
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("olfactory"),
                                  title: "Olfactory Effects"
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "volume-up.svg",
                            title: "Auditory Effects",
                            page: "/categories/auditory-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("auditory")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "hand-paper.svg",
                            title: "Tactile Effects",
                            page: "/categories/tactile-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("tactile")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "utensils.svg",
                            title: "Smell & Taste Effects",
                            page: "/categories/smell-and-taste-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("gustatory"),
                                title: "Gustatory Effects"
                              }, null, 8, ["effects"]),
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("olfactory"),
                                title: "Olfactory Effects"
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "cogs.svg",
                          title: "Multisensory Effects",
                          page: "/categories/multisensory-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("multisensory")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("multisensory")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "cogs.svg",
                            title: "Multisensory Effects",
                            page: "/categories/multisensory-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("multisensory")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Blob), null, {
                      default: withCtx(() => [
                        createVNode("p", null, [
                          createVNode("b", null, " Sensory effects "),
                          createTextVNode(" are subjective effects that directly alter a person's senses. These can include any combination of sight, sound, touch, taste, and smell. ")
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "eye.svg",
                          title: "Visual Effects",
                          page: "/categories/visual-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "amplification"),
                              title: "Amplifications",
                              page: "/categories/visual-amplifications"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "suppression"),
                              title: "Suppressions",
                              page: "/categories/visual-suppressions"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "distortion"),
                              title: "Distortions",
                              page: "/categories/visual-distortions"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "geometric"),
                              title: "Geometric Patterns",
                              page: "/categories/geometric-patterns"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("visual", "hallucinatory state"),
                              title: "Hallucinatory States",
                              page: "/categories/hallucinatory-states"
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "volume-up.svg",
                          title: "Auditory Effects",
                          page: "/categories/auditory-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("auditory")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "hand-paper.svg",
                          title: "Tactile Effects",
                          page: "/categories/tactile-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("tactile")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "utensils.svg",
                          title: "Smell & Taste Effects",
                          page: "/categories/smell-and-taste-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("gustatory"),
                              title: "Gustatory Effects"
                            }, null, 8, ["effects"]),
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("olfactory"),
                              title: "Olfactory Effects"
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "cogs.svg",
                          title: "Multisensory Effects",
                          page: "/categories/multisensory-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("multisensory")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Tab), null, {
                default: withCtx(() => [
                  createVNode(unref(Blob), null, {
                    default: withCtx(() => [
                      createVNode("p", null, [
                        createVNode("b", null, " Sensory effects "),
                        createTextVNode(" are subjective effects that directly alter a person's senses. These can include any combination of sight, sound, touch, taste, and smell. ")
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "eye.svg",
                        title: "Visual Effects",
                        page: "/categories/visual-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "amplification"),
                            title: "Amplifications",
                            page: "/categories/visual-amplifications"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "suppression"),
                            title: "Suppressions",
                            page: "/categories/visual-suppressions"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "distortion"),
                            title: "Distortions",
                            page: "/categories/visual-distortions"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "geometric"),
                            title: "Geometric Patterns",
                            page: "/categories/geometric-patterns"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("visual", "hallucinatory state"),
                            title: "Hallucinatory States",
                            page: "/categories/hallucinatory-states"
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "volume-up.svg",
                        title: "Auditory Effects",
                        page: "/categories/auditory-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("auditory")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "hand-paper.svg",
                        title: "Tactile Effects",
                        page: "/categories/tactile-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("tactile")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "utensils.svg",
                        title: "Smell & Taste Effects",
                        page: "/categories/smell-and-taste-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("gustatory"),
                            title: "Gustatory Effects"
                          }, null, 8, ["effects"]),
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("olfactory"),
                            title: "Olfactory Effects"
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "cogs.svg",
                        title: "Multisensory Effects",
                        page: "/categories/multisensory-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("multisensory")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        Cognitive: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Tab), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Blob), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p${_scopeId3}><b${_scopeId3}> Cognitive effects </b> are subjective effects that directly alter or introduce new content to an element of a person&#39;s cognition. </p>`);
                      } else {
                        return [
                          createVNode("p", null, [
                            createVNode("b", null, " Cognitive effects "),
                            createTextVNode(" are subjective effects that directly alter or introduce new content to an element of a person's cognition. ")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "arrow-up.svg",
                          title: "Amplifications",
                          page: "/categories/cognitive-amplifications"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "amplification")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "amplification")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "arrow-down.svg",
                          title: "Suppressions",
                          page: "/categories/cognitive-suppressions"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "suppression")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "suppression")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "arrow-up.svg",
                            title: "Amplifications",
                            page: "/categories/cognitive-amplifications"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "amplification")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "arrow-down.svg",
                            title: "Suppressions",
                            page: "/categories/cognitive-suppressions"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "suppression")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "lightbulb.svg",
                          title: "Novel States",
                          page: "/categories/novel-cognitive-states"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "novel")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "novel")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "psychological.svg",
                          title: "Psychological States",
                          page: "/categories/psychological-states"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "psychological state")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "psychological state")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "lightbulb.svg",
                            title: "Novel States",
                            page: "/categories/novel-cognitive-states"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "novel")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "psychological.svg",
                            title: "Psychological States",
                            page: "/categories/psychological-states"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "psychological state")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "infinity.svg",
                          title: "Transpersonal States",
                          page: "/categories/transpersonal-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "transpersonal state")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("cognitive", "transpersonal state")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "infinity.svg",
                            title: "Transpersonal States",
                            page: "/categories/transpersonal-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("cognitive", "transpersonal state")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Blob), null, {
                      default: withCtx(() => [
                        createVNode("p", null, [
                          createVNode("b", null, " Cognitive effects "),
                          createTextVNode(" are subjective effects that directly alter or introduce new content to an element of a person's cognition. ")
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "arrow-up.svg",
                          title: "Amplifications",
                          page: "/categories/cognitive-amplifications"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "amplification")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "arrow-down.svg",
                          title: "Suppressions",
                          page: "/categories/cognitive-suppressions"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "suppression")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "lightbulb.svg",
                          title: "Novel States",
                          page: "/categories/novel-cognitive-states"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "novel")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "psychological.svg",
                          title: "Psychological States",
                          page: "/categories/psychological-states"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "psychological state")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "infinity.svg",
                          title: "Transpersonal States",
                          page: "/categories/transpersonal-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("cognitive", "transpersonal state")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Tab), null, {
                default: withCtx(() => [
                  createVNode(unref(Blob), null, {
                    default: withCtx(() => [
                      createVNode("p", null, [
                        createVNode("b", null, " Cognitive effects "),
                        createTextVNode(" are subjective effects that directly alter or introduce new content to an element of a person's cognition. ")
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "arrow-up.svg",
                        title: "Amplifications",
                        page: "/categories/cognitive-amplifications"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "amplification")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "arrow-down.svg",
                        title: "Suppressions",
                        page: "/categories/cognitive-suppressions"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "suppression")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "lightbulb.svg",
                        title: "Novel States",
                        page: "/categories/novel-cognitive-states"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "novel")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "psychological.svg",
                        title: "Psychological States",
                        page: "/categories/psychological-states"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "psychological state")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "infinity.svg",
                        title: "Transpersonal States",
                        page: "/categories/transpersonal-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("cognitive", "transpersonal state")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        Physical: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Tab), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Blob), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p${_scopeId3}><b${_scopeId3}> Physical effects </b> are subjective effects that directly affect part of a person&#39;s physical body. </p>`);
                      } else {
                        return [
                          createVNode("p", null, [
                            createVNode("b", null, " Physical effects "),
                            createTextVNode(" are subjective effects that directly affect part of a person's physical body. ")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "arrow-up.svg",
                          title: "Amplifications",
                          page: "/categories/physical-amplifications"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "amplification")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "amplification")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "arrow-down.svg",
                          title: "Suppressions",
                          page: "/categories/physical-suppressions"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "suppression")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "suppression")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "cogs.svg",
                          title: "Alterations",
                          page: "/categories/physical-alterations"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "alteration")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "alteration")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "arrow-up.svg",
                            title: "Amplifications",
                            page: "/categories/physical-amplifications"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "amplification")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "arrow-down.svg",
                            title: "Suppressions",
                            page: "/categories/physical-suppressions"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "suppression")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "cogs.svg",
                            title: "Alterations",
                            page: "/categories/physical-alterations"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "alteration")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "child.svg",
                          title: "Uncomfortable bodily effects",
                          page: "/categories/uncomfortable-bodily-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "bodily")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "bodily")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "child.svg",
                            title: "Uncomfortable bodily effects",
                            page: "/categories/uncomfortable-bodily-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "bodily")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "brain.svg",
                          title: "Neurological",
                          page: "/categories/neurological-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "neurological")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "neurological")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Category), {
                          icon: "heart.svg",
                          title: "Cardiovascular",
                          page: "/categories/cardiovascular-effects"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Actions), {
                                effects: filterEffectsByTag("physical", "cardiovascular")
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Actions), {
                                  effects: filterEffectsByTag("physical", "cardiovascular")
                                }, null, 8, ["effects"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Category), {
                            icon: "brain.svg",
                            title: "Neurological",
                            page: "/categories/neurological-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "neurological")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Category), {
                            icon: "heart.svg",
                            title: "Cardiovascular",
                            page: "/categories/cardiovascular-effects"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Actions), {
                                effects: filterEffectsByTag("physical", "cardiovascular")
                              }, null, 8, ["effects"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Blob), null, {
                      default: withCtx(() => [
                        createVNode("p", null, [
                          createVNode("b", null, " Physical effects "),
                          createTextVNode(" are subjective effects that directly affect part of a person's physical body. ")
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "arrow-up.svg",
                          title: "Amplifications",
                          page: "/categories/physical-amplifications"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "amplification")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "arrow-down.svg",
                          title: "Suppressions",
                          page: "/categories/physical-suppressions"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "suppression")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "cogs.svg",
                          title: "Alterations",
                          page: "/categories/physical-alterations"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "alteration")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "child.svg",
                          title: "Uncomfortable bodily effects",
                          page: "/categories/uncomfortable-bodily-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "bodily")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), null, {
                      default: withCtx(() => [
                        createVNode(unref(Category), {
                          icon: "brain.svg",
                          title: "Neurological",
                          page: "/categories/neurological-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "neurological")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Category), {
                          icon: "heart.svg",
                          title: "Cardiovascular",
                          page: "/categories/cardiovascular-effects"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Actions), {
                              effects: filterEffectsByTag("physical", "cardiovascular")
                            }, null, 8, ["effects"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Tab), null, {
                default: withCtx(() => [
                  createVNode(unref(Blob), null, {
                    default: withCtx(() => [
                      createVNode("p", null, [
                        createVNode("b", null, " Physical effects "),
                        createTextVNode(" are subjective effects that directly affect part of a person's physical body. ")
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "arrow-up.svg",
                        title: "Amplifications",
                        page: "/categories/physical-amplifications"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "amplification")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "arrow-down.svg",
                        title: "Suppressions",
                        page: "/categories/physical-suppressions"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "suppression")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "cogs.svg",
                        title: "Alterations",
                        page: "/categories/physical-alterations"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "alteration")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "child.svg",
                        title: "Uncomfortable bodily effects",
                        page: "/categories/uncomfortable-bodily-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "bodily")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Column), null, {
                    default: withCtx(() => [
                      createVNode(unref(Category), {
                        icon: "brain.svg",
                        title: "Neurological",
                        page: "/categories/neurological-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "neurological")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Category), {
                        icon: "heart.svg",
                        title: "Cardiovascular",
                        page: "/categories/cardiovascular-effects"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Actions), {
                            effects: filterEffectsByTag("physical", "cardiovascular")
                          }, null, 8, ["effects"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/effects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-T2dQ98Pm.mjs.map
