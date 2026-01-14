#!/bin/bash

# Process Bitcoin Wallet Discovery Results
# This script runs the interactive tool to review discovered wallets

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
RUN_IMAGES=true

print_help() {
  cat <<'EOF'
Usage: ./processWalletDiscovery.sh [OPTIONS]

Runs the interactive wallet discovery processor. By default it also runs
./updateImages.sh after processing so new entries get screenshots.

Options:
  --no-images   Skip running updateImages.sh after processing
  --help        Show this help text and exit
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-images)
      RUN_IMAGES=false
      shift
      ;;
    --help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      print_help
      exit 1
      ;;
  esac
done

(cd "${REPO_ROOT}" && node "${SCRIPT_DIR}/processWalletDiscovery.mjs")

if [[ "${RUN_IMAGES}" == true ]]; then
  echo "updating images. This may take some time..."
  (cd "${REPO_ROOT}" && ./updateImages.sh)
else
  echo "Skipping image updates (--no-images)."
fi
