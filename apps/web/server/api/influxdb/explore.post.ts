import { InfluxDB } from '@influxdata/influxdb-client'
import { definePublicMutation, withValidatedBody } from '#layer/server/utils/mutation'
import { RATE_LIMIT_POLICIES } from '#layer/server/utils/rateLimit'
import { z } from 'zod'

const bodySchema = z.object({
    query: z.string().min(1, 'Query is required'),
})

export default definePublicMutation(
    {
        rateLimit: RATE_LIMIT_POLICIES.influxExplorer,
        parseBody: withValidatedBody(bodySchema.parse),
    },
    async ({ event, body: { query } }) => {
        const config = useRuntimeConfig(event)

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

            return await new Promise<{ results: Record<string, unknown>[]; count: number }>((resolve, reject) => {
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
    },
)
