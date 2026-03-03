import { InfluxDB, flux } from '@influxdata/influxdb-client'
import { z } from 'zod'

const querySchema = z.object({
    startTime: z.string().optional().default('2025-06-26T00:00:00Z'),
    endTime: z.string().optional().default('2025-07-05T00:00:00Z'),
    limit: z.coerce.number().int().positive().optional().default(10),
})

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = querySchema.parse(getQuery(event))

    const startTime = query.startTime
    const endTime = query.endTime
    const limit = query.limit

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

        const exploreQuery = flux`
      from(bucket: ${config.influxBucket})
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r["self"] == "t")
        |> limit(n: ${String(limit)})
        |> yield(name: "explore")
    `

        const results: Record<string, unknown>[] = []

        return new Promise((resolve, reject) => {
            queryApi.queryRows(exploreQuery, {
                next(row, tableMeta) {
                    results.push(tableMeta.toObject(row))
                },
                error(error) {
                    console.error('InfluxDB explore query error:', error)
                    reject(
                        createError({
                            statusCode: 500,
                            statusMessage: `InfluxDB query failed: ${error.message}`,
                        }),
                    )
                },
                complete() {
                    const byMeasurement = new Map<string, Set<string>>()

                    for (const row of results) {
                        const measurement = row._measurement as string
                        const field = row._field as string

                        if (!byMeasurement.has(measurement)) {
                            byMeasurement.set(measurement, new Set())
                        }
                        byMeasurement.get(measurement)!.add(field)
                    }

                    const structure = Array.from(byMeasurement.entries()).map(
                        ([measurement, fields]) => ({
                            measurement,
                            fields: Array.from(fields),
                            sampleCount: results.filter(r => r._measurement === measurement).length,
                        }),
                    )

                    resolve({
                        totalRows: results.length,
                        measurements: structure,
                        sampleRows: results.slice(0, 5),
                    })
                },
            })
        })
    }
    catch (error: unknown) {
        const err = error as { message?: string }
        console.error('Error exploring InfluxDB:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to explore InfluxDB: ${err.message}`,
        })
    }
})
