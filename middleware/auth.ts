export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === 'true'
  if (browseOnlyMode) {
    return abortNavigation(createError({ statusCode: 404, statusMessage: 'Page Not Found' }))
  }

  const { $auth } = useNuxtApp()
  if (!$auth.loggedIn) {
    return navigateTo('/user/login')
  }
})
