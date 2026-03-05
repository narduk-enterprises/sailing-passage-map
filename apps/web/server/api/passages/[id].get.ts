import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getPassagesStorage, getVesselDataStorage } from '#server/utils/storage'
import { getD2Database, getPassageFromD2 } from '#server/utils/d2Storage'
import { getD2ApiClient } from '#server/utils/d2ApiClient'
import { interpolatePosition } from '~/utils/mapHelpers'
import type { PassagePosition } from '~/types/passage'

// Helper to generate fake encounters for local dev testing
function generateMockEncounters(passage: Record<string, unknown>) {
    const positions = passage.positions as Array<Record<string, unknown>>
    if (!positions || positions.length < 10) return null
    if (!passage.startTime || !passage.endTime) return null

    const timeRange = {
        start: passage.startTime as string,
        end: passage.endTime as string,
    }
    
    // Pick a point in the middle of the passage to base our fake ship around
    const midPointIdx = Math.floor(positions.length / 2)
    const midPos = positions[midPointIdx]!
    const midTimeMs = new Date((midPos._time || midPos.time) as string).getTime()

    // 1 hour encounter
    const startEncounterMs = midTimeMs - (1000 * 60 * 30)
    const endEncounterMs = midTimeMs + (1000 * 60 * 30)
    
    const segmentPositions = []
    
    // Generate 10 positions for the fake ship
    for (let i = 0; i <= 10; i++) {
        const timeMs = startEncounterMs + ((endEncounterMs - startEncounterMs) * (i / 10))
        // Position it slightly off from our own boat's interpolated position
        const myBoatPos = interpolatePosition(positions as unknown as PassagePosition[], new Date(timeMs).toISOString())
       
        if (myBoatPos) {
           segmentPositions.push({
               time: new Date(timeMs).toISOString(),
               lat: myBoatPos.lat + (0.01 * (i - 5)), // move lat slightly
               lon: myBoatPos.lon + 0.02,             // offset lon
               speed: 12.5,
               heading: myBoatPos.heading ? (myBoatPos.heading + 180) % 360 : 180,
               cog: myBoatPos.heading ? (myBoatPos.heading + 180) % 360 : 180,
           })
        }
    }
    
    return {
        passageId: passage.id,
        passageName: passage.name,
        generated: new Date().toISOString(),
        timeRange,
        vessels: [
            {
                vesselId: 'mock-tanker-123',
                displayName: 'DEV MOCK TANKER',
                metadata: {
                    mmsi: '123456789',
                    name: 'DEV MOCK TANKER',
                    shipType: 80, // Tanker
                    length: 250,
                },
                firstSeen: new Date(startEncounterMs).toISOString(),
                lastSeen: new Date(endEncounterMs).toISOString(),
                minDistance: 0.5,
                maxSpeed: 12.5,
                totalPositions: segmentPositions.length,
                encounterSegments: [
                    {
                        startTime: new Date(startEncounterMs).toISOString(),
                        endTime: new Date(endEncounterMs).toISOString(),
                        positions: segmentPositions,
                        closestApproach: {
                            time: new Date(midTimeMs).toISOString(),
                            distance: 0.5,
                            ownPosition: { lat: midPos.lat, lon: midPos.lon },
                            vesselPosition: { lat: segmentPositions[5]?.lat || midPos.lat, lon: segmentPositions[5]?.lon || midPos.lon }
                        }
                    }
                ]
            }
        ],
        summary: {
           totalVessels: 1,
           totalEncounterSegments: 1,
           closestApproach: {
               vesselId: 'mock-tanker-123',
               distance: 0.5,
               time: new Date(midTimeMs).toISOString()
           }
        }
    }
}

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
                const formattedPassage = {
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

                // Append encounters if they exist
                if (p.encounters_filename) {
                    const vesselStorage = getVesselDataStorage(env, storageConfig)
                    let encounters = await vesselStorage.readJSON(p.encounters_filename as string)
                    
                    if (!encounters && import.meta.dev) {
                        // Generate mock encounters in local dev if bucket is inaccessible
                        encounters = generateMockEncounters(formattedPassage)
                    }

                    if (encounters) {
                        return { ...formattedPassage, encounters }
                    }
                }

                return formattedPassage
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
