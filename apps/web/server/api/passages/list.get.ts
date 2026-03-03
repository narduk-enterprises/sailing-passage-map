import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getPassagesStorage } from '#server/utils/storage'
import { getD2Database, listPassagesFromD2 } from '#server/utils/d2Storage'
import { getD2ApiClient } from '#server/utils/d2ApiClient'

export default defineEventHandler(async (event) => {
    const env = getCloudflareEnv(event)
    const config = useRuntimeConfig()
    const storageConfig = {
        r2AccessKeyId: config.r2AccessKeyId,
        r2SecretAccessKey: config.r2SecretAccessKey,
    }

    try {
        // Try D2 database first
        const d2Db = getD2Database(env)
        if (d2Db) {
            const passages = await listPassagesFromD2(d2Db)
            return passages.map(p => ({
                id: p.id,
                startTime: p.start_time,
                endTime: p.end_time,
                duration: p.duration,
                avgSpeed: p.avg_speed,
                maxSpeed: p.max_speed,
                distance: p.distance,
                startLocation: { lat: p.start_lat, lon: p.start_lon },
                endLocation: { lat: p.end_lat, lon: p.end_lon },
                description: p.description,
                name: p.name,
                route: p.route,
                exportTimestamp: p.export_timestamp,
                filename: p.filename,
                encountersFilename: p.encounters_filename,
                queryMetadata: p.query_metadata ? JSON.parse(p.query_metadata as string) : undefined,
            }))
        }

        // Try D2 API client
        const d2Api = getD2ApiClient()
        if (d2Api) {
            return await d2Api.listPassages()
        }

        // Fallback to R2/S3 storage
        const storage = getPassagesStorage(env, storageConfig)
        const files = await storage.list()
        const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'queries.json')

        const passages = await Promise.all(
            jsonFiles.map(async (file) => {
                const data = await storage.readJSON<Record<string, unknown>>(file)
                if (!data) return null
                return {
                    id: data.id || file.replace('.json', ''),
                    startTime: data.startTime,
                    endTime: data.endTime,
                    duration: data.duration,
                    avgSpeed: data.avgSpeed,
                    maxSpeed: data.maxSpeed,
                    distance: data.distance,
                    startLocation: data.startLocation,
                    endLocation: data.endLocation,
                    description: data.description,
                    name: data.name,
                    route: data.route,
                    exportTimestamp: data.exportTimestamp,
                    filename: file,
                    encountersFilename: data.encountersFilename,
                }
            }),
        )

        return passages.filter(Boolean)
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        console.error('Error listing passages:', error)
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.message || 'Failed to list passages',
        })
    }
})
