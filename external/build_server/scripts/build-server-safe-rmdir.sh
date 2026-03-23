#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="/opt/build-server-builds"

usage() {
  echo "Usage: $0 <absolute-path-inside-${BASE_DIR}>" >&2
  exit 2
}

if [[ "${1:-}" == "" ]]; then
  usage
fi

TARGET_INPUT="$1"

if [[ "$TARGET_INPUT" != /* ]]; then
  echo "Error: target path must be absolute: ${TARGET_INPUT}" >&2
  exit 2
fi

if [[ -L "$TARGET_INPUT" ]]; then
  echo "Error: refusing to delete symlink: ${TARGET_INPUT}" >&2
  exit 2
fi

if [[ ! -e "$TARGET_INPUT" ]]; then
  exit 0
fi

if [[ ! -d "$TARGET_INPUT" ]]; then
  echo "Error: refusing to delete non-directory path: ${TARGET_INPUT}" >&2
  exit 2
fi

BASE_REAL="$(realpath -m "$BASE_DIR")"
TARGET_REAL="$(realpath -m "$TARGET_INPUT")"

if [[ -z "$BASE_REAL" || -z "$TARGET_REAL" ]]; then
  echo "Error: could not resolve paths safely (base=${BASE_REAL:-} target=${TARGET_REAL:-})" >&2
  exit 3
fi

# Extra safety: never delete the base directory itself.
if [[ "$TARGET_REAL" == "$BASE_REAL" ]]; then
  echo "Error: refusing to delete base directory: ${TARGET_REAL}" >&2
  exit 3
fi

case "$TARGET_REAL" in
  "$BASE_REAL"/*)
    # ok
    ;;
  *)
    echo "Error: refusing to delete outside allowed base directory." >&2
    echo "Allowed base: ${BASE_REAL}" >&2
    echo "Target: ${TARGET_REAL}" >&2
    exit 3
    ;;
esac

/bin/rm -rf --one-file-system -- "$TARGET_REAL"

#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="/opt/build-server-builds"

usage() {
  echo "Usage: $0 <absolute-path-inside-${BASE_DIR}>" >&2
  exit 2
}

if [[ "${1:-}" == "" ]]; then
  usage
fi

TARGET_INPUT="$1"

if [[ "$TARGET_INPUT" != /* ]]; then
  echo "Error: target path must be absolute: ${TARGET_INPUT}" >&2
  exit 2
fi

if [[ -L "$TARGET_INPUT" ]]; then
  echo "Error: refusing to delete symlink: ${TARGET_INPUT}" >&2
  exit 2
fi

# If it does not exist, nothing to delete.
if [[ ! -e "$TARGET_INPUT" ]]; then
  exit 0
fi

if [[ ! -d "$TARGET_INPUT" ]]; then
  echo "Error: refusing to delete non-directory path: ${TARGET_INPUT}" >&2
  exit 2
fi

BASE_REAL="$(realpath -m "$BASE_DIR")"
TARGET_REAL="$(realpath -m "$TARGET_INPUT")"

if [[ -z "$BASE_REAL" || -z "$TARGET_REAL" ]]; then
  echo "Error: could not resolve paths safely (base=${BASE_REAL:-} target=${TARGET_REAL:-})" >&2
  exit 3
fi

# Extra safety: never delete the base directory itself.
if [[ "$TARGET_REAL" == "$BASE_REAL" ]]; then
  echo "Error: refusing to delete base directory: ${TARGET_REAL}" >&2
  exit 3
fi

case "$TARGET_REAL" in
  "$BASE_REAL"/*)
    # ok
    ;;
  *)
    echo "Error: refusing to delete outside allowed base directory." >&2
    echo "Allowed base: ${BASE_REAL}" >&2
    echo "Target: ${TARGET_REAL}" >&2
    exit 3
    ;;
esac

/bin/rm -rf --one-file-system -- "$TARGET_REAL"

