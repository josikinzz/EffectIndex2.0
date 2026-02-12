import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$1 = {
  props: {
    effect: {
      type: Object,
      default: () => {
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<li${ssrRenderAttrs(_attrs)} data-v-13e68c02><h4 data-v-13e68c02>`);
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
  _push(`</h4><p data-v-13e68c02>${ssrInterpolate($props.effect.summary_raw)}</p></li>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/EffectListItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EffectListItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-13e68c02"]]);
const _sfc_main = {
  components: {
    EffectListItem
  },
  props: {
    effects: {
      type: Array,
      default: () => []
    },
    tags: {
      type: Array,
      default: () => []
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
  const _component_EffectListItem = resolveComponent("EffectListItem");
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "categories__effectList" }, _attrs))} data-v-c13d6abb><!--[-->`);
  ssrRenderList($options.filteredEffects, (effect) => {
    _push(ssrRenderComponent(_component_EffectListItem, {
      key: effect._id,
      effect
    }, null, _parent));
  });
  _push(`<!--]--></ul>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/categories/EffectList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EffectList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c13d6abb"]]);

export { EffectList as E };
//# sourceMappingURL=EffectList-C9D0GNuL.mjs.map
