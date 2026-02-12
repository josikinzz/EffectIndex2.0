import { $fetch } from 'ofetch'
import { resolveStaticApiRequest } from '~/utils/static-api'

export const useApiFetch = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === 'true'
  const authorizationHeader = token.value ? { Authorization: `Bearer ${token.value}` } : {}

  const withHeaders = (options: Record<string, any> = {}) => ({
    ...options,
    headers: {
      ...(options.headers || {}),
      ...authorizationHeader
    }
  })

  if (import.meta.server) {
    const requestFetch = useRequestFetch()
    return async (request: string, options: Record<string, any> = {}) => {
      if (browseOnlyMode) {
        const staticResponse = await resolveStaticApiRequest(request, options)
        if (staticResponse !== undefined) return staticResponse
      }

      return requestFetch(request, withHeaders(options))
    }
  }

  const baseURL = config.public.browserBaseURL || config.public.baseURL || undefined
  const browserFetch = $fetch.create({
    baseURL,
    headers: Object.keys(authorizationHeader).length ? authorizationHeader : undefined
  })

  return async (request: string, options: Record<string, any> = {}) => {
    if (browseOnlyMode) {
      const staticResponse = await resolveStaticApiRequest(request, options)
      if (staticResponse !== undefined) return staticResponse
    }

    return browserFetch(request, withHeaders(options))
  }
}
