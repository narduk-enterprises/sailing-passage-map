/**
 * Storage abstraction layer
 * Supports R2 bindings (production) and R2 S3 API (fallback)
 */

import type { R2Bucket } from './r2Storage'
import { readR2JSON, writeR2JSON, listR2Objects, readR2Text } from './r2Storage'
import { R2S3Storage } from './r2S3Storage'

export interface StorageAdapter {
    readJSON<T = unknown>(key: string): Promise<T | null>
    readText(key: string): Promise<string | null>
    writeJSON(key: string, data: unknown): Promise<void>
    list(prefix?: string): Promise<string[]>
    exists(key: string): Promise<boolean>
}

/**
 * R2 storage adapter (for production/Cloudflare)
 */
class R2Storage implements StorageAdapter {
    constructor(private bucket: R2Bucket) { }

    async readJSON<T = unknown>(key: string): Promise<T | null> {
        return readR2JSON<T>(this.bucket, key)
    }

    async readText(key: string): Promise<string | null> {
        return readR2Text(this.bucket, key)
    }

    async writeJSON(key: string, data: unknown): Promise<void> {
        await writeR2JSON(this.bucket, key, data)
    }

    async list(prefix?: string): Promise<string[]> {
        const objects = await listR2Objects(this.bucket, prefix)
        return objects.map(obj => obj.key)
    }

    async exists(key: string): Promise<boolean> {
        const obj = await this.bucket.head(key)
        return obj !== null
    }
}

/**
 * Get storage adapter based on environment
 * Priority: 1. R2 bindings, 2. R2 S3 API
 */
export function getStorageAdapter(
    bucketName: 'passages' | 'vessel-data' | 'queries',
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): StorageAdapter {
    const bucketBindings = {
        'passages': 'PASSAGES_BUCKET',
        'vessel-data': 'VESSEL_DATA_BUCKET',
        'queries': 'QUERIES_BUCKET',
    } as const

    const binding = bucketBindings[bucketName]

    // Try to get R2 bucket from environment (Cloudflare Workers)
    let r2Bucket: R2Bucket | undefined

    if (env) {
        r2Bucket = env[binding] as R2Bucket | undefined

        if (!r2Bucket) {
            const cfEnv = (env as Record<string, unknown>).cloudflare as
                | { env?: Record<string, unknown> }
                | undefined
            if (cfEnv?.env) {
                r2Bucket = cfEnv.env[binding] as R2Bucket | undefined
            }
        }
    }

    // Check if we have a valid R2 bucket binding
    if (r2Bucket && typeof r2Bucket === 'object' && 'get' in r2Bucket && 'put' in r2Bucket) {
        return new R2Storage(r2Bucket)
    }

    // Try R2 S3 API as fallback
    const bucketNames = {
        'passages': 'passage-map-passages',
        'vessel-data': 'passage-map-vessel-data',
        'queries': 'passage-map-queries',
    } as const

    const r2AccessKeyId = config?.r2AccessKeyId || process.env.R2_ACCESS_KEY_ID
    const r2SecretAccessKey = config?.r2SecretAccessKey || process.env.R2_SECRET_ACCESS_KEY

    if (r2AccessKeyId && r2SecretAccessKey) {
        return new R2S3Storage(bucketNames[bucketName], r2AccessKeyId, r2SecretAccessKey)
    }

    // No storage available — return a no-op adapter that returns empty results
    return {
        readJSON: async () => null,
        readText: async () => null,
        writeJSON: async () => { },
        list: async () => [],
        exists: async () => false,
    }
}

/**
 * Get passages storage
 */
export function getPassagesStorage(
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): StorageAdapter {
    return getStorageAdapter('passages', env, config)
}

/**
 * Get vessel data storage
 */
export function getVesselDataStorage(
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): StorageAdapter {
    return getStorageAdapter('vessel-data', env, config)
}

/**
 * Get queries storage
 */
export function getQueriesStorage(
    env?: Record<string, unknown>,
    config?: { r2AccessKeyId?: string; r2SecretAccessKey?: string },
): StorageAdapter {
    return getStorageAdapter('queries', env, config)
}
