/**
 * Map geometry utilities for MapKit coordinate calculations
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in nautical miles
 */
export function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 3440.065 // Earth radius in nautical miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a
        = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos((lat1 * Math.PI) / 180)
        * Math.cos((lat2 * Math.PI) / 180)
        * Math.sin(dLon / 2)
        * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

/**
 * Calculate bearing between two points (in degrees)
 */
export function calculateBearing(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const lat1Rad = (lat1 * Math.PI) / 180
    const lat2Rad = (lat2 * Math.PI) / 180

    const y = Math.sin(dLon) * Math.cos(lat2Rad)
    const x
        = Math.cos(lat1Rad) * Math.sin(lat2Rad)
        - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)
    const bearing = (Math.atan2(y, x) * 180) / Math.PI
    return (bearing + 360) % 360
}

/**
 * Calculate bounding region for an array of coordinates
 */
export function calculateBoundingRegion(
    positions: Array<{ lat: number; lon: number }>,
): { center: { lat: number; lon: number }; span: { latDelta: number; lonDelta: number } } {
    if (positions.length === 0) {
        return { center: { lat: 0, lon: 0 }, span: { latDelta: 10, lonDelta: 10 } }
    }

    let minLat = positions[0]!.lat
    let maxLat = positions[0]!.lat
    let minLon = positions[0]!.lon
    let maxLon = positions[0]!.lon

    for (const pos of positions) {
        minLat = Math.min(minLat, pos.lat)
        maxLat = Math.max(maxLat, pos.lat)
        minLon = Math.min(minLon, pos.lon)
        maxLon = Math.max(maxLon, pos.lon)
    }

    const padding = 0.1
    const latDelta = (maxLat - minLat) * (1 + padding) || 0.1
    const lonDelta = (maxLon - minLon) * (1 + padding) || 0.1

    return {
        center: {
            lat: (minLat + maxLat) / 2,
            lon: (minLon + maxLon) / 2,
        },
        span: { latDelta, lonDelta },
    }
}
