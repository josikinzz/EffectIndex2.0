import { withAsyncContext, computed, mergeProps, unref, resolveComponent, withCtx, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-ByRaPiMR.mjs';
import { _ as _export_sfc, j as useApiFetch } from './server.mjs';
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

const _sfc_main$2 = {
  props: {
    person: {
      type: Object,
      default: void 0
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<li${ssrRenderAttrs(mergeProps({ class: "peopleListItem" }, _attrs))} data-v-777df648><figure data-v-777df648><figcaption class="roleInfo" data-v-777df648><span class="name" data-v-777df648>${ssrInterpolate($props.person.role)}</span></figcaption>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: $props.person.profile_url ? `/people/${$props.person.profile_url}` : "/people"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if ($props.person.profile_image) {
          _push2(`<img${ssrRenderAttr("src", "/" + $props.person.profile_image)}${ssrRenderAttr("alt", `Profile image of ${$props.person.full_name || $props.person.alias}`)} data-v-777df648${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          $props.person.profile_image ? (openBlock(), createBlock("img", {
            key: 0,
            src: "/" + $props.person.profile_image,
            alt: `Profile image of ${$props.person.full_name || $props.person.alias}`
          }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<figcaption class="personInfo" data-v-777df648><span class="name" data-v-777df648>${ssrInterpolate($props.person.full_name || $props.person.alias)}</span></figcaption></figure></li>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/people/PersonProfileItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PersonProfileItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-777df648"]]);
const _sfc_main$1 = {
  components: {
    PersonProfileItem
  },
  props: {
    people: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    getPeople() {
      const order = { "Founder": 1, "Developer": 2, "Editor": 3, "Neural Network Dev": 4, "Proofreader": 5, "Former Dev": 6 };
      let people = this.people;
      people = people.sort(function(a, b) {
        return order[a.role] - order[b.role];
      });
      const chunkSize = 3;
      const chunks = [];
      for (let i = 0; i < people.length; i += chunkSize) {
        chunks.push(people.slice(i, i + chunkSize));
      }
      return chunks;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_person_profile_item = resolveComponent("person-profile-item");
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "roleList" }, _attrs))} data-v-1e017345><!--[-->`);
  ssrRenderList($options.getPeople, (peopleRow, index2) => {
    _push(`<li class="role" data-v-1e017345><ul class="peopleList" data-v-1e017345><!--[-->`);
    ssrRenderList(peopleRow, (person) => {
      _push(ssrRenderComponent(_component_person_profile_item, {
        key: person._id,
        person
      }, null, _parent));
    });
    _push(`<!--]--></ul></li>`);
  });
  _push(`<!--]--></ul>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/people/PeopleProfileList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PeopleProfileList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-1e017345"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const apiFetch = useApiFetch();
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("people:featured", async () => {
      try {
        return await apiFetch("/api/persons/featured");
      } catch (error) {
        console.log(error);
        return { people: [] };
      }
    })), __temp = await __temp, __restore(), __temp);
    const people = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.people) != null ? _b : [];
    });
    useHead({ title: "People" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))} data-v-42635a72><h1 data-v-42635a72> The Team </h1>`);
      _push(ssrRenderComponent(unref(PeopleProfileList), { people: unref(people) }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/people/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-42635a72"]]);

export { index as default };
//# sourceMappingURL=index-9WveN-ku.mjs.map
