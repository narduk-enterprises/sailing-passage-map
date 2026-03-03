/**
 * Helper to access Cloudflare environment bindings in Nitro
 * Tries multiple access patterns for compatibility with different Nitro/Cloudflare setups
 */
import type { H3Event } from 'h3'

export function getCloudflareEnv(event: H3Event): Record<string, unknown> {
    // Pattern 1: event.context.cloudflare.env (standard Nitro/Cloudflare)
    const cfEnv = (event.context as Record<string, unknown>).cloudflare as
        | { env?: Record<string, unknown> }
        | undefined

    if (cfEnv?.env) {
        return cfEnv.env
    }

    // Pattern 2: cloudflare object itself has bindings
    if (cfEnv && typeof cfEnv === 'object') {
        const cf = cfEnv as Record<string, unknown>
        if ('PASSAGES_BUCKET' in cf || 'VESSEL_DATA_BUCKET' in cf || 'QUERIES_BUCKET' in cf) {
            return cf
        }
    }

    // Pattern 3: event.context.env
    const ctxEnv = (event.context as Record<string, unknown>).env as
        | Record<string, unknown>
        | undefined
    if (ctxEnv) {
        return ctxEnv
    }

    return {}
}
