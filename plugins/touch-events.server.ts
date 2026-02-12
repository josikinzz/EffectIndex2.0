export default defineNuxtPlugin((nuxtApp) => {
  const noopDirective = {
    mounted: () => undefined,
    updated: () => undefined,
    unmounted: () => undefined
  }

  nuxtApp.vueApp.directive('touch', noopDirective)
})
