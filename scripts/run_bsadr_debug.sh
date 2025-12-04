#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: run_bsadr_debug.sh

Required environment variables:
  GITHUB_TOKEN      GitHub PAT with repo read access.
  WS_BOT_NOSTR_PK   Nostr private key for the WS bot.
  DEBUG_APPS        Comma-separated list of appIds to process.

Optional environment variables:
  APP_INFO_SOURCE   Path or URL to buildServerInfo JSON (default: buildServerInfo.seed.json).
  BUILD_DIR_OVERRIDE Directory for build outputs (default: ./build_server_builds).

The script runs external/build_server/index.mjs in single-run debug mode using the
environment you provide. Example:

  GITHUB_TOKEN=xxx WS_BOT_NOSTR_PK=yyy DEBUG_APPS="bitcoinsafe" \
  APP_INFO_SOURCE=buildServerInfo.seed.json \
  ./scripts/run_bsadr_debug.sh
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN to a valid GitHub token}"
: "${WS_BOT_NOSTR_PK:?Set WS_BOT_NOSTR_PK to a valid nostr private key}"
: "${DEBUG_APPS:?Set DEBUG_APPS to a comma separated list of appIds}"

APP_INFO_SOURCE="${APP_INFO_SOURCE:-${ROOT_DIR}/buildServerInfo.seed.json}"
BUILD_DIR_OVERRIDE="${BUILD_DIR_OVERRIDE:-${ROOT_DIR}/build_server_builds}"

export DEBUG_APP_IDS="${DEBUG_APPS}"
export BUILD_DIR_OVERRIDE

mkdir -p "${BUILD_DIR_OVERRIDE}"

CMD=(
  node "${ROOT_DIR}/external/build_server/index.mjs"
  --githubToken "${GITHUB_TOKEN}"
  --wsBotNostrPrivateKey "${WS_BOT_NOSTR_PK}"
  --singleRun
  --debug
)

if [[ -n "${APP_INFO_SOURCE}" ]]; then
  CMD+=(--appInfo "${APP_INFO_SOURCE}")
fi

echo "Running BSADR debug build with DEBUG_APP_IDS=${DEBUG_APP_IDS}"
echo "Build output directory: ${BUILD_DIR_OVERRIDE}"
echo "App info source: ${APP_INFO_SOURCE}"

"${CMD[@]}"
