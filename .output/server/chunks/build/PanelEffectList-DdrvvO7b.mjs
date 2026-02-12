import { mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';

const _sfc_main$4 = {
  props: {
    subtitle: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "panel" }, _attrs))} data-v-b9b08f03><div class="contentContainer" data-v-b9b08f03>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Panel.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-b9b08f03"]]);
const _sfc_main$3 = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    page: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "categoryContainer" }, _attrs))} data-v-ecf01771><h3 class="categoryTitle" data-v-ecf01771>`);
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
    _push(`<span data-v-ecf01771>${ssrInterpolate($props.title)}</span>`);
  }
  if ($props.icon) {
    _push(ssrRenderComponent(_component_Icon, {
      filename: $props.icon,
      class: "panelIcon"
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</h3><div class="actionContainer" data-v-ecf01771>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/Panel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Panel = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-ecf01771"]]);
const _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "categories__columnContainer" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/Column.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "categories__columns" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/Columns.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Columns = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  props: {
    effects: {
      type: Array,
      default: () => []
    },
    tags: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: void 0
    }
  },
  computed: {
    filteredEffects() {
      return this.effects.filter(
        (effect) => this.tags.every(
          (tag) => effect.tags.includes(tag)
        )
      );
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "categories__panelEffectList" }, _attrs))} data-v-2b6ba7a2>`);
  if ($props.title) {
    _push(`<h4 class="effectTitle" data-v-2b6ba7a2>${ssrInterpolate($props.title)}</h4>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<!--[-->`);
  ssrRenderList($options.filteredEffects, (effect) => {
    _push(`<li data-v-2b6ba7a2>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: `/effects/${effect.url}`
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
    if (effect.subarticles.length) {
      _push(`<ul class="effectSubarticleList" data-v-2b6ba7a2><!--[-->`);
      ssrRenderList(effect.subarticles, (subarticle, index) => {
        _push(`<li data-v-2b6ba7a2>`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: `/effects/${effect.url}/?s=${subarticle.id}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(subarticle.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(subarticle.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</li>`);
  });
  _push(`<!--]--></ul>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/PanelEffectList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PanelEffectList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-2b6ba7a2"]]);

export { Columns as C, PanelEffectList as P, __nuxt_component_2 as _, Column as a, Panel as b };
//# sourceMappingURL=PanelEffectList-DdrvvO7b.mjs.map
