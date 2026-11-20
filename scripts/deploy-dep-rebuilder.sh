#!/usr/bin/env bash
# Deploy the dependency rebuilder (external/dep_rebuilder) to the build server as a systemd service.
#
# Same host, user and conventions as scripts/deploy-source-analysis.sh: the
# existing build-server user (rootless podman, subuids and linger are already
# set up for the Automated Build Server), its own tree /opt/dep-rebuilder. The
# rebuilder reuses source_analysis's comparison code, so both folders are
# copied, to /opt/dep-rebuilder/external/. Its database, logs and scratch are in
# /var/lib/walletscrutiny-dep-rebuilder (StateDirectory), separate from every
# other service's.
#
# Installed: walletscrutiny-dep-rebuilder.service (node index.mjs serve,
# Restart=always), enabled on each deploy so it comes back after a reboot.
#
# SSH config for that host uses User root. The tests run first and a failure
# aborts the deploy.
#
# Usage:
#   npm run deploy:dep-rebuilder
#
# Environment:
#   BUILD_SERVER_HOST   default: build.walletscrutiny.com
#   RESTART=0           install without restarting a running service (default: restart, which waits for the build in progress)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${BUILD_SERVER_HOST:-build.walletscrutiny.com}"
TARGET_DIR="/opt/dep-rebuilder"
SERVICE_NAME="walletscrutiny-dep-rebuilder.service"
SERVICE_USER="build-server"
EXCLUDES=(node_modules/ data/ .local/ .DS_Store "*.log" backup/ temp_repos/ cache/ "*.db" "*.db-*")

cd "$ROOT"
echo "Running dep_rebuilder tests (a failure aborts the deploy)..."
DEP_REBUILDER_ALLOW_ROOT=1 npm test --prefix external/dep_rebuilder
git rev-parse HEAD > external/dep_rebuilder/REVISION

RSYNC_EXCLUDES=()
for pattern in "${EXCLUDES[@]}"; do RSYNC_EXCLUDES+=(--exclude "$pattern"); done

ssh -o BatchMode=yes "$HOST" "mkdir -p '${TARGET_DIR}/external'"
for dir in dep_rebuilder source_analysis; do
  echo "Syncing external/${dir} to ${HOST}:${TARGET_DIR}/external/${dir}"
  rsync -az --delete --info=stats1 "${RSYNC_EXCLUDES[@]}" "external/${dir}/" "${HOST}:${TARGET_DIR}/external/${dir}/"
done

ssh -o BatchMode=yes "$HOST" bash -s -- "$TARGET_DIR" "$SERVICE_USER" "$SERVICE_NAME" "${RESTART:-1}" <<'REMOTE'
set -euo pipefail
TARGET_DIR="$1"; SERVICE_USER="$2"; SERVICE_NAME="$3"; RESTART="$4"
APP="${TARGET_DIR}/external/dep_rebuilder"

command -v podman >/dev/null || { echo "podman is not installed (README: apt install podman)" >&2; exit 1; }
id "$SERVICE_USER" >/dev/null 2>&1 || { echo "User ${SERVICE_USER} is missing (build_server README, server preparation)" >&2; exit 1; }
loginctl enable-linger "$SERVICE_USER"

chown -R root:root "$TARGET_DIR"
# node_modules and the REVISION file are written by the service user
chown -R "${SERVICE_USER}:${SERVICE_USER}" "$APP"
echo "Installing npm dependencies..."
rm -rf "${APP}/node_modules"
runuser -u "$SERVICE_USER" -- npm ci --prefix "$APP"

cp "${APP}/config/${SERVICE_NAME}" /etc/systemd/system/
export SYSTEMD_BUS_TIMEOUT=900
systemctl daemon-reload || echo "Warning: systemctl daemon-reload failed; enabling anyway" >&2
systemctl enable "$SERVICE_NAME"

echo "Verifying imports..."
(cd "$APP" && runuser -u "$SERVICE_USER" -- node --input-type=module -e 'await import("./db.mjs"); await import("./rebuild.mjs"); console.log("import check passed");')

if [ "$RESTART" = "1" ] || ! systemctl is-active --quiet "$SERVICE_NAME"; then
  systemctl restart "$SERVICE_NAME"
fi
sleep 3
systemctl --no-pager --full status "$SERVICE_NAME" | head -12 || true
echo "Follow it: journalctl -u ${SERVICE_NAME} -f      Progress: sudo -u ${SERVICE_USER} env DEP_REBUILDER_DATA=/var/lib/walletscrutiny-dep-rebuilder/data node ${APP}/index.mjs status"
REMOTE
echo "Done. Target: ${HOST}:${TARGET_DIR}"
