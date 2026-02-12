import { withAsyncContext, computed, mergeProps, unref, resolveComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { A as AudioPlayer } from './AudioPlayer-DSX_ItL1.mjs';
import { a as useNuxtApp, _ as _export_sfc } from './server.mjs';
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
  components: {
    AudioPlayer,
    ExtLink: __nuxt_component_1
  },
  props: {
    replication: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    associatedEffects() {
      let replication = this.replication;
      if (!Array.isArray(replication.associated_effects)) return void 0;
      return this.$store.state.effects.list.filter(
        (effect) => replication.associated_effects.includes(effect._id)
      );
    },
    description() {
      return typeof this.replication.description === "string" ? this.replication.description : "";
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  const _component_ext_link = __nuxt_component_1;
  const _component_audio_player = resolveComponent("audio-player");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "audioReplication" }, _attrs))} data-v-cd800738><div class="replicationInfo" data-v-cd800738><span class="replicationTitle" data-v-cd800738>${ssrInterpolate($props.replication.title)}</span> by <span class="replicationArtist" data-v-cd800738>`);
  if ($props.replication.artist_url) {
    _push(`<span data-v-cd800738>`);
    _push(ssrRenderComponent(_component_ext_link, {
      href: $props.replication.artist_url
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.replication.artist)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.replication.artist), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</span>`);
  } else {
    _push(`<span data-v-cd800738>${ssrInterpolate($props.replication.artist)}</span>`);
  }
  _push(`</span></div><div data-v-cd800738>${(_a = _ctx.$md.render($options.description)) != null ? _a : ""}</div>`);
  _push(ssrRenderComponent(_component_audio_player, {
    src: `/audio/${$props.replication.resource}`,
    title: $props.replication.title,
    artist: $props.replication.artist
  }, null, _parent));
  _push(`<div style="${ssrRenderStyle($options.associatedEffects.length ? null : { display: "none" })}" data-v-cd800738><h4 data-v-cd800738> Effects Replicated </h4><ul class="replicationEffectsList" data-v-cd800738><!--[-->`);
  ssrRenderList($options.associatedEffects, (effect) => {
    _push(`<li class="replicationEffectsListItem" data-v-cd800738>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: "/effects/" + effect.url
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
  _push(`<!--]--></ul></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/replications/audio/AudioReplication.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AudioReplication = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-cd800738"]]);
const _sfc_main = {
  __name: "audio",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Audio Replications" });
    const { $store } = useNuxtApp();
    [__temp, __restore] = withAsyncContext(async () => useAsyncData("replications:audio", async () => {
      await $store.dispatch("replications/get");
      await $store.dispatch("effects/get");
      return {};
    })), await __temp, __restore();
    const audioReplications = computed(() => {
      return $store.state.replications.list.filter(
        (replication) => replication.type === "audio"
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(__nuxt_component_0), {
        filename: "volume-up.svg",
        class: "categoryIcon"
      }, null, _parent));
      _push(`<h1> Auditory Effect Replications </h1><div><!--[-->`);
      ssrRenderList(unref(audioReplications), (replication) => {
        _push(ssrRenderComponent(unref(AudioReplication), {
          key: replication._id,
          replication
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/replications/audio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=audio-NtT14Rwt.mjs.map
