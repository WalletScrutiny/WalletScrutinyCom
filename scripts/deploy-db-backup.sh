#!/usr/bin/env bash
# Deploy the database backup (external/db_backup) to build.walletscrutiny.com, or
# with DB_BACKUP_PROFILE=dep-rebuilder to the machine that runs the dependency
# rebuilder (npm run deploy:db-backup:dep-rebuilder; its database is not on the
# build server). The second one is the same script and timer with a systemd
# drop-in (config/dep-rebuilder.conf) for the user and the database.
#
# Only that folder is deployed, to /opt/db-backup, root-owned (the service runs as
# build-server and must not be able to change its own script). Same host and SSH
# conventions as scripts/deploy-source-analysis.sh (SSH config for that host uses
# User root). The units installed here:
#   walletscrutiny-db-backup.service (oneshot, /opt/db-backup/backup.sh)
#   walletscrutiny-db-backup.timer   (nightly)
# The timer is enabled on each deploy (not only started) so it comes back after reboot.
#
# Not touched by the deploy: /etc/walletscrutiny-db-backup/env (the remote copy
# target; created once by hand, see external/db_backup/README.md, "Setting up")
# and the snapshots in /var/lib/walletscrutiny-db-backup.
#
# Usage:
#   npm run deploy:db-backup
#   DEP_REBUILDER_HOST=<ssh host> npm run deploy:db-backup:dep-rebuilder
#
# Environment:
#   BUILD_SERVER_HOST   default: build.walletscrutiny.com
#   DEP_REBUILDER_HOST  required with DB_BACKUP_PROFILE=dep-rebuilder (same value as deploy:dep-rebuilder)
#   RUN_NOW=1           take snapshots right after the deploy (default: wait for the timer)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE="${DB_BACKUP_PROFILE:-build-server}"
case "$PROFILE" in
  build-server) HOST="${BUILD_SERVER_HOST:-build.walletscrutiny.com}" ;;
  dep-rebuilder)
    HOST="${DEP_REBUILDER_HOST:-}"
    if [ -z "$HOST" ]; then
      echo "Set DEP_REBUILDER_HOST to the machine that runs the rebuilder (as for deploy:dep-rebuilder)." >&2
      exit 1
    fi ;;
  *) echo "Unknown DB_BACKUP_PROFILE '${PROFILE}' (build-server or dep-rebuilder)" >&2; exit 1 ;;
esac
SOURCE_DIR="${ROOT}/external/db_backup"
TARGET_DIR="/opt/db-backup"
SERVICE_NAME="walletscrutiny-db-backup.service"
TIMER_NAME="walletscrutiny-db-backup.timer"

log() {
  printf '%s\n' "$*"
}

cd "$ROOT"

log "Checking backup.sh..."
bash -n "${SOURCE_DIR}/backup.sh"
bash -n "${SOURCE_DIR}/pull.sh"

log "Syncing ${SOURCE_DIR} to ${HOST}:${TARGET_DIR}"
ssh -o BatchMode=yes "${HOST}" "mkdir -p '${TARGET_DIR}'"
rsync -az --delete --chown=root:root --info=stats1 \
  --exclude ".DS_Store" --exclude ".local/" \
  "${SOURCE_DIR}/" \
  "${HOST}:${TARGET_DIR}/"

log "Installing the units and verifying on ${HOST}"
ssh -o BatchMode=yes "${HOST}" bash -s -- \
  "$TARGET_DIR" "$SERVICE_NAME" "$TIMER_NAME" "${RUN_NOW:-0}" "$PROFILE" <<'REMOTE'
set -euo pipefail
TARGET_DIR="$1"
SERVICE_NAME="$2"
TIMER_NAME="$3"
RUN_NOW="$4"
PROFILE="$5"
UNIT_DIR="${TARGET_DIR}/config"

for tool in sqlite3 zstd rsync; do
  if ! command -v "$tool" >/dev/null; then
    echo "Missing $tool on this host: apt install sqlite3 zstd rsync" >&2
    exit 1
  fi
done

chmod 755 "${TARGET_DIR}/backup.sh" "${TARGET_DIR}/pull.sh"
mkdir -p /etc/walletscrutiny-db-backup
if [ ! -f /etc/walletscrutiny-db-backup/env ]; then
  echo "Warning: /etc/walletscrutiny-db-backup/env does not exist, so snapshots stay on this host" >&2
  echo "         until WS_BACKUP_PUSH_TARGET is set there (README, \"Setting up\", step 2)." >&2
elif ! grep -q '^WS_BACKUP_PUSH_TARGET=' /etc/walletscrutiny-db-backup/env; then
  echo "Warning: WS_BACKUP_PUSH_TARGET is not set in /etc/walletscrutiny-db-backup/env, so snapshots stay on this host." >&2
fi

echo "Refreshing systemd units from ${UNIT_DIR}..."
cp "${UNIT_DIR}/${SERVICE_NAME}" /etc/systemd/system/
cp "${UNIT_DIR}/${TIMER_NAME}" /etc/systemd/system/
DROPIN_DIR="/etc/systemd/system/${SERVICE_NAME}.d"
if [ "$PROFILE" = "dep-rebuilder" ]; then
  if ! id dep-rebuilder >/dev/null 2>&1; then
    echo "No user dep-rebuilder on this host: run deploy:dep-rebuilder first" >&2
    exit 1
  fi
  mkdir -p "$DROPIN_DIR"
  cp "${UNIT_DIR}/dep-rebuilder.conf" "${DROPIN_DIR}/dep-rebuilder.conf"
else
  rm -f "${DROPIN_DIR}/dep-rebuilder.conf"
fi
# See scripts/deploy-build-server.sh: daemon-reload can take minutes on this host.
export SYSTEMD_BUS_TIMEOUT=900
if ! systemctl daemon-reload; then
  echo "Warning: systemctl daemon-reload failed; enabling the timer anyway" >&2
fi
echo "Enabling ${TIMER_NAME}..."
systemctl enable --now "${TIMER_NAME}"

if [ "${RUN_NOW}" = "1" ]; then
  echo "Running ${SERVICE_NAME} now..."
  systemctl start "${SERVICE_NAME}"
  journalctl --no-pager -u "${SERVICE_NAME}" -n 15
fi

systemctl --no-pager list-timers "${TIMER_NAME}"
REMOTE

log "Done. Target: ${TARGET_DIR}"
