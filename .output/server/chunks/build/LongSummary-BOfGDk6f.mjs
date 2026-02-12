import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as _sfc_main$1 } from './vcode-DI0Nwo0O.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  props: {
    effect: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    replications() {
      return this.$store.state.replications.list;
    },
    odd() {
      return this.index % 2 ? true : false;
    },
    image() {
      let replications = this.replications.filter((replication) => replication.associated_effects.includes(this.effect._id) && replication.type !== "audio");
      return replications[Math.floor(Math.random() * (replications.length - 1))];
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  const _component_vcode = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "effect__longSummary" }, _attrs))} data-v-d3cba3da><h4${ssrRenderAttr("id", $props.effect.url)} class="longSummary__title" style="${ssrRenderStyle($props.showTitle ? null : { display: "none" })}" data-v-d3cba3da>${ssrInterpolate($props.effect.name)}</h4><div class="longSummary__mainArticle" data-v-d3cba3da> Full article: `);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: `/effects/${$props.effect.url}`
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
  _push(`</div><div data-v-d3cba3da>`);
  _push(ssrRenderComponent(_component_vcode, {
    body: $props.effect.long_summary
  }, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/effects/LongSummary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LongSummary = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-d3cba3da"]]);

export { LongSummary as L };
//# sourceMappingURL=LongSummary-BOfGDk6f.mjs.map
