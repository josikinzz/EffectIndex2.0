import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {
  components: {
    Icon: __nuxt_component_0
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageContent" }, _attrs))}><h1> Documentation Style Guide `);
  _push(ssrRenderComponent(_component_Icon, {
    filename: "book-open.svg",
    class: "categoryIcon"
  }, null, _parent));
  _push(`</h1><h3> Rules of Thumb </h3><ul><li> Use simplistic and easily understandable language over complex and obscure language wherever possible. This is to ensure that the SEI is as accessible to the general public as possible. </li><li> Do not make absolute or black/white assertions. For example &quot;XYZ can creating the feeling that&quot; over &quot;XYZ will create the feeling that&quot; </li><li> Do not talk about the conclusions reached during these states as if they are inherently true, instead make it clear that you are simply describing the experience of them. </li></ul><h3> Write about facts, note speculation: </h3><ul><li> Find a balance between (a) acknowledging when content is subjective or speculative, and (b) using a direct and confident writing style. </li><li> Do not make absolute or black/white assertions. For example &quot;XYZ can creating the feeling that&quot; over &quot;XYZ will create the feeling that&quot; </li><li> Do not talk about the conclusions reached during these states as if they are inherently true, instead make it clear that you are simply describing the experience of them. </li></ul><h3> Levels of intensity intro </h3><p> &quot;This effect is capable of manifesting itself across the x different levels of intensity described below:&quot; </p><h3> Tiers </h3><ul><li> At the lowest level, \u2026 </li><li> At this level, \u2026 </li><li> At the highest level, \u2026 </li></ul><h3> Referring to the experiencer </h3><ul><li> \u201CA person\u201D is preferred </li><ul style="${ssrRenderStyle({ "margin-bottom": "0" })}"><li> &quot;At this level a person experiences morphing&quot; </li></ul><li> \u201COne\u2019s\u201D is secondary and provides variety </li><li> \u201CAt this level one\u2019s vision is completely encompassed by geometry\u201D </li></ul><h3> Outro paragraph sentence: </h3><p> &quot;Effect is most commonly induced under the influence of low/moderate/heavy dosages of hallucinogenic compounds, such as type list. However, it can also occur under the influence of type list, particularly during phase [or as a result of x]&quot; </p><h3> Word preferences: </h3><ul><li> To describe a given environment in its entirety: <i> Scene </i></li><li> To describe the surface of a given object (like the surface of a wall in a video game): <i> Texture </i></li><li> To describe a given object: <i> Object </i></li><li> To describe the experience of an effect of an illusion: <i> Perception </i></li><li> To describe increasing intensity across multiple tiers: <i> Progressive </i></li><li> To describe common sober experiences (to contrast with intoxicated effects): <i> Everyday (life) </i></li><li> To describe an illusion the subject recognizes to be false: <i> Hallucination / hallucinatory </i></li><li> To describe an illusion the subject cannot recognize as such: <i> Delusion </i></li><li> To describe the lower bound of an effect range: <i> Subtle </i></li><li> To describe the upper bound of an effect range: <i> Extreme </i></li></ul><h3> Grammatical/syntax preferences: </h3><ul><li> To refer to all possible trips: use &quot;a trip&quot; or &quot;a [substance] trip&quot; is preferred when referring to a trip. This makes the language general and inclusive, so it is clear that a specific trip or kind of trip is not being denoted. Example: &quot;The first stage of a DMT trip is the onset&quot; </li><li> To refer to specific trips: use &quot;the trip&quot;: use &quot;the trip&quot; or &quot;the [substance] trip&quot; when referring to a specific trip in narrative, or when a kind of experience given specific parameters is being discussed. Example: &quot;After describing the LSD trip Hofmann had experienced, the lecture hall giggled.&quot; </li><li> Use of and/or: Do not use &quot;and/or&quot;, it can always be replaced with more specific language that is more readable. </li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/documentation-style-guide.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const documentationStyleGuide = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { documentationStyleGuide as default };
//# sourceMappingURL=documentation-style-guide-KBpEpRHt.mjs.map
