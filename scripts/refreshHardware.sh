#!/usr/bin/env bash
# =============================================================================
# scripts/refreshHardware.sh  - Check & update hardware wallet markdown files
# =============================================================================

# 1) Determine our own directory before enabling “nounset”
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 2) Now turn on strict mode
IFS=$'\n\t'

# 3) Pull in the shared GitHub helpers
source "$script_dir/github_utils.sh"

# -----------------------------------------------------------------------------
# Defaults & usage
# -----------------------------------------------------------------------------
GITHUB_TOKEN=""
DEBUG=false

usage() {
  echo "Usage: $0 [-g GITHUB_TOKEN] [-d]"
  echo "  -g  GitHub token (overrides GITHUB_API_TOKEN/GITHUB_TOKEN)"
  echo "  -d  Enable debug output"
  exit 1
}

# -----------------------------------------------------------------------------
# Parse flags
# -----------------------------------------------------------------------------
# Reset in case github_utils alters OPTIND
OPTIND=1
while getopts "g:d" opt; do
  case $opt in
    g) GITHUB_TOKEN="$OPTARG" ;;
    d) DEBUG=true        ;;
    *) usage             ;;
  esac
done
shift $((OPTIND-1))

debug() { $DEBUG && echo -e "\033[0;33mDEBUG:\033[0m $*"; }

# -----------------------------------------------------------------------------
# Hand off our token to github_utils (it sets $GITHUB_TOKEN internally)
# -----------------------------------------------------------------------------
if [[ -n $GITHUB_TOKEN ]]; then
  parse_github_token -g "$GITHUB_TOKEN"
else
  parse_github_token
fi

# -----------------------------------------------------------------------------
# Sanity checks
# -----------------------------------------------------------------------------
require_jq
check_rate_limit

# -----------------------------------------------------------------------------
# Locate files
# -----------------------------------------------------------------------------
HARDWARE_DIR="/home/dannybuntu/work/walletScrutinyCom/_hardware"
mapfile -t files < <(printf '%s\n' "$HARDWARE_DIR"/*.md 2>/dev/null || true)

if (( ${#files[@]} == 0 )); then
  echo "No .md files found in $HARDWARE_DIR — nothing to do."
  exit 0
fi

echo "Starting hardware update on ${#files[@]} files..."
echo

# -----------------------------------------------------------------------------
# Prepare counters & helper functions
# -----------------------------------------------------------------------------
FILES_ANALYZED=0
FILES_UPDATED=0
FILES_SKIPPED=0
declare -a SKIPPED_REASONS

extract_field() {
  # Usage: extract_field file fieldName
  grep -m1 "^$2:" "$1" | sed "s/^$2:[[:space:]]*//;s/[\"']//g"
}

update_field() {
  # Usage: update_field file fieldName oldValue newValue
  if [[ $3 != $4 ]]; then
    perl -i -pe "s|^$2: .*|$2: $4|" "$1"
    return 0
  fi
  return 1
}

# -----------------------------------------------------------------------------
# Main loop
# -----------------------------------------------------------------------------
for file in "${files[@]}"; do
  ((FILES_ANALYZED++))
  name=$(basename "$file")

  verdict=$(extract_field "$file" verdict)
  if [[ ! $verdict =~ ^(reproducible|sourceavailable|wip)$ ]]; then
    continue
  fi

  repo_url=$(extract_field "$file" repository)
  if [[ -z $repo_url || $repo_url == https://github.com/ ]]; then
    continue
  fi

  repo_path=${repo_url#https://github.com/}
  echo -e "\033[0;34mProcessing $name\033[0m"
  echo "current 'verdict: $verdict'"

  debug "Calling retry_api_call for $repo_path"
  release_info=$(retry_api_call "$repo_path")
  if [[ $release_info == ERROR* ]]; then
    echo -e "\033[0;31mFetch failed: $release_info\033[0m"
    continue
  fi

  IFS='|' read -r latest_version release_date <<<"$release_info"
  current_version=$(extract_field "$file" version)
  current_updated=$(extract_field "$file" updated)

  updated=0
  if [[ "$current_version" != "$latest_version" ]]; then
    echo "- 'version: $current_version'"
    echo "+ 'version: $latest_version'"
    update_field "$file" version "$current_version" "$latest_version"
    updated=1
  fi
  if [[ "$current_updated" != "$release_date" ]]; then
    echo "- 'updated: $current_updated'"
    echo "+ 'updated: $release_date'"
    update_field "$file" updated "$current_updated" "$release_date"
    updated=1
  fi
  if [[ $updated -eq 1 ]]; then
    echo -e "\033[1;33mUpdated to latest version.\033[0m"
    ((FILES_UPDATED++))
  else
    echo "Already up to date."
    echo -e "  \033[0;34mAlready up to date ($current_version)\033[0m"
    debug "$name remains at $current_version"
  fi

  check_rate_limit
  echo
done

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo "===== Hardware Summary ====="
echo "Files analyzed: $FILES_ANALYZED"
echo "Files updated:  $FILES_UPDATED"
echo "Files skipped:  $FILES_SKIPPED"

if (( ${#SKIPPED_REASONS[@]} )); then
  echo -e "\nReasons for skipping:"
  for r in "${SKIPPED_REASONS[@]}"; do
    echo "  - $r"
  done
fi
