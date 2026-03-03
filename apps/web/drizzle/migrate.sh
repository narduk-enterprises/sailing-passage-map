#!/usr/bin/env bash
# Runs all D1 migrations in order.
# Usage: ./drizzle/migrate.sh [--local|--remote]
# Called by package.json db:migrate and by CI deploy pipeline.

set -euo pipefail

MODE="${1:---local}"
DB_NAME="sailing-passage-map-db"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Running D1 migrations ($MODE)..."

wrangler d1 execute "$DB_NAME" "$MODE" --file="$DIR/0000_initial_schema.sql"
wrangler d1 execute "$DB_NAME" "$MODE" --file="$DIR/0001_passages.sql"

echo "✅ All migrations applied."
