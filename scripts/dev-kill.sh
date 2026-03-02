#!/usr/bin/env sh
# Kill dev servers for this monorepo (web + showcase apps on ports 3000, 3010-3015)
set -e
for port in 3000 3010 3011 3012 3013 3014 3015; do
  pid=$(lsof -ti :"$port" 2>/dev/null) || true
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null && echo "Killed process on port $port (PID $pid)" || true
  fi
done
echo "Done."
