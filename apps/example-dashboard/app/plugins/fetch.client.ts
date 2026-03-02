/**
 * Client-side $fetch interceptor — injects CSRF header for same-origin requests.
 * Composables use useNuxtApp().csrfFetch for API calls.
 */
const fetchWithCsrf = $fetch.create({
  onRequest({ options, request }) {
    if (typeof request === 'string' && request.startsWith('/')) {
      const headers = new Headers(options.headers as HeadersInit || {})
      headers.set('X-Requested-With', 'XMLHttpRequest')
      options.headers = headers
    }
  },
})

export default defineNuxtPlugin(() => {
  globalThis.$fetch = fetchWithCsrf as typeof globalThis.$fetch
  return { provide: { csrfFetch: fetchWithCsrf } }
})
