import { l as defineNuxtRouteMiddleware, m as abortNavigation, g as createError, a as useNuxtApp, n as navigateTo, b as useRuntimeConfig } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'markdown-it';

const auth = defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === "true";
  if (browseOnlyMode) {
    return abortNavigation(createError({ statusCode: 404, statusMessage: "Page Not Found" }));
  }
  const { $auth } = useNuxtApp();
  if (!$auth.loggedIn) {
    return navigateTo("/user/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-DdBecrBl.mjs.map
