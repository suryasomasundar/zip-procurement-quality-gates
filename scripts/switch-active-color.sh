#!/usr/bin/env bash
set -eu

if [ "${1:-}" != "blue" ] && [ "${1:-}" != "green" ]; then
  echo "Usage: ./scripts/switch-active-color.sh <blue|green>"
  exit 1
fi

cat <<EOF > .env.blue-green
ACTIVE_COLOR=$1
EOF

docker compose -f docker-compose.blue-green.yml up -d edge

echo "Switched active color to $1"
