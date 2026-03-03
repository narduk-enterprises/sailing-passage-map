/**
 * Server-side reverse geocoding utility
 * Uses Apple Maps Server API
 */

export interface GeocodeResult {
    name?: string
    locality?: string
    administrativeArea?: string
    country?: string
    countryCode?: string
    formattedAddress?: string
}

/**
 * Get MapKit token for server-side API requests
 */
function getMapKitToken(): string {
    const config = useRuntimeConfig()
    const token = config.mapkitProdToken || config.mapkitDevToken || ''

    if (!token) {
        throw new Error('MapKit token not configured')
    }

    return token
}

/**
 * Reverse geocode coordinates to get location information
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult | null> {
    try {
        const token = getMapKitToken()
        const url = `https://maps-api.apple.com/v1/reverseGeocode?latitude=${lat}&longitude=${lon}`

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            console.warn(`Apple Maps geocoding failed: ${response.status} ${response.statusText}`)
            return null
        }

        const data = (await response.json()) as Record<string, unknown>

        let results: Record<string, unknown>[] = []

        if (Array.isArray(data.results)) {
            results = data.results as Record<string, unknown>[]
        }
        else if (data.result) {
            results = Array.isArray(data.result)
                ? (data.result as Record<string, unknown>[])
                : [data.result as Record<string, unknown>]
        }
        else if (data.address) {
            results = [data]
        }
        else {
            results = [data]
        }

        if (results.length === 0) return null

        let bestResult = results[0]!
        for (const result of results) {
            const address = (result.address || result) as Record<string, unknown>
            if (address.locality || (result.name && !String(result.name).match(/^\d+/))) {
                bestResult = result
                break
            }
        }

        const address = (bestResult.address || bestResult) as Record<string, string>

        return {
            name: (bestResult.name as string) || address.name || undefined,
            locality: address.locality || address.subLocality || address.city || address.town || address.island || undefined,
            administrativeArea: address.administrativeArea || address.state || address.province || address.region || undefined,
            country: address.country || undefined,
            countryCode: address.countryCode || address.isoCountryCode || undefined,
            formattedAddress: (bestResult.formattedAddress as string) || address.formattedAddress || (bestResult.displayName as string) || undefined,
        }
    }
    catch (error) {
        console.error('Error in reverse geocoding:', error)
        return null
    }
}

/**
 * Get the best location name from geocode result
 */
function getLocationName(location: GeocodeResult | null): string {
    if (!location) return 'Unknown'

    if (location.locality) return location.locality
    if (location.name && !location.name.match(/^\d+[°\s]/) && !location.name.match(/^[\d\s,.-]+$/)) {
        return location.name
    }
    if (location.administrativeArea) return location.administrativeArea

    return 'Unknown'
}

/**
 * Generate a passage name from start and end locations
 */
export function generatePassageName(
    startLocation: GeocodeResult | null,
    endLocation: GeocodeResult | null,
): string {
    const startName = getLocationName(startLocation)
    const endName = getLocationName(endLocation)

    return `From ${startName} to ${endName}`
}
