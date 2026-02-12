import { reactive } from 'vue'
import { useAdminStore } from '~/stores/admin'
import { useArticlesStore } from '~/stores/articles'
import { useBlogStore } from '~/stores/blog'
import { useEffectsStore } from '~/stores/effects'
import { useGalleryStore } from '~/stores/gallery'
import { useModalStore } from '~/stores/modal'
import { useNavigationStore } from '~/stores/navigation'
import { useProfilesStore } from '~/stores/profiles'
import { usePulloutMenuStore } from '~/stores/pullout_menu'
import { useRedirectsStore } from '~/stores/redirects'
import { useReplicationsStore } from '~/stores/replications'
import { useReportsStore } from '~/stores/reports'
import { useSearchStore } from '~/stores/search'

export default defineNuxtPlugin((nuxtApp) => {
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
  }

  const state = reactive({}) as Record<string, any>
  Object.entries(stores).forEach(([key, store]) => {
    Object.defineProperty(state, key, {
      enumerable: true,
      get: () => store.$state
    })
  })

  const dispatch = (type: string, payload?: any) => {
    const [namespace, action] = type.split('/')
    const store = stores[namespace as keyof typeof stores]
    if (!store || typeof (store as any)[action] !== 'function') {
      throw new Error(`Unknown action: ${type}`)
    }
    return (store as any)[action](payload)
  }

  const commit = (type: string, payload?: any) => {
    const [namespace, mutation] = type.split('/')
    const store = stores[namespace as keyof typeof stores]
    if (!store || typeof (store as any)[mutation] !== 'function') {
      throw new Error(`Unknown mutation: ${type}`)
    }
    return (store as any)[mutation](payload)
  }

  const subscribe = (callback: (mutation: { type: string }, state: any) => void) => {
    const unsubscribes = Object.values(stores).map((store) =>
      store.$subscribe(() => callback({ type: `${store.$id}/patch` }, state))
    )
    return () => unsubscribes.forEach((unsub) => unsub())
  }

  const compatStore = {
    state,
    dispatch,
    commit,
    subscribe
  }

  nuxtApp.provide('store', compatStore)
})
