import { getCloudflareEnv } from '#server/utils/cloudflareEnv'
import { getD2Database, insertPassageLocations } from '#server/utils/d2Storage'
import { getPassagesStorage } from '#server/utils/storage'
import { definePublicMutation, withValidatedBody } from '#layer/server/utils/mutation'
import { RATE_LIMIT_POLICIES } from '#layer/server/utils/rateLimit'
import { z } from 'zod'

const locationSchema = z.object({
    lat: z.number(),
    lon: z.number(),
    time: z.string().optional(),
    name: z.string().optional(),
    locality: z.string().optional(),
    administrativeArea: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    formattedAddress: z.string().optional(),
    pointsOfInterest: z.string().optional(),
})

const bodySchema = z.object({
    locations: z.array(locationSchema).min(1, 'At least one location is required'),
})

export default definePublicMutation(
    {
        rateLimit: RATE_LIMIT_POLICIES.passageEdit,
        parseBody: withValidatedBody(bodySchema.parse),
    },
    async ({ event, body: { locations } }) => {
        const id = getRouterParam(event, 'id')
        if (!id) {
            throw createError({ statusCode: 400, statusMessage: 'Passage ID is required' })
        }

        const env = getCloudflareEnv(event)
        const config = useRuntimeConfig(event)
        const storageConfig = {
            r2AccessKeyId: config.r2AccessKeyId,
            r2SecretAccessKey: config.r2SecretAccessKey,
        }

        try {
            const d2Db = getD2Database(env)
            if (d2Db) {
                const d2Locations = locations.map(loc => ({
                    coordinate: { lat: loc.lat, lon: loc.lon },
                    time: loc.time ?? '',
                    name: loc.name,
                    locality: loc.locality,
                    administrativeArea: loc.administrativeArea,
                    country: loc.country,
                    countryCode: loc.countryCode,
                    formattedAddress: loc.formattedAddress,
                    pointsOfInterest: loc.pointsOfInterest ? [loc.pointsOfInterest] : undefined,
                }))
                await insertPassageLocations(d2Db, id, d2Locations)
            }

            const storage = getPassagesStorage(env, storageConfig)
            const filename = id.endsWith('.json') ? id : `${id}.json`
            const passage = await storage.readJSON<Record<string, unknown>>(filename)

            if (passage) {
                passage.locations = locations
                await storage.writeJSON(filename, passage)
            }

            return { success: true, id, locationCount: locations.length }
        }
        catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string }
            console.error(`Error saving locations for passage ${id}:`, error)
            throw createError({
                statusCode: err.statusCode || 500,
                statusMessage: err.message || 'Failed to save locations',
            })
        }
    },
)
