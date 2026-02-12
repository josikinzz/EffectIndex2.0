const isBlockedPath = (path: string) => {
  return path === '/admin' || path.startsWith('/admin/') || path === '/user' || path.startsWith('/user/')
}

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === 'true'

  if (!browseOnlyMode || !isBlockedPath(to.path)) {
    return
  }

  return abortNavigation(createError({ statusCode: 404, statusMessage: 'Page Not Found' }))
})
