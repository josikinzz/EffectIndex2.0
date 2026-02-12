import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { ref, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { a as useNuxtApp, _ as _export_sfc } from './server.mjs';
import { L as LightBox } from './LightBox-D_heWLbN.mjs';
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

const _sfc_main$1 = {
  props: {
    effects: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ""
    }
  },
  methods: {
    selectEffect(effectId) {
      this.$store.dispatch("gallery/setSelectedEffect", effectId);
      this.$emit("effectSelected");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery__effectSelectorContainer" }, _attrs))} data-v-f37b7494>`);
  if ($props.effects) {
    _push(`<ul class="gallery__effectSelector" data-v-f37b7494><!--[-->`);
    ssrRenderList($props.effects, (effect) => {
      _push(`<li class="gallery__effectSelectorItem" data-v-f37b7494><a class="${ssrRenderClass(effect._id === $props.selected ? "active" : "")}" data-v-f37b7494>${ssrInterpolate(effect.name)}</a></li>`);
    });
    _push(`<!--]--></ul>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EffectSelector.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EffectSelector = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-f37b7494"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Replications" });
    const { $store, $scrollTo } = useNuxtApp();
    const lightbox = ref(null);
    [__temp, __restore] = withAsyncContext(() => useAsyncData("replications:gallery", () => $store.dispatch("gallery/get"))), await __temp, __restore();
    const replicated_effects = computed(() => $store.state.gallery.replicated_effects);
    const replications = computed(() => $store.state.gallery.replications);
    const selected_effect_id = computed(() => $store.state.gallery.selected_effect_id);
    const selected_effect = computed(() => {
      const selected = replicated_effects.value.find((val) => val._id === selected_effect_id.value);
      return selected || {};
    });
    const image_set = computed(() => {
      return replications.value.filter(
        (replication) => replication.associated_effects.includes(selected_effect_id.value)
      );
    });
    const gallery_order = computed(() => {
      const selected = replicated_effects.value.find(
        (effect) => effect._id === selected_effect_id.value
      );
      return selected ? selected.gallery_order : void 0;
    });
    const current_index = computed(() => {
      return replicated_effects.value.findIndex(
        (val) => val._id === selected_effect_id.value
      );
    });
    const scroll = () => {
      if (typeof $scrollTo === "function") {
        $scrollTo(lightbox.value, 800);
      }
    };
    const switchEffect = (prev) => {
      if (!replicated_effects.value.length) return;
      if (!prev) {
        const index = current_index.value + 1 >= replicated_effects.value.length ? 0 : current_index.value + 1;
        $store.dispatch("gallery/setGallerySelectedEffect", replicated_effects.value[index]._id);
      } else {
        const index = current_index.value - 1 <= 0 ? replicated_effects.value.length - 1 : current_index.value - 1;
        $store.dispatch("gallery/setGallerySelectedEffect", replicated_effects.value[index]._id);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "images.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`<h1> Replications </h1><p><span class="bold"> Replications </span> are image, video, and audio recreations of the sensory experiences produced by various subjective effects that a user may encounter under the influence of hallucinogens. Replications may be created intentionally or unintentionally, as long as they accurately convey the effect being shown. They serve the purpose of documenting certain experiences in a level of detail that descriptive language is incapable of describing. </p><p> This page will serve as a dedicated index of as many replication examples as possible in the form of images, animations, and videos. These are primarily sourced from our <a href="https://reddit.com/r/replications">subreddit,</a> through dedicated artists, and from various sources throughout the internet. The artist is credited for each replication whenever possible. However, if you would like your artwork removed or its link altered, please do not hesitate to contact us at <a href="mailto:effectindex@gmail.com"> effectindex@gmail.com </a></p><hr><h3 style="${ssrRenderStyle({ "text-align": "center" })}">`);
      if (unref(selected_effect).url) {
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: "/effects/" + unref(selected_effect).url
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(selected_effect).name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(selected_effect).name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<span>${ssrInterpolate(unref(selected_effect).name || "No effect selected")}</span>`);
      }
      _push(`</h3>`);
      _push(ssrRenderComponent(LightBox, {
        "image-set": unref(image_set),
        order: unref(gallery_order),
        base: "/img/gallery/",
        onListEnd: switchEffect,
        onListStart: ($event) => switchEffect(true)
      }, null, _parent));
      _push(`<hr><h3> Effect Galleries </h3>`);
      _push(ssrRenderComponent(EffectSelector, {
        effects: unref(replicated_effects),
        selected: unref(selected_effect_id),
        onEffectSelected: scroll
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/replications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CBrIHl-Y.mjs.map
