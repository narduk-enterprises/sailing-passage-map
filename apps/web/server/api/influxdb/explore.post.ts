import { InfluxDB } from '@influxdata/influxdb-client'
import { z } from 'zod'

const bodySchema = z.object({
    query: z.string().min(1, 'Query is required'),
})

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { query } = bodySchema.parse(await readBody(event))

    if (!query || typeof query !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Query is required and must be a string',
        })
    }

    if (!config.influxToken || !config.influxOrgId || !config.influxBucket) {
        throw createError({
            statusCode: 500,
            statusMessage: 'InfluxDB configuration is missing',
        })
    }

    try {
        const influxDB = new InfluxDB({
            url: config.influxUrl,
            token: config.influxToken,
        })

        const queryApi = influxDB.getQueryApi(config.influxOrgId)
        const results: Record<string, unknown>[] = []

        return new Promise((resolve, reject) => {
            queryApi.queryRows(query, {
                next(row, tableMeta) {
                    results.push(tableMeta.toObject(row))
                },
                error(error) {
                    console.error('InfluxDB query error:', error)
                    reject(
                        createError({
                            statusCode: 500,
                            statusMessage: `InfluxDB query failed: ${error.message}`,
                        }),
                    )
                },
                complete() {
                    resolve({ results, count: results.length })
                },
            })
        })
    }
    catch (error: unknown) {
        const err = error as { message?: string }
        console.error('Error executing InfluxDB query:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to execute query: ${err.message}`,
        })
    }
})
