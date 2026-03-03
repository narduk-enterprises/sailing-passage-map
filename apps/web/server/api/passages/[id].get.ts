import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getPassagesStorage, getVesselDataStorage } from '#server/utils/storage'
import { getD2Database, getPassageFromD2 } from '#server/utils/d2Storage'
import { getD2ApiClient } from '#server/utils/d2ApiClient'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Passage ID is required' })
    }

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
            const result = await getPassageFromD2(d2Db, id)
            if (result) {
                const p = result.passage
                return {
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
                    positions: result.positions.map(pos => ({
                        _time: pos.time,
                        lat: pos.lat,
                        lon: pos.lon,
                        speed: pos.speed,
                        heading: pos.heading,
                        distance: pos.distance,
                    })),
                    locations: result.locations.map(loc => ({
                        coordinate: { lat: loc.lat, lon: loc.lon },
                        time: loc.time,
                        name: loc.name,
                        locality: loc.locality,
                        administrativeArea: loc.administrative_area,
                        country: loc.country,
                        countryCode: loc.country_code,
                        formattedAddress: loc.formatted_address,
                        pointsOfInterest: loc.points_of_interest ? JSON.parse(loc.points_of_interest as string) : undefined,
                    })),
                }
            }
        }

        // Try D2 API client
        const d2Api = getD2ApiClient()
        if (d2Api) {
            return await d2Api.getPassage(id)
        }

        // Fallback to R2/S3 storage
        const storage = getPassagesStorage(env, storageConfig)
        const filename = id.endsWith('.json') ? id : `${id}.json`
        const passage = await storage.readJSON(filename)

        if (!passage) {
            throw createError({ statusCode: 404, statusMessage: `Passage ${id} not found` })
        }

        // Try to load vessel encounters
        const passageData = passage as Record<string, unknown>
        if (passageData.encountersFilename) {
            const vesselStorage = getVesselDataStorage(env, storageConfig)
            const encounters = await vesselStorage.readJSON(passageData.encountersFilename as string)
            if (encounters) {
                return { ...passageData, encounters }
            }
        }

        return passage
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        if (err.statusCode) throw error
        console.error(`Error fetching passage ${id}:`, error)
        throw createError({
            statusCode: 500,
            statusMessage: err.message || 'Failed to fetch passage',
        })
    }
})
