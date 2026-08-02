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

if [[ "$LOCAL" == "$REMOTE" ]]; then
  exit 0
fi

log "Deploy start: $LOCAL -> $REMOTE"
docker builder prune -af >> "$LOG" 2>&1 || true

git pull --ff-only origin main >> "$LOG" 2>&1

cd "$APP_DIR"
timeout 720 docker compose -p lotm -f "$COMPOSE_FILE" build lotm card-studio >> "$LOG" 2>&1
timeout 180 docker compose -p lotm -f "$COMPOSE_FILE" up -d --force-recreate >> "$LOG" 2>&1

docker builder prune -af >> "$LOG" 2>&1 || true
log "Deploy finished: $(git -C "$REPO_DIR" rev-parse main)"
