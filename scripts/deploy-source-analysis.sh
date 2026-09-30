#!/usr/bin/env bash
# Deploy the WalletScrutiny tree to build.walletscrutiny.com for the source
# analysis service. Same target tree, user and rsync rules as
# scripts/deploy-build-server.sh; only the npm install and the systemd units
# differ. The two scripts can be run independently.
#
# SSH config for that host uses User root. The units installed here:
#   walletscrutiny-source-analysis.service (oneshot, node index.mjs in
#     /opt/build-server/walletScrutinyCom/external/source_analysis)
#   walletscrutiny-source-analysis.timer   (every 6 hours)
# The timer is enabled on each deploy (not only started) so it comes back after reboot.
#
# Usage:
#   scripts/deploy-source-analysis.sh
#
# Environment:
#   BUILD_SERVER_HOST   default: build.walletscrutiny.com
#   SKIP_TESTS=1        skip local source_analysis tests
#   RUN_NOW=1           start a run right after the deploy (default: wait for the timer)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${BUILD_SERVER_HOST:-build.walletscrutiny.com}"
TARGET_DIR="/opt/build-server/walletScrutinyCom"
APP_DIR="external/source_analysis"
SERVICE_NAME="walletscrutiny-source-analysis.service"
TIMER_NAME="walletscrutiny-source-analysis.timer"
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
  "external/source_analysis/assets.db"
  "external/source_analysis/temp_repos/"
  "*.log"
)

log() {
  printf '%s\n' "$*"
}

cd "$ROOT"

if [ "${SKIP_TESTS:-}" != "1" ]; then
  log "Running source analysis tests..."
  npm test --prefix "$APP_DIR"
fi

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
  "$TARGET_DIR" "$APP_DIR" "$SERVICE_USER" "$SERVICE_NAME" "$TIMER_NAME" "${RUN_NOW:-0}" <<'REMOTE'
set -euo pipefail
TARGET_DIR="$1"
APP_DIR="$2"
SERVICE_USER="$3"
SERVICE_NAME="$4"
TIMER_NAME="$5"
RUN_NOW="$6"
APP_PATH="${TARGET_DIR}/${APP_DIR}"
UNIT_DIR="${APP_PATH}/config"

if [ ! -f /etc/credstore.encrypted/build-server-gh-token ]; then
  echo "Missing /etc/credstore.encrypted/build-server-gh-token (the unit loads the GitHub token from it)" >&2
  exit 1
fi

chown -R "${SERVICE_USER}:${SERVICE_USER}" "${TARGET_DIR}"

echo "Installing npm dependencies (${APP_DIR})..."
rm -rf "${APP_PATH}/node_modules"
runuser -u "${SERVICE_USER}" -- npm ci --prefix "${APP_PATH}"

echo "Refreshing systemd units from ${UNIT_DIR}..."
cp "${UNIT_DIR}/${SERVICE_NAME}" /etc/systemd/system/
cp "${UNIT_DIR}/${TIMER_NAME}" /etc/systemd/system/
# See scripts/deploy-build-server.sh: daemon-reload can take minutes on this host.
export SYSTEMD_BUS_TIMEOUT=900
if ! systemctl daemon-reload; then
  echo "Warning: systemctl daemon-reload failed; enabling the timer anyway" >&2
fi
echo "Enabling ${TIMER_NAME}..."
systemctl enable --now "${TIMER_NAME}"

echo "Verifying layout and imports..."
test -f "${APP_PATH}/index.mjs"
test -d "${APP_PATH}/node_modules"
cd "${APP_PATH}"
runuser -u "${SERVICE_USER}" -- node --input-type=module -e 'await import("./config.mjs"); await import("./appAnalysis.mjs"); await import("better-sqlite3"); console.log("import check passed");'

if [ "${RUN_NOW}" = "1" ]; then
  echo "Starting ${SERVICE_NAME} now (runs in the background, follow it with journalctl -u ${SERVICE_NAME} -f)..."
  systemctl start --no-block "${SERVICE_NAME}"
fi

systemctl --no-pager list-timers "${TIMER_NAME}"
systemctl --no-pager --full status "${SERVICE_NAME}" | head -12 || true

echo "Deployed tree size:"
du -sh "${APP_PATH}" "${APP_PATH}/node_modules"
REMOTE

log "Done. Target: ${TARGET_DIR}/${APP_DIR}"
