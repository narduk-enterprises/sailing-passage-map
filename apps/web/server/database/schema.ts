/**
 * App-specific database schema.
 *
 * Re-exports the layer's base tables (users, sessions, todos) so that
 * drizzle-kit can discover them from this workspace. App-specific
 * tables for passage tracking are defined below.
 */
export * from '#layer/server/database/schema'

// ─── Passage Tracking Tables ────────────────────────────────────
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const passages = sqliteTable('passages', {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull().default(''),
    description: text('description').notNull().default(''),
    route: text('route').notNull().default(''),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    duration: real('duration').notNull().default(0),
    avgSpeed: real('avg_speed').notNull().default(0),
    maxSpeed: real('max_speed').notNull().default(0),
    distance: real('distance').notNull().default(0),
    startLat: real('start_lat').notNull().default(0),
    startLon: real('start_lon').notNull().default(0),
    endLat: real('end_lat').notNull().default(0),
    endLon: real('end_lon').notNull().default(0),
    exportTimestamp: text('export_timestamp'),
    filename: text('filename'),
    encountersFilename: text('encounters_filename'),
    queryMetadata: text('query_metadata'),
    createdAt: text('created_at').notNull().default("datetime('now')"),
    updatedAt: text('updated_at').notNull().default("datetime('now')"),
})

export const passagePositions = sqliteTable('passage_positions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    passageId: text('passage_id').notNull().references(() => passages.id, { onDelete: 'cascade' }),
    time: text('time').notNull(),
    lat: real('lat').notNull(),
    lon: real('lon').notNull(),
    speed: real('speed'),
    heading: real('heading'),
    distance: real('distance'),
})

export const passageLocations = sqliteTable('passage_locations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    passageId: text('passage_id').notNull().references(() => passages.id, { onDelete: 'cascade' }),
    lat: real('lat').notNull(),
    lon: real('lon').notNull(),
    time: text('time'),
    name: text('name'),
    locality: text('locality'),
    administrativeArea: text('administrative_area'),
    country: text('country'),
    countryCode: text('country_code'),
    formattedAddress: text('formatted_address'),
    pointsOfInterest: text('points_of_interest'),
})
