import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getPassagesStorage } from '#server/utils/storage'
import { getD2Database, updatePassageName } from '#server/utils/d2Storage'
import { z } from 'zod'

const bodySchema = z.object({
    name: z.string().min(1, 'Name is required'),
})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Passage ID is required' })
    }

    const { name } = bodySchema.parse(await readBody(event))

    const env = getCloudflareEnv(event)
    const config = useRuntimeConfig()
    const storageConfig = {
        r2AccessKeyId: config.r2AccessKeyId,
        r2SecretAccessKey: config.r2SecretAccessKey,
    }

    try {
        // Update in D2 if available
        const d2Db = getD2Database(env)
        if (d2Db) {
            await updatePassageName(d2Db, id, name)
        }

        // Update in R2/S3 storage
        const storage = getPassagesStorage(env, storageConfig)
        const filename = id.endsWith('.json') ? id : `${id}.json`
        const passage = await storage.readJSON<Record<string, unknown>>(filename)

        if (passage) {
            passage.name = name
            await storage.writeJSON(filename, passage)
        }

        return { success: true, id, name }
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        console.error(`Error renaming passage ${id}:`, error)
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.message || 'Failed to rename passage',
        })
    }
})
