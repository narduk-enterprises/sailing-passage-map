/**
 * App-level auth composable backed by nuxt-auth-utils.
 * Wraps useUserSession() to provide a clean API surface for pages/components.
 */
export const useAuth = () => {
  const { loggedIn, user, clear, fetch: fetchSession } = useUserSession()

  const isAuthenticated = computed(() => loggedIn.value)

  const logout = async () => {
    await clear()
    await navigateTo('/login')
  }

  const fetchUser = async () => {
    await fetchSession()
  }

  return {
    user,
    isAuthenticated,
    fetchUser,
    logout,
  }
}
