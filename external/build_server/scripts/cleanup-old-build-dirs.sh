#!/usr/bin/env bash
set -euo pipefail

# Removes immediate child directories of /opt/build-server-builds whose last
# modification time is strictly older than RETENTION_DAYS (GNU find -mtime +N).
# Deletion goes through sudo + build-server-safe-rmdir.sh because build artifacts
# are often owned by container UIDs, not by build-server.

BASE_DIR="/opt/build-server-builds"
RETENTION_DAYS=7

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAFE_RMDIR_SCRIPT="${SCRIPT_DIR}/build-server-safe-rmdir.sh"

if [[ ! -d "$BASE_DIR" ]]; then
  exit 0
fi

if [[ ! -f "$SAFE_RMDIR_SCRIPT" || ! -x "$SAFE_RMDIR_SCRIPT" ]]; then
  echo "Error: safe rmdir script missing or not executable: ${SAFE_RMDIR_SCRIPT}" >&2
  exit 4
fi

failed=0
while IFS= read -r -d '' dir; do
  if ! sudo -n "$SAFE_RMDIR_SCRIPT" "$dir"; then
    echo "Error: failed to remove ${dir}" >&2
    failed=1
  fi
done < <(find "$BASE_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"${RETENTION_DAYS}" -print0)

exit "${failed}"
