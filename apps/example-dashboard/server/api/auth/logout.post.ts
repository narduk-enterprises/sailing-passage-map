/**
 * Proxies to the auth app's /api/auth/logout so that $fetch('/api/auth/logout')
 * is handled by Nitro (avoids Vue Router "No match found" for /api/auth/logout).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authAppUrl = (config.public.authAppUrl as string) || 'http://localhost:3011'
  const cookie = getHeader(event, 'cookie')

  await $fetch(`${authAppUrl}/api/auth/logout`, {
    method: 'POST',
    headers: cookie ? { cookie } : {},
  })
  return { success: true }
})
