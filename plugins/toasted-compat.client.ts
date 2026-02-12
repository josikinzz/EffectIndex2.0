export default defineNuxtPlugin((nuxtApp) => {
  const toast = nuxtApp.vueApp.config.globalProperties.$toast

  nuxtApp.vueApp.config.globalProperties.$toasted = {
    show(message: string, options: { duration?: number; type?: string } = {}) {
      const timeout = options.duration
      if (options.type === 'success') {
        return toast.success(message, { timeout })
      }
      if (options.type === 'error') {
        return toast.error(message, { timeout })
      }
      return toast(message, { timeout })
    }
  }
})
