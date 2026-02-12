import { _ as __nuxt_component_0$2 } from './nuxt-link-ByRaPiMR.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, e as __nuxt_component_1 } from './server.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0$1 } from './Icon-xL9_OgMt.mjs';
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
import 'pinia';
import 'vue-router';
import 'markdown-it';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$c = {
  props: {
    location: {
      type: String,
      default: ""
    },
    external: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    subMenuItems: {
      type: Array,
      default: () => []
    },
    scope: {
      type: Array,
      default: null
    }
  },
  computed: {
    access() {
      if (Array.isArray(this.scope)) {
        for (let i = 0; i < this.scope.length; i++) {
          if (this.$auth.hasScope(this.scope[i])) return true;
        }
        return false;
      } else return true;
    }
  },
  methods: {
    itemAccess(scope) {
      if (Array.isArray(scope)) {
        for (let i = 0; i < scope.length; i++) {
          if (this.$auth.hasScope(scope[i])) return true;
        }
        return false;
      } else return true;
    }
  }
};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "headerNav__menuItem" }, _attrs, {
    style: $options.access ? null : { display: "none" }
  }))}>`);
  if ($props.external) {
    _push(`<a${ssrRenderAttr("href", $props.location)} target="_blank">${ssrInterpolate($props.name)}</a>`);
  } else {
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: $props.location,
      class: "headerNav__menuItemLink"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.name)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.name), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
  }
  if ($props.subMenuItems) {
    _push(`<ul class="headerNav__dropdown"><!--[-->`);
    ssrRenderList($props.subMenuItems, (item, index) => {
      _push(`<li style="${ssrRenderStyle($options.itemAccess(item.scope) ? null : { display: "none" })}">`);
      if (item.external) {
        _push(`<a${ssrRenderAttr("href", item.location)} target="_blank">${ssrInterpolate(item.name)}</a>`);
      } else {
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: item.location
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      }
      _push(`</li>`);
    });
    _push(`<!--]--></ul>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/headerNav__menuItem.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const MenuItem = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$c]]);
const _sfc_main$b = {};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs) {
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(ssrRenderComponent(_component_nuxt_link, mergeProps({
    class: "headerNav__donateButton",
    to: "/donate/"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Donate `);
      } else {
        return [
          createTextVNode(" Donate ")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/headerNav__donateButton.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const DonateButton = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$b], ["__scopeId", "data-v-14f0556c"]]);
const _sfc_main$a = {
  components: {
    MenuItem,
    DonateButton
  },
  data() {
    return {
      subMenuItems: {}
    };
  },
  computed: {
    navigation() {
      return this.$store.state.navigation;
    }
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_menu_item = resolveComponent("menu-item");
  const _component_donate_button = resolveComponent("donate-button");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "headerNav__mainNavigation" }, _attrs))}><!--[-->`);
  ssrRenderList($options.navigation, (navItem, name) => {
    _push(ssrRenderComponent(_component_menu_item, {
      key: navItem.name,
      location: navItem.location,
      external: navItem.external,
      name,
      "sub-menu-items": navItem.children,
      scope: navItem.scope
    }, null, _parent));
  });
  _push(`<!--]-->`);
  _push(ssrRenderComponent(_component_donate_button, { style: { "margin-left": "20px" } }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/headerNav__mainNavigation.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const MainNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$a]]);
const _sfc_main$9 = {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleHamburger: function() {
      this.$store.dispatch("pullout_menu/toggle");
    }
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "hamburger" }, _attrs))} data-v-ddf4d691><div class="${ssrRenderClass("closed " + ($props.active ? "inactive" : "active"))}" data-v-ddf4d691><span class="patty" data-v-ddf4d691></span><span class="patty" data-v-ddf4d691></span><span class="patty" data-v-ddf4d691></span></div><div class="${ssrRenderClass("open " + ($props.active ? "active" : "inactive"))}" data-v-ddf4d691><span class="patty" data-v-ddf4d691></span><span class="patty" data-v-ddf4d691></span></div></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/headerNav__hamburgerButton.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const Hamburger = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$9], ["__scopeId", "data-v-ddf4d691"]]);
const _imports_0$1 = publicAssetsURL("/logo2.svg");
const _sfc_main$8 = {
  components: {
    MainNavigation,
    Hamburger
  },
  computed: {
    navbarPullout() {
      return this.$store.state.pullout_menu.active;
    }
  }
};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$2;
  const _component_main_navigation = resolveComponent("main-navigation");
  const _component_hamburger = resolveComponent("hamburger");
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "navbar" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img class="navbar__logo"${ssrRenderAttr("src", _imports_0$1)} alt="An eye, the EffectIndex logo."${_scopeId}>`);
      } else {
        return [
          createVNode("img", {
            class: "navbar__logo",
            src: _imports_0$1,
            alt: "An eye, the EffectIndex logo."
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_main_navigation, null, null, _parent));
  _push(ssrRenderComponent(_component_hamburger, { active: $options.navbarPullout }, null, _parent));
  _push(`</header>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/HeaderNav.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$8]]);
const _sfc_main$7 = {
  props: {
    name: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    external: {
      type: Boolean,
      default: false
    },
    children: {
      type: Array,
      default: void 0
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    checkItemAccess(scope) {
      if (Array.isArray(scope)) {
        for (let i = 0; i < scope.length; i++) {
          if (this.$auth.hasScope(scope[i])) return true;
        }
        return false;
      } else return true;
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<li${ssrRenderAttrs(mergeProps({ class: "pulloutMenu__itemContainer" }, _attrs))}>`);
  if (!$props.children && $props.external) {
    _push(`<a${ssrRenderAttr("href", $props.location)} target="_blank">${ssrInterpolate($props.name)}</a>`);
  } else if (!$props.children) {
    _push(ssrRenderComponent(_component_nuxt_link, { to: $props.location }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($props.name)}`);
        } else {
          return [
            createTextVNode(toDisplayString($props.name), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<a>`);
    if (!$data.expanded) {
      _push(`<span> + </span>`);
    } else {
      _push(`<span> - </span>`);
    }
    _push(` ${ssrInterpolate($props.name)}</a>`);
  }
  if ($data.expanded && $props.children) {
    _push(`<ol><!--[-->`);
    ssrRenderList($props.children, (child) => {
      _push(`<li style="${ssrRenderStyle($options.checkItemAccess(child.scope) ? null : { display: "none" })}">`);
      if (!child.external) {
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: child.location
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(child.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(child.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      } else {
        _push(`<a${ssrRenderAttr("href", child.location)} target="_blank">${ssrInterpolate(child.name)}</a>`);
      }
      _push(`</li>`);
    });
    _push(`<!--]--></ol>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</li>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PulloutMenu/pulloutMenu__item.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const PulloutItem = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7]]);
const _sfc_main$6 = {
  components: {
    DonateButton,
    PulloutItem
  },
  computed: {
    navbarPullout() {
      return this.$store.state.pullout_menu.active;
    },
    navigation() {
      return this.$store.state.navigation;
    }
  },
  methods: {
    checkItemAccess(scope) {
      if (Array.isArray(scope)) {
        for (let i = 0; i < scope.length; i++) {
          if (this.$auth.hasScope(scope[i])) return true;
        }
        return false;
      } else return true;
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_pullout_item = resolveComponent("pullout-item");
  const _component_donate_button = resolveComponent("donate-button");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "navbarPullout " + ($options.navbarPullout ? "active" : "")
  }, _attrs))}><div class="navbarPullout__menu"><!--[-->`);
  ssrRenderList($options.navigation, (item, name) => {
    _push(`<ul style="${ssrRenderStyle($options.checkItemAccess(item.scope) ? null : { display: "none" })}">`);
    _push(ssrRenderComponent(_component_pullout_item, {
      style: $options.checkItemAccess(item.scope) ? null : { display: "none" },
      name,
      location: item.location,
      external: item.external,
      children: item.children
    }, null, _parent));
    _push(`</ul>`);
  });
  _push(`<!--]-->`);
  _push(ssrRenderComponent(_component_donate_button, { style: { "margin-top": "1.5em", "margin-left": "40px" } }, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PulloutMenu/PulloutMenu.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$5 = {
  components: {
    Icon: __nuxt_component_0$1
  },
  props: {
    type: {
      type: String,
      default: void 0
    },
    src: {
      type: String,
      default: void 0
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  head() {
    return {
      htmlAttrs: {
        class: this.active ? "modal-active" : ""
      }
    };
  },
  computed: {
    url() {
      console.log(`${this.src}`);
      return `${this.src}`;
    }
  },
  methods: {
    toggleModal() {
      this.$emit("toggleModal");
    },
    popout() {
      (void 0).open(this.src, "_blank");
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal" }, _attrs, {
    style: $props.active ? null : { display: "none" }
  }))} data-v-3beead78>`);
  if ($props.type === "image") {
    _push(`<div style="${ssrRenderStyle("background-image: url('" + $options.url + "');")}" class="modalImageContainer" data-v-3beead78><a class="fileButton" data-v-3beead78>`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "external-link.svg",
      color: "white"
    }, null, _parent));
    _push(`</a></div>`);
  } else if ($props.type === "gfycat" && $props.active) {
    _push(`<div style="${ssrRenderStyle({ "position": "relative", "height": "100%" })}" class="modalImageContainer" data-v-3beead78><iframe${ssrRenderAttr("src", "https://streamable.com/e/" + $props.src + "?autoplay=1&loop=1")} frameborder="0" scrolling="no" width="100%" height="100%" style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "0" })}" allow="autoplay" allowfullscreen data-v-3beead78></iframe><div class="cover" data-v-3beead78></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-3beead78"]]);
const _imports_0 = publicAssetsURL("/sm-icon-youtube.svg");
const _imports_1 = publicAssetsURL("/sm-icon-discord.svg");
const _imports_2 = publicAssetsURL("/sm-icon-reddit.svg");
const _imports_3 = publicAssetsURL("/sm-icon-github.svg");
const _sfc_main$4 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(_attrs)}><div class="footer__social"><a href="https://www.youtube.com/c/Josikinz"><img${ssrRenderAttr("src", _imports_0)} height="32" width="32" alt="YouTube"></a><a href="/discord"><img${ssrRenderAttr("src", _imports_1)} height="32" width="32" alt="Facebook"></a><a href="https://reddit.com/r/replications"><img${ssrRenderAttr("src", _imports_2)} height="32" width="32" alt="Reddit"></a><a href="https://github.com/effectindex/EffectIndex"><img${ssrRenderAttr("src", _imports_3)} height="32" width="32" alt="GitHub"></a></div><div class="footer__secret"><p><a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="${ssrRenderStyle({ "border-width": "0" })}" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a><br><small><i><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"> \xA9 This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. </a></i></small><br></p></div></footer>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/footer/Footer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const CustomFooter = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$3 = {
  props: {
    user: {
      type: Object,
      default: void 0
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout();
        this.$toasted.show(
          "You have been logged out.",
          {
            duration: 2e3,
            type: "success"
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "user-info" }, _attrs))} data-v-8b17b1b4><div class="username" data-v-8b17b1b4>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/me" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($props.user.username)}`);
      } else {
        return [
          createTextVNode(toDisplayString($props.user.username), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="logout" data-v-8b17b1b4><a data-v-8b17b1b4> (logout) </a></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/UserBar/UserInfo.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const UserInfo = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-8b17b1b4"]]);
const _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "user-menu" }, _attrs))} data-v-e36fb5fb>`);
  if (_ctx.$auth.hasScope("admin")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Misc `);
        } else {
          return [
            createTextVNode(" Misc ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$auth.hasScope("admin")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/users" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Users `);
        } else {
          return [
            createTextVNode(" Users ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$auth.hasScope("admin")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/people" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` People `);
        } else {
          return [
            createTextVNode(" People ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$auth.hasScope("all-replications") || _ctx.$auth.hasScope("own-replications")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/replications" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Replications `);
        } else {
          return [
            createTextVNode(" Replications ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$auth.hasScope("all-reports") || _ctx.$auth.hasScope("own-reports")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/reports" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Reports `);
        } else {
          return [
            createTextVNode(" Reports ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$auth.hasScope("all-articles") || _ctx.$auth.hasScope("own-articles")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/articles" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Articles `);
        } else {
          return [
            createTextVNode(" Articles ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$auth.hasScope("admin-effects") || _ctx.$auth.hasScope("edit-effects")) {
    _push(`<li data-v-e36fb5fb>`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: "/admin/effects" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Effects `);
        } else {
          return [
            createTextVNode(" Effects ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</ul>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/UserBar/UserMenu.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UserMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-e36fb5fb"]]);
const _sfc_main$1 = {
  components: {
    UserInfo,
    UserMenu
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_user_info = resolveComponent("user-info");
  const _component_user_menu = resolveComponent("user-menu");
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "user-bar" }, _attrs))} data-v-b83666b7><div class="user-bar-content" data-v-b83666b7>`);
  _push(ssrRenderComponent(_component_user_info, {
    user: _ctx.$auth.user
  }, null, _parent));
  _push(ssrRenderComponent(_component_user_menu, {
    user: _ctx.$auth.user
  }, null, _parent));
  _push(`</div></nav>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/UserBar/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const UserBar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-b83666b7"]]);
const _sfc_main = {
  name: "EffectIndex",
  components: {
    HeaderNav: __nuxt_component_0,
    CustomFooter,
    PulloutMenu: __nuxt_component_2,
    Modal: __nuxt_component_3,
    UserBar
  },
  head() {
    return {
      titleTemplate: "%s - Effect Index",
      title: "Home",
      meta: [
        { name: "description", hid: "description", content: "A resource dedicated to establishing the field of formalised subjective effect documentation." },
        { name: "apple-mobile-web-app-title", hid: "apple-mobile-web-app-title", content: "Effect Index" },
        // Open Graph
        { name: "og:title", hid: "og:title", content: "Effect Index" },
        { name: "og:description", hid: "og:description", content: "A resource dedicated to establishing the field of formalised subjective effect documentation." },
        { name: "og:type", hid: "og:type", content: "website" },
        { name: "og:url", hid: "og:url", content: "https://effectindex.com" },
        { name: "og:image", hid: "og:image", content: "https://effectindex.com/logo-letter.png" },
        // Twitter Card
        { name: "twitter:card", hid: "twitter:card", content: "summary" },
        { name: "twitter:title", hid: "twitter:title", content: "Effect Index" },
        { name: "twitter:description", hid: "twitter:description", content: "A resource dedicated to establishing the field of formalised subjective effect documentation." },
        { name: "twitter:image", hid: "twitter:image", content: "https://effectindex.com/logo-letter.png" },
        { name: "twitter:image:alt", hid: "twitter:image:alt", content: "Effect Index Logo" }
      ]
    };
  },
  computed: {
    navbarPullout() {
      return this.$store.state.pullout_menu.active;
    },
    modalActive() {
      return this.$store.state.modal.active;
    },
    modalData() {
      return {
        type: this.$store.state.modal.type,
        resource: this.$store.state.modal.resource
      };
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit("modal/toggle");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_header_nav = __nuxt_component_0;
  const _component_client_only = __nuxt_component_1;
  const _component_custom_footer = resolveComponent("custom-footer");
  const _component_pullout_menu = __nuxt_component_2;
  const _component_modal = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "layoutContainer" }, _attrs))}><div class="${ssrRenderClass([{ mainContainerPulledout: $options.navbarPullout }, "mainContainer"])}">`);
  _push(ssrRenderComponent(_component_header_nav, null, null, _parent));
  _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
  _push(`<main class="page">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_custom_footer, null, null, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_pullout_menu, null, null, _parent));
  if ($options.modalActive) {
    _push(ssrRenderComponent(_component_modal, {
      active: $options.modalActive,
      type: $options.modalData.type,
      src: $options.modalData.type === "image" ? $options.modalData.resource : $options.modalData.resource,
      onToggleModal: $options.toggleModal
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-CK2-YmL7.mjs.map
