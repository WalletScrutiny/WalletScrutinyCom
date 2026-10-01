#!/usr/bin/env bash
# Deploy the source analysis (external/source_analysis) to build.walletscrutiny.com.
#
# The analysis is self-contained (it imports nothing from the rest of the
# repository and gets the wallet list from the site over HTTPS), so only that
# folder is deployed, to its own tree /opt/source_analysis, independent of the
# Automated Build Server tree in /opt/build-server. Same host, user, credential
# and conventions as scripts/deploy-build-server.sh otherwise.
#
# SSH config for that host uses User root. The units installed here:
#   walletscrutiny-source-analysis.service (oneshot, node index.mjs in /opt/source_analysis)
#   walletscrutiny-source-analysis.timer   (every 6 hours)
# The timer is enabled on each deploy (not only started) so it comes back after reboot.
#
# The tests run first and a failure aborts the deploy; there is no way to skip them.
#
# Usage:
#   npm run deploy:source-analysis
#
# Environment:
#   BUILD_SERVER_HOST   default: build.walletscrutiny.com
#   RUN_NOW=1           start a run right after the deploy (default: wait for the timer)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${BUILD_SERVER_HOST:-build.walletscrutiny.com}"
SOURCE_DIR="${ROOT}/external/source_analysis"
TARGET_DIR="/opt/source_analysis"
SERVICE_NAME="walletscrutiny-source-analysis.service"
TIMER_NAME="walletscrutiny-source-analysis.timer"
SERVICE_USER="build-server"

# Dev-run state and anything not needed to run the service
EXCLUDES=(
  "node_modules/"
  "assets.db"
  "backup/"
  "temp_repos/"
  "cache/"
  ".local/"
  ".DS_Store"
  "*.log"
)

log() {
  printf '%s\n' "$*"
}

cd "$ROOT"

log "Running source analysis tests (a failure aborts the deploy)..."
npm test --prefix "$SOURCE_DIR"

log "Syncing ${SOURCE_DIR} to ${HOST}:${TARGET_DIR}"
ssh -o BatchMode=yes "${HOST}" "mkdir -p '${TARGET_DIR}'"

RSYNC_EXCLUDES=()
for pattern in "${EXCLUDES[@]}"; do
  RSYNC_EXCLUDES+=(--exclude "$pattern")
done

rsync -az --delete --chown="${SERVICE_USER}:${SERVICE_USER}" --info=stats1 \
  "${RSYNC_EXCLUDES[@]}" \
  "${SOURCE_DIR}/" \
  "${HOST}:${TARGET_DIR}/"

log "Installing dependencies and verifying on ${HOST}"
ssh -o BatchMode=yes "${HOST}" bash -s -- \
  "$TARGET_DIR" "$SERVICE_USER" "$SERVICE_NAME" "$TIMER_NAME" "${RUN_NOW:-0}" <<'REMOTE'
set -euo pipefail
TARGET_DIR="$1"
SERVICE_USER="$2"
SERVICE_NAME="$3"
TIMER_NAME="$4"
RUN_NOW="$5"
UNIT_DIR="${TARGET_DIR}/config"

if [ ! -f /etc/credstore.encrypted/build-server-gh-token ]; then
  echo "Missing /etc/credstore.encrypted/build-server-gh-token (the unit loads the GitHub token from it)" >&2
  exit 1
fi

chown -R "${SERVICE_USER}:${SERVICE_USER}" "${TARGET_DIR}"

echo "Installing npm dependencies (${TARGET_DIR})..."
rm -rf "${TARGET_DIR}/node_modules"
runuser -u "${SERVICE_USER}" -- npm ci --prefix "${TARGET_DIR}"

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
test -f "${TARGET_DIR}/index.mjs"
test -f "${TARGET_DIR}/containerEntry.mjs"
test -d "${TARGET_DIR}/node_modules"
cd "${TARGET_DIR}"
runuser -u "${SERVICE_USER}" -- node --input-type=module -e 'await import("./config.mjs"); await import("./appAnalysis.mjs"); await import("better-sqlite3"); console.log("import check passed");'

# The analysis container image (pinned by digest in config.mjs): pull it as the
# service user now so the first pass does not, and drop superseded copies of it
# (an image bump would otherwise leave the previous 4 GB behind). Other images
# on the host (Automated Build Server, Semgrep) are not touched.
IMAGE="$(runuser -u "${SERVICE_USER}" -- node --input-type=module -e 'const c = await import("./config.mjs"); console.log(c.ANALYSIS_IMAGE);')"
echo "Pulling analysis image ${IMAGE}..."
runuser -u "${SERVICE_USER}" -- docker pull --quiet "${IMAGE}"
KEEP_ID="$(runuser -u "${SERVICE_USER}" -- docker image inspect --format '{{.Id}}' "${IMAGE}")"
IMAGE_REPO="${IMAGE%%@*}"; IMAGE_REPO="${IMAGE_REPO%%:*}"
for id in $(runuser -u "${SERVICE_USER}" -- docker images --filter "reference=${IMAGE_REPO}" --format '{{.ID}}' | sort -u); do
  if ! runuser -u "${SERVICE_USER}" -- docker image inspect --format '{{.Id}}' "$id" | grep -qx "${KEEP_ID}"; then
    echo "Removing superseded analysis image ${id}"
    runuser -u "${SERVICE_USER}" -- docker rmi -f "$id" || true
  fi
done

if [ "${RUN_NOW}" = "1" ]; then
  echo "Starting ${SERVICE_NAME} now (runs in the background, follow it with journalctl -u ${SERVICE_NAME} -f)..."
  systemctl start --no-block "${SERVICE_NAME}"
fi

systemctl --no-pager list-timers "${TIMER_NAME}"
systemctl --no-pager --full status "${SERVICE_NAME}" | head -12 || true

echo "Deployed tree size:"
du -sh "${TARGET_DIR}" "${TARGET_DIR}/node_modules"
echo "Analysis image:"
runuser -u "${SERVICE_USER}" -- docker images --filter "reference=${IMAGE_REPO}" --format '{{.Repository}}:{{.Tag}} {{.Size}}'
REMOTE

log "Done. Target: ${TARGET_DIR}"
