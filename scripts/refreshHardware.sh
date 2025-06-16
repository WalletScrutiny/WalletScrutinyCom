#!/usr/bin/env bash
# =============================================================================
# scripts/refreshHardware.sh  - Check & update hardware wallet markdown files
# =============================================================================

# 1) Determine our own directory before enabling "nounset"
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

debug() { $DEBUG && echo -e "\033[0;33mDEBUG:\033[0m $*" >&2; }

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

# Enhanced API call with better error handling and validation
safe_api_call() {
  local url="$1"
  local token="$2"
  local response
  local http_code
  
  debug "Making API call to: $url"
  
  if [[ -n "$token" ]]; then
    response=$(curl -s -w "\n%{http_code}" -H "Authorization: token $token" "$url")
  else
    response=$(curl -s -w "\n%{http_code}" "$url")
  fi
  
  # Extract HTTP code from last line
  http_code=$(echo "$response" | tail -n1)
  response=$(echo "$response" | head -n -1)
  
  debug "HTTP response code: $http_code"
  debug "Response preview: $(echo "$response" | head -c 200)..."
  
  # Check for HTTP errors
  if [[ "$http_code" -ge 400 ]]; then
    debug "HTTP error $http_code for URL: $url"
    echo "ERROR_HTTP_$http_code"
    return 1
  fi
  
  # Validate JSON format
  if ! echo "$response" | jq empty 2>/dev/null; then
    debug "Invalid JSON response from: $url"
    debug "Raw response: $response"
    echo "ERROR_INVALID_JSON"
    return 1
  fi
  
  echo "$response"
  return 0
}

# Fetch BitLox Ultimate firmware version from GitHub releases
# Usage: fetch_bitlox_version
# Returns: version and date on separate lines
fetch_bitlox_version() {
  debug "Fetching BitLox Ultimate firmware version from GitHub releases"
  
  local api_url="https://api.github.com/repos/BitLox/bitlox-firmware/releases"
  local json_output
  local version="unknown"
  local release_date="$(date +%F)"
  
  json_output=$(safe_api_call "$api_url" "$GITHUB_TOKEN")
  local exit_code=$?
  
  if [[ $exit_code -ne 0 || "$json_output" == ERROR* ]]; then
    debug "Failed to fetch BitLox releases: $json_output"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  # Parse the JSON output to get the latest release
  if command -v jq &>/dev/null; then
    version=$(echo "$json_output" | jq -r '.[0].tag_name // "unknown"')
    release_date=$(echo "$json_output" | jq -r '.[0].published_at // ""' | cut -d'T' -f1)
  else
    version=$(echo "$json_output" | grep -o '"tag_name":"[^"]*"' | head -1 | cut -d'"' -f4)
    release_date=$(echo "$json_output" | grep -o '"published_at":"[^"]*"' | head -1 | cut -d'"' -f4 | cut -d'T' -f1)
  fi
  
  debug "Parsed BitLox version: $version"
  debug "Parsed BitLox release date: $release_date"
  
  if [[ -z "$version" || "$version" == "unknown" || "$version" == "null" ]]; then
    debug "Could not extract BitLox version"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  if [[ -z "$release_date" || "$release_date" == "null" ]]; then
    release_date=$(date +%F)
  fi
  
  echo "$version $release_date"
  return 0
}

# Fetch Blockstream Jade firmware version from GitHub releases
# Usage: fetch_jade_version ["plus"]
# Returns: version and date on separate lines
fetch_jade_version() {
  local is_plus="$1"
  debug "Fetching Blockstream Jade${is_plus:+ Plus} firmware version from GitHub tags"
  
  local api_url="https://api.github.com/repos/Blockstream/jade/tags"
  local json_output
  local version="unknown"
  local release_date="$(date +%F)"
  
  json_output=$(safe_api_call "$api_url" "$GITHUB_TOKEN")
  local exit_code=$?
  
  if [[ $exit_code -ne 0 || "$json_output" == ERROR* ]]; then
    debug "Failed to fetch Jade tags: $json_output"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  if command -v jq &>/dev/null; then
    version=$(echo "$json_output" | jq -r '.[0].name // "unknown"')
    debug "Jade raw version from jq: $version"
    
    # Get commit SHA for the tag to fetch commit date
    local commit_sha=$(echo "$json_output" | jq -r '.[0].commit.sha // ""')
    debug "Jade commit SHA: $commit_sha"
    
    if [[ -n "$commit_sha" && "$commit_sha" != "null" ]]; then
      local commit_url="https://api.github.com/repos/Blockstream/jade/commits/$commit_sha"
      debug "Fetching commit info from: $commit_url"
      
      local commit_info=$(safe_api_call "$commit_url" "$GITHUB_TOKEN")
      debug "Commit info response code: $?"
      debug "Commit info preview: ${commit_info:0:100}..."
      
      if [[ $? -eq 0 && "$commit_info" != ERROR* ]]; then
        release_date=$(echo "$commit_info" | jq -r '.commit.committer.date // ""' | cut -d'T' -f1)
        debug "Extracted release date from commit: $release_date"
      else
        debug "Failed to get valid commit info"
      fi
    else
      debug "No valid commit SHA found"
    fi
  else
    version=$(echo "$json_output" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
    debug "Jade raw version from grep: $version"
    
    # Get commit SHA for the tag to fetch commit date
    local commit_sha=$(echo "$json_output" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
    debug "Jade commit SHA (grep): $commit_sha"
    
    if [[ -n "$commit_sha" ]]; then
      local commit_url="https://api.github.com/repos/Blockstream/jade/commits/$commit_sha"
      debug "Fetching commit info from: $commit_url (grep path)"
      
      local commit_info=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "$commit_url")
      debug "Commit info preview (grep): ${commit_info:0:100}..."
      
      release_date=$(echo "$commit_info" | grep -o '"date":"[^"]*"' | head -1 | cut -d'"' -f4 | cut -d'T' -f1)
      debug "Extracted release date from commit (grep): $release_date"
    else
      debug "No valid commit SHA found (grep path)"
    fi
  fi
  
  debug "Parsed Jade${is_plus:+ Plus} version: $version"
  debug "Parsed Jade${is_plus:+ Plus} release date: $release_date"
  
  if [[ -z "$version" || "$version" == "unknown" || "$version" == "null" ]]; then
    debug "Could not extract Jade${is_plus:+ Plus} version"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  if [[ -z "$release_date" || "$release_date" == "null" ]]; then
    release_date=$(date +%F)
  fi
  
  echo "$version"
  echo "$release_date"
  return 0
}

# Fetch Trezor version information from releases.json or GitHub releases API
# Usage: fetch_trezor_version "model_code"
# Returns: JSON with version and date
fetch_trezor_version() {
  local model_code="$1"
  local trezor_model="" version="" release_date=""
  
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
  
  local json_output=""
  
  if [[ -n "$GITHUB_TOKEN" ]]; then
    debug "Running with GitHub token"
    json_output=$(node "$script_dir/trezor_fextractor.js" -g "$GITHUB_TOKEN" --json --model "$trezor_model" --debug 2>/dev/null)
  else
    debug "Running without GitHub token"
    json_output=$(node "$script_dir/trezor_fextractor.js" --json --model "$trezor_model" --debug 2>/dev/null)
  fi
  
  local exit_code=$?
  debug "JavaScript extractor exit code: $exit_code"
  
  if [[ $exit_code -ne 0 || -z "$json_output" ]]; then
    debug "JavaScript extractor failed or returned empty output"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  if command -v jq &>/dev/null; then
    version=$(echo "$json_output" | jq -r '.version')
    release_date=$(echo "$json_output" | jq -r '.date')
  else
    version=$(echo "$json_output" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    release_date=$(echo "$json_output" | grep -o '"date":"[^"]*"' | cut -d'"' -f4)
  fi
  
  debug "Parsed version: $version"
  debug "Parsed date: $release_date"
  
  if [[ -z "$version" || "$version" == "unknown" || "$version" == "null" ]]; then
    debug "Could not extract version for $trezor_model"
    echo "unknown"
    echo "$(date +%F)"
    return 0
  fi
  
  if [[ -z "$release_date" || "$release_date" == "null" ]]; then
    release_date=$(date +%F)
  fi
  
  debug "Found version $version from JS extractor"
  debug "Found date $release_date from JS extractor"
  
  if [[ "$trezor_model" == "LEGACY" && ! "$version" =~ ^v ]]; then
    version="v$version"
  fi
  
  echo "$version"
  echo "$release_date"
  return 0
}

# Enhanced Coldcard version tag fetcher with better error handling
get_latest_coldcard_version() {
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
  
  local api_url="https://api.github.com/repos/Coldcard/firmware/tags?per_page=100"
  local tags_json
  
  tags_json=$(safe_api_call "$api_url" "$GITHUB_TOKEN")
  local exit_code=$?
  
  if [[ $exit_code -ne 0 || "$tags_json" == ERROR* ]]; then
    debug "Failed to fetch Coldcard tags: $tags_json"
    return 1
  fi
  
  local tags_list
  local tag_name
  local tag_sha
  
  if command -v jq &>/dev/null; then
    tags_list=$(echo "$tags_json" | jq -r '.[].name' 2>/dev/null)
  else
    tags_list=$(echo "$tags_json" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
  fi
  
  if [[ -z "$tags_list" ]]; then
    debug "No tags found in response"
    return 1
  fi
  
  local versions
  versions=$(echo "$tags_list" | \
    sed -nE 's/.*-v([0-9]+\.[0-9]+\.[0-9]+[A-Z]*).*/v\1/p')
  local latest_version
  latest_version=$(echo "$versions" | grep -E "$regex" | sort -V | tail -n1)
  
  if [[ -n "$latest_version" ]]; then
    debug "Found latest Coldcard $model version: $latest_version"
    
    # Get the tag name that matches our version
    if command -v jq &>/dev/null; then
      tag_name=$(echo "$tags_json" | jq -r --arg version "$latest_version" '.[] | select(.name | contains($version)) | .name' | head -1)
      tag_sha=$(echo "$tags_json" | jq -r --arg name "$tag_name" '.[] | select(.name == $name) | .commit.sha' 2>/dev/null)
    else
      tag_name=$(echo "$tags_list" | grep "$latest_version" | head -1)
      tag_sha=$(echo "$tags_json" | grep -A 5 "\"name\":\"$tag_name\"" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
    fi
    
    debug "Found tag name: $tag_name with SHA: $tag_sha"
    
    # Get the commit date for this tag
    local release_date="$(date +%F)" # Default to today
    if [[ -n "$tag_sha" ]]; then
      local commit_url="https://api.github.com/repos/Coldcard/firmware/commits/$tag_sha"
      debug "Fetching commit info from: $commit_url"
      
      local commit_info=$(safe_api_call "$commit_url" "$GITHUB_TOKEN")
      if [[ $? -eq 0 && "$commit_info" != ERROR* ]]; then
        if command -v jq &>/dev/null; then
          release_date=$(echo "$commit_info" | jq -r '.commit.committer.date // ""' | cut -d'T' -f1)
        else
          release_date=$(echo "$commit_info" | grep -o '"date":"[^"]*"' | head -1 | cut -d'"' -f4 | cut -d'T' -f1)
        fi
        debug "Extracted release date from commit: $release_date"
      else
        debug "Failed to get valid commit info, using current date"
      fi
    fi
    
    echo "$latest_version"
    echo "$release_date"
    return 0
  else
    debug "No matching version found for pattern: $regex"
    return 1
  fi
}

extract_field() {
  grep -m1 "^$2:" "$1" | sed "s/^$2:[[:space:]]*//;s/[\"']//g"
}

update_field() {
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
  
  file_lc=$(basename "$file" | tr '[:upper:]' '[:lower:]')

  # Coldcard special handling
  if [[ "$repo_url" == "https://github.com/Coldcard/firmware" ]]; then
    model=""
    fname="$(basename "$file" .md | tr '[:upper:]' '[:lower:]')"
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
      # Get both version and release date
      { read -r latest_version; read -r release_date; } < <(get_latest_coldcard_version "$model")
      fetch_result=$?
      
      current_version=$(extract_field "$file" version)
      current_updated=$(extract_field "$file" updated)
      updated=0
      
      if [[ "$model" == "mk1" && -z "$latest_version" ]]; then
        echo -e "\033[1;33mNo tags found for mk1. Checking if this is expected for legacy device.\033[0m"
        ((FILES_SKIPPED++))
        echo
        continue
      fi
      
      debug "Coldcard $model: Found version=$latest_version, date=$release_date"
      
      # Update version if needed
      if [[ -n "$latest_version" && "$current_version" != "$latest_version" ]]; then
        echo "- 'version: $current_version'"
        echo "+ 'version: $latest_version'"
        update_field "$file" version "$current_version" "$latest_version"
        updated=1
      fi
      
      # Update date if needed
      if [[ -n "$release_date" && "$release_date" != "null" && "$current_updated" != "$release_date" ]]; then
        echo "- 'updated: $current_updated'"
        echo "+ 'updated: $release_date'"
        update_field "$file" updated "$current_updated" "$release_date"
        updated=1
      fi
      
      if [[ $updated -eq 1 ]]; then
        echo -e "\033[1;33mUpdated to latest version.\033[0m"
        ((FILES_UPDATED++))
      else
        echo "Already up to date. (current: $current_version, updated: $current_updated)"
        debug "$name remains at $current_version"
      fi
      echo
      continue
    fi
  fi

  # BitLox Ultimate special handling
  if [[ "$repo_url" == "https://github.com/BitLox/bitlox-firmware/releases/tag/v67_app" || "$file_lc" == *bitloxultimate* ]]; then
    echo -e "\033[0;34mDetected BitLox Ultimate device in $(basename "$file")\033[0m"
    
    debug "Fetching BitLox Ultimate version info"
    { read -r latest_version; read -r release_date; } < <(fetch_bitlox_version)
    fetch_result=$?
    
    if [[ $fetch_result -ne 0 || -z "$latest_version" || "$latest_version" == "unknown" ]]; then
      echo -e "\033[1;33mFailed to fetch version info for BitLox Ultimate. Please update manually if needed.\033[0m"
      ((FILES_SKIPPED++))
      SKIPPED_REASONS+=("Failed to fetch version info for BitLox Ultimate")
      echo
      continue
    fi
    debug "Found BitLox Ultimate version $latest_version from GitHub releases"
    
    current_version=$(extract_field "$file" version)
    current_updated=$(extract_field "$file" updated)
    updated=0
    if [[ "$current_version" != "$latest_version" ]]; then
      echo "- 'version: $current_version'"
      echo "+ 'version: $latest_version'"
      update_field "$file" version "$current_version" "$latest_version"
      updated=1
    fi
    # Only update the date if we have a valid release date and it's different from current
    if [[ -n "$release_date" && "$release_date" != "null" && "$current_updated" != "$release_date" ]]; then
      echo "- 'updated: $current_updated'"
      echo "+ 'updated: $release_date'"
      update_field "$file" updated "$current_updated" "$release_date"
      updated=1
    fi
    if [[ $updated -eq 1 ]]; then
      echo -e "\033[1;33mUpdated to latest version.\033[0m"
      ((FILES_UPDATED++))
    else
      echo "Already up to date. (current: $current_version, updated: $current_updated)"
      debug "$name remains at $current_version"
    fi
    echo
    continue
  fi
  
  # Blockstream Jade special handling
  if [[ "$repo_url" == "https://github.com/Blockstream/jade" ]]; then
    is_plus=""
    if [[ "$file_lc" == *jadeplus* ]]; then
      is_plus="plus"
      echo -e "\033[0;34mDetected Blockstream Jade Plus device in $(basename "$file")\033[0m"
    else
      echo -e "\033[0;34mDetected Blockstream Jade device in $(basename "$file")\033[0m"
    fi
    
    debug "Fetching Blockstream Jade${is_plus:+ Plus} version info"
    { read -r latest_version; read -r release_date; } < <(fetch_jade_version "$is_plus")
    fetch_result=$?
    
    if [[ $fetch_result -ne 0 || -z "$latest_version" || "$latest_version" == "unknown" ]]; then
      echo -e "\033[1;33mFailed to fetch version info for Blockstream Jade${is_plus:+ Plus}. Please update manually if needed.\033[0m"
      ((FILES_SKIPPED++))
      SKIPPED_REASONS+=("Failed to fetch version info for Blockstream Jade${is_plus:+ Plus}")
      echo
      continue
    fi
    debug "Found Blockstream Jade${is_plus:+ Plus} version $latest_version from GitHub releases"
    
    current_version=$(extract_field "$file" version)
    current_updated=$(extract_field "$file" updated)
    updated=0
    if [[ "$current_version" != "$latest_version" ]]; then
      echo "- 'version: $current_version'"
      echo "+ 'version: $latest_version'"
      update_field "$file" version "$current_version" "$latest_version"
      updated=1
    fi
    # Only update the date if we have a valid release date and it's different from current
    if [[ -n "$release_date" && "$release_date" != "null" && "$current_updated" != "$release_date" ]]; then
      echo "- 'updated: $current_updated'"
      echo "+ 'updated: $release_date'"
      update_field "$file" updated "$current_updated" "$release_date"
      updated=1
    fi
    if [[ $updated -eq 1 ]]; then
      echo -e "\033[1;33mUpdated to latest version.\033[0m"
      ((FILES_UPDATED++))
    else
      echo "Already up to date. (current: $current_version, updated: $current_updated)"
      debug "$name remains at $current_version"
    fi
    echo
    continue
  fi
  
  # Trezor special handling
  provider=$(extract_field "$file" provider | tr '[:upper:]' '[:lower:]')
  app_id=$(extract_field "$file" appId)
  app_id_lc=$(echo "$app_id" | tr '[:upper:]' '[:lower:]')
  
  debug "Checking Trezor detection for $file (provider=$provider, repo=$repo_path, app_id=$app_id, file=$file_lc)"
  if [[ "$provider" == *trezor* || "$repo_path" == *trezor* || "$app_id_lc" == *trezor* || "$file_lc" == *trezor* ]]; then
    echo -e "\033[0;34mDetected Trezor device in $(basename \"$file\")\033[0m"
    
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
      
      debug "Fetching Trezor version info using JavaScript extractor for $firmware_code"
      { read -r latest_version; read -r release_date; } < <(fetch_trezor_version "$firmware_code")
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
      # Only update the date if we have a valid release date and it's different from current
      if [[ -n "$release_date" && "$release_date" != "null" && "$current_updated" != "$release_date" ]]; then
        echo "- 'updated: $current_updated'"
        echo "+ 'updated: $release_date'"
        update_field "$file" updated "$current_updated" "$release_date"
        updated=1
      fi
      
      if [[ $updated -eq 1 ]]; then
        echo -e "\033[1;33mUpdated to latest version.\033[0m"
        ((FILES_UPDATED++))
      else
        echo "Already up to date. (current: $current_version, updated: $current_updated)"
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
  # Only update the date if we have a valid release date and it's different from current
  if [[ -n "$release_date" && "$release_date" != "null" && "$current_updated" != "$release_date" ]]; then
    echo "- 'updated: $current_updated'"
    echo "+ 'updated: $release_date'"
    update_field "$file" updated "$current_updated" "$release_date"
    updated=1
  fi
  if [[ $updated -eq 1 ]]; then
    echo -e "\033[1;33mUpdated to latest version.\033[0m"
    ((FILES_UPDATED++))
  else
    echo "Already up to date. (current: $current_version, updated: $current_updated)"
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