import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    selected_effect_id: '',
    replications: [],
    replicated_effects: []
  }),
  actions: {
    set(data) {
      this.replications = data.replications
      this.replicated_effects = data.replicated_effects
      if (data.replicated_effects && data.replicated_effects.length > 0 && !this.selected_effect_id) {
        this.selected_effect_id = data.replicated_effects[0]._id
      }
    },
    set_selected_effect(id) {
      this.selected_effect_id = id
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { replications, replicated_effects } = await apiFetch('/api/replications/gallery')
        this.set({ replications, replicated_effects })
      } catch (error) {
        throw error
      }
    },
    setSelectedEffect(id) {
      this.set_selected_effect(id)
    }
  }
})
