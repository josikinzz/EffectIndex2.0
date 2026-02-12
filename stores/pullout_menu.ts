import { defineStore } from 'pinia'

export const usePulloutMenuStore = defineStore('pullout_menu', {
  state: () => ({
    active: false
  }),
  actions: {
    toggle() {
      this.active = !this.active
    },
    close() {
      this.active = false
    },
    open() {
      this.active = true
    }
  }
})
