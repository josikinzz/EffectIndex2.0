import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    report: {
      type: Object,
      default: () => ({
        subject: {},
        substances: [],
        featured: false
      })
    },
    profileName: {
      type: String,
      default: void 0
    }
  },
  methods: {
    gotoReport(slug) {
      this.$router.push(`/reports/${slug}`);
    },
    gotoProfile(name) {
      this.$router.push(`/profiles/${name}`);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<a${ssrRenderAttrs(mergeProps({
    href: `/reports/${$props.report.slug}`,
    class: `reportList__item ${$props.report.featured ? "featured" : ""}`,
    tabindex: "0"
  }, _attrs))} data-v-f732bd81><div class="infoContainer" data-v-f732bd81><div class="titleContainer" data-v-f732bd81><h4 data-v-f732bd81>${ssrInterpolate($props.report.title)}</h4><span class="reportList__item--tripDate" style="${ssrRenderStyle($props.report.subject.trip_date ? null : { display: "none" })}" data-v-f732bd81> on ${ssrInterpolate($props.report.subject.trip_date)}</span><span class="reportList__item--author" data-v-f732bd81>-\xA0${ssrInterpolate($props.report.subject.name)}</span></div><div class="featuredStarMobile" data-v-f732bd81>`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "star.svg",
    style: { "height": "30px", "width": "30px", "opacity": "0.65" }
  }, null, _parent));
  _push(`</div></div><ul class="substancesList" data-v-f732bd81><!--[-->`);
  ssrRenderList($props.report.substances, (substance, index) => {
    _push(`<li class="substancesListItem" data-v-f732bd81><span class="substanceName" data-v-f732bd81>${ssrInterpolate(substance.name)}</span><span class="substanceDose" data-v-f732bd81>${ssrInterpolate(`${substance.dose} ${substance.roa}`)}</span></li>`);
  });
  _push(`<!--]--></ul><div class="featuredStar" data-v-f732bd81>`);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "star.svg",
    style: { "height": "30px", "width": "30px", "opacity": "0.65" }
  }, null, _parent));
  _push(`</div></a>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reports/reportList__item.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RelatedReportItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-f732bd81"]]);

export { RelatedReportItem as R };
//# sourceMappingURL=reportList__item-D2QDlvjC.mjs.map
