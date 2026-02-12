import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useProfilesStore = defineStore('profiles', {
  state: () => ({
    list: []
  }),
  actions: {
    set(profiles) {
      this.list = profiles
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { profiles } = await apiFetch('/api/profiles')
        this.set(profiles)
      } catch (error) {
        throw error
      }
    },
    async getProfileByName(name) {
      try {
        const apiFetch = useApiFetch()
        const { profile } = await apiFetch(`/api/profiles/user/${name}`)
        return { profile }
      } catch (error) {
        throw error
      }
    },
    async getProfileById(id) {
      try {
        const apiFetch = useApiFetch()
        const { profile } = await apiFetch(`/api/profiles/${id}`)
        return { profile }
      } catch (error) {
        throw error
      }
    },
    async submit(payload) {
      try {
        const { profile } = payload
        const apiFetch = useApiFetch()
        const response = await apiFetch('/api/profiles/', {
          method: 'POST',
          body: { profile }
        })
        await this.get()
        return response
      } catch (error) {
        throw error
      }
    },
    async update(payload) {
      try {
        const { profile } = payload
        const apiFetch = useApiFetch()
        const response = await apiFetch(`/api/profiles/${profile._id}`, {
          method: 'PUT',
          body: { profile }
        })
        return response
      } catch (error) {
        throw error
      }
    },
    async delete(id) {
      try {
        const apiFetch = useApiFetch()
        await apiFetch(`/api/profiles/${id}`, { method: 'DELETE' })
        await this.get()
      } catch (error) {
        throw error
      }
    }
  }
})
