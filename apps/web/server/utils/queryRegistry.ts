import { getQueriesStorage } from './storage'

export interface QueryMetadata {
    id: string
    query: string
    parameters?: Record<string, unknown>
    passageId?: string
    timestamp: string
    description?: string
    passageFilename?: string
}

const QUERIES_FILE = 'queries.json'

/**
 * Load all queries from registry
 */
export async function loadQueries(
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): Promise<QueryMetadata[]> {
    const storage = getQueriesStorage(env, config)

    try {
        const data = await storage.readJSON<{ queries: QueryMetadata[] }>(QUERIES_FILE)
        return Array.isArray(data?.queries) ? data.queries : []
    }
    catch (error) {
        console.error('Error loading queries:', error)
        return []
    }
}

/**
 * Save queries to registry
 */
export async function saveQueries(
    queries: QueryMetadata[],
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): Promise<void> {
    const storage = getQueriesStorage(env, config)
    await storage.writeJSON(QUERIES_FILE, {
        queries,
        updatedAt: new Date().toISOString(),
    })
}

/**
 * Add a query to the registry
 */
export async function addQuery(
    query: Omit<QueryMetadata, 'id' | 'timestamp'>,
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): Promise<QueryMetadata> {
    const queries = await loadQueries(env, config)

    const newQuery: QueryMetadata = {
        ...query,
        id: `query_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString(),
    }

    queries.push(newQuery)
    await saveQueries(queries, env, config)

    return newQuery
}

/**
 * Get all queries sorted by timestamp (newest first)
 */
export async function getAllQueries(
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): Promise<QueryMetadata[]> {
    const queries = await loadQueries(env, config)
    return queries.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return timeB - timeA
    })
}
