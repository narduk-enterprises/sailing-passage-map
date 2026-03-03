import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getAllQueries } from '#server/utils/queryRegistry'

export default defineEventHandler(async (event) => {
    const env = getCloudflareEnv(event)
    const config = useRuntimeConfig()
    const storageConfig = {
        r2AccessKeyId: config.r2AccessKeyId,
        r2SecretAccessKey: config.r2SecretAccessKey,
    }

    try {
        return await getAllQueries(env, storageConfig)
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        console.error('Error fetching queries:', error)
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.message || 'Failed to fetch queries',
        })
    }
})
