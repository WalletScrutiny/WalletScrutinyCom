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
all_files=("$HARDWARE_DIR"/*.md)
FILES_ANALYZED=${#all_files[@]}

# Only keep files with 'verdict: sourceavailable'
files=()
for f in "${all_files[@]}"; do
  if grep -q '^verdict: *sourceavailable' "$f"; then
    files+=("$f")
  fi
done
SOURCE_AVAILABLE=${#files[@]}

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No sourceavailable .md files found in $HARDWARE_DIR — nothing to do."
  exit 0
fi

echo "Starting hardware update on ${#files[@]} sourceavailable files..."
echo

# -----------------------------------------------------------------------------
# Prepare counters & helper functions
# -----------------------------------------------------------------------------
FILES_UPDATED=0
FILES_SKIPPED=0
SKIPPED_REASONS=()

# Fetch Trezor version information from releases.json or GitHub releases API
# Usage: fetch_trezor_version "model_code"
# Returns: JSON with version and date
fetch_trezor_version() {
  local model_code="$1"
  local trezor_model="" version="" release_date=""
  
  # Map the firmware code to the model code used by the JS script
  case "$model_code" in
    1|legacy|trezorOne)   trezor_model="LEGACY" ;;
    2|core|trezorT)       trezor_model="T2T1"   ;;
    t2b1|trezorSafe3)     trezor_model="T2B1"   ;;
    t3t1|trezorSafe5)     trezor_model="T3T1"   ;;
    *)
      debug "Unknown Trezor model code: $model_code"
      echo "unknown"
      echo "$(date +%F)"
      return 0
      ;;
  esac
  
  debug "Fetching Trezor version info for $trezor_model using trezor_fextractor.js"
  
  # Run the JavaScript extractor with the new --json and --model flags
  local json_output=""
  
  if [[ -n "$GITHUB_TOKEN" ]]; then
    debug "  ↳ Running with GitHub token"
    json_output=$(node "$script_dir/trezor_fextractor.js" -g "$GITHUB_TOKEN" --json --model "$trezor_model" 2>/dev/null)
  else
    debug "  ↳ Running without GitHub token"
    json_output=$(node "$script_dir/trezor_fextractor.js" --json --model "$trezor_model" 2>/dev/null)
  fi
  
  local exit_code=$?
  debug "  ↳ JavaScript extractor exit code: $exit_code"
  
  # Check if the script execution was successful
  if [[ $exit_code -ne 0 || -z "$json_output" ]]; then
    debug "  ↳ JavaScript extractor failed or returned empty output"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  # Parse the JSON output
  if command -v jq &>/dev/null; then
    version=$(echo "$json_output" | jq -r '.version')
    release_date=$(echo "$json_output" | jq -r '.date')
  else
    # Fallback if jq is not available - basic parsing
    version=$(echo "$json_output" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    release_date=$(echo "$json_output" | grep -o '"date":"[^"]*"' | cut -d'"' -f4)
  fi
  
  debug "  ↳ Parsed version: $version"
  debug "  ↳ Parsed date: $release_date"
  
  if [[ -z "$version" || "$version" == "unknown" || "$version" == "null" ]]; then
    debug "  ↳ Could not extract version for $trezor_model"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  # If release date is empty, use current date
  if [[ -z "$release_date" || "$release_date" == "null" ]]; then
    release_date=$(date +%F)
  fi
  
  debug "  ↳ Found version $version from JS extractor"
  debug "  ↳ Found date $release_date from JS extractor"
  
  # Add 'v' prefix for legacy Trezor One
  if [[ "$trezor_model" == "LEGACY" && ! "$version" =~ ^v ]]; then
    version="v$version"
  fi
  
  # Output the results
  echo "$version"
  echo "$release_date"
  return 0
}

# Coldcard version tag fetcher
get_latest_coldcard_version() {
  # $1: model (mk1, mk2, mk3, mk4, q, mk4edge, qedge)
  local model="$1"
  local regex suffix
  case "$model" in
    mk4)
      regex='v5\.[0-9]+\.[0-9]+$'
      ;;
    mk3|mk2)
      regex='v4\.[0-9]+\.[0-9]+$'
      ;;
    mk1)
      regex='v3\.[0-9]+\.[0-9]+$'
      ;;
    q)
      regex='v1\.[0-9]+\.[0-9]+Q$'
      ;;
    *)
      echo "Unknown Coldcard model: $model" >&2
      return 1
      ;;
  esac
  # Fetch tags (first 100 is enough for now)
  local tags_json
  tags_json=$(curl -s "https://api.github.com/repos/Coldcard/firmware/tags?per_page=100")
  local tags_list
  tags_list=$(echo "$tags_json" | jq -r '.[].name')
  # New robust tag parsing: extract version after last -v, match prefix, pick highest
  local versions
  versions=$(echo "$tags_list" | \
    sed -nE 's/.*-v([0-9]+\.[0-9]+\.[0-9]+[A-Z]*).*/v\1/p')
  local latest_version
  latest_version=$(echo "$versions" | grep -E "$regex" | sort -V | tail -n1)
  echo "$latest_version"
}

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
  name=$(basename "$file")

  verdict=$(extract_field "$file" verdict)
  # Only process sourceavailable files (already filtered, but keep for safety)
  if [[ "$verdict" != "sourceavailable" ]]; then
    continue
  fi

  repo_url=$(extract_field "$file" repository)
  if [[ -z $repo_url || $repo_url == https://github.com/ ]]; then
    ((FILES_SKIPPED++))
    continue
  fi

  repo_path=${repo_url#https://github.com/}
  echo -e "\033[0;34mProcessing $name\033[0m"

  # Coldcard special handling
  if [[ "$repo_url" == "https://github.com/Coldcard/firmware" ]]; then
    # Determine model from filename (lowercase, strip extension)
    model=""
    fname="$(basename "$file" .md | tr '[:upper:]' '[:lower:]')"
    # Enhanced model detection for coinkite.coldcard.* patterns
    if [[ "$fname" =~ (coldcard|coinkite\.coldcard)[^a-z0-9]*mk4 ]]; then
      model="mk4"
    elif [[ "$fname" =~ (coldcard|coinkite\.coldcard)[^a-z0-9]*mk3 ]]; then
      model="mk3"
    elif [[ "$fname" =~ (coldcard|coinkite\.coldcard)[^a-z0-9]*mk2 ]]; then
      model="mk2"
    elif [[ "$fname" =~ (coldcard|coinkite\.coldcard)[^a-z0-9]*mk1 ]]; then
      model="mk1"
    elif [[ "$fname" =~ (coldcard|coinkite\.coldcard)[^a-z0-9]*q ]]; then
      model="q"
    fi
    if [[ -n "$model" ]]; then
      latest_version=$(get_latest_coldcard_version "$model")
      release_date=""
      current_version=$(extract_field "$file" version)
      current_updated=$(extract_field "$file" updated)
      updated=0
      # Special handling for mk1 legacy device
      if [[ "$model" == "mk1" && -z "$latest_version" ]]; then
        echo -e "\033[1;33mNo tags found for mk1 (legacy device). Please update manually if needed.\033[0m"
        ((FILES_SKIPPED++))
        echo
        continue
      fi
      # Uniform output for Coldcard status
      if [[ -n "$latest_version" && "$current_version" != "$latest_version" ]]; then
        echo "- 'version: $current_version'"
        echo "+ 'version: $latest_version'"
        update_field "$file" version "$current_version" "$latest_version"
        updated=1
      fi
      if [[ $updated -eq 1 ]]; then
        echo -e "\033[1;33mUpdated to latest version.\033[0m"
        ((FILES_UPDATED++))
      else
        echo "Already up to date."
        debug "$name remains at $current_version"
      fi
      echo
      continue
    fi
    # If model not matched, fallback to regular API
  fi

  # Trezor special handling
  provider=$(extract_field "$file" provider | tr '[:upper:]' '[:lower:]')
  app_id=$(extract_field "$file" appId)
  file_lc=$(basename "$file" | tr '[:upper:]' '[:lower:]')
  app_id_lc=$(echo "$app_id" | tr '[:upper:]' '[:lower:]')
  
  # Robust Trezor detection: match provider, repo, appId, or filename (case-insensitive, partial)
  debug "Checking Trezor detection for $file (provider=$provider, repo=$repo_path, app_id=$app_id, file=$file_lc)"
  if [[ "$provider" == *trezor* || "$repo_path" == *trezor* || "$app_id_lc" == *trezor* || "$file_lc" == *trezor* ]]; then
    echo -e "\033[0;34mDetected Trezor device in $(basename \"$file\")\033[0m"
    
    # Map the file to the correct firmware code
    firmware_code=""
    if [[ "$file_lc" == *trezorone* ]]; then 
      firmware_code="legacy"
      app_id="trezorOne"
    elif [[ "$file_lc" == *trezort* ]]; then 
      firmware_code="core"
      app_id="trezorT"
    elif [[ "$file_lc" == *trezorsafe3* ]]; then 
      firmware_code="t2b1"
      app_id="trezorSafe3"
    elif [[ "$file_lc" == *trezorsafe5* ]]; then 
      firmware_code="t3t1"
      app_id="trezorSafe5"
    fi
    
    if [[ -n "$firmware_code" ]]; then
      echo -e "\033[0;34mUsing firmware code '$firmware_code' for Trezor device\033[0m"
      
      # Fetch version info using the JavaScript extractor
      debug "Fetching Trezor version info using JavaScript extractor for $firmware_code"
      # The function now returns version and date on separate lines
      latest_version=$(fetch_trezor_version "$firmware_code" | head -1)
      release_date=$(fetch_trezor_version "$firmware_code" | tail -1)
      fetch_result=$?
      
      if [[ $fetch_result -ne 0 || -z "$latest_version" || "$latest_version" == "unknown" ]]; then
        echo -e "\033[1;33mFailed to fetch version info for $app_id. Please update manually if needed.\033[0m"
        ((FILES_SKIPPED++))
        SKIPPED_REASONS+=("Failed to fetch version info for $app_id from JavaScript extractor")
        echo
        continue
      fi
      debug "Found version $latest_version from JavaScript extractor"
      
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
        debug "$name remains at $current_version"
      fi
      
      echo
      continue
    else
      echo -e "\033[1;33mDetected Trezor device but could not determine firmware code. Please check mapping.\033[0m"
      ((FILES_SKIPPED++))
      SKIPPED_REASONS+=("Unknown Trezor model: $(basename \"$file\")")
      echo
      continue
    fi
  fi

  debug "Calling retry_api_call for $repo_path"
  release_info=$(retry_api_call "$repo_path")
  if [[ $release_info == ERROR* ]]; then
    echo -e "\033[0;31mFetch failed: $release_info\033[0m"
    if [[ $release_info == *"404"* ]]; then
      echo "'repository: $repo_url'"
    fi
    ((FILES_SKIPPED++))
    echo
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
    debug "$name remains at $current_version"
  fi
  echo

  check_rate_limit
  echo
done

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo "===== Hardware Summary ====="
echo "Files analyzed: $FILES_ANALYZED"
echo "Source available: $SOURCE_AVAILABLE"
echo "Files updated:  $FILES_UPDATED"
echo "Files skipped:  $FILES_SKIPPED"

if (( ${#SKIPPED_REASONS[@]} )); then
  echo -e "\nReasons for skipping:"
  for r in "${SKIPPED_REASONS[@]}"; do
    echo "  - $r"
  done
fi
