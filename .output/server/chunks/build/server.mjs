import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, hasInjectionContext, inject, ref, Suspense, Fragment, shallowReactive, toRef, defineAsyncComponent, computed, unref, createApp, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, reactive, effectScope, mergeProps, getCurrentScope, withCtx, nextTick, isReadonly, toRaw, useSSRContext, isRef, isShallow, isReactive } from 'vue';
import { e as createError$1, k as hasProtocol, l as isScriptProtocol, h as joinURL, w as withQuery, m as klona, s as sanitizeStatusCode, n as getContext, o as getRequestHeader, p as destr, q as isEqual, r as setCookie, t as getCookie, v as deleteCookie, $ as $fetch$1, x as createHooks, y as defu, z as executeAsync } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { defineStore, setActivePinia, createPinia, shouldHydrate } from 'pinia';
import { RouterView, useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import MarkdownIt from 'markdown-it';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'module';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.0";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
const abortNavigation = (err) => {
  if (!err) {
    return false;
  }
  err = createError(err);
  if (err.fatal) {
    useNuxtApp().runWithContext(() => showError(err));
  }
  throw err;
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher().map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$7 = { scrollToTop: true };
const __nuxt_page_meta$6 = { scrollToTop: true };
const __nuxt_page_meta$5 = { scrollToTop: true };
const __nuxt_page_meta$4 = { scrollToTop: true };
const __nuxt_page_meta$3 = null;
const __nuxt_page_meta$2 = { scrollToTop: true };
const __nuxt_page_meta$1 = { scrollToTop: true };
const __nuxt_page_meta = { scrollToTop: true };
const _routes = [
  {
    name: "about",
    path: "/about",
    component: () => import('./about-XzQXR7pg.mjs')
  },
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./index-47v_1Cw3.mjs')
  },
  {
    name: "donate",
    path: "/donate",
    component: () => import('./donate-YooQmBhn.mjs')
  },
  {
    name: "search",
    path: "/search",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./search-BUQm6Z9p.mjs')
  },
  {
    name: "contact",
    path: "/contact",
    component: () => import('./contact-Crg3IRwH.mjs')
  },
  {
    name: "discord",
    path: "/discord",
    component: () => import('./discord-B_83lMuJ.mjs')
  },
  {
    name: "clinical",
    path: "/clinical",
    component: () => import('./clinical-Dw1wEimF.mjs')
  },
  {
    name: "blog",
    path: "/blog",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./index-Dx1IKLvH.mjs')
  },
  {
    name: "people",
    path: "/people",
    component: () => import('./index-9WveN-ku.mjs')
  },
  {
    name: "effects",
    path: "/effects",
    component: () => import('./index-T2dQ98Pm.mjs')
  },
  {
    name: "reports",
    path: "/reports",
    component: () => import('./index-B0RTsKli.mjs')
  },
  {
    name: "articles",
    path: "/articles",
    component: () => import('./index-BVaLU8j4.mjs')
  },
  {
    name: "profiles",
    path: "/profiles",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./index-IUwXYgyr.mjs')
  },
  {
    name: "summaries",
    path: "/summaries",
    component: () => import('./index-Dy0OkGTp.mjs'),
    children: [
      {
        name: "summaries-index-deliriants",
        path: "deliriants",
        component: () => import('./index-mDP6EQ7W.mjs')
      },
      {
        name: "summaries-index-dissociatives",
        path: "dissociatives",
        component: () => import('./index-4XH0mkoR.mjs')
      },
      {
        name: "summaries-index-psychedelics-visual",
        path: "psychedelics/visual",
        component: () => import('./visual-Bx-dVhEQ.mjs')
      },
      {
        name: "summaries-index-psychedelics-cognitive",
        path: "psychedelics/cognitive",
        component: () => import('./cognitive-Drr0hn5A.mjs')
      },
      {
        name: "summaries-index-psychedelics-miscellaneous",
        path: "psychedelics/miscellaneous",
        component: () => import('./miscellaneous-Bx788E2x.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$3?.name,
    path: "/categories",
    component: () => import('./index-B4eV3tRO.mjs'),
    children: [
      {
        name: "categories-index",
        path: "",
        component: () => import('./index-MOaoedW6.mjs')
      },
      {
        name: "categories-index-visual-effects",
        path: "visual-effects",
        component: () => import('./visual-effects-Cmq1htcW.mjs')
      },
      {
        name: "categories-index-tactile-effects",
        path: "tactile-effects",
        component: () => import('./tactile-effects-Crc4Iuqo.mjs')
      },
      {
        name: "categories-index-auditory-effects",
        path: "auditory-effects",
        component: () => import('./auditory-effects-CbwMzuVr.mjs')
      },
      {
        name: "categories-index-physical-effects",
        path: "physical-effects",
        component: () => import('./physical-effects-DUNBfmQX.mjs')
      },
      {
        name: "categories-index-cognitive-effects",
        path: "cognitive-effects",
        component: () => import('./cognitive-effects-DUJpXOM1.mjs')
      },
      {
        name: "categories-index-geometric-patterns",
        path: "geometric-patterns",
        component: () => import('./geometric-patterns-NxYRI9V2.mjs')
      },
      {
        name: "categories-index-visual-distortions",
        path: "visual-distortions",
        component: () => import('./visual-distortions-EJaRLFgD.mjs')
      },
      {
        name: "categories-index-visual-suppressions",
        path: "visual-suppressions",
        component: () => import('./visual-suppressions-D7bvnbFx.mjs')
      },
      {
        name: "categories-index-hallucinatory-states",
        path: "hallucinatory-states",
        component: () => import('./hallucinatory-states-CWgXmwXq.mjs')
      },
      {
        name: "categories-index-multisensory-effects",
        path: "multisensory-effects",
        component: () => import('./multisensory-effects-jAa7t7YJ.mjs')
      },
      {
        name: "categories-index-neurological-effects",
        path: "neurological-effects",
        component: () => import('./neurological-effects-DN6WBta_.mjs')
      },
      {
        name: "categories-index-physical-alterations",
        path: "physical-alterations",
        component: () => import('./physical-alterations-DmnFIHh4.mjs')
      },
      {
        name: "categories-index-psychological-states",
        path: "psychological-states",
        component: () => import('./psychological-states-D27WRz-y.mjs')
      },
      {
        name: "categories-index-transpersonal-states",
        path: "transpersonal-states",
        component: () => import('./transpersonal-states-MCvud5C1.mjs')
      },
      {
        name: "categories-index-disconnective-effects",
        path: "disconnective-effects",
        component: () => import('./disconnective-effects-F4n-PX_I.mjs')
      },
      {
        name: "categories-index-physical-suppressions",
        path: "physical-suppressions",
        component: () => import('./physical-suppressions-XGIP1fms.mjs')
      },
      {
        name: "categories-index-transpersonal-effects",
        path: "transpersonal-effects",
        component: () => import('./transpersonal-effects-DXjNccip.mjs')
      },
      {
        name: "categories-index-visual-amplifications",
        path: "visual-amplifications",
        component: () => import('./visual-amplifications-D6xwQ3nC.mjs')
      },
      {
        name: "categories-index-cardiovascular-effects",
        path: "cardiovascular-effects",
        component: () => import('./cardiovascular-effects-Lvn6bwjC.mjs')
      },
      {
        name: "categories-index-cognitive-suppressions",
        path: "cognitive-suppressions",
        component: () => import('./cognitive-suppressions-Dn1uncr_.mjs')
      },
      {
        name: "categories-index-novel-cognitive-states",
        path: "novel-cognitive-states",
        component: () => import('./novel-cognitive-states-2XBO9AnM.mjs')
      },
      {
        name: "categories-index-physical-amplifications",
        path: "physical-amplifications",
        component: () => import('./physical-amplifications-Bg89LSof.mjs')
      },
      {
        name: "categories-index-smell-and-taste-effects",
        path: "smell-and-taste-effects",
        component: () => import('./smell-and-taste-effects-CBOWMOij.mjs')
      },
      {
        name: "categories-index-cognitive-amplifications",
        path: "cognitive-amplifications",
        component: () => import('./cognitive-amplifications-BDUu0YCd.mjs')
      },
      {
        name: "categories-index-uncomfortable-bodily-effects",
        path: "uncomfortable-bodily-effects",
        component: () => import('./uncomfortable-bodily-effects-BAXIlGU7.mjs')
      },
      {
        name: "categories-index-uncomfortable-physical-effects",
        path: "uncomfortable-physical-effects",
        component: () => import('./uncomfortable-physical-effects-C5ZTwAUU.mjs')
      }
    ]
  },
  {
    name: "blog-slug",
    path: "/blog/:slug()",
    component: () => import('./index-ChRq_XY0.mjs')
  },
  {
    name: "people-url",
    path: "/people/:url()",
    component: () => import('./index-BqSj5aLA.mjs')
  },
  {
    name: "replications-audio",
    path: "/replications/audio",
    component: () => import('./audio-NtT14Rwt.mjs')
  },
  {
    name: "replications",
    path: "/replications",
    component: () => import('./index-CBrIHl-Y.mjs')
  },
  {
    name: "profiles-username",
    path: "/profiles/:username()",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./_username_-DqBLHcd-.mjs')
  },
  {
    name: "copyright-disclaimer",
    path: "/copyright-disclaimer",
    component: () => import('./copyright-disclaimer-f29oaDqP.mjs')
  },
  {
    name: "effects-name",
    path: "/effects/:name()",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./index-0iPjuG9Y.mjs')
  },
  {
    name: "reports-slug",
    path: "/reports/:slug()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-weCzMTxo.mjs')
  },
  {
    name: "articles-slug",
    path: "/articles/:slug()",
    component: () => import('./index-CQI981s-.mjs')
  },
  {
    name: "replications-tutorials",
    path: "/replications/tutorials",
    component: () => import('./tutorials-BD3jE9vB.mjs')
  },
  {
    name: "documentation-style-guide",
    path: "/documentation-style-guide",
    component: () => import('./documentation-style-guide-KBpEpRHt.mjs')
  },
  {
    name: "methodology-duration-terminology",
    path: "/methodology/duration-terminology",
    component: () => import('./duration-terminology-BGP6dnw8.mjs')
  },
  {
    name: "methodology-approximate-frequency-of-occurence-scale",
    path: "/methodology/approximate-frequency-of-occurence-scale",
    component: () => import('./approximate-frequency-of-occurence-scale-D0fGK7Jv.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const routerOptions$1 = {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    let position = {};
    if (to.matched.length < 2) {
      position = { left: 0, top: 0 };
    } else if (to.matched.some((route) => route.components?.default?.scrollToTop)) {
      position = { left: 0, top: 0 };
    }
    if (to.hash) {
      {
        position = { left: 0, top: 0 };
      }
    }
    return position;
  }
};
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const hashMode = routerOptions$1.hashMode ?? false;
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0,
  ...routerOptions$1
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const isBlockedPath = (path) => {
  return path === "/admin" || path.startsWith("/admin/") || path === "/user" || path.startsWith("/user/");
};
const browse_45only_45404_45global = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === "true";
  if (!browseOnlyMode || !isBlockedPath(to.path)) {
    return;
  }
  return abortNavigation(createError({ statusCode: 404, statusMessage: "Page Not Found" }));
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  browse_45only_45404_45global,
  manifest_45route_45rule
];
const namedMiddleware = {
  auth: () => import('./auth-DdBecrBl.mjs'),
  "close-nav-on-nav": () => import('./closeNavOnNav-DMoPpsY0.mjs'),
  redirect: () => import('./redirect-rYyQzGqO.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const __nuxt_component_1$1 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia;
    }
    return {
      provide: {
        pinia
      }
    };
  },
  hooks: {
    "app:rendered"() {
      const nuxtApp = useNuxtApp();
      nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
      setActivePinia(void 0);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const pwa_icons_plugin_C24GcIKjcI2zsa8A86om0L2LZjx1chWtzYxD11T7Txg = /* @__PURE__ */ defineNuxtPlugin(() => {
  return {
    provide: {
      pwaIcons: {
        transparent: {},
        maskable: {},
        favicon: {},
        apple: {},
        appleSplashScreen: {}
      }
    }
  };
});
const EMPTY_STATIC_API_DATA = {
  endpointData: {},
  dynamicData: {}
};
let staticApiDataPromise = null;
const createHttpError = (statusCode, statusMessage, data) => {
  const error = new Error(statusMessage);
  error.statusCode = statusCode;
  error.statusMessage = statusMessage;
  if (data) error.data = data;
  return error;
};
const parsePath = (request) => {
  if (!request) return "";
  try {
    return new URL(request, "http://localhost").pathname;
  } catch {
    return request.split("?")[0] || "";
  }
};
const clone = (value) => {
  if (value === void 0) return value;
  return JSON.parse(JSON.stringify(value));
};
const getStaticApiData = async () => {
  if (staticApiDataPromise) return staticApiDataPromise;
  staticApiDataPromise = (async () => {
    {
      try {
        const [{ readFile }, { resolve }] = await Promise.all([
          import('node:fs/promises'),
          import('node:path')
        ]);
        const json = await readFile(resolve(process.cwd(), "static/data/api-data.json"), "utf8");
        return JSON.parse(json);
      } catch {
        return EMPTY_STATIC_API_DATA;
      }
    }
    try {
      return await $fetch("/data/api-data.json");
    } catch {
      return EMPTY_STATIC_API_DATA;
    }
  })();
  return staticApiDataPromise;
};
const getMethod = (options = {}) => {
  return String(options.method || "GET").toUpperCase();
};
const getDynamicMatch = (path, dynamicData) => {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 3 && segments[0] === "api" && segments[1] === "effects") {
    const effect = dynamicData?.effectsBySlug?.[decodeURIComponent(segments[2])];
    return effect === void 0 ? void 0 : { effect };
  }
  if (segments.length === 3 && segments[0] === "api" && segments[1] === "articles") {
    const article = dynamicData?.articlesBySlug?.[decodeURIComponent(segments[2])];
    if (article === void 0) {
      throw createHttpError(404, "Article not found");
    }
    return { article };
  }
  if (segments.length === 3 && segments[0] === "api" && segments[1] === "blog") {
    const post = dynamicData?.blogBySlug?.[decodeURIComponent(segments[2])];
    if (post === void 0) {
      throw createHttpError(404, "Post not found");
    }
    return { post };
  }
  if (segments.length === 4 && segments[0] === "api" && segments[1] === "reports" && segments[2] === "slug") {
    const report = dynamicData?.reportsBySlug?.[decodeURIComponent(segments[3])];
    if (report === void 0) {
      throw createHttpError(404, "Report not found");
    }
    return { report };
  }
  if (segments.length === 3 && segments[0] === "api" && segments[1] === "persons") {
    const person = dynamicData?.personsByUrl?.[decodeURIComponent(segments[2])];
    return person === void 0 ? void 0 : { person };
  }
  if (segments.length === 4 && segments[0] === "api" && segments[1] === "profiles" && segments[2] === "user") {
    const profile = dynamicData?.profilesByUsername?.[decodeURIComponent(segments[3]).toLowerCase()];
    return profile === void 0 ? void 0 : { profile };
  }
  if (segments.length === 4 && segments[0] === "api" && segments[1] === "replications" && segments[2] === "byartist") {
    const replications = dynamicData?.replicationsByArtist?.[decodeURIComponent(segments[3]).toLowerCase()];
    return replications === void 0 ? void 0 : { replications };
  }
  if (segments.length === 3 && segments[0] === "api" && segments[1] === "replications") {
    const replication = dynamicData?.replicationsByUrl?.[decodeURIComponent(segments[2])];
    return replication === void 0 ? void 0 : { replication };
  }
  return void 0;
};
const resolveStaticApiRequest = async (request, options = {}) => {
  const path = parsePath(request);
  if (!path.startsWith("/api/")) return void 0;
  const method = getMethod(options);
  const isReadMethod = method === "GET" || method === "HEAD" || method === "OPTIONS";
  if (!isReadMethod) {
    throw createHttpError(405, "READ_ONLY_MODE", {
      error: {
        name: "READ_ONLY_MODE",
        message: "This static build does not accept write operations."
      }
    });
  }
  const staticApiData = await getStaticApiData();
  const endpointData = staticApiData.endpointData || {};
  const dynamicData = staticApiData.dynamicData || {};
  if (Object.prototype.hasOwnProperty.call(endpointData, path)) {
    return clone(endpointData[path]);
  }
  const dynamicMatch = getDynamicMatch(path, dynamicData);
  if (dynamicMatch !== void 0) {
    return clone(dynamicMatch);
  }
  return void 0;
};
const useApiFetch = () => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const token = useCookie("token");
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === "true";
  const authorizationHeader = token.value ? { Authorization: `Bearer ${token.value}` } : {};
  const withHeaders = (options = {}) => ({
    ...options,
    headers: {
      ...options.headers || {},
      ...authorizationHeader
    }
  });
  {
    const requestFetch = useRequestFetch();
    return async (request, options = {}) => {
      if (browseOnlyMode) {
        const staticResponse = await resolveStaticApiRequest(request, options);
        if (staticResponse !== void 0) return staticResponse;
      }
      return requestFetch(request, withHeaders(options));
    };
  }
};
const auth_ydS_uAQ5qS4E2Ez9vBX0d0JPoo00WYZNOgh9_nraCUo = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
  let __temp, __restore;
  const config = /* @__PURE__ */ useRuntimeConfig();
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === "true";
  const token = useCookie("token");
  const user = useState("auth:user", () => null);
  const fetchUser = async () => {
    if (browseOnlyMode) {
      user.value = null;
      return null;
    }
    if (!token.value) {
      user.value = null;
      return null;
    }
    const apiFetch = useApiFetch();
    try {
      const { user: userData } = await apiFetch("/api/users/user");
      user.value = userData;
      return userData;
    } catch {
      user.value = null;
      return null;
    }
  };
  const loginWith = async (strategy, options = {}) => {
    if (browseOnlyMode) {
      token.value = null;
      user.value = null;
      return { token: null };
    }
    if (strategy !== "local") {
      throw new Error(`Unsupported auth strategy: ${strategy}`);
    }
    const apiFetch = useApiFetch();
    const { token: jwt } = await apiFetch("/api/users/login", {
      method: "POST",
      body: options.data
    });
    token.value = jwt;
    await fetchUser();
    return { token: jwt };
  };
  const logout = async () => {
    if (browseOnlyMode) {
      token.value = null;
      user.value = null;
      return;
    }
    const apiFetch = useApiFetch();
    try {
      await apiFetch("/api/users/logout", { method: "POST" });
    } finally {
      token.value = null;
      user.value = null;
    }
  };
  const hasScope = (scope) => {
    if (browseOnlyMode) return false;
    return Boolean(user.value?.permissions?.includes(scope));
  };
  const auth = {
    get user() {
      return user.value;
    },
    get loggedIn() {
      if (browseOnlyMode) return false;
      return Boolean(token.value && user.value);
    },
    hasScope,
    loginWith,
    logout,
    fetchUser
  };
  if (!browseOnlyMode && token.value && !user.value) {
    [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
  }
  nuxtApp.provide("auth", auth);
});
const markdown_it_HDu_aSefzW5TUSp2aH3mkoYeoaY_g7kJGcIc0JozbSI = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const md = new MarkdownIt({
    linkify: true,
    breaks: true,
    html: true,
    typographer: true,
    quotes: "“”‘’"
  });
  nuxtApp.provide("md", md);
});
const touch_events_server_OEY1eBFK1PVdTD6ebaZL4QixNtPs_sLhX_zurCGE9XQ = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const noopDirective = {
    mounted: () => void 0,
    updated: () => void 0,
    unmounted: () => void 0
  };
  nuxtApp.vueApp.directive("touch", noopDirective);
});
const TagAction = {
  open: "OPEN",
  close: "CLOSE"
};
const TagType = {
  single: "SINGLE",
  range: "RANGE"
};
class TagSymbol {
  constructor(index, position, length, name, action, properties, type) {
    this.index = index;
    this.position = position;
    this.length = length;
    this.name = name;
    this.action = action;
    this.properties = properties;
    this.type = type;
  }
}
class Node {
  constructor(name, properties, children) {
    this.name = name;
    this.properties = properties;
    this.children = children;
  }
}
function parseProperties(text2) {
  const PROPERTY_REGEX = /([\w\-]+)\=\"([^\"]*)\"/g;
  const properties = {};
  let match;
  while (match = PROPERTY_REGEX.exec(text2)) {
    let [_, key, value] = match;
    properties[key] = value;
  }
  return properties;
}
function getDocumentSymbols(document) {
  const SYMBOL_REGEX = /\[(\/)*([\w\-]+)([\s\S]*?)(\/)*\]/g;
  const symbols = [];
  let match;
  while (match = SYMBOL_REGEX.exec(document)) {
    let [matchedText, closed, name, properties, single] = match;
    const symbol = new TagSymbol(symbols.length, match.index, matchedText.length, name, closed ? TagAction.close : TagAction.open, properties.trim(), single ? TagType.single : TagType.range);
    symbols.push(symbol);
  }
  return symbols;
}
function getClosingTagSymbol(documentSymbols, symbol) {
  let depth = 1;
  for (let i = symbol.index + 1; i < documentSymbols.length; i++) {
    const candidate = documentSymbols[i];
    if (candidate) {
      if (candidate.type === TagType.range && candidate.name === symbol.name) {
        depth = candidate.action === TagAction.open ? depth + 1 : depth - 1;
        if (depth === 0) {
          return candidate;
        }
      }
    } else {
      break;
    }
  }
  return void 0;
}
function getTree(documentSymbols, document, startSymbol, endSymbol) {
  const ast = [];
  let currPosition = startSymbol ? startSymbol.position + startSymbol.length : 0;
  for (let i = startSymbol ? startSymbol.index + 1 : 0; i < (endSymbol ? endSymbol.index : documentSymbols.length); i++) {
    const currSymbol = documentSymbols[i];
    if (currSymbol.action === TagAction.open) {
      if (currSymbol.type === TagType.single) {
        if (currSymbol.position > currPosition) {
          ast.push(document.slice(currPosition, currSymbol.position));
        }
        ast.push(new Node(currSymbol.name, parseProperties(currSymbol.properties), void 0));
        currPosition = currSymbol.position + currSymbol.length;
      } else {
        const endSymbol2 = getClosingTagSymbol(documentSymbols, currSymbol);
        if (endSymbol2 !== void 0) {
          if (currSymbol.position > currPosition) {
            ast.push(document.slice(currPosition, currSymbol.position));
          }
          ast.push(new Node(currSymbol.name, parseProperties(currSymbol.properties), getTree(documentSymbols, document, currSymbol, endSymbol2)));
          currPosition = endSymbol2.position + endSymbol2.length;
          i = endSymbol2.index;
        }
      }
    }
  }
  const endPosition = endSymbol ? endSymbol.position : document.length;
  if (currPosition < endPosition) {
    ast.push(document.slice(currPosition, endPosition));
  }
  return ast;
}
function parse(document) {
  if (!document) return [];
  return getTree(getDocumentSymbols(document), document);
}
const vcode_parse_DzYOaoMh7wb60p97U0iFF_DGyzP4XWCFVFETn2S5F2E = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const vcode = (text2) => parse(text2);
  nuxtApp.provide("vcode", vcode);
});
const useAdminStore = defineStore("admin", {
  state: () => ({
    users: [],
    invitations: []
  }),
  actions: {
    set_user_list(users) {
      this.users = users;
    },
    set_invitations(invitations) {
      this.invitations = invitations;
    },
    async getAllUsers() {
      try {
        const apiFetch = useApiFetch();
        const users = await apiFetch("/api/users");
        this.set_user_list(users);
      } catch (error) {
        throw error;
      }
    },
    async getUser(id) {
      try {
        const apiFetch = useApiFetch();
        const { user } = await apiFetch(`/api/users/${id}`);
        return { user };
      } catch (error) {
        throw error;
      }
    },
    async register(user) {
      try {
        const apiFetch = useApiFetch();
        const { user: registeredUser } = await apiFetch("/api/users/register", {
          method: "POST",
          body: { user }
        });
        return { user: registeredUser };
      } catch (error) {
        if (error?.response?._data?.error?.message) {
          throw new Error(error.response._data.error.message);
        }
        throw error;
      }
    },
    async deleteUser(id) {
      try {
        const apiFetch = useApiFetch();
        const response = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
        await this.getAllUsers();
        return response;
      } catch (error) {
        throw error;
      }
    },
    async updateUser(payload) {
      try {
        const { user } = payload;
        const apiFetch = useApiFetch();
        const response = await apiFetch(`/api/users/${user._id}`, {
          method: "POST",
          body: { user }
        });
        await this.getAllUsers();
        return response;
      } catch (error) {
        throw error;
      }
    },
    async getInvitations() {
      try {
        const apiFetch = useApiFetch();
        const invitations = await apiFetch("/api/invitations");
        this.set_invitations(invitations);
      } catch (error) {
        throw error;
      }
    },
    async deleteInvitation(id) {
      try {
        const apiFetch = useApiFetch();
        await apiFetch(`/api/invitations/${id}`, { method: "DELETE" });
        await this.getInvitations();
      } catch (error) {
        throw error;
      }
    },
    async generateInvitation(expiration) {
      try {
        const apiFetch = useApiFetch();
        const { invitation } = await apiFetch("/api/invitations/generate", {
          method: "POST",
          body: { expiration }
        });
        return { invitation };
      } catch (error) {
        throw error;
      }
    }
  }
});
const useArticlesStore = defineStore("articles", {
  state: () => ({
    list: []
  }),
  actions: {
    set(articles) {
      this.list = articles;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { articles } = await apiFetch("/api/articles");
        this.set(articles);
      } catch (error) {
        throw error;
      }
    }
  }
});
const useBlogStore = defineStore("blog", {
  state: () => ({
    posts: []
  }),
  actions: {
    set_posts(posts) {
      this.posts = posts;
    },
    async deletePost(id) {
      const apiFetch = useApiFetch();
      await apiFetch(`/api/blog/${id}/delete`);
      await this.getPosts();
    },
    async getPosts() {
      const apiFetch = useApiFetch();
      const { posts } = await apiFetch("/api/blog");
      this.set_posts(posts);
    },
    async getPost(slug) {
      const apiFetch = useApiFetch();
      const { post } = await apiFetch(`/api/blog/${slug}`);
      return { post };
    },
    async submitPost(post) {
      try {
        const apiFetch = useApiFetch();
        await apiFetch("/api/blog", {
          method: "POST",
          body: post
        });
        await this.getPosts();
      } catch (error) {
        throw error;
      }
    },
    async updatePost(post) {
      const apiFetch = useApiFetch();
      const { post: updatedPost } = await apiFetch(`/api/blog/${post._id}`, {
        method: "POST",
        body: post
      });
      await this.getPosts();
      return updatedPost;
    }
  }
});
const useEffectsStore = defineStore("effects", {
  state: () => ({
    list: []
  }),
  actions: {
    set_effects(effects) {
      this.list = effects;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { effects } = await apiFetch("/api/effects");
        this.set_effects(effects);
      } catch (error) {
        throw error;
      }
    },
    async submit(effect) {
      try {
        const apiFetch = useApiFetch();
        const { effect: submitted } = await apiFetch("/api/effects", {
          method: "POST",
          body: { effect }
        });
        return submitted;
      } catch (error) {
        throw error;
      }
    },
    async update(effect) {
      try {
        const apiFetch = useApiFetch();
        const { effect: updatedEffect } = await apiFetch(`/api/effects/${effect.id}`, {
          method: "POST",
          body: effect
        });
        await this.get();
        return updatedEffect;
      } catch (error) {
        throw error;
      }
    },
    async delete(id) {
      const apiFetch = useApiFetch();
      const { effect: deletedEffect } = await apiFetch(`/api/effects/${id}`, { method: "DELETE" });
      await this.get();
      return deletedEffect;
    }
  }
});
const useGalleryStore = defineStore("gallery", {
  state: () => ({
    selected_effect_id: "",
    replications: [],
    replicated_effects: []
  }),
  actions: {
    set(data) {
      this.replications = data.replications;
      this.replicated_effects = data.replicated_effects;
      if (data.replicated_effects && data.replicated_effects.length > 0 && !this.selected_effect_id) {
        this.selected_effect_id = data.replicated_effects[0]._id;
      }
    },
    set_selected_effect(id) {
      this.selected_effect_id = id;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { replications, replicated_effects } = await apiFetch("/api/replications/gallery");
        this.set({ replications, replicated_effects });
      } catch (error) {
        throw error;
      }
    },
    setSelectedEffect(id) {
      this.set_selected_effect(id);
    }
  }
});
const useModalStore = defineStore("modal", {
  state: () => ({
    active: false,
    type: "",
    resource: ""
  }),
  actions: {
    toggle() {
      this.active = !this.active;
    },
    set_data(data) {
      this.type = data.type;
      this.resource = data.resource;
    }
  }
});
const Home = { "location": "/" };
const Effects = { "location": "/effects", "children": [{ "name": "Index", "location": "/effects" }, { "name": "Sensory", "location": "/effects?type=Sensory" }, { "name": "Cognitive", "location": "/effects?type=Cognitive" }, { "name": "Physical", "location": "/effects?type=Physical" }] };
const Replications = { "location": "/replications", "children": [{ "name": "Gallery", "location": "/replications" }, { "name": "Audio", "location": "/replications/audio" }, { "name": "Subreddit", "location": "https://reddit.com/r/replications", "external": true }, { "name": "Tutorials", "location": "/replications/tutorials" }] };
const Project = { "location": "/about", "children": [{ "name": "About", "location": "/about" }, { "name": "Articles", "location": "/articles" }, { "name": "Blog", "location": "/blog" }, { "name": "Search", "location": "/search" }, { "name": "Github", "location": "https://github.com/effectindex/EffectIndex", "external": true }] };
const Community = { "location": "/discord", "children": [{ "name": "People", "location": "/people" }, { "name": "Discord", "location": "/discord" }, { "name": "Contact", "location": "/contact" }] };
const navigation = {
  Home,
  Effects,
  Replications,
  "Trip Reports": { "location": "/reports", "children": [{ "name": "Trip Reports", "location": "/reports" }, { "name": "Submit Report", "location": "https://rc.community/submit-report", "external": true }] },
  Project,
  Community
};
const useNavigationStore = defineStore("navigation", {
  state: () => ({
    ...navigation
  })
});
const useProfilesStore = defineStore("profiles", {
  state: () => ({
    list: []
  }),
  actions: {
    set(profiles) {
      this.list = profiles;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { profiles } = await apiFetch("/api/profiles");
        this.set(profiles);
      } catch (error) {
        throw error;
      }
    },
    async getProfileByName(name) {
      try {
        const apiFetch = useApiFetch();
        const { profile } = await apiFetch(`/api/profiles/user/${name}`);
        return { profile };
      } catch (error) {
        throw error;
      }
    },
    async getProfileById(id) {
      try {
        const apiFetch = useApiFetch();
        const { profile } = await apiFetch(`/api/profiles/${id}`);
        return { profile };
      } catch (error) {
        throw error;
      }
    },
    async submit(payload) {
      try {
        const { profile } = payload;
        const apiFetch = useApiFetch();
        const response = await apiFetch("/api/profiles/", {
          method: "POST",
          body: { profile }
        });
        await this.get();
        return response;
      } catch (error) {
        throw error;
      }
    },
    async update(payload) {
      try {
        const { profile } = payload;
        const apiFetch = useApiFetch();
        const response = await apiFetch(`/api/profiles/${profile._id}`, {
          method: "PUT",
          body: { profile }
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    async delete(id) {
      try {
        const apiFetch = useApiFetch();
        await apiFetch(`/api/profiles/${id}`, { method: "DELETE" });
        await this.get();
      } catch (error) {
        throw error;
      }
    }
  }
});
const usePulloutMenuStore = defineStore("pullout_menu", {
  state: () => ({
    active: false
  }),
  actions: {
    toggle() {
      this.active = !this.active;
    },
    close() {
      this.active = false;
    },
    open() {
      this.active = true;
    }
  }
});
const useRedirectsStore = defineStore("redirects", {
  state: () => ({
    list: [],
    fetched: false
  }),
  actions: {
    set(redirects) {
      this.list = redirects;
      this.fetched = true;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { redirects } = await apiFetch("/api/redirects");
        this.set(redirects);
      } catch (error) {
        console.log(error);
      }
    }
  }
});
const useReplicationsStore = defineStore("replications", {
  state: () => ({
    list: []
  }),
  actions: {
    set(replications) {
      this.list = replications;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { replications } = await apiFetch("/api/replications");
        this.set(replications);
      } catch (error) {
        throw error;
      }
    },
    async featured() {
      try {
        const apiFetch = useApiFetch();
        const { replications } = await apiFetch("/api/replications/featured");
        this.set(replications);
      } catch (error) {
        throw error;
      }
    },
    async getReplication(name) {
      try {
        const apiFetch = useApiFetch();
        const { replication } = await apiFetch(`/api/replications/${name}`);
        return { replication };
      } catch (error) {
        throw error;
      }
    },
    async getReplicationsByArtist(artist) {
      try {
        const apiFetch = useApiFetch();
        const { replications } = await apiFetch(`/api/replications/byartist/${artist}`);
        return { replications };
      } catch (error) {
        throw error;
      }
    },
    async submit(replication) {
      try {
        const apiFetch = useApiFetch();
        const { replication: submittedReplication } = await apiFetch("/api/replications", {
          method: "POST",
          body: { replication }
        });
        return submittedReplication;
      } catch (error) {
        throw error;
      }
    },
    async update(replication) {
      try {
        const apiFetch = useApiFetch();
        const { replication: updatedReplication } = await apiFetch(`/api/replications/${replication.id}`, {
          method: "POST",
          body: { replication }
        });
        await this.get();
        return updatedReplication;
      } catch (error) {
        throw error;
      }
    }
  }
});
const useReportsStore = defineStore("reports", {
  state: () => ({
    list: []
  }),
  actions: {
    set(reports) {
      this.list = reports;
    },
    async get() {
      try {
        const apiFetch = useApiFetch();
        const { reports } = await apiFetch("/api/reports");
        this.set(reports);
      } catch (error) {
        throw error;
      }
    },
    async getReportById(id) {
      try {
        const apiFetch = useApiFetch();
        const { reportData, sectionVisibility } = await apiFetch(`/api/reports/${id}`);
        return { reportData, sectionVisibility };
      } catch (error) {
        throw error;
      }
    },
    async getReportBySlug(slug) {
      try {
        const apiFetch = useApiFetch();
        const { report } = await apiFetch(`/api/reports/slug/${slug}`);
        if (report.unpublished === true) {
          return void 0;
        }
        return { report };
      } catch (error) {
        return void 0;
      }
    },
    async delete(id) {
      try {
        const apiFetch = useApiFetch();
        await apiFetch(`/api/reports/${id}`, { method: "DELETE" });
        await this.get();
      } catch (error) {
        throw error;
      }
    },
    async update(payload) {
      try {
        const { report, sectionVisibility } = payload;
        const apiFetch = useApiFetch();
        await apiFetch(`/api/reports/${report._id}`, {
          method: "PUT",
          body: { report, sectionVisibility }
        });
        await this.get();
      } catch (error) {
        throw error;
      }
    },
    async submit(reportData) {
      try {
        const apiFetch = useApiFetch();
        const response = await apiFetch("/api/reports/", {
          method: "POST",
          body: reportData
        });
        await this.get();
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});
const emptyResults = () => ({
  articles: [],
  effects: [],
  reports: [],
  total_results: 0
});
const text = (value) => String(value || "").toLowerCase();
const useSearchStore = defineStore("search", {
  state: () => ({
    results: emptyResults(),
    input: "",
    staticIndexLoaded: false,
    staticIndex: {
      articles: [],
      effects: [],
      reports: []
    }
  }),
  actions: {
    set_results(results) {
      if (typeof results === "object") {
        const { articles, effects, reports, total_results } = results;
        this.results = {
          articles,
          effects,
          reports,
          total_results
        };
      } else {
        this.results = emptyResults();
      }
    },
    async loadStaticIndex() {
      if (this.staticIndexLoaded) return;
      try {
        const index = await $fetch("/search-index.json");
        if (typeof index === "object" && index) {
          this.staticIndex = {
            articles: Array.isArray(index.articles) ? index.articles : [],
            effects: Array.isArray(index.effects) ? index.effects : [],
            reports: Array.isArray(index.reports) ? index.reports : []
          };
        } else {
          this.staticIndex = { articles: [], effects: [], reports: [] };
        }
      } finally {
        this.staticIndexLoaded = true;
      }
    },
    searchStatic(query) {
      const normalizedQuery = text(query).trim();
      if (!normalizedQuery) {
        this.set_results(emptyResults());
        return;
      }
      const effects = this.staticIndex.effects.filter((effect) => {
        const haystack = [
          effect.name,
          effect.summary_raw,
          ...Array.isArray(effect.tags) ? effect.tags : []
        ].map(text).join(" ");
        return haystack.includes(normalizedQuery);
      });
      const articles = this.staticIndex.articles.filter((article) => {
        const authorNames = Array.isArray(article.authors) ? article.authors.map((author) => `${author.full_name || ""} ${author.alias || ""}`) : [];
        const haystack = [
          article.title,
          article.subtitle,
          article.short_description,
          ...Array.isArray(article.tags) ? article.tags : [],
          ...authorNames
        ].map(text).join(" ");
        return haystack.includes(normalizedQuery);
      });
      const reports = this.staticIndex.reports.filter((report) => {
        const substanceNames = Array.isArray(report.substances) ? report.substances.map((substance) => `${substance.name || ""} ${substance.dose || ""} ${substance.roa || ""}`) : [];
        const haystack = [
          report.title,
          report?.subject?.name,
          ...Array.isArray(report.tags) ? report.tags : [],
          ...substanceNames
        ].map(text).join(" ");
        return haystack.includes(normalizedQuery);
      });
      this.set_results({
        effects,
        reports,
        articles,
        total_results: effects.length + reports.length + articles.length
      });
    },
    change_input(input) {
      if (input) this.input = input;
    },
    clear_input() {
      this.input = "";
    },
    async search(query) {
      try {
        const config = /* @__PURE__ */ useRuntimeConfig();
        const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === "true";
        if (browseOnlyMode) {
          await this.loadStaticIndex();
          this.searchStatic(query);
          return;
        }
        const apiFetch = useApiFetch();
        const results = await apiFetch("/api/search", {
          method: "POST",
          body: { query }
        });
        this.set_results(results);
      } catch (error) {
        throw error;
      }
    },
    changeSearch(query) {
      this.change_input(query);
    }
  }
});
const vuex_compat_6xVb_IxCrtDDF2yFsp6mQOFWFLlB13GwrFwW56Zf5io = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const stores = {
    admin: useAdminStore(),
    articles: useArticlesStore(),
    blog: useBlogStore(),
    effects: useEffectsStore(),
    gallery: useGalleryStore(),
    modal: useModalStore(),
    navigation: useNavigationStore(),
    profiles: useProfilesStore(),
    pullout_menu: usePulloutMenuStore(),
    redirects: useRedirectsStore(),
    replications: useReplicationsStore(),
    reports: useReportsStore(),
    search: useSearchStore()
  };
  const state = reactive({});
  Object.entries(stores).forEach(([key, store]) => {
    Object.defineProperty(state, key, {
      enumerable: true,
      get: () => store.$state
    });
  });
  const dispatch = (type, payload) => {
    const [namespace, action] = type.split("/");
    const store = stores[namespace];
    if (!store || typeof store[action] !== "function") {
      throw new Error(`Unknown action: ${type}`);
    }
    return store[action](payload);
  };
  const commit = (type, payload) => {
    const [namespace, mutation] = type.split("/");
    const store = stores[namespace];
    if (!store || typeof store[mutation] !== "function") {
      throw new Error(`Unknown mutation: ${type}`);
    }
    return store[mutation](payload);
  };
  const subscribe = (callback) => {
    const unsubscribes = Object.values(stores).map(
      (store) => store.$subscribe(() => callback({ type: `${store.$id}/patch` }, state))
    );
    return () => unsubscribes.forEach((unsub) => unsub());
  };
  const compatStore = {
    state,
    dispatch,
    commit,
    subscribe
  };
  nuxtApp.provide("store", compatStore);
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  pwa_icons_plugin_C24GcIKjcI2zsa8A86om0L2LZjx1chWtzYxD11T7Txg,
  auth_ydS_uAQ5qS4E2Ez9vBX0d0JPoo00WYZNOgh9_nraCUo,
  markdown_it_HDu_aSefzW5TUSp2aH3mkoYeoaY_g7kJGcIc0JozbSI,
  touch_events_server_OEY1eBFK1PVdTD6ebaZL4QixNtPs_sLhX_zurCGE9XQ,
  vcode_parse_DzYOaoMh7wb60p97U0iFF_DGyzP4XWCFVFETn2S5F2E,
  vuex_compat_6xVb_IxCrtDDF2yFsp6mQOFWFLlB13GwrFwW56Zf5io
];
const layouts = {
  default: defineAsyncComponent(() => import('./default-CK2-YmL7.mjs').then((m) => m.default || m)),
  error: defineAsyncComponent(() => import('./error-CIv_QP6e.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0$1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$1;
  const _component_NuxtRouteAnnouncer = __nuxt_component_1$1;
  const _component_NuxtPage = __nuxt_component_0;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtRouteAnnouncer),
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DIsXc1wz.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-Dad-hzpQ.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, useSearchStore as d, entry_default as default, __nuxt_component_1 as e, asyncDataDefaults as f, createError as g, hashMode as h, useRoute as i, useApiFetch as j, __nuxt_component_0 as k, defineNuxtRouteMiddleware as l, abortNavigation as m, navigateTo as n, resolveRouteObject as r, tryUseNuxtApp as t, useRouter as u };
//# sourceMappingURL=server.mjs.map
