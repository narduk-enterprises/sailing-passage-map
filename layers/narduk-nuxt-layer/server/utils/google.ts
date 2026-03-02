import { SignJWT, importPKCS8 } from 'jose'

export const GA_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
]

export const GSC_SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
]

// ─── Token cache ────────────────────────────────────────────
// INTENTIONAL module-scope cache: within a Worker isolate's lifetime, this avoids
// redundant JWT exchanges with Google. The cache is scoped to a single isolate and
// is NOT shared across Workers — it acts as a per-instance optimization, not global state.
let cachedToken: { token: string; expiry: number } | null = null

/**
 * Obtain a Google access token via service account JWT assertion.
 * Caches the token until 60s before expiry.
 */
async function getAccessToken(scopes: string[]): Promise<string> {
  if (cachedToken && cachedToken.expiry > Date.now() + 60_000) {
    return cachedToken.token
  }

  const config = useRuntimeConfig()
  const saKeyJson = config.googleServiceAccountKey
  if (!saKeyJson) {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON not configured — set googleServiceAccountKey in runtimeConfig')
  }

  // Doppler may store the service account JSON as base64-encoded
  const decoded = saKeyJson.trim().startsWith('{')
    ? saKeyJson
    : atob(saKeyJson)
  const sa = JSON.parse(decoded) as { client_email: string; private_key: string }
  const privateKey = await importPKCS8(sa.private_key, 'RS256')

  const now = Math.floor(Date.now() / 1000)
  const jwt = await new SignJWT({
    iss: sa.client_email,
    sub: sa.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .sign(privateKey)

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    throw new Error(`Google token exchange failed (${tokenResponse.status}): ${errorText}`)
  }

  const tokenData = await tokenResponse.json() as { access_token: string; expires_in: number }
  cachedToken = {
    token: tokenData.access_token,
    expiry: Date.now() + tokenData.expires_in * 1000,
  }

  return cachedToken.token
}

/**
 * Fetch from Google APIs using service account credentials.
 * Automatically handles JWT-based token generation and caching.
 */
export async function googleApiFetch(url: string, scopes: string[], options: RequestInit = {}) {
  const token = await getAccessToken(scopes)

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    throw new Error(`Google API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
