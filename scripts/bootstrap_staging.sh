#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="${COMPOSE_CMD:-docker compose}"
COMPOSE_FILE="${PROJECT_ROOT}/ghana_decides/docker-compose.yml"

cd "${PROJECT_ROOT}/ghana_decides"

echo "[SELS] Starting core services (db, redis)…"
${COMPOSE} -f "${COMPOSE_FILE}" up -d db redis

echo "[SELS] Applying migrations…"
${COMPOSE} -f "${COMPOSE_FILE}" run --rm ghana_decides_app python manage.py migrate

echo "[SELS] Loading staging seed data…"
${COMPOSE} -f "${COMPOSE_FILE}" run --rm ghana_decides_app python manage.py seed_staging_data

echo "[SELS] Launching application, worker, beat, and frontend…"
${COMPOSE} -f "${COMPOSE_FILE}" up -d ghana_decides_app celery celery-beat ghana_decides_frontend

echo "[SELS] Staging environment is ready. Access Django on http://localhost:5050 and frontend on http://localhost:3000."
