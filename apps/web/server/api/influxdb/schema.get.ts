import { getInfluxDBConfig } from '#server/utils/influxClient'
import { exploreSchema } from '#server/utils/influxQueries'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const startTime = (query.startTime as string) || undefined
    const endTime = (query.endTime as string) || undefined

    try {
        const config = getInfluxDBConfig()
        return await exploreSchema(config, startTime, endTime)
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        console.error('Error exploring InfluxDB schema:', error)
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.message || 'Failed to explore InfluxDB schema',
        })
    }
})
