export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useAuth()

  if (!user.value) {
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event) {
        await fetchUser()
      }
    } else {
      await fetchUser()
    }
  }

  if (!user.value) {
    const authUrl = useAuthAppUrl()
    return navigateTo(`${authUrl}/login`, { external: true })
  }
})
