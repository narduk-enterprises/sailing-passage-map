/**
 * Returns the auth app's base URL for cross-app redirects (login/logout).
 * Configure via EXAMPLE_AUTH_URL env var or runtimeConfig.
 */
export function useAuthAppUrl(): string {
  const config = useRuntimeConfig()
  return (config.public.authAppUrl as string) || 'http://localhost:3011'
}
