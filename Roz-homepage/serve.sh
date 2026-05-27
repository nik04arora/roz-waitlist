#!/usr/bin/env bash
# Preview Roz homepage locally (avoids file:// script issues).
cd "$(dirname "$0")"
PORT="${1:-8766}"
echo "Open: http://127.0.0.1:${PORT}/index.html"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
