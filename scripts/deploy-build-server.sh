#!/usr/bin/env bash
# Deploy the WalletScrutiny tree to build.walletscrutiny.com for the ABS.
#
# SSH config for that host uses User root. The systemd unit runs:
#   ExecStart=/usr/bin/node index.mjs
#   WorkingDirectory=/opt/build-server/walletScrutinyCom/external/build_server
# ABS imports src/ and scripts/ from the repo root, so each deploy copies the
# full project (not only external/build_server).
#
# Usage:
#   scripts/deploy-build-server.sh
#
# Environment:
#   BUILD_SERVER_HOST   default: build.walletscrutiny.com
#   SKIP_TESTS=1        skip local ABS tests

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${BUILD_SERVER_HOST:-build.walletscrutiny.com}"
TARGET_DIR="/opt/build-server/walletScrutinyCom"
SERVICE_NAME="walletscrutiny-build-server.service"
SERVICE_USER="build-server"

EXCLUDES=(
  ".git/"
  "node_modules/"
  "_site/"
  "dist/"
  "images/"
  "playwright-report/"
  "test-results/"
  ".jekyll-cache/"
  ".idea/"
  ".vscode/"
  ".cursor/"
  ".claude/"
  "vendor/"
  "backup/"
  "scripts/cache/"
  "external/build_server/logs/"
  "external/build_server/build_server_build_dir/"
  "external/build_server/.env"
  "*.log"
)

log() {
  printf '%s\n' "$*"
}

cd "$ROOT"

if [ "${SKIP_TESTS:-}" != "1" ]; then
  log "Running ABS tests..."
  npm test --prefix external/build_server
fi

log "Stopping ${SERVICE_NAME}..."
ssh -o BatchMode=yes "${HOST}" "systemctl stop '${SERVICE_NAME}' || true"

log "Syncing sources to ${HOST}:${TARGET_DIR}"
ssh -o BatchMode=yes "${HOST}" "mkdir -p '${TARGET_DIR}'"

RSYNC_EXCLUDES=()
for pattern in "${EXCLUDES[@]}"; do
  RSYNC_EXCLUDES+=(--exclude "$pattern")
done

rsync -az --delete --chown="${SERVICE_USER}:${SERVICE_USER}" --info=stats1 \
  "${RSYNC_EXCLUDES[@]}" \
  "$ROOT/" \
  "${HOST}:${TARGET_DIR}/"

log "Installing dependencies and verifying on ${HOST}"
ssh -o BatchMode=yes "${HOST}" bash -s -- \
  "$TARGET_DIR" "$SERVICE_USER" "$SERVICE_NAME" <<'REMOTE'
set -euo pipefail
TARGET_DIR="$1"
SERVICE_USER="$2"
SERVICE_NAME="$3"
UNIT_DIR="${TARGET_DIR}/external/build_server/config"

rm -rf "${TARGET_DIR}/node_modules" "${TARGET_DIR}/external/build_server/node_modules"
chown -R "${SERVICE_USER}:${SERVICE_USER}" "${TARGET_DIR}"

echo "Installing npm dependencies (repo root, used by src/ and scripts/)..."
runuser -u "${SERVICE_USER}" -- npm ci --prefix "${TARGET_DIR}"

echo "Installing npm dependencies (external/build_server)..."
runuser -u "${SERVICE_USER}" -- npm ci --prefix "${TARGET_DIR}/external/build_server"

echo "Refreshing systemd units from ${UNIT_DIR}..."
cp "${UNIT_DIR}/walletscrutiny-build-server.service" /etc/systemd/system/
cp "${UNIT_DIR}/walletscrutiny-build-server-builds-cleanup.service" /etc/systemd/system/
cp "${UNIT_DIR}/walletscrutiny-build-server-builds-cleanup.timer" /etc/systemd/system/
cp "${UNIT_DIR}/walletscrutiny-build-server-nix-gc.service" /etc/systemd/system/
cp "${UNIT_DIR}/walletscrutiny-build-server-nix-gc.timer" /etc/systemd/system/
systemctl daemon-reload
echo "Starting ${SERVICE_NAME}..."
systemctl start "${SERVICE_NAME}"
systemctl --no-pager --full status "${SERVICE_NAME}" | head -20

echo "Verifying layout and imports..."
test -f "${TARGET_DIR}/external/build_server/index.mjs"
test -f "${TARGET_DIR}/src/nostr-client.mjs"
test -f "${TARGET_DIR}/src/verifications_common.mjs"
test -f "${TARGET_DIR}/scripts/refreshDesktop.mjs"
test -f "${TARGET_DIR}/scripts/refreshHardware.mjs"
test -d "${TARGET_DIR}/node_modules"
test -d "${TARGET_DIR}/external/build_server/node_modules"

cd "${TARGET_DIR}/external/build_server"
runuser -u "${SERVICE_USER}" -- node --input-type=module -e 'await import("./config/config.mjs"); await import("../../src/nostr-client.mjs"); await import("../../src/verifications_common.mjs"); await import("better-sqlite3"); console.log("import check passed");'

echo "Deployed tree size:"
du -sh "${TARGET_DIR}" \
  "${TARGET_DIR}/node_modules" \
  "${TARGET_DIR}/external/build_server/node_modules"
REMOTE

log "Done. Target: ${TARGET_DIR}"
