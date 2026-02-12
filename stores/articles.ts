import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    list: []
  }),
  actions: {
    set(articles) {
      this.list = articles
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { articles } = await apiFetch('/api/articles')
        this.set(articles)
      } catch (error) {
        throw error
      }
    }
  }
})
