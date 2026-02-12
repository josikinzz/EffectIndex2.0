import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useEffectsStore = defineStore('effects', {
  state: () => ({
    list: []
  }),
  actions: {
    set_effects(effects) {
      this.list = effects
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { effects } = await apiFetch('/api/effects')
        this.set_effects(effects)
      } catch (error) {
        throw error
      }
    },
    async submit(effect) {
      try {
        const apiFetch = useApiFetch()
        const { effect: submitted } = await apiFetch('/api/effects', {
          method: 'POST',
          body: { effect }
        })
        return submitted
      } catch (error) {
        throw error
      }
    },
    async update(effect) {
      try {
        const apiFetch = useApiFetch()
        const { effect: updatedEffect } = await apiFetch(`/api/effects/${effect.id}`, {
          method: 'POST',
          body: effect
        })
        await this.get()
        return updatedEffect
      } catch (error) {
        throw error
      }
    },
    async delete(id) {
      const apiFetch = useApiFetch()
      const { effect: deletedEffect } = await apiFetch(`/api/effects/${id}`, { method: 'DELETE' })
      await this.get()
      return deletedEffect
    }
  }
})
