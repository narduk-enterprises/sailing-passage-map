#!/usr/bin/env sh
# Wrapper so Ctrl+C in dev:showcase also kills the auth app (nitro-cloudflare-dev
# can leave a workerd process bound to 3011 that ignores SIGINT).
set -e
trap 'lsof -ti :3011 | xargs kill 2>/dev/null || true; exit 130' INT TERM
pnpm --filter example-auth dev
