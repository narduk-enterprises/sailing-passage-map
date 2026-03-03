import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getPassagesStorage } from '#server/utils/storage'
import { getD2Database, upsertPassage, insertPassagePositions } from '#server/utils/d2Storage'
import { getInfluxDBConfig, executeQuery } from '#server/utils/influxClient'
import { buildPassagePositionQuery, buildPassageSpeedQuery } from '#server/utils/influxQueries'
import { parseInfluxResults, transformToPassage } from '#server/utils/passageTransformer'
import { addQuery } from '#server/utils/queryRegistry'
import { reverseGeocode, generatePassageName } from '#server/utils/geocoding'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { startTime, endTime, resolution = 60, name, description } = body || {}

    if (!startTime || !endTime) {
        throw createError({
            statusCode: 400,
            statusMessage: 'startTime and endTime are required',
        })
    }

    const env = getCloudflareEnv(event)
    const config = useRuntimeConfig()
    const storageConfig = {
        r2AccessKeyId: config.r2AccessKeyId,
        r2SecretAccessKey: config.r2SecretAccessKey,
    }

    try {
        const influxConfig = getInfluxDBConfig()

        // Query position and speed data
        const positionQuery = buildPassagePositionQuery(influxConfig.bucket, {
            startTime,
            endTime,
            resolution,
        })
        const speedQuery = buildPassageSpeedQuery(influxConfig.bucket, {
            startTime,
            endTime,
            resolution,
        })

        const [positionResults, speedResults] = await Promise.all([
            executeQuery(influxConfig, positionQuery),
            executeQuery(influxConfig, speedQuery),
        ])

        const passageData = parseInfluxResults(positionResults, speedResults)

        if (passageData.positions.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'No position data found for the given time range',
            })
        }

        // Auto-generate name from geocoding if not provided
        let passageName = name
        if (!passageName) {
            try {
                const firstPos = passageData.positions[0]!
                const lastPos = passageData.positions.at(-1)!
                const [startGeo, endGeo] = await Promise.all([
                    reverseGeocode(firstPos.lat, firstPos.lon),
                    reverseGeocode(lastPos.lat, lastPos.lon),
                ])
                passageName = generatePassageName(startGeo, endGeo)
            }
            catch {
                passageName = undefined
            }
        }

        const passage = transformToPassage(passageData, {
            name: passageName,
            description,
            startTime,
            endTime,
        })

        // Save to D2 if available
        const d2Db = getD2Database(env)
        if (d2Db) {
            await upsertPassage(d2Db, passage)
            if (passage.positions && passage.positions.length > 0) {
                await insertPassagePositions(d2Db, passage.id, passage.positions)
            }
        }

        // Save to R2/S3 storage
        const storage = getPassagesStorage(env, storageConfig)
        const filename = `${passage.id}.json`
        passage.filename = filename
        await storage.writeJSON(filename, passage)

        // Register the query
        await addQuery(
            {
                query: positionQuery,
                passageId: passage.id,
                description: `Generated passage: ${passage.name}`,
                passageFilename: filename,
            },
            env,
            storageConfig,
        )

        return passage
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        if (err.statusCode) throw error
        console.error('Error generating passage:', error)
        throw createError({
            statusCode: 500,
            statusMessage: err.message || 'Failed to generate passage',
        })
    }
})
