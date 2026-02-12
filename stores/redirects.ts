import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useRedirectsStore = defineStore('redirects', {
  state: () => ({
    list: [],
    fetched: false
  }),
  actions: {
    set(redirects) {
      this.list = redirects
      this.fetched = true
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { redirects } = await apiFetch('/api/redirects')
        this.set(redirects)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
