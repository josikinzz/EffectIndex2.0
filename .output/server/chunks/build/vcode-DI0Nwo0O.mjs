import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, h, createVNode, useSSRContext } from 'vue';
import { _ as __nuxt_component_1 } from './ExtLink-Ipqsfa0G.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc, j as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-ByRaPiMR.mjs';
import { A as AudioPlayer } from './AudioPlayer-DSX_ItL1.mjs';

const _sfc_main$j = {
  components: {
    ExtLink: __nuxt_component_1
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    align: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    },
    artist: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    caption: {
      type: String,
      default: ""
    },
    gfycat: {
      type: String,
      default: ""
    },
    top: {
      type: String,
      default: ""
    },
    border: {
      type: String,
      default: ""
    },
    rounding: {
      type: String,
      default: ""
    },
    imageRoutes: {
      type: String,
      default: void 0
    }
  },
  computed: {
    imageSrc() {
      let imageSrc = {
        src: this.src,
        title: this.title,
        artist: this.artist,
        caption: this.caption
      };
      if (this.imageRoutes) {
        let routes = this.imageRoutes.split(",");
        routes.forEach((route) => {
          let info = route.split(":");
          let path = info[0] ? info[0].trim() : void 0;
          let src = info[1] ? info[1].trim() : this.src;
          let title = info[2] ? info[2].trim() : this.title;
          let artist = info[3] ? info[3].trim() : this.artist;
          let caption = info[4] ? info[4].trim() : this.caption;
          if (this.$route.path.includes(path)) imageSrc = { src, title, artist, caption };
        });
      }
      return imageSrc;
    },
    float() {
      switch (this.align.toLowerCase()) {
        case "right":
          return "floatRight";
        case "left":
          return "floatLeft";
        case "center":
          return "alignCenter";
        default:
          return "floatRight";
      }
    },
    modalData() {
      return {
        type: this.gfycat ? "gfycat" : "image",
        resource: this.gfycat ? this.gfycat : this.imageSrc.src
      };
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit("modal/set_data", this.modalData);
      this.$store.commit("modal/toggle");
    }
  }
};
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ext_link = __nuxt_component_1;
  _push(`<figure${ssrRenderAttrs(mergeProps({
    class: [$options.float + " " + ($props.border ? "withBorder" : ""), "captionedImage"],
    style: { maxWidth: $props.width ? $props.width + "px" : "100%", marginTop: $props.top ? "0" : "2em" }
  }, _attrs))} data-v-463a57f1><img${ssrRenderAttr("src", $options.imageSrc.src)}${ssrRenderAttr("height", $props.height ? $props.height + "px" : "auto")} style="${ssrRenderStyle([
    { borderRadius: $props.rounding ? $props.rounding : "0" },
    $options.imageSrc.src ? null : { display: "none" }
  ])}" data-v-463a57f1><div style="${ssrRenderStyle([
    {
      maxWidth: $props.width ? $props.width + "px" : "none",
      height: $props.height ? $props.height + "px" : "auto",
      marginBottom: "0.5em"
    },
    { "position": "relative", "padding-bottom": "56.25%" },
    $props.gfycat ? null : { display: "none" }
  ])}" data-v-463a57f1>`);
  if ($props.gfycat) {
    _push(`<iframe${ssrRenderAttr("src", "https://streamable.com/e/" + $props.gfycat + "?autoplay=1&loop=1")} frameborder="0" scrolling="no" width="100%" height="100%" style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "0" })}" allow="autoplay" allowfullscreen data-v-463a57f1></iframe>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><figcaption class="captionedImage__caption" data-v-463a57f1><span class="artistTitle" style="${ssrRenderStyle(($props.title || $options.imageSrc.title) && ($props.artist || $options.imageSrc.artist) ? null : { display: "none" })}" data-v-463a57f1><span class="title" data-v-463a57f1>${ssrInterpolate($props.title || $options.imageSrc.title)}</span> by `);
  if ($props.url) {
    _push(`<span data-v-463a57f1>`);
    _push(ssrRenderComponent(_component_ext_link, { href: $props.url }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.artist || $options.imageSrc.artist)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.artist || $options.imageSrc.artist), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</span>`);
  } else {
    _push(`<span class="artist" data-v-463a57f1>${ssrInterpolate($props.artist || $options.imageSrc.artist)}</span>`);
  }
  _push(`<span style="${ssrRenderStyle($props.caption || $options.imageSrc.caption ? null : { display: "none" })}" data-v-463a57f1> - </span></span> ${ssrInterpolate($props.caption || $options.imageSrc.caption)}</figcaption></figure>`);
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CaptionedImage.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const CaptionedImage$2 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$i], ["__scopeId", "data-v-463a57f1"]]);
const _sfc_main$i = {
  name: "VcodeCaptionedImage",
  components: {
    ExtLink: __nuxt_component_1
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    align: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    },
    artist: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    caption: {
      type: String,
      default: ""
    },
    gfycat: {
      type: String,
      default: ""
    },
    top: {
      type: String,
      default: ""
    },
    border: {
      type: String,
      default: ""
    },
    rounding: {
      type: String,
      default: ""
    },
    imageRoutes: {
      type: String,
      default: void 0
    },
    noMargin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    float() {
      if (this.noMargin) return "noMargin";
      switch (this.align.toLowerCase()) {
        case "right":
          return "floatRight";
        case "left":
          return "floatLeft";
        case "center":
          return "alignCenter";
        default:
          return "floatRight";
      }
    },
    modalData() {
      const { gfycat, src } = this;
      return gfycat ? { type: "gfycat", resource: gfycat } : { type: "image", resource: src };
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit("modal/set_data", this.modalData);
      this.$store.commit("modal/toggle");
    }
  }
};
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ext_link = __nuxt_component_1;
  _push(`<figure${ssrRenderAttrs(mergeProps({
    class: [$options.float + " " + ($props.border ? "withBorder" : ""), "captionedImage"],
    style: { maxWidth: $props.width ? $props.width + "px" : "100%", marginTop: $props.top ? "0" : "2em" }
  }, _attrs))} data-v-cb89fb21>`);
  if ($props.src) {
    _push(`<img${ssrRenderAttr("src", $props.src)} style="${ssrRenderStyle(`max-width: 100%; max-height: ${$props.height ? $props.height + "px" : "auto"}; border-radius: ${$props.rounding ? $props.rounding : "0"}`)}" data-v-cb89fb21>`);
  } else if ($props.gfycat) {
    _push(`<div style="${ssrRenderStyle([{
      maxWidth: $props.width ? $props.width + "px" : "none",
      height: $props.height ? $props.height + "px" : "auto",
      marginBottom: "0.5em"
    }, { "position": "relative", "padding-bottom": "56.25%" }])}" data-v-cb89fb21>`);
    if ($props.gfycat) {
      _push(`<iframe${ssrRenderAttr("src", "https://streamable.com/e/" + $props.gfycat + "?autoplay=1&loop=1")} frameborder="0" scrolling="no" width="100%" height="100%" style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "0" })}" allow="autoplay" allowfullscreen data-v-cb89fb21></iframe>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<figcaption class="captionedImage__caption" data-v-cb89fb21><span class="artistTitle" style="${ssrRenderStyle($props.title && $props.artist ? null : { display: "none" })}" data-v-cb89fb21><span class="title" data-v-cb89fb21>${ssrInterpolate($props.title)}</span> by `);
  if ($props.url) {
    _push(`<span data-v-cb89fb21>`);
    _push(ssrRenderComponent(_component_ext_link, { href: $props.url }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.artist)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.artist), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</span>`);
  } else {
    _push(`<span class="artist" data-v-cb89fb21>${ssrInterpolate($props.artist)}</span>`);
  }
  _push(`</span><div class="caption" style="${ssrRenderStyle($props.caption ? null : { display: "none" })}" data-v-cb89fb21>${ssrInterpolate($props.caption)}</div></figcaption></figure>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/CaptionedImage.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const CaptionedImage$1 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$h], ["__scopeId", "data-v-cb89fb21"]]);
const _sfc_main$h = {
  props: {
    to: {
      type: String,
      default: ""
    },
    no: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<sup${ssrRenderAttrs(mergeProps({
    id: "ref-" + $props.to + ($props.no ? "-" + $props.no : ""),
    class: "reference"
  }, _attrs))}><a${ssrRenderAttr("href", "#cite-" + $props.to)}> [${ssrInterpolate($props.text ? $props.text : $props.to)}] </a></sup>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Reference.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const Reference = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$g]]);
const _sfc_main$g = {
  components: {
    ExtLink: __nuxt_component_1
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    },
    artist: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    caption: {
      type: String,
      default: ""
    },
    gfycat: {
      type: String,
      default: ""
    },
    top: {
      type: String,
      default: ""
    }
  },
  computed: {
    modalData() {
      const { gfycat, src } = this;
      return gfycat ? { type: "gfycat", resource: gfycat } : { type: "image", resource: src };
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit("modal/set_data", this.modalData);
      this.$store.commit("modal/toggle");
    }
  }
};
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ext_link = __nuxt_component_1;
  _push(`<figure${ssrRenderAttrs(mergeProps({
    style: { maxWidth: $props.width ? $props.width + "px" : "100%" },
    class: "captionedImage"
  }, _attrs))} data-v-a2944734>`);
  if ($props.src) {
    _push(`<img${ssrRenderAttr("src", $props.src)}${ssrRenderAttr("height", $props.height ? $props.height + "px" : "auto")} data-v-a2944734>`);
  } else if ($props.gfycat) {
    _push(`<div style="${ssrRenderStyle([{
      minWidth: $props.width ? $props.width + "px" : "none",
      maxWidth: $props.width ? $props.width + "px" : "none",
      height: $props.height ? $props.height + "px" : "auto",
      marginBottom: "0.5em"
    }, { "position": "relative", "padding-bottom": "56.25%" }])}" data-v-a2944734>`);
    if ($props.gfycat) {
      _push(`<iframe${ssrRenderAttr("src", "https://streamable.com/e/" + $props.gfycat + "?autoplay=1&loop=1")} frameborder="0" scrolling="no" width="100%" height="100%" style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "0" })}" allow="autoplay" allowfullscreen data-v-a2944734></iframe>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<figcaption class="captionedImage__caption" data-v-a2944734><span class="artistTitle" style="${ssrRenderStyle($props.title && $props.artist ? null : { display: "none" })}" data-v-a2944734><span class="title" data-v-a2944734>${ssrInterpolate($props.title)}</span> by `);
  if ($props.url) {
    _push(`<span data-v-a2944734>`);
    _push(ssrRenderComponent(_component_ext_link, { href: $props.url }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.artist)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.artist), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</span>`);
  } else {
    _push(`<span class="artist" data-v-a2944734>${ssrInterpolate($props.artist)}</span>`);
  }
  _push(`<span style="${ssrRenderStyle($props.caption ? null : { display: "none" })}" data-v-a2944734> - </span></span> ${ssrInterpolate($props.caption)}</figcaption></figure>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/HeaderedTextboxCaptionedImage.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const CaptionedImage = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$f], ["__scopeId", "data-v-a2944734"]]);
const _sfc_main$f = {
  components: {
    CaptionedImage,
    Icon: __nuxt_component_0
  },
  props: {
    id: {
      type: String,
      default: void 0
    },
    label: {
      type: String,
      default: void 0
    },
    labelBackground: {
      type: String,
      default: "#666666"
    },
    headerBackground: {
      type: String,
      default: "#F0F0F0"
    },
    header: {
      type: String,
      default: void 0
    },
    subHeader: {
      type: String,
      default: void 0
    },
    imageSrc: {
      type: String,
      default: ""
    },
    imageAlign: {
      type: String,
      default: ""
    },
    imageWidth: {
      type: String,
      default: ""
    },
    imageHeight: {
      type: String,
      default: ""
    },
    imageArtist: {
      type: String,
      default: ""
    },
    imageUrl: {
      type: String,
      default: ""
    },
    imageTitle: {
      type: String,
      default: ""
    },
    imageCaption: {
      type: String,
      default: ""
    },
    imageGfycat: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: void 0
    }
  },
  computed: {
    imageAlignment() {
      return this.imageAlign.toLowerCase() === "left" ? "left" : "right";
    }
  }
};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  const _component_captioned_image = CaptionedImage$2;
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: $props.id,
    class: "headeredTextbox"
  }, _attrs))} data-v-f9b1dee7><div class="headersContainer" style="${ssrRenderStyle(`background-color: ${$props.headerBackground}`)}" data-v-f9b1dee7><div class="headersContainerText" data-v-f9b1dee7><h4 class="label" style="${ssrRenderStyle([
    `background-color: ${$props.labelBackground}`,
    $props.label ? null : { display: "none" }
  ])}" data-v-f9b1dee7><span style="${ssrRenderStyle({ "white-space": "pre" })}" data-v-f9b1dee7>${ssrInterpolate($props.label)}</span></h4><div class="headers" style="${ssrRenderStyle($props.header || $props.subHeader ? null : { display: "none" })}" data-v-f9b1dee7><h3 class="mainHeader" style="${ssrRenderStyle($props.header ? null : { display: "none" })}" data-v-f9b1dee7>${ssrInterpolate($props.header)}</h3><h4 class="subHeader" style="${ssrRenderStyle($props.subHeader ? null : { display: "none" })}" data-v-f9b1dee7><span class="separator" data-v-f9b1dee7>-</span> ${ssrInterpolate($props.subHeader)}</h4></div></div>`);
  if ($props.icon) {
    _push(ssrRenderComponent(_component_Icon, { filename: $props.icon }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="${ssrRenderClass([$options.imageAlignment, "body"])}" data-v-f9b1dee7><div class="body-text" data-v-f9b1dee7>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
  if ($props.imageSrc || $props.imageGfycat) {
    _push(ssrRenderComponent(_component_captioned_image, {
      src: $props.imageSrc,
      width: $props.imageWidth,
      height: $props.imageHeight,
      artist: $props.imageArtist,
      url: $props.imageUrl,
      title: $props.imageTitle,
      caption: $props.imageCaption,
      gfycat: $props.imageGfycat
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/HeaderedTextbox.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const HeaderedTextbox = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$e], ["__scopeId", "data-v-f9b1dee7"]]);
const _sfc_main$e = {
  props: {
    id: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<span${ssrRenderAttrs(mergeProps({
    id: $props.id,
    class: "subarticle-anchor"
  }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</span>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/SubarticleAnchor.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const SubarticleAnchor = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$d]]);
const _sfc_main$d = {
  props: {
    a: {
      type: String,
      default: void 0
    },
    b: {
      type: String,
      default: void 0
    },
    label: {
      type: String,
      default: void 0
    }
  },
  computed: {
    body() {
      return this.$slots.default ? this.$slots.default[0].text : void 0;
    }
  }
};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "separatedTextbox" }, _attrs))} data-v-0a0c8e0f>`);
  if ($props.a && $props.b) {
    _push(`<h4 data-v-0a0c8e0f><span class="comparator" data-v-0a0c8e0f>${ssrInterpolate($props.a)}</span> vs <span class="comparator" data-v-0a0c8e0f>${ssrInterpolate($props.b)}</span></h4>`);
  } else {
    _push(`<h4 data-v-0a0c8e0f>${ssrInterpolate($props.label)}</h4>`);
  }
  _push(`<p class="body" data-v-0a0c8e0f>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</p></div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/SeparatedTextbox.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const SeparatedTextbox = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$c], ["__scopeId", "data-v-0a0c8e0f"]]);
const _sfc_main$c = {
  props: {
    author: {
      type: String,
      default: ""
    },
    profile: {
      /* technically this should be called person, but keeping it as this for backwards compat */
      type: String,
      default: void 0
    }
  },
  data() {
    return {
      profileImage: void 0
    };
  },
  mounted() {
    this.loadProfileImage();
  },
  methods: {
    async loadProfileImage() {
      try {
        if (this.profile) {
          const apiFetch = useApiFetch();
          const { person } = await apiFetch(`/api/persons/${this.profile}`);
          if (person) {
            this.profileImage = person.profile_image ? `/${person.profile_image}` : void 0;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "quotation" }, _attrs))} data-v-b7a96068><div class="quotationContent" data-v-b7a96068>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div><div class="quotationAuthor" data-v-b7a96068>`);
  if (!$props.profile) {
    _push(`<span class="quotationAuthorName" data-v-b7a96068><span class="quotationDash" data-v-b7a96068> - </span> ${ssrInterpolate($props.author)}</span>`);
  } else {
    _push(`<div data-v-b7a96068>`);
    if ($data.profileImage) {
      _push(`<div class="quotationProfileImageContainer" data-v-b7a96068>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: `/people/${$props.profile}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", $data.profileImage)} class="quotationProfileImage" data-v-b7a96068${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: $data.profileImage,
                class: "quotationProfileImage"
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-b7a96068><span class="quotationDash" data-v-b7a96068> - </span> `);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: `/people/${$props.profile}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate($props.author)}`);
          } else {
            return [
              createTextVNode(toDisplayString($props.author), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</span></div>`);
    } else {
      _push(`<span data-v-b7a96068><span class="quotationDash" data-v-b7a96068> - </span> ${ssrInterpolate($props.author)}</span>`);
    }
    _push(`</div>`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Quote.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const Quote = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$b], ["__scopeId", "data-v-b7a96068"]]);
const _sfc_main$b = {
  props: {
    text: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  _push(`<span${ssrRenderAttrs(_attrs)}>${(_a = _ctx.$md.render($props.text)) != null ? _a : ""}</span>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Markdown.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const Markdown = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$a]]);
const _sfc_main$a = {
  props: {
    ordered: {
      type: Boolean,
      default: false
    },
    listStyle: {
      type: String,
      default: "disc"
    }
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (!$props.ordered) {
    _push(`<ul${ssrRenderAttrs(mergeProps({ class: $props.listStyle }, _attrs))} data-v-e358f7e5>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</ul>`);
  } else {
    _push(`<ol${ssrRenderAttrs(_attrs)} data-v-e358f7e5>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</ol>`);
  }
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/List.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const List = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$9], ["__scopeId", "data-v-e358f7e5"]]);
const _sfc_main$9 = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "columns" }, _attrs))} data-v-c3b7d8c3>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Columns.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const Columns = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$8], ["__scopeId", "data-v-c3b7d8c3"]]);
const _sfc_main$8 = {};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "column" }, _attrs))} data-v-1ffbb449>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Column.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$7], ["__scopeId", "data-v-1ffbb449"]]);
const _sfc_main$7 = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    title: {
      type: String,
      default: void 0
    },
    icon: {
      type: String,
      default: void 0
    },
    width: {
      type: String,
      default: "auto"
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "panel",
    style: { width: $props.width }
  }, _attrs))} data-v-5e6a28bd>`);
  if ($props.title) {
    _push(`<div class="panel-header" data-v-5e6a28bd><h4 data-v-5e6a28bd>${ssrInterpolate($props.title)}</h4>`);
    if ($props.icon) {
      _push(ssrRenderComponent(_component_Icon, { filename: $props.icon }, null, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="panel-content" data-v-5e6a28bd>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Panel.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Panel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-5e6a28bd"]]);
const _sfc_main$6 = {
  name: "Comparison",
  components: {
    CaptionedImage: CaptionedImage$1
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    description: {
      type: Object,
      default: () => ({})
    },
    images: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: void 0
    }
  },
  data() {
    return {
      showImages: false
    };
  },
  computed: {
    a() {
      return this.items.length && this.items[0] ? this.items[0].properties.name : void 0;
    },
    b() {
      return this.items.length && this.items[1] ? this.items[1].properties.name : void 0;
    },
    hasImages() {
      return this.images && this.images.length === 2;
    }
  },
  methods: {
    toggleImages() {
      this.showImages = !this.showImages;
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_vcode = _sfc_main;
  const _component_captioned_image = CaptionedImage$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "comparison" }, _attrs))} data-v-a6edfea2><div class="comparison-text" data-v-a6edfea2><div class="comparison-label" data-v-a6edfea2>`);
  if ($props.label) {
    _push(`<h4 data-v-a6edfea2>${ssrInterpolate($props.label)}</h4>`);
  } else if ($options.a && $options.b) {
    _push(`<h4 data-v-a6edfea2><span class="comparator" data-v-a6edfea2>${ssrInterpolate($options.a)}</span> vs <span class="comparator" data-v-a6edfea2>${ssrInterpolate($options.b)}</span></h4>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="show-images-button" style="${ssrRenderStyle($options.hasImages ? null : { display: "none" })}" data-v-a6edfea2><a data-v-a6edfea2>${ssrInterpolate($data.showImages ? "(hide examples)" : "(show examples)")}</a></div></div>`);
  _push(ssrRenderComponent(_component_vcode, {
    body: $props.description.children,
    type: "p",
    class: "comparison-description"
  }, null, _parent));
  _push(`</div>`);
  if ($options.hasImages && $data.showImages) {
    _push(`<div class="comparison-images" data-v-a6edfea2>`);
    _push(ssrRenderComponent(_component_captioned_image, mergeProps({
      "no-margin": true,
      top: "true",
      border: "true"
    }, $props.images[0].properties), null, _parent));
    _push(`<div class="image-separator" data-v-a6edfea2> vs </div>`);
    _push(ssrRenderComponent(_component_captioned_image, mergeProps({
      "no-margin": true,
      top: "true",
      border: "true"
    }, $props.images[1].properties), null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/Comparison/Comparison.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const Comparison = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-a6edfea2"]]);
const _sfc_main$5 = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: void 0
    },
    page: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "categoryContainer" }, _attrs))} data-v-73371b22><h3 class="categoryTitle" data-v-73371b22>`);
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
  _push(ssrRenderComponent(_component_Icon, {
    style: $props.icon ? null : { display: "none" },
    filename: $props.icon,
    class: "category"
  }, null, _parent));
  _push(`</h3><div class="categoryContent" data-v-73371b22>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Category.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Category = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-73371b22"]]);
const _sfc_main$4 = {
  name: "TableOfContents",
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    float: {
      type: String,
      default: void 0
    },
    top: {
      type: String,
      default: void 0
    }
  },
  computed: {
    toc() {
      return this.data && this.data.toc ? this.data.toc : [];
    },
    floatLeft() {
      return this.float ? this.float.toLowerCase() === "left" : false;
    },
    floatRight() {
      return this.float ? this.float.toLowerCase() === "right" : false;
    }
  },
  methods: {
    hasSection(name) {
      if (name in this.data) {
        const section = this.data[name];
        if (Array.isArray(section) || typeof section === "string") {
          if (section.length > 0) return true;
        } else if (section && typeof section === "object") {
          if (section.raw && section.raw.length > 0) return true;
        }
      }
      return false;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: ["table-of-contents", { floatLeft: $options.floatLeft, floatRight: $options.floatRight, top: $props.top }]
  }, _attrs))} data-v-a190e9d0><div class="table-of-contents-content" data-v-a190e9d0><h4 data-v-a190e9d0> Contents </h4><ol class="table-of-contents-list" data-v-a190e9d0><!--[-->`);
  ssrRenderList($options.toc, (item, index) => {
    _push(`<li class="table-of-contents-list-item" data-v-a190e9d0><a${ssrRenderAttr("href", `#${item.id}`)} data-v-a190e9d0>${ssrInterpolate(item.name)}</a>`);
    if (item.children && item.children.length) {
      _push(`<ul data-v-a190e9d0><!--[-->`);
      ssrRenderList(item.children, (subitem, subindex) => {
        _push(`<li class="table-of-contents-sublist-subitem" data-v-a190e9d0>${ssrInterpolate(index + 1)}.${ssrInterpolate(subindex + 1)} <a${ssrRenderAttr("href", `#${subitem.id}`)} data-v-a190e9d0>${ssrInterpolate(subitem.name)}</a></li>`);
      });
      _push(`<!--]--></ul>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</li>`);
  });
  _push(`<!--]--><li style="${ssrRenderStyle($options.hasSection("replications") ? null : { display: "none" })}" data-v-a190e9d0><a href="#replication-gallery" data-v-a190e9d0> Replication Gallery </a></li><li style="${ssrRenderStyle($options.hasSection("audio_replications") ? null : { display: "none" })}" data-v-a190e9d0><a href="#audio-replications" data-v-a190e9d0> Replication Gallery </a></li><li style="${ssrRenderStyle($options.hasSection("analysis") ? null : { display: "none" })}" data-v-a190e9d0><a href="#analysis" data-v-a190e9d0> Analysis </a></li><li style="${ssrRenderStyle($options.hasSection("style_variations") ? null : { display: "none" })}" data-v-a190e9d0><a href="#style-variations" data-v-a190e9d0> Style Variations </a></li><li style="${ssrRenderStyle($options.hasSection("personal_commentary") ? null : { display: "none" })}" data-v-a190e9d0><a href="#personal-commentary" data-v-a190e9d0> Personal Commentary </a></li><li style="${ssrRenderStyle($options.hasSection("related_reports") ? null : { display: "none" })}" data-v-a190e9d0><a href="#related-reports" data-v-a190e9d0> Related Reports </a></li><li style="${ssrRenderStyle($options.hasSection("see_also") ? null : { display: "none" })}" data-v-a190e9d0><a href="#see-also" data-v-a190e9d0> See Also </a></li><li style="${ssrRenderStyle($options.hasSection("external_links") ? null : { display: "none" })}" data-v-a190e9d0><a href="#external-links" data-v-a190e9d0> External Links </a></li><li style="${ssrRenderStyle($options.hasSection("citations") ? null : { display: "none" })}" data-v-a190e9d0><a href="#references" data-v-a190e9d0> References </a></li></ol></div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TableOfContents.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const TableOfContents = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-a190e9d0"]]);
const _sfc_main$3 = {
  props: {
    opacity: {
      type: String,
      default: "1.0"
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<hr${ssrRenderAttrs(mergeProps({
    style: `opacity: ${$props.opacity}`
  }, _attrs))} data-v-88983ab3>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/HorizontalRule.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const HorizontalRule = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-88983ab3"]]);
const _sfc_main$2 = {
  props: {
    opened: {
      type: String,
      default: ""
    },
    closed: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      hiddenIntro: false
    };
  },
  methods: {
    toggleIntro() {
      this.hiddenIntro = !this.hiddenIntro;
    },
    getClosedText() {
      return this.$props["closed"] ? this.$props["closed"] : "Read More";
    },
    getOpenedText() {
      return this.$props["opened"] ? this.$props["opened"] : "Read Less";
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-06f865de><div class="hiddenIntro showDetails" style="${ssrRenderStyle($data.hiddenIntro ? null : { display: "none" })}" data-v-06f865de>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div><div style="${ssrRenderStyle({ "display": "inline-block" })}" class="whiteButton showDetails" data-v-06f865de>${ssrInterpolate($data.hiddenIntro ? $options.getOpenedText() : $options.getClosedText())}</div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ShowDetails.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ShowDetails = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-06f865de"]]);
const _sfc_main$1 = {
  name: "YoutubeEmbed",
  props: {
    src: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if ($props.src) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "video-responsive" }, _attrs))} data-v-73ab0e2f><iframe${ssrRenderAttr("src", `https://www.youtube.com/embed/${$props.src}`)}${ssrRenderAttr("title", $props.title)} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-73ab0e2f></iframe></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/components/YoutubeEmbed.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const YoutubeEmbed = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-73ab0e2f"]]);
function renderVcode(createElement, data, body) {
  return createNodes(body, data);
  function createNodes(nodes, data2) {
    return Array.isArray(nodes) ? nodes.map((node) => typeof node === "string" ? node : createNode(node, data2)) : void 0;
  }
  function createNode(node, data2) {
    const { name, properties, children } = node;
    switch (name) {
      case "comparison":
        const comparisonChildren = Array.isArray(children) ? children : [];
        const items = comparisonChildren.filter((child) => child && child.name === "item");
        const description = comparisonChildren.find((child) => child && child.name === "description");
        const images = [];
        for (const item of items) {
          const itemChildren = Array.isArray(item.children) ? item.children : [];
          const image = itemChildren.find((child) => child && child.name === "image");
          if (image) images.push(image);
        }
        return createElement(Comparison, { props: { ...properties, items, images, ...description ? { description } : {} } });
      case "headered-textbox":
        return createElement(HeaderedTextbox, { props: { ...properties } }, createNodes(children, data2));
      case "i":
        return createElement(
          "span",
          { style: { fontStyle: "italic" } },
          createNodes(children, data2)
        );
      case "b":
        return createElement(
          "span",
          { style: { fontWeight: "bold" } },
          createNodes(children, data2)
        );
      case "u":
        return createElement(
          "span",
          { style: { textDecoration: "underline" } },
          createNodes(children, data2)
        );
      case "p":
        return createElement(
          "p",
          createNodes(children, data2)
        );
      case "h1":
        return createElement(
          "h2",
          { attrs: { id: properties ? properties.id : void 0 } },
          createNodes(children, data2)
        );
      case "h2":
        return createElement(
          "h3",
          { attrs: { id: properties ? properties.id : void 0 } },
          createNodes(children, data2)
        );
      case "h3":
        return createElement(
          "h4",
          { attrs: { id: properties ? properties.id : void 0 } },
          createNodes(children, data2)
        );
      case "br":
        return createElement("br");
      case "hr":
        return createElement(
          HorizontalRule,
          { props: { ...properties } }
        );
      case "category":
        return createElement(
          Category,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "captioned-image":
        return createElement(
          CaptionedImage$1,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "youtube-embed":
        return createElement(
          YoutubeEmbed,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "ref":
        return createElement(
          Reference,
          { props: { ...properties } }
        );
      case "int-link":
        if (properties && "to" in properties) {
          const { to } = properties;
          return createElement(
            "a",
            { attrs: { href: to } },
            createNodes(children, data2)
          );
        } else return createElement(
          "span",
          { attrs: { style: "color: red;" } },
          createNodes(children, data2)
        );
      case "ext-link":
        if (properties && "to" in properties) {
          const { to } = properties;
          return createElement(__nuxt_component_1, { attrs: { href: to } }, createNodes(children, data2));
        } else {
          return createElement("span", { attrs: { style: "color: red;" } }, createNodes(children, data2));
        }
      case "details":
        return createElement(ShowDetails, { props: { ordered: false, ...properties } }, createNodes(children, data2));
      case "ul":
        return createElement(
          List,
          { props: { ordered: false, ...properties } },
          createNodes(children, data2)
        );
      case "li":
        return createElement(
          "li",
          createNodes(children, data2)
        );
      case "ol":
        return createElement(
          List,
          { props: { ordered: true, ...properties } },
          createNodes(children, data2)
        );
      case "markdown":
        return createElement(
          Markdown,
          { props: { ...properties } }
        );
      case "audio":
        return createElement(
          AudioPlayer,
          { props: { ...properties } }
        );
      case "separated-textbox":
        return createElement(
          SeparatedTextbox,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "quote":
        return createElement(
          Quote,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "subarticle":
        return createElement(
          SubarticleAnchor,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "columns":
        return createElement(
          Columns,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "column":
        return createElement(
          Column,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "panel":
        return createElement(
          Panel,
          { props: { ...properties } },
          createNodes(children, data2)
        );
      case "sup":
        return createElement(
          "sup",
          createNodes(children, data2)
        );
      case "toc":
        return createElement(
          TableOfContents,
          { props: { data: data2, ...properties } }
        );
    }
  }
}
const createElementCompat = (type, options, children) => {
  if (options == null || Array.isArray(options) || typeof options === "string" || typeof options === "number") {
    return h(type, null, options);
  }
  const { props, attrs, class: className, style } = options;
  const mergedProps = {
    ...attrs || {},
    ...props || {},
    ...className ? { class: className } : {},
    ...style ? { style } : {}
  };
  return h(type, mergedProps, children);
};
const _sfc_main = defineComponent({
  name: "Vcode",
  props: {
    body: {
      type: [String, Object, Array],
      default: void 0
    },
    type: {
      type: String,
      default: "div"
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return () => {
      let body;
      if (typeof props.body === "string") {
        body = JSON.parse(props.body);
      } else if (typeof props.body === "object" && props.body && "parsed" in props.body) {
        const { parsed } = props.body;
        body = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      } else if (Array.isArray(props.body)) {
        body = props.body;
      } else {
        body = ["Error processing vcode."];
      }
      return createElementCompat(
        props.type || "div",
        { class: "vcode-document" },
        renderVcode(createElementCompat, props.data || {}, body)
      );
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vcode/vcode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { CaptionedImage$2 as C, _sfc_main as _ };
//# sourceMappingURL=vcode-DI0Nwo0O.mjs.map
