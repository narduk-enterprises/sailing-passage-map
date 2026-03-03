import type { VesselEncounter, EncounterSegment, VesselPosition } from '~/types/vessel-encounter'

/**
 * Get the closest encounter segment for a vessel
 */
export function getClosestEncounter(encounter: VesselEncounter): EncounterSegment | null {
    if (encounter.encounterSegments.length === 0) return null

    return encounter.encounterSegments.reduce((closest, segment) => {
        if (!closest || segment.closestApproach.distance < closest.closestApproach.distance) {
            return segment
        }
        return closest
    })
}

/**
 * Get vessels visible at a specific time
 */
export function getVisibleVessels(
    encounters: VesselEncounter[],
    time: string,
): Array<{ encounter: VesselEncounter; position: VesselPosition }> {
    const timeMs = new Date(time).getTime()
    const visible: Array<{ encounter: VesselEncounter; position: VesselPosition }> = []

    for (const encounter of encounters) {
        for (const segment of encounter.encounterSegments) {
            const startMs = new Date(segment.startTime).getTime()
            const endMs = new Date(segment.endTime).getTime()

            if (timeMs >= startMs && timeMs <= endMs) {
                const position = interpolateVesselPosition(segment.positions, time)
                if (position) {
                    visible.push({ encounter, position })
                }
                break
            }
        }
    }

    return visible
}

/**
 * Interpolate vessel position at a specific time
 */
function interpolateVesselPosition(
    positions: VesselPosition[],
    targetTime: string,
): VesselPosition | null {
    if (positions.length === 0) return null

    const targetMs = new Date(targetTime).getTime()

    let prevIdx = -1
    for (let i = 0; i < positions.length; i++) {
        const posMs = new Date(positions[i]!.time).getTime()
        if (posMs <= targetMs) {
            prevIdx = i
        }
        else {
            break
        }
    }

    if (prevIdx === -1) return positions[0]!
    if (prevIdx >= positions.length - 1) return positions.at(-1)!

    const prev = positions[prevIdx]!
    const next = positions[prevIdx + 1]!
    const prevMs = new Date(prev.time).getTime()
    const nextMs = new Date(next.time).getTime()

    if (nextMs === prevMs) return prev

    const ratio = (targetMs - prevMs) / (nextMs - prevMs)

    return {
        time: targetTime,
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
 * Format vessel distance
 */
export function formatVesselDistance(distanceNm: number): string {
    if (distanceNm < 0.1) return `${Math.round(distanceNm * 1852)} m`
    return `${distanceNm.toFixed(1)} nm`
}

/**
 * Get encounter danger level based on closest approach
 */
export function getEncounterDangerLevel(distanceNm: number): 'safe' | 'caution' | 'danger' {
    if (distanceNm < 0.5) return 'danger'
    if (distanceNm < 1.0) return 'caution'
    return 'safe'
}
