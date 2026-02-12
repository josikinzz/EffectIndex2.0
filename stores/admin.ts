import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    invitations: []
  }),
  actions: {
    set_user_list(users) {
      this.users = users
    },
    set_invitations(invitations) {
      this.invitations = invitations
    },
    async getAllUsers() {
      try {
        const apiFetch = useApiFetch()
        const users = await apiFetch('/api/users')
        this.set_user_list(users)
      } catch (error) {
        throw error
      }
    },
    async getUser(id) {
      try {
        const apiFetch = useApiFetch()
        const { user } = await apiFetch(`/api/users/${id}`)
        return { user }
      } catch (error) {
        throw error
      }
    },
    async register(user) {
      try {
        const apiFetch = useApiFetch()
        const { user: registeredUser } = await apiFetch('/api/users/register', {
          method: 'POST',
          body: { user }
        })
        return { user: registeredUser }
      } catch (error) {
        if (error?.response?._data?.error?.message) {
          throw new Error(error.response._data.error.message)
        }
        throw error
      }
    },
    async deleteUser(id) {
      try {
        const apiFetch = useApiFetch()
        const response = await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
        await this.getAllUsers()
        return response
      } catch (error) {
        throw error
      }
    },
    async updateUser(payload) {
      try {
        const { user } = payload
        const apiFetch = useApiFetch()
        const response = await apiFetch(`/api/users/${user._id}`, {
          method: 'POST',
          body: { user }
        })
        await this.getAllUsers()
        return response
      } catch (error) {
        throw error
      }
    },
    async getInvitations() {
      try {
        const apiFetch = useApiFetch()
        const invitations = await apiFetch('/api/invitations')
        this.set_invitations(invitations)
      } catch (error) {
        throw error
      }
    },
    async deleteInvitation(id) {
      try {
        const apiFetch = useApiFetch()
        await apiFetch(`/api/invitations/${id}`, { method: 'DELETE' })
        await this.getInvitations()
      } catch (error) {
        throw error
      }
    },
    async generateInvitation(expiration) {
      try {
        const apiFetch = useApiFetch()
        const { invitation } = await apiFetch('/api/invitations/generate', {
          method: 'POST',
          body: { expiration }
        })
        return { invitation }
      } catch (error) {
        throw error
      }
    }
  }
})
