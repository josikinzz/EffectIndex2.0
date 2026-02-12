import { withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { i as useRoute, a as useNuxtApp, _ as _export_sfc } from './server.mjs';
import { L as LightBox } from './LightBox-D_heWLbN.mjs';
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
import './Icon-xL9_OgMt.mjs';

const _sfc_main$1 = {
  props: {
    filename: {
      type: String,
      default: ""
    },
    username: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "profileImage" }, _attrs))} data-v-383cdda5><img${ssrRenderAttr("src", "/img/profiles/" + $props.filename)}${ssrRenderAttr("alt", $props.username ? "Profile image of " + $props.username : "User profile image. ")} data-v-383cdda5></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profiles/ProfileImage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProfileImage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-383cdda5"]]);
const _sfc_main = {
  __name: "[username]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { $store } = useNuxtApp();
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "profiles:detail",
      async () => {
        const username = route.params.username;
        const { profile: profile2 } = await $store.dispatch("profiles/getProfileByName", username);
        if (!profile2) {
          return { profile: {}, replications: [] };
        }
        const { replications: replications2 } = await $store.dispatch(
          "replications/getReplicationsByArtist",
          username
        );
        return { profile: profile2, replications: replications2 };
      },
      { watch: [() => route.params.username] }
    )), __temp = await __temp, __restore(), __temp);
    const profile = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.profile) || {};
    });
    const replications = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.replications) || [];
    });
    useHead(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return {
        title: ((_a = profile.value) == null ? void 0 : _a.username) || "Profile",
        meta: [
          { name: "description", hid: "description", content: `Profile of Effect Index contributor ${((_b = profile.value) == null ? void 0 : _b.username) || ""}` },
          { name: "og:title", hid: "og:title", content: `Effect Index - ${((_c = profile.value) == null ? void 0 : _c.username) || ""}` },
          { name: "og:description", hid: "og:description", content: `Profile of Effect Index contributor ${((_d = profile.value) == null ? void 0 : _d.username) || ""}` },
          { name: "og:image", hid: "og:image", content: ((_e = profile.value) == null ? void 0 : _e.profileImageFull) ? `/img/profiles/${profile.value.profileImageFull}` : void 0 },
          { name: "twitter:title", hid: "twitter:title", content: `Effect Index - ${((_f = profile.value) == null ? void 0 : _f.username) || ""}` },
          { name: "twitter:description", hid: "twitter:description", content: `Profile of Effect Index contributor ${((_g = profile.value) == null ? void 0 : _g.username) || ""}` },
          { name: "twitter:image", hid: "twitter:image", content: ((_h = profile.value) == null ? void 0 : _h.profileImageFull) ? `/img/profiles/${profile.value.profileImageFull}` : void 0 }
        ].filter((meta) => meta.content)
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}>`);
      if (unref(profile).username) {
        _push(`<div><h1>${ssrInterpolate(unref(profile).username)}</h1>`);
        _push(ssrRenderComponent(ProfileImage, {
          filename: unref(profile).profileImageFull,
          username: unref(profile).username
        }, null, _parent));
        if (unref(profile).body) {
          _push(`<div>${(_a = _ctx.$md.render(unref(profile).body)) != null ? _a : ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(replications).length > 0) {
          _push(`<div style="${ssrRenderStyle({ "clear": "both", "margin-top": "2em" })}"><hr><h3>Replications</h3>`);
          _push(ssrRenderComponent(LightBox, {
            "image-set": unref(replications),
            base: "/img/gallery/"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div><h1>Profile not found</h1></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profiles/[username].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_username_-DqBLHcd-.mjs.map
