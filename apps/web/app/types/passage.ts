export interface PassageLocation {
    lat: number
    lon: number
}

export interface PassagePosition {
    _time: string
    lat: number
    lon: number
    speed?: number
    heading?: number
    distance?: number
}

export interface QueryMetadata {
    id?: string
    query?: string
    parameters?: Record<string, unknown>
    timestamp?: string
    description?: string
}

export interface LocationInfo {
    coordinate: { lat: number; lon: number }
    time: string
    name?: string
    locality?: string
    administrativeArea?: string
    country?: string
    countryCode?: string
    pointsOfInterest?: string[]
    formattedAddress?: string
}

export interface Passage {
    id: string
    startTime: string
    endTime: string
    duration: number
    avgSpeed: number
    maxSpeed: number
    distance: number
    startLocation: PassageLocation
    endLocation: PassageLocation
    description: string
    name: string
    route: string
    exportTimestamp?: string
    filename?: string
    positions?: PassagePosition[]
    queryMetadata?: QueryMetadata
    encountersFilename?: string
    locations?: LocationInfo[]
}
