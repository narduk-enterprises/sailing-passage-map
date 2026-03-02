/**
 * Proxies to the auth app's /api/auth/me so that $fetch('/api/auth/me')
 * is handled by Nitro (avoids Vue Router "No match found" for /api/auth/me).
 * Forwards the request cookie so the auth app can validate the session.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authAppUrl = (config.public.authAppUrl as string) || 'http://localhost:3011'
  const cookie = getHeader(event, 'cookie')

  const response = await $fetch<{ user: { id: string; email: string; name: string | null } }>(
    `${authAppUrl}/api/auth/me`,
    {
      headers: cookie ? { cookie } : {},
    },
  )
  return response
})
