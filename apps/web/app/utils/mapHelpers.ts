import type { PassagePosition } from '~/types/passage'

/**
 * Get position color based on speed (green for slow, red for fast)
 */
export function getSpeedColor(speed: number, maxSpeed: number): string {
    if (maxSpeed <= 0) return '#22c55e'
    const ratio = Math.min(speed / maxSpeed, 1)
    const hue = (1 - ratio) * 120 // 120 = green, 0 = red
    return `hsl(${hue}, 80%, 50%)`
}

/**
 * Create a gradient polyline style for a passage track
 */
export function createTrackStyle(positions: PassagePosition[]): {
    coordinates: Array<{ lat: number; lon: number }>
    style: { lineWidth: number; strokeColor: string; strokeOpacity: number }
} {
    const coordinates = positions.map(p => ({ lat: p.lat, lon: p.lon }))
    return {
        coordinates,
        style: {
            lineWidth: 3,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.8,
        },
    }
}

/**
 * Interpolate position at a given time
 */
export function interpolatePosition(
    positions: PassagePosition[],
    targetTime: string,
): { lat: number; lon: number; speed?: number; heading?: number } | null {
    if (positions.length === 0) return null

    const targetMs = new Date(targetTime).getTime()

    // Find surrounding positions
    let prevIdx = -1
    for (let i = 0; i < positions.length; i++) {
        const posMs = new Date(positions[i]!._time).getTime()
        if (posMs <= targetMs) {
            prevIdx = i
        }
        else {
            break
        }
    }

    if (prevIdx === -1) {
        const first = positions[0]!
        return { lat: first.lat, lon: first.lon, speed: first.speed, heading: first.heading }
    }
    if (prevIdx >= positions.length - 1) {
        const last = positions.at(-1)!
        return { lat: last.lat, lon: last.lon, speed: last.speed, heading: last.heading }
    }

    const prev = positions[prevIdx]!
    const next = positions[prevIdx + 1]!
    const prevMs = new Date(prev._time).getTime()
    const nextMs = new Date(next._time).getTime()

    if (nextMs === prevMs) {
        return { lat: prev.lat, lon: prev.lon, speed: prev.speed, heading: prev.heading }
    }

    const ratio = (targetMs - prevMs) / (nextMs - prevMs)
    return {
        lat: prev.lat + (next.lat - prev.lat) * ratio,
        lon: prev.lon + (next.lon - prev.lon) * ratio,
        speed: prev.speed !== undefined && next.speed !== undefined
            ? prev.speed + (next.speed - prev.speed) * ratio
            : prev.speed,
        heading: prev.heading !== undefined && next.heading !== undefined
            ? prev.heading + (next.heading - prev.heading) * ratio
            : prev.heading,
    }
}

/**
 * Format speed in knots
 */
export function formatSpeed(knots: number): string {
    return `${knots.toFixed(1)} kn`
}

/**
 * Format distance in nautical miles
 */
export function formatDistance(nm: number): string {
    if (nm < 0.1) return `${(nm * 1852).toFixed(0)} m`
    return `${nm.toFixed(1)} nm`
}

/**
 * Format a compass heading
 */
export function formatHeading(degrees: number): string {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const idx = Math.round(degrees / 45) % 8
    return `${degrees.toFixed(0)}° ${dirs[idx]}`
}

/**
 * Format coordinates to DMS
 */
export function formatCoordinate(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`
}
