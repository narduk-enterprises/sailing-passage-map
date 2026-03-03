import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getD2Database, insertPassageLocations } from '#server/utils/d2Storage'
import { getPassagesStorage } from '#server/utils/storage'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Passage ID is required' })
    }

    const body = await readBody(event)
    const { locations } = body || {}

    if (!Array.isArray(locations)) {
        throw createError({ statusCode: 400, statusMessage: 'locations array is required' })
    }

    const env = getCloudflareEnv(event)
    const config = useRuntimeConfig()
    const storageConfig = {
        r2AccessKeyId: config.r2AccessKeyId,
        r2SecretAccessKey: config.r2SecretAccessKey,
    }

    try {
        // Save to D2 if available
        const d2Db = getD2Database(env)
        if (d2Db) {
            await insertPassageLocations(d2Db, id, locations)
        }

        // Also update R2/S3 storage
        const storage = getPassagesStorage(env, storageConfig)
        const filename = id.endsWith('.json') ? id : `${id}.json`
        const passage = await storage.readJSON<Record<string, unknown>>(filename)

        if (passage) {
            passage.locations = locations
            await storage.writeJSON(filename, passage)
        }

        return { success: true, id, locationCount: locations.length }
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        console.error(`Error saving locations for passage ${id}:`, error)
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.message || 'Failed to save locations',
        })
    }
})
