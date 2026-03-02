export default defineEventHandler(async (event) => {
  const rawPath = getRouterParam(event, 'path') || ''

  // Local dev fallback for NuxtImg cloudflare provider:
  // /cdn-cgi/image/<modifiers>/<real-path> -> /<real-path>
  const segments = rawPath.split('/').filter(Boolean)
  if (segments.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Cloudflare image path' })
  }

  const [, ...rest] = segments
  const targetPath = `/${rest.join('/')}`

  if (!targetPath.startsWith('/_og/')) {
    throw createError({ statusCode: 404, statusMessage: 'Unsupported image source path' })
  }

  const requestUrl = getRequestURL(event)
  const forwarded = new URL(targetPath, 'http://localhost')
  for (const [key, value] of requestUrl.searchParams.entries()) {
    forwarded.searchParams.set(key, value)
  }

  return sendRedirect(event, `${forwarded.pathname}${forwarded.search}`, 302)
})
