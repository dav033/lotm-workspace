#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$REPO_DIR/lotm"
COMPOSE_FILE="$APP_DIR/docker-compose.production.yml"
LOG="$REPO_DIR/deploy.log"
LOCK="/tmp/lotm-deploy.lock"

exec 9>"$LOCK"
flock -n 9 || exit 0

log() { printf '%s %s\n' "$(date -Iseconds)" "$*" >> "$LOG"; }

cd "$REPO_DIR"
git fetch origin main >> "$LOG" 2>&1
LOCAL="$(git rev-parse main)"
REMOTE="$(git rev-parse origin/main)"

log "Deploy start: $LOCAL -> $REMOTE"
docker builder prune -af >> "$LOG" 2>&1 || true
docker image prune -af >> "$LOG" 2>&1 || true

git pull --ff-only origin main >> "$LOG" 2>&1

cd "$APP_DIR"
timeout 720 docker compose -p lotm -f "$COMPOSE_FILE" build lotm >> "$LOG" 2>&1
docker builder prune -af >> "$LOG" 2>&1 || true
timeout 180 docker compose -p lotm -f "$COMPOSE_FILE" up -d --no-build --force-recreate lotm >> "$LOG" 2>&1
docker image prune -af >> "$LOG" 2>&1 || true
timeout 60 docker compose -p lotm -f "$COMPOSE_FILE" stop card-studio cards-mcp >> "$LOG" 2>&1 || true
timeout 60 docker compose -p lotm -f "$COMPOSE_FILE" rm -f card-studio cards-mcp >> "$LOG" 2>&1 || true
docker image rm lotm-card-studio:latest >> "$LOG" 2>&1 || true
docker builder prune -af >> "$LOG" 2>&1 || true
timeout 720 docker compose -p lotm -f "$COMPOSE_FILE" build card-studio >> "$LOG" 2>&1
docker builder prune -af >> "$LOG" 2>&1 || true
timeout 180 docker compose -p lotm -f "$COMPOSE_FILE" up -d --force-recreate >> "$LOG" 2>&1

docker builder prune -af >> "$LOG" 2>&1 || true
docker image prune -af >> "$LOG" 2>&1 || true
log "Deploy finished: $(git -C "$REPO_DIR" rev-parse main)"
