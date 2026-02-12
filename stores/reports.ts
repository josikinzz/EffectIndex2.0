import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    list: []
  }),
  actions: {
    set(reports) {
      this.list = reports
    },
    async get() {
      try {
        const apiFetch = useApiFetch()
        const { reports } = await apiFetch('/api/reports')
        this.set(reports)
      } catch (error) {
        throw error
      }
    },
    async getReportById(id) {
      try {
        const apiFetch = useApiFetch()
        const { reportData, sectionVisibility } = await apiFetch(`/api/reports/${id}`)
        return { reportData, sectionVisibility }
      } catch (error) {
        throw error
      }
    },
    async getReportBySlug(slug) {
      try {
        const apiFetch = useApiFetch()
        const { report } = await apiFetch(`/api/reports/slug/${slug}`)
        if (report.unpublished === true) {
          return undefined
        }
        return { report }
      } catch (error) {
        return undefined
      }
    },
    async delete(id) {
      try {
        const apiFetch = useApiFetch()
        await apiFetch(`/api/reports/${id}`, { method: 'DELETE' })
        await this.get()
      } catch (error) {
        throw error
      }
    },
    async update(payload) {
      try {
        const { report, sectionVisibility } = payload
        const apiFetch = useApiFetch()
        await apiFetch(`/api/reports/${report._id}`, {
          method: 'PUT',
          body: { report, sectionVisibility }
        })
        await this.get()
      } catch (error) {
        throw error
      }
    },
    async submit(reportData) {
      try {
        const apiFetch = useApiFetch()
        const response = await apiFetch('/api/reports/', {
          method: 'POST',
          body: reportData
        })
        await this.get()
        return response
      } catch (error) {
        throw error
      }
    }
  }
})
