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
  const storeFactories = {
    admin: useAdminStore,
    articles: useArticlesStore,
    blog: useBlogStore,
    effects: useEffectsStore,
    gallery: useGalleryStore,
    modal: useModalStore,
    navigation: useNavigationStore,
    profiles: useProfilesStore,
    pullout_menu: usePulloutMenuStore,
    redirects: useRedirectsStore,
    replications: useReplicationsStore,
    reports: useReportsStore,
    search: useSearchStore
  } as const

  type Namespace = keyof typeof storeFactories
  const stores = {} as Record<Namespace, any>

  const resolveStore = (namespace: Namespace) => {
    if (!stores[namespace]) {
      stores[namespace] = storeFactories[namespace]()
    }
    return stores[namespace]
  }

  const state = reactive({}) as Record<string, any>
  ;(Object.keys(storeFactories) as Namespace[]).forEach((key) => {
    Object.defineProperty(state, key, {
      enumerable: true,
      get: () => resolveStore(key).$state
    })
  })

  const dispatch = (type: string, payload?: any) => {
    const [namespace, action] = type.split('/')
    if (!(namespace in storeFactories)) {
      throw new Error(`Unknown action: ${type}`)
    }
    const store = resolveStore(namespace as Namespace)
    if (!store || typeof (store as any)[action] !== 'function') {
      throw new Error(`Unknown action: ${type}`)
    }
    return (store as any)[action](payload)
  }

  const commit = (type: string, payload?: any) => {
    const [namespace, mutation] = type.split('/')
    if (!(namespace in storeFactories)) {
      throw new Error(`Unknown mutation: ${type}`)
    }
    const store = resolveStore(namespace as Namespace)
    if (!store || typeof (store as any)[mutation] !== 'function') {
      throw new Error(`Unknown mutation: ${type}`)
    }
    return (store as any)[mutation](payload)
  }

  const subscribe = (callback: (mutation: { type: string }, state: any) => void) => {
    const unsubscribes = (Object.keys(storeFactories) as Namespace[]).map((namespace) => {
      const store = resolveStore(namespace)
      store.$subscribe(() => callback({ type: `${store.$id}/patch` }, state))
    })
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
