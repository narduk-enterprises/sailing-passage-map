/**
 * D2 Database storage utilities
 * Provides typed access to passages and locations stored in D1/D2
 */

export interface D2Database {
    prepare(query: string): D2PreparedStatement
    exec(query: string): Promise<D2ExecResult>
    batch<T = unknown>(statements: D2PreparedStatement[]): Promise<D2Result<T>[]>
}

export interface D2PreparedStatement {
    bind(...values: unknown[]): D2PreparedStatement
    first<T = unknown>(): Promise<T | null>
    run<T = unknown>(): Promise<D2Result<T>>
    all<T = unknown>(): Promise<D2Result<T>>
}

export interface D2Result<T = unknown> {
    success: boolean
    meta: {
        duration: number
        rows_read: number
        rows_written: number
        changed_db: boolean
        last_row_id: number
        changed_rows: number
        size_after: number
    }
    results?: T[]
}

export interface D2ExecResult {
    count: number
    duration: number
}

/**
 * Get D2 database binding from environment
 */
export function getD2Database(env?: Record<string, unknown>): D2Database | null {
    if (!env) return null

    let db = (env.DB || env.passage_map_db || env.PASSAGES_DB) as D2Database | undefined

    if (!db) {
        const cfEnv = (env as Record<string, unknown>).cloudflare as
            | { env?: Record<string, unknown> }
            | undefined
        if (cfEnv?.env) {
            db = (cfEnv.env.DB || cfEnv.env.passage_map_db || cfEnv.env.PASSAGES_DB) as D2Database | undefined
        }
    }

    if (db && typeof db === 'object' && 'prepare' in db && 'exec' in db) {
        return db
    }

    return null
}

/**
 * Insert or update a passage
 */
export async function upsertPassage(
    db: D2Database,
    passage: {
        id: string
        startTime: string
        endTime: string
        duration: number
        avgSpeed: number
        maxSpeed: number
        distance: number
        startLocation: { lat: number; lon: number }
        endLocation: { lat: number; lon: number }
        description: string
        name: string
        route: string
        exportTimestamp?: string
        filename?: string
        queryMetadata?: unknown
        encountersFilename?: string
    },
): Promise<void> {
    const query = `
    INSERT INTO passages (
      id, start_time, end_time, duration, avg_speed, max_speed, distance,
      start_lat, start_lon, end_lat, end_lon, description, name, route,
      export_timestamp, filename, query_metadata, encounters_filename, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      start_time = excluded.start_time,
      end_time = excluded.end_time,
      duration = excluded.duration,
      avg_speed = excluded.avg_speed,
      max_speed = excluded.max_speed,
      distance = excluded.distance,
      start_lat = excluded.start_lat,
      start_lon = excluded.start_lon,
      end_lat = excluded.end_lat,
      end_lon = excluded.end_lon,
      description = excluded.description,
      name = excluded.name,
      route = excluded.route,
      export_timestamp = excluded.export_timestamp,
      filename = excluded.filename,
      query_metadata = excluded.query_metadata,
      encounters_filename = excluded.encounters_filename,
      updated_at = datetime('now')
  `

    await db
        .prepare(query)
        .bind(
            passage.id,
            passage.startTime,
            passage.endTime,
            passage.duration,
            passage.avgSpeed,
            passage.maxSpeed,
            passage.distance,
            passage.startLocation.lat,
            passage.startLocation.lon,
            passage.endLocation.lat,
            passage.endLocation.lon,
            passage.description,
            passage.name,
            passage.route,
            passage.exportTimestamp || null,
            passage.filename || null,
            passage.queryMetadata ? JSON.stringify(passage.queryMetadata) : null,
            passage.encountersFilename || null,
        )
        .run()
}

/**
 * Insert passage positions in batch
 */
export async function insertPassagePositions(
    db: D2Database,
    passageId: string,
    positions: Array<{
        _time: string
        lat: number
        lon: number
        speed?: number
        heading?: number
        distance?: number
    }>,
): Promise<void> {
    if (positions.length === 0) return

    await db.prepare('DELETE FROM passage_positions WHERE passage_id = ?').bind(passageId).run()

    const batchSize = 100
    for (let i = 0; i < positions.length; i += batchSize) {
        const batch = positions.slice(i, i + batchSize)
        const statements = batch.map(pos =>
            db
                .prepare(
                    'INSERT INTO passage_positions (passage_id, time, lat, lon, speed, heading, distance) VALUES (?, ?, ?, ?, ?, ?, ?)',
                )
                .bind(
                    passageId,
                    pos._time,
                    pos.lat,
                    pos.lon,
                    pos.speed ?? null,
                    pos.heading ?? null,
                    pos.distance ?? null,
                ),
        )
        await db.batch(statements)
    }
}

/**
 * Insert passage locations in batch
 */
export async function insertPassageLocations(
    db: D2Database,
    passageId: string,
    locations: Array<{
        coordinate: { lat: number; lon: number }
        time: string
        name?: string
        locality?: string
        administrativeArea?: string
        country?: string
        countryCode?: string
        formattedAddress?: string
        pointsOfInterest?: string[]
    }>,
): Promise<void> {
    if (locations.length === 0) return

    await db.prepare('DELETE FROM passage_locations WHERE passage_id = ?').bind(passageId).run()

    const batchSize = 100
    for (let i = 0; i < locations.length; i += batchSize) {
        const batch = locations.slice(i, i + batchSize)
        const statements = batch.map(loc =>
            db
                .prepare(
                    'INSERT INTO passage_locations (passage_id, lat, lon, time, name, locality, administrative_area, country, country_code, formatted_address, points_of_interest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                )
                .bind(
                    passageId,
                    loc.coordinate.lat,
                    loc.coordinate.lon,
                    loc.time,
                    loc.name ?? null,
                    loc.locality ?? null,
                    loc.administrativeArea ?? null,
                    loc.country ?? null,
                    loc.countryCode ?? null,
                    loc.formattedAddress ?? null,
                    loc.pointsOfInterest ? JSON.stringify(loc.pointsOfInterest) : null,
                ),
        )
        await db.batch(statements)
    }
}

/**
 * Get a passage by ID with positions and locations
 */
export async function getPassageFromD2(
    db: D2Database,
    passageId: string,
): Promise<{
    passage: Record<string, unknown>
    positions: Record<string, unknown>[]
    locations: Record<string, unknown>[]
} | null> {
    const passage = await db
        .prepare('SELECT * FROM passages WHERE id = ?')
        .bind(passageId)
        .first<Record<string, unknown>>()

    if (!passage) return null

    const positions = await db
        .prepare('SELECT * FROM passage_positions WHERE passage_id = ? ORDER BY time')
        .bind(passageId)
        .all<Record<string, unknown>>()

    const locations = await db
        .prepare('SELECT * FROM passage_locations WHERE passage_id = ? ORDER BY time')
        .bind(passageId)
        .all<Record<string, unknown>>()

    return {
        passage,
        positions: positions.results || [],
        locations: locations.results || [],
    }
}

/**
 * List all passages (metadata only)
 */
export async function listPassagesFromD2(
    db: D2Database,
    limit?: number,
    offset?: number,
): Promise<Record<string, unknown>[]> {
    let query = 'SELECT * FROM passages ORDER BY start_time DESC'
    const params: unknown[] = []

    if (limit) {
        query += ' LIMIT ?'
        params.push(limit)
        if (offset) {
            query += ' OFFSET ?'
            params.push(offset)
        }
    }

    const result = await db.prepare(query).bind(...params).all<Record<string, unknown>>()
    return result.results || []
}

/**
 * Update passage name
 */
export async function updatePassageName(
    db: D2Database,
    passageId: string,
    name: string,
): Promise<void> {
    await db
        .prepare('UPDATE passages SET name = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .bind(name, passageId)
        .run()
}
