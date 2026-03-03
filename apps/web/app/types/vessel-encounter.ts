export interface VesselPosition {
    time: string
    lat: number
    lon: number
    speed?: number
    heading?: number
    cog?: number
}

export interface VesselMetadata {
    mmsi?: string
    name?: string
    callsign?: string
    imo?: string
    shipType?: string | number
    destination?: string
    length?: number
    width?: number
    draught?: number
    flag?: string
    eta?: string
    navStatus?: string | number
}

export interface EncounterSegment {
    startTime: string
    endTime: string
    closestApproach: {
        time: string
        distance: number
        ownPosition: { lat: number; lon: number }
        vesselPosition: { lat: number; lon: number }
    }
    positions: VesselPosition[]
}

export interface VesselEncounter {
    vesselId: string
    displayName: string
    metadata: VesselMetadata
    encounterSegments: EncounterSegment[]
    totalPositions: number
    firstSeen: string
    lastSeen: string
    minDistance: number
    maxSpeed?: number
}

export interface PassageEncounters {
    passageId: string
    passageName: string
    generated: string
    timeRange: {
        start: string
        end: string
    }
    vessels: VesselEncounter[]
    summary: {
        totalVessels: number
        totalEncounterSegments: number
        closestApproach: {
            vesselId: string
            distance: number
            time: string
        }
    }
}
