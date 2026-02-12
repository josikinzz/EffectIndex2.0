import type { RouterOptions } from '@nuxt/schema'

const routerOptions: RouterOptions = {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    let position: { left?: number; top?: number; el?: string } = {}

    if (to.matched.length < 2) {
      position = { left: 0, top: 0 }
    } else if (to.matched.some(route => route.components?.default?.scrollToTop)) {
      position = { left: 0, top: 0 }
    }

    if (to.hash) {
      // Avoid vue-router warning noise when legacy hash anchors are absent.
      if (import.meta.client && document.querySelector(to.hash)) {
        position = { el: to.hash }
      } else {
        position = { left: 0, top: 0 }
      }
    }

    return position
  }
}

export default routerOptions
