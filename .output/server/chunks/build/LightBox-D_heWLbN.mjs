import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { resolveComponent, resolveDirective, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDirectiveProps, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$1 = {
  props: {
    title: {
      type: String,
      default: ""
    },
    artist: {
      type: String,
      default: ""
    },
    artistWebpage: {
      type: String,
      default: ""
    }
  },
  methods: {
    openWindow(e) {
      if (this.artistWebpage) {
        (void 0).open(this.artistWebpage);
        e.stopPropagation();
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "lightBox__imageDetails" }, _attrs))}><h3 class="lightBox__title">${ssrInterpolate($props.title)}</h3><h4 class="lightBox__artist"> by <a>${ssrInterpolate($props.artist)}</a></h4></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/gallery/LightBox__imageDetails.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ImageDetails = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  components: {
    ImageDetails,
    Icon: __nuxt_component_0
  },
  props: {
    imageSet: {
      default: () => [],
      type: Array
    },
    order: {
      default: () => [],
      type: Array
    },
    base: {
      type: String,
      default: ""
    },
    gfycats: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      current_image: 0,
      thumbnailOffset: 0,
      modalActive: false,
      thumbs: []
    };
  },
  computed: {
    currentImage() {
      if (this.thumbs.length > 0) {
        if (this.current_image <= this.thumbs.length - 1)
          return this.thumbs[this.current_image];
        else return this.imageSet[this.thumbs.length - 1];
      } else if (this.imageSet.length > 0) {
        if (this.current_image <= this.imageSet.length - 1)
          return this.imageSet[this.current_image];
        else return this.imageSet[this.imageSet.length - 1];
      } else return {};
    }
  },
  watch: {
    imageSet: function(oldImageSet, newImageSet) {
      this.current_image = 0;
      this.updateThumbs();
    }
  },
  mounted() {
    this.updateThumbs();
    this.updateThumbnailOffset();
  },
  updated() {
    this.updateThumbnailOffset();
    if (!this.thumbs.length) this.$emit("listEnd");
    console.log(this.thumbs);
  },
  methods: {
    updateThumbs() {
      if (this.order.length) {
        let thumbs = [];
        this.order.forEach((order) => {
          let foundImage = this.imageSet.find((image) => image._id === order._id);
          if (foundImage) thumbs.push(foundImage);
        });
        let filteredImageSet = this.imageSet.filter((image) => {
          return !this.order.find((orderItem) => orderItem._id === image._id);
        });
        if (!this.gfycats) this.thumbs = thumbs.concat(filteredImageSet).filter((thumb) => thumb.type !== "gfycat");
        else this.thumbs = thumbs.concat(filteredImageSet);
      } else {
        if (!this.gfycats) this.thumbs = this.imageSet.filter((image) => image.type !== "gfycat");
        else this.thumbs = this.imageSet;
      }
      console.log(this.thumbs);
    },
    updateThumbnailOffset() {
      setTimeout(() => {
        if (this.$refs.thumbnailReel && this.$refs.activeThumbnail) {
          let thumbnailReel = this.$refs.thumbnailReel;
          let currentImage = this.$refs.activeThumbnail[this.current_image];
          this.thumbnailOffset = thumbnailReel.offsetWidth / 2 - currentImage.offsetLeft - currentImage.offsetWidth / 2;
        }
      }, 0);
    },
    selectImage(index) {
      this.current_image = index;
      this.updateThumbnailOffset();
    },
    nextImage() {
      if (this.current_image + 1 >= this.thumbs.length) this.$emit("listEnd");
      this.current_image = (this.current_image + 1) % this.thumbs.length;
      this.updateThumbnailOffset();
    },
    previousImage() {
      if (this.current_image === 0) {
        this.current_image = this.thumbs.length - 1;
        this.$emit("listStart");
      } else this.current_image = this.current_image - 1;
      this.updateThumbnailOffset();
    },
    openImage(url, absolute) {
      absolute ? (void 0).open(url) : (void 0).open("/img/gallery/" + url);
    },
    toggleModal() {
      let data = {
        type: this.currentImage.type,
        resource: this.currentImage.resource
      };
      this.$store.commit("modal/set_data", data);
      this.$store.commit("modal/toggle");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  const _component_image_details = resolveComponent("image-details");
  const _component_Icon = __nuxt_component_0;
  const _directive_touch = resolveDirective("touch");
  let _temp0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "lightBox" }, _attrs, {
    style: $data.thumbs.length > 0 ? null : { display: "none" }
  }))}>`);
  if ($options.currentImage) {
    _push(`<div class="lightBox__canvas">`);
    if ($options.currentImage.resource && $options.currentImage.type === "image") {
      _push(`<div${ssrRenderAttrs(mergeProps({
        key: $options.currentImage.resource,
        style: "background-image: url('" + $options.currentImage.resource + "');",
        class: "lightBox__image"
      }, ssrGetDirectiveProps(_ctx, _directive_touch, $options.nextImage, "swipe", { left: true }), ssrGetDirectiveProps(_ctx, _directive_touch, $options.previousImage, "swipe", { right: true })))}>`);
      _push(ssrRenderComponent(_component_image_details, {
        title: $options.currentImage.title,
        artist: $options.currentImage.artist,
        "artist-webpage": $options.currentImage.artist_url
      }, null, _parent));
      _push(`</div>`);
    } else if ($options.currentImage.resource && $options.currentImage.type === "gfycat" && !$data.modalActive) {
      _push(`<div style="${ssrRenderStyle({ "position": "relative", "height": "100%" })}"><iframe${ssrRenderAttr("src", "https://streamable.com/e/" + $options.currentImage.resource + "?autoplay=1&loop=1&nocontrols=1")} frameborder="0" scrolling="no" width="100%" height="100%" style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "0" })}" allow="autoplay" allowfullscreen></iframe><div${ssrRenderAttrs(_temp0 = mergeProps({ class: "lightBox__touchControls" }, ssrGetDirectiveProps(_ctx, _directive_touch, $options.nextImage, "swipe", { left: true }), ssrGetDirectiveProps(_ctx, _directive_touch, $options.previousImage, "swipe", { right: true })))}>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : (_a = _temp0.innerHTML) != null ? _a : ""}</div>`);
      _push(ssrRenderComponent(_component_image_details, {
        title: $options.currentImage.title,
        artist: $options.currentImage.artist,
        "artist-webpage": $options.currentImage.artist_url
      }, null, _parent));
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<a class="lightBox__control previousImage">`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "chevron-double-left.svg",
      class: "lightBox__icon",
      color: "white"
    }, null, _parent));
    _push(`</a><a class="lightBox__control nextImage">`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "chevron-double-right.svg",
      class: "lightBox__icon",
      color: "white"
    }, null, _parent));
    _push(`</a></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="lightBox__thumbnailReel">`);
  if ($data.thumbs) {
    _push(`<div style="${ssrRenderStyle("left: " + $data.thumbnailOffset + "px;")}" class="lightBox__thumbnailContainer"><!--[-->`);
    ssrRenderList($data.thumbs, (image, index) => {
      _push(`<span>`);
      if (image.type === "image") {
        _push(`<img${ssrRenderAttr("src", image.resource.includes("https://") ? image.resource : "https://cdn-cf-east.streamable.com/image/" + image.resource + ".jpg")} class="${ssrRenderClass([$data.current_image === index ? { active: true } : {}, "lightBox__thumbnailImage"])}">`);
      } else {
        _push(`<!---->`);
      }
      if (image.thumbnail) {
        _push(`<img${ssrRenderAttr("src", image.thumbnail.includes("https://") ? image.thumbnail : "https://cdn-cf-east.streamable.com/image/" + image.thumbnail + ".jpg")} class="${ssrRenderClass([$data.current_image === index ? { active: true } : {}, "lightBox__thumbnailImage"])}">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span>`);
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/gallery/LightBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LightBox = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { LightBox as L };
//# sourceMappingURL=LightBox-D_heWLbN.mjs.map
