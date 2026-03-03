import { getInfluxDBConfig } from '#server/utils/influxClient'
import { exploreSchema } from '#server/utils/influxQueries'
import { z } from 'zod'

const querySchema = z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
})

export default defineEventHandler(async (event) => {
    const query = querySchema.parse(getQuery(event))
    const startTime = query.startTime
    const endTime = query.endTime

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
