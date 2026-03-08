#!/usr/bin/env sh
set -eu

echo "[entrypoint] Waiting for database..."
if [ -n "${DATABASE_WAIT_HOST:-}" ]; then
  until nc -z "${DATABASE_WAIT_HOST}" "${DATABASE_WAIT_PORT:-5432}"; do
    sleep 1
  done
fi

echo "[entrypoint] Running DB migrations..."
npm run db:migrate

echo "[entrypoint] Starting API server..."
exec "$@"
