import { defineStore } from 'pinia'
import navigation from '~/store/navigation.json'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    ...navigation
  })
})
