interface DashboardUser {
  id: string
  email: string
  name: string | null
}

export const useAuth = () => {
  const user = useState<DashboardUser | null>('auth_user', () => null)
  const isHydrated = ref(false)

  onMounted(() => {
    isHydrated.value = true
  })

  const isAuthenticated = computed(() => !!user.value)

  const { csrfFetch: api } = useNuxtApp()

  const fetchUser = async () => {
    try {
      const data = await api<{ user: DashboardUser }>('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    user.value = null
    const authUrl = useAuthAppUrl()
    await navigateTo(`${authUrl}/login`, { external: true })
  }

  return {
    user,
    isAuthenticated,
    isHydrated,
    fetchUser,
    logout,
  }
}
