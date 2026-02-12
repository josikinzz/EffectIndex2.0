import { useApiFetch } from '~/composables/useApiFetch'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === 'true'
  const token = useCookie<string | null>('token')
  const user = useState<any | null>('auth:user', () => null)

  const fetchUser = async () => {
    if (browseOnlyMode) {
      user.value = null
      return null
    }

    if (!token.value) {
      user.value = null
      return null
    }
    const apiFetch = useApiFetch()
    try {
      const { user: userData } = await apiFetch('/api/users/user')
      user.value = userData
      return userData
    } catch {
      user.value = null
      return null
    }
  }

  const loginWith = async (strategy: string, options: { data?: any } = {}) => {
    if (browseOnlyMode) {
      token.value = null
      user.value = null
      return { token: null }
    }

    if (strategy !== 'local') {
      throw new Error(`Unsupported auth strategy: ${strategy}`)
    }
    const apiFetch = useApiFetch()
    const { token: jwt } = await apiFetch('/api/users/login', {
      method: 'POST',
      body: options.data
    })
    token.value = jwt
    await fetchUser()
    return { token: jwt }
  }

  const logout = async () => {
    if (browseOnlyMode) {
      token.value = null
      user.value = null
      return
    }

    const apiFetch = useApiFetch()
    try {
      await apiFetch('/api/users/logout', { method: 'POST' })
    } finally {
      token.value = null
      user.value = null
    }
  }

  const hasScope = (scope: string) => {
    if (browseOnlyMode) return false
    return Boolean(user.value?.permissions?.includes(scope))
  }

  const auth = {
    get user() {
      return user.value
    },
    get loggedIn() {
      if (browseOnlyMode) return false
      return Boolean(token.value && user.value)
    },
    hasScope,
    loginWith,
    logout,
    fetchUser
  }

  if (!browseOnlyMode && token.value && !user.value) {
    await fetchUser()
  }

  nuxtApp.provide('auth', auth)
})
