export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$scrollTo = (target: any) => {
    if (process.server) return
    let el: Element | null = null

    if (typeof target === 'string') {
      el = document.querySelector(target)
    } else if (target?.$el) {
      el = target.$el as Element
    } else if (target instanceof Element) {
      el = target
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})
