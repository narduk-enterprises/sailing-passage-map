/**
 * Auth API composable — wraps all auth-related mutations.
 * Pages call these instead of $fetch directly (satisfies no-fetch-in-component).
 */
export function useAuthApi() {
  async function login(payload: { email: string; password: string }) {
    return $fetch<{ user: { id: string; name: string; email: string } }>('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
  }

  async function register(payload: { name: string; email: string; password: string }) {
    return $fetch<{ user: { id: string; name: string; email: string } }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
  }

  async function loginAsTestUser() {
    return $fetch<{ user: { id: string; name: string; email: string } }>('/api/auth/login-test', {
      method: 'POST',
    })
  }

  return { login, register, loginAsTestUser }
}
