-- Passage tracking schema: passages, positions, and locations
-- Applied after 0000_initial_schema.sql

CREATE TABLE IF NOT EXISTS `passages` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL DEFAULT '',
  `description` text NOT NULL DEFAULT '',
  `route` text NOT NULL DEFAULT '',
  `start_time` text NOT NULL,
  `end_time` text NOT NULL,
  `duration` real NOT NULL DEFAULT 0,
  `avg_speed` real NOT NULL DEFAULT 0,
  `max_speed` real NOT NULL DEFAULT 0,
  `distance` real NOT NULL DEFAULT 0,
  `start_lat` real NOT NULL DEFAULT 0,
  `start_lon` real NOT NULL DEFAULT 0,
  `end_lat` real NOT NULL DEFAULT 0,
  `end_lon` real NOT NULL DEFAULT 0,
  `export_timestamp` text,
  `filename` text,
  `encounters_filename` text,
  `query_metadata` text,
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  `updated_at` text NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `passage_positions` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `passage_id` text NOT NULL REFERENCES `passages`(`id`) ON DELETE CASCADE,
  `time` text NOT NULL,
  `lat` real NOT NULL,
  `lon` real NOT NULL,
  `speed` real,
  `heading` real,
  `distance` real
);

CREATE INDEX IF NOT EXISTS `idx_passage_positions_passage_id` ON `passage_positions` (`passage_id`);
CREATE INDEX IF NOT EXISTS `idx_passage_positions_time` ON `passage_positions` (`time`);

CREATE TABLE IF NOT EXISTS `passage_locations` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `passage_id` text NOT NULL REFERENCES `passages`(`id`) ON DELETE CASCADE,
  `lat` real NOT NULL,
  `lon` real NOT NULL,
  `time` text,
  `name` text,
  `locality` text,
  `administrative_area` text,
  `country` text,
  `country_code` text,
  `formatted_address` text,
  `points_of_interest` text
);

CREATE INDEX IF NOT EXISTS `idx_passage_locations_passage_id` ON `passage_locations` (`passage_id`);
