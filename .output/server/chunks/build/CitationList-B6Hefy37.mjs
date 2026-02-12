import { _ as __nuxt_component_0$1 } from './Icon-xL9_OgMt.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';

const _sfc_main$1 = {
  components: {
    Icon: __nuxt_component_0$1
  },
  props: {
    from: {
      type: String,
      default: void 0
    },
    no: {
      type: String,
      default: void 0
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$1;
  _push(`<li${ssrRenderAttrs(mergeProps({
    id: "cite-" + $props.from
  }, _attrs))}><div class="citation__contents">`);
  if (!$props.no || Number($props.no) === 1) {
    _push(`<a${ssrRenderAttr("href", "#ref-" + $props.from)}>`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "angle-double-up.svg",
      style: { "height": "1em", "width": "1em", "display": "inline-block" }
    }, null, _parent));
    _push(`</a>`);
  } else {
    _push(`<span>`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "angle-double-up.svg",
      style: { "height": "1em", "width": "1em", "display": "inline-block" }
    }, null, _parent));
    _push(`<!--[-->`);
    ssrRenderList(Number($props.no), (num) => {
      _push(`<a${ssrRenderAttr("href", "#ref-" + $props.from + "-" + num)}>[${ssrInterpolate(num)}]</a>`);
    });
    _push(`<!--]--></span>`);
  }
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></li>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Citation.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  components: {
    Citation: __nuxt_component_0,
    ExtLink: __nuxt_component_1
  },
  props: {
    citations: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filteredCitations() {
      return this.citations ? this.citations.filter((citation) => citation) : [];
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_citation = __nuxt_component_0;
  const _component_ext_link = __nuxt_component_1;
  _push(`<ol${ssrRenderAttrs(mergeProps({ class: "citationList" }, _attrs))}><!--[-->`);
  ssrRenderList($options.filteredCitations, (citation, index) => {
    _push(ssrRenderComponent(_component_citation, {
      key: index,
      from: String(citation.from),
      no: String(citation.no)
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<span class="citationText"${_scopeId}>${ssrInterpolate(citation.text)}</span><span class="citationSeparator"${_scopeId}> | </span>`);
          _push2(ssrRenderComponent(_component_ext_link, {
            href: citation.url
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`${ssrInterpolate(citation.url)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(citation.url), 1)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        } else {
          return [
            createVNode("span", { class: "citationText" }, toDisplayString(citation.text), 1),
            createVNode("span", { class: "citationSeparator" }, " | "),
            createVNode(_component_ext_link, {
              href: citation.url
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(citation.url), 1)
              ]),
              _: 2
            }, 1032, ["href"])
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]-->`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</ol>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CitationList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CitationList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { CitationList as C };
//# sourceMappingURL=CitationList-B6Hefy37.mjs.map
