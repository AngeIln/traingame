#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/srv/traingame"
cd "$APP_DIR"

PREVIOUS_SHA="$(docker compose ps --format json | jq -r '.[] | select(.Service=="server") | .Image' | head -n1 || true)"

echo "Pulling newest images..."
docker compose --profile prod pull

echo "Starting updated stack..."
docker compose --profile prod up -d

echo "Checking readiness..."
for i in {1..30}; do
  if curl -fsS https://localhost/ready --insecure >/dev/null; then
    echo "Ready endpoint OK"
    exit 0
  fi
  sleep 2
done

echo "Healthcheck failed, rolling back"
if [ -n "$PREVIOUS_SHA" ]; then
  docker image tag "$PREVIOUS_SHA" traingame-server:rollback || true
  docker compose --profile prod up -d --no-deps server
fi

exit 1
