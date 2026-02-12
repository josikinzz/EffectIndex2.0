import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { P as PanelEffectList, C as Columns, a as Column, b as Panel, _ as __nuxt_component_2 } from './PanelEffectList-DdrvvO7b.mjs';
import { resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
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
    Panel,
    Column,
    Columns,
    PanelEffectList,
    Icon: __nuxt_component_0
  },
  scrollToTop: true,
  head() {
    return {
      title: "Cognitive Effects"
    };
  },
  computed: {
    effects() {
      return this.$store.state.effects.list;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Icon = __nuxt_component_0;
  const _component_Columns = resolveComponent("Columns");
  const _component_Column = resolveComponent("Column");
  const _component_Panel = __nuxt_component_2;
  const _component_PanelEffectList = resolveComponent("PanelEffectList");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/categories/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Effect Categories `);
      } else {
        return [
          createTextVNode(" Effect Categories ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` - Cognitive Effects `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "user.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><p><b>Cognitive effects</b> are subjective effects that directly alter or introduce new content to an element of a person&#39;s cognition. </p><p> This page lists the various cognitive enhancements that can occur under the influence of certain psychoactive compounds. </p><hr>`);
  _push(ssrRenderComponent(_component_Columns, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_Column, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_Panel, {
                title: "Amplifications",
                page: "/categories/cognitive-amplifications",
                icon: "arrow-up.svg"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_PanelEffectList, {
                      tags: ["cognitive", "amplification"],
                      effects: $options.effects
                    }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_PanelEffectList, {
                        tags: ["cognitive", "amplification"],
                        effects: $options.effects
                      }, null, 8, ["effects"])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(ssrRenderComponent(_component_Panel, {
                title: "Suppressions",
                page: "/categories/cognitive-suppressions",
                icon: "arrow-down.svg"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_PanelEffectList, {
                      tags: ["cognitive", "suppression"],
                      effects: $options.effects
                    }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_PanelEffectList, {
                        tags: ["cognitive", "suppression"],
                        effects: $options.effects
                      }, null, 8, ["effects"])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_Panel, {
                  title: "Amplifications",
                  page: "/categories/cognitive-amplifications",
                  icon: "arrow-up.svg"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_PanelEffectList, {
                      tags: ["cognitive", "amplification"],
                      effects: $options.effects
                    }, null, 8, ["effects"])
                  ]),
                  _: 1
                }),
                createVNode(_component_Panel, {
                  title: "Suppressions",
                  page: "/categories/cognitive-suppressions",
                  icon: "arrow-down.svg"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_PanelEffectList, {
                      tags: ["cognitive", "suppression"],
                      effects: $options.effects
                    }, null, 8, ["effects"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_Column, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_Panel, {
                title: "Novel States",
                page: "/categories/novel-cognitive-states",
                icon: "lightbulb.svg"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_PanelEffectList, {
                      tags: ["cognitive", "novel"],
                      effects: $options.effects
                    }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_PanelEffectList, {
                        tags: ["cognitive", "novel"],
                        effects: $options.effects
                      }, null, 8, ["effects"])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(ssrRenderComponent(_component_Panel, {
                title: "Psychological States",
                page: "/categories/psychological-states",
                icon: "psychological.svg"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_PanelEffectList, {
                      tags: ["cognitive", "psychological state"],
                      effects: $options.effects
                    }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_PanelEffectList, {
                        tags: ["cognitive", "psychological state"],
                        effects: $options.effects
                      }, null, 8, ["effects"])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_Panel, {
                  title: "Novel States",
                  page: "/categories/novel-cognitive-states",
                  icon: "lightbulb.svg"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_PanelEffectList, {
                      tags: ["cognitive", "novel"],
                      effects: $options.effects
                    }, null, 8, ["effects"])
                  ]),
                  _: 1
                }),
                createVNode(_component_Panel, {
                  title: "Psychological States",
                  page: "/categories/psychological-states",
                  icon: "psychological.svg"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_PanelEffectList, {
                      tags: ["cognitive", "psychological state"],
                      effects: $options.effects
                    }, null, 8, ["effects"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_Column, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_Panel, {
                title: "Transpersonal States",
                page: "/categories/transpersonal-states",
                icon: "infinity.svg"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_PanelEffectList, {
                      tags: ["cognitive", "transpersonal state"],
                      effects: $options.effects
                    }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_PanelEffectList, {
                        tags: ["cognitive", "transpersonal state"],
                        effects: $options.effects
                      }, null, 8, ["effects"])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_Panel, {
                  title: "Transpersonal States",
                  page: "/categories/transpersonal-states",
                  icon: "infinity.svg"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_PanelEffectList, {
                      tags: ["cognitive", "transpersonal state"],
                      effects: $options.effects
                    }, null, 8, ["effects"])
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
          createVNode(_component_Column, null, {
            default: withCtx(() => [
              createVNode(_component_Panel, {
                title: "Amplifications",
                page: "/categories/cognitive-amplifications",
                icon: "arrow-up.svg"
              }, {
                default: withCtx(() => [
                  createVNode(_component_PanelEffectList, {
                    tags: ["cognitive", "amplification"],
                    effects: $options.effects
                  }, null, 8, ["effects"])
                ]),
                _: 1
              }),
              createVNode(_component_Panel, {
                title: "Suppressions",
                page: "/categories/cognitive-suppressions",
                icon: "arrow-down.svg"
              }, {
                default: withCtx(() => [
                  createVNode(_component_PanelEffectList, {
                    tags: ["cognitive", "suppression"],
                    effects: $options.effects
                  }, null, 8, ["effects"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_Column, null, {
            default: withCtx(() => [
              createVNode(_component_Panel, {
                title: "Novel States",
                page: "/categories/novel-cognitive-states",
                icon: "lightbulb.svg"
              }, {
                default: withCtx(() => [
                  createVNode(_component_PanelEffectList, {
                    tags: ["cognitive", "novel"],
                    effects: $options.effects
                  }, null, 8, ["effects"])
                ]),
                _: 1
              }),
              createVNode(_component_Panel, {
                title: "Psychological States",
                page: "/categories/psychological-states",
                icon: "psychological.svg"
              }, {
                default: withCtx(() => [
                  createVNode(_component_PanelEffectList, {
                    tags: ["cognitive", "psychological state"],
                    effects: $options.effects
                  }, null, 8, ["effects"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_Column, null, {
            default: withCtx(() => [
              createVNode(_component_Panel, {
                title: "Transpersonal States",
                page: "/categories/transpersonal-states",
                icon: "infinity.svg"
              }, {
                default: withCtx(() => [
                  createVNode(_component_PanelEffectList, {
                    tags: ["cognitive", "transpersonal state"],
                    effects: $options.effects
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
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories/index/cognitive-effects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cognitiveEffects = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { cognitiveEffects as default };
//# sourceMappingURL=cognitive-effects-DUJpXOM1.mjs.map
