/**
 * D2 API Client for accessing D2 database via external Worker API
 */

export interface D2ApiConfig {
    apiUrl: string
    apiKey?: string
}

export class D2ApiClient {
    constructor(private config: D2ApiConfig) { }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.config.apiUrl}${endpoint}`
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options?.headers as Record<string, string>),
        }

        if (this.config.apiKey) {
            headers.Authorization = `Bearer ${this.config.apiKey}`
        }

        const response = await fetch(url, { ...options, headers })

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`
            try {
                const error = (await response.json()) as Record<string, string>
                errorMessage = error.error || error.message || errorMessage
            }
            catch {
                const text = await response.text().catch(() => '')
                if (text) errorMessage = text
            }
            throw new Error(`D2 API request failed: ${errorMessage}`)
        }

        return response.json() as Promise<T>
    }

    async healthCheck(): Promise<{ status: string; database: string }> {
        return this.request('/health')
    }

    async query<T = unknown>(query: string, params?: unknown[]): Promise<{ results?: T[] }> {
        return this.request('/query', {
            method: 'POST',
            body: JSON.stringify({ query, params }),
        })
    }

    async getPassage(passageId: string): Promise<{
        passage: Record<string, unknown>
        positions: Record<string, unknown>[]
        locations: Record<string, unknown>[]
    }> {
        return this.request(`/passages/${passageId}`)
    }

    async listPassages(limit = 100, offset = 0): Promise<Record<string, unknown>[]> {
        return this.request(`/passages?limit=${limit}&offset=${offset}`)
    }
}

/**
 * Get D2 API client from environment
 */
export function getD2ApiClient(): D2ApiClient | null {
    let apiUrl: string | undefined = process.env.D2_API_URL
    let apiKey: string | undefined = process.env.D2_API_KEY

    if (!apiUrl) {
        try {
            const config = useRuntimeConfig()
            apiUrl = config.d2ApiUrl
            apiKey = config.d2ApiKey || apiKey
        }
        catch {
            // useRuntimeConfig might fail in some contexts
        }
    }

    if (!apiUrl) return null

    return new D2ApiClient({ apiUrl, apiKey })
}
