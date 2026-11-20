#!/usr/bin/env bash
# Deploy the database backup (external/db_backup) to build.walletscrutiny.com.
#
# Only that folder is deployed, to /opt/db-backup, root-owned (the service runs as
# build-server and must not be able to change its own script). Same host and SSH
# conventions as scripts/deploy-source-analysis.sh (SSH config for that host uses
# User root). The units installed here:
#   walletscrutiny-db-backup.service (oneshot, /opt/db-backup/backup.sh)
#   walletscrutiny-db-backup.timer   (nightly)
# and, when the group dep-rebuilder exists, a drop-in that lets the service read the
# dependency rebuilder's database (that service writes it as dep-rebuilder, mode 660).
# The timer is enabled on each deploy (not only started) so it comes back after reboot.
#
# Not touched by the deploy: /etc/walletscrutiny-db-backup/env (the remote copy
# target; created once by hand, see external/db_backup/README.md, "Setting up")
# and the snapshots in /var/lib/walletscrutiny-db-backup.
#
# Usage:
#   npm run deploy:db-backup
#
# Environment:
#   BUILD_SERVER_HOST   default: build.walletscrutiny.com
#   RUN_NOW=1           take snapshots right after the deploy (default: wait for the timer)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${BUILD_SERVER_HOST:-build.walletscrutiny.com}"
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
  "$TARGET_DIR" "$SERVICE_NAME" "$TIMER_NAME" "${RUN_NOW:-0}" <<'REMOTE'
set -euo pipefail
TARGET_DIR="$1"
SERVICE_NAME="$2"
TIMER_NAME="$3"
RUN_NOW="$4"
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
# The dependency rebuilder's database is group dep-rebuilder (its db.mjs sets 660 / 770).
DROPIN_DIR="/etc/systemd/system/${SERVICE_NAME}.d"
if getent group dep-rebuilder >/dev/null; then
  mkdir -p "$DROPIN_DIR"
  cp "${UNIT_DIR}/dep-rebuilder-group.conf" "${DROPIN_DIR}/dep-rebuilder-group.conf"
else
  rm -f "${DROPIN_DIR}/dep-rebuilder-group.conf"
  echo "No group dep-rebuilder yet: its database is skipped until deploy:dep-rebuilder has run; deploy this again after." >&2
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
