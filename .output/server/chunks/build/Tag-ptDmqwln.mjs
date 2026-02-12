import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { mergeProps, resolveComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$3 = {
  props: {
    profileImage: {
      type: String,
      default: void 0
    }
  },
  computed: {
    image() {
      if (!this.profileImage || this.profileImage === "") {
        return "indy_iphone_square.png";
      }
      return this.profileImage;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "profileIcon" }, _attrs))} data-v-8824b59a><img class="image"${ssrRenderAttr("src", `/${$options.image}`)} data-v-8824b59a></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/people/PersonProfileImage.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const PersonProfileImage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-8824b59a"]]);
const _sfc_main$2 = {
  props: {
    socialMedia: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    icons() {
      return this.socialMedia.map((socialMedia) => {
        switch (socialMedia.type) {
          case "personal":
            return { url: socialMedia.value, filename: "home.svg" };
          case "facebook":
            return { url: socialMedia.value, filename: "facebook.svg" };
          case "instagram":
            return { url: socialMedia.value, filename: "instagram.svg" };
          case "tiktok":
            return { url: socialMedia.value, filename: "tiktok.svg" };
          case "youtube":
            return { url: socialMedia.value, filename: "youtube.svg" };
          case "reddit":
            return { url: socialMedia.value, filename: "reddit.svg" };
          case "twitter":
            return { url: socialMedia.value, filename: "twitter.svg" };
          default:
            return { url: socialMedia.value, filename: "home.svg" };
        }
      });
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "person-social-media-icons" }, _attrs))}><!--[-->`);
  ssrRenderList($options.icons, (icon, index) => {
    _push(`<a class="icon"${ssrRenderAttr("href", icon.url)}><img${ssrRenderAttr("src", `/icons/${icon.filename}`)} height="24" width="24"></a>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/articles/PersonSocialMediaIcons.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PersonSocialMediaIcons = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {
  components: {
    PersonProfileImage,
    PersonSocialMediaIcons
  },
  props: {
    author: {
      type: Object,
      default: () => ({})
    },
    avatar: {
      type: Boolean,
      default: true
    },
    socialMedia: {
      type: Boolean,
      default: true
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_PersonProfileImage = resolveComponent("PersonProfileImage");
  const _component_nuxt_link = __nuxt_component_0;
  const _component_person_social_media_icons = resolveComponent("person-social-media-icons");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "author" }, _attrs))} data-v-dbe7f8e2>`);
  if ($props.avatar) {
    _push(`<div class="author-image" data-v-dbe7f8e2>`);
    _push(ssrRenderComponent(_component_PersonProfileImage, {
      "profile-image": $props.author.profile_image
    }, null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="name-container" data-v-dbe7f8e2><div class="name" data-v-dbe7f8e2>`);
  if ($props.author.profile_url) {
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: `/people/${$props.author.profile_url}`
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.author.full_name)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.author.full_name), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<span data-v-dbe7f8e2>${ssrInterpolate($props.author.full_name)}</span>`);
  }
  _push(`</div>`);
  if ($props.socialMedia) {
    _push(ssrRenderComponent(_component_person_social_media_icons, {
      "social-media": $props.author.social_media
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/articles/AuthorInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AuthorInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-dbe7f8e2"]]);
const _sfc_main = {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    clickTag(value) {
      this.$router.push("/search?q=" + value);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "tag" }, _attrs))} data-v-32f794c9>${ssrInterpolate($props.value)}</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/articles/Tag.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Tag = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-32f794c9"]]);

export { AuthorInfo as A, Tag as T };
//# sourceMappingURL=Tag-ptDmqwln.mjs.map
