#!/usr/bin/env bash
set -euo pipefail

# Removes immediate child directories of /opt/build-server-builds whose last
# modification time is strictly older than RETENTION_DAYS (GNU find -mtime +N).
# Deletion goes through sudo + build-server-safe-rmdir.sh because build artifacts
# are often owned by container UIDs, not by build-server.
#
# Also prunes stopped containers and unused images older than RETENTION_DAYS
# for rootless Podman ($HOME/.local/share/containers/storage) and for Docker
# (/var/lib/docker). The systemd unit runs as build-server, which is in the
# docker group. Running containers and the images they use are left in place.

BASE_DIR="/opt/build-server-builds"
RETENTION_DAYS=7

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAFE_RMDIR_SCRIPT="${SCRIPT_DIR}/build-server-safe-rmdir.sh"

failed=0

if [[ -d "$BASE_DIR" ]]; then
  if [[ ! -f "$SAFE_RMDIR_SCRIPT" || ! -x "$SAFE_RMDIR_SCRIPT" ]]; then
    echo "Error: safe rmdir script missing or not executable: ${SAFE_RMDIR_SCRIPT}" >&2
    failed=1
  else
    while IFS= read -r -d '' dir; do
      if ! sudo -n "$SAFE_RMDIR_SCRIPT" "$dir"; then
        echo "Error: failed to remove ${dir}" >&2
        failed=1
      fi
    done < <(find "$BASE_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"${RETENTION_DAYS}" -print0)
  fi
fi

# Go durations have no day unit.
PRUNE_UNTIL="$((RETENTION_DAYS * 24))h"

prune_containers_and_images() {
  local engine="$1"

  if ! command -v "$engine" >/dev/null 2>&1; then
    echo "${engine} not installed; skipping container and image prune" >&2
    return 0
  fi

  # Stopped containers first, so images they were holding become unused.
  if ! "$engine" container prune --force --filter "until=${PRUNE_UNTIL}"; then
    echo "Error: ${engine} container prune failed" >&2
    failed=1
  fi

  if ! "$engine" image prune --all --force --filter "until=${PRUNE_UNTIL}"; then
    echo "Error: ${engine} image prune failed" >&2
    failed=1
  fi
}

runtime_dir="/run/user/$(id -u)"
if [[ -n "${XDG_RUNTIME_DIR:-}" && ! -O "${XDG_RUNTIME_DIR}" ]]; then
  unset XDG_RUNTIME_DIR
fi
if [[ -z "${XDG_RUNTIME_DIR:-}" && -d "$runtime_dir" ]]; then
  export XDG_RUNTIME_DIR="$runtime_dir"
fi

prune_containers_and_images podman
prune_containers_and_images docker

exit "${failed}"
