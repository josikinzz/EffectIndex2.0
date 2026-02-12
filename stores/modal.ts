import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    active: false,
    type: '',
    resource: ''
  }),
  actions: {
    toggle() {
      this.active = !this.active
    },
    set_data(data) {
      this.type = data.type
      this.resource = data.resource
    }
  }
})
