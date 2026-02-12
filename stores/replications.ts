import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useReplicationsStore = defineStore('replications', {
  state: () => ({
    list: []
  }),
  actions: {
    set(replications) {
      this.list = replications
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { replications } = await apiFetch('/api/replications')
        this.set(replications)
      } catch (error) {
        throw error
      }
    },
    async featured() {
      try {
        const apiFetch = useApiFetch()
        const { replications } = await apiFetch('/api/replications/featured')
        this.set(replications)
      } catch (error) {
        throw error
      }
    },
    async getReplication(name) {
      try {
        const apiFetch = useApiFetch()
        const { replication } = await apiFetch(`/api/replications/${name}`)
        return { replication }
      } catch (error) {
        throw error
      }
    },
    async getReplicationsByArtist(artist) {
      try {
        const apiFetch = useApiFetch()
        const { replications } = await apiFetch(`/api/replications/byartist/${artist}`)
        return { replications }
      } catch (error) {
        throw error
      }
    },
    async submit(replication) {
      try {
        const apiFetch = useApiFetch()
        const { replication: submittedReplication } = await apiFetch('/api/replications', {
          method: 'POST',
          body: { replication }
        })
        return submittedReplication
      } catch (error) {
        throw error
      }
    },
    async update(replication) {
      try {
        const apiFetch = useApiFetch()
        const { replication: updatedReplication } = await apiFetch(`/api/replications/${replication.id}`, {
          method: 'POST',
          body: { replication }
        })
        await this.get()
        return updatedReplication
      } catch (error) {
        throw error
      }
    }
  }
})
