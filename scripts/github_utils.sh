#!/usr/bin/env bash
# =============================================================================
# scripts/github_utils.sh  - Shared GitHub API helper functions
# =============================================================================

# Set shell options for safety
set -o nounset

# Initialize global variables
GITHUB_TOKEN=${GITHUB_TOKEN:-""}

# Ensure jq is installed
require_jq() {
  if ! command -v jq >/dev/null 2>&1; then
    echo -e "${RED}ERROR: 'jq' is required. Install with 'sudo apt install jq'.${NC}" >&2
    exit 1
  fi
}

# Parse -g flag and fall back to environment variables
# Usage: parse_github_token "${@}"
parse_github_token() {
  local OPTIND opt token_flag=""
  while getopts "g:" opt; do
    case $opt in
      g) token_flag=$OPTARG ;;  
    esac
  done
  # precedence: flag > GITHUB_API_TOKEN > GITHUB_TOKEN
  if [ -n "$token_flag" ]; then
    GITHUB_TOKEN="$token_flag"
  elif [ -n "${GITHUB_API_TOKEN:-}" ]; then
    GITHUB_TOKEN="$GITHUB_API_TOKEN"
  fi
}

# Check GitHub rate limit and exit if it falls below thresholds
check_rate_limit() {
  require_jq
  local headers response remaining reset_time

  if [ -n "${GITHUB_TOKEN:-}" ]; then
    headers=( -H "Authorization: token $GITHUB_TOKEN" )
  fi

  response=$(curl -s -m 10 "${headers[@]}" https://api.github.com/rate_limit)
  remaining=$(echo "$response" | jq '.rate.remaining')
  reset_time=$(echo "$response" | jq -r '.rate.reset')

  if [ "$remaining" -lt 10 ]; then
    local reset_fmt
    reset_fmt=$(date -d @${reset_time} 2>/dev/null || date -r ${reset_time})
    echo "WARNING: GitHub rate limit low ($remaining). Resets at $reset_fmt." >&2
    if [ "$remaining" -lt 5 ]; then
      echo "ERROR: Exiting due to rate limit." >&2
      exit 1
    fi
  fi
}

# Get the latest release for a GitHub repo (owner/repo)
# Returns: tag|date on success or "ERROR|code" on failure
get_latest_release() {
  require_jq
  local repo_path="$1"
  local api_url="https://api.github.com/repos/$repo_path/releases/latest"
  local headers=()
  [ -n "${GITHUB_TOKEN:-}" ] && headers=( -H "Authorization: token $GITHUB_TOKEN" )

  local raw status body
  raw=$(curl -s -m 10 "${headers[@]}" -w "%{http_code}" "$api_url")
  status=${raw: -3}
  body=${raw:0:${#raw}-3}

  if [ "$status" -ne 200 ]; then
    # Add descriptive error codes
    local error_code="UNK"
    case "$status" in
      401) error_code="AUTH" ;; # Authentication failed
      403) 
        if [[ "$body" == *"rate limit"* ]]; then
          error_code="RATE" # Rate limit exceeded
        else
          error_code="PERM" # Permission denied
        fi
        ;;
      404) error_code="NOTF" ;; # Not found
      422) error_code="INVL" ;; # Invalid request
      500) error_code="SERV" ;; # Server error
      503) error_code="DOWN" ;; # Service unavailable
      *) error_code="HTTP$status" ;; # Other HTTP error
    esac
    echo "ERROR|$error_code|$status" && return 1
  fi

  local tag date
  tag=$(echo "$body" | jq -r '.tag_name // empty' | sed 's/^v//')
  date=$(echo "$body" | jq -r '.published_at // empty' | cut -d'T' -f1)

  [ -z "$tag" ] && echo "ERROR|no_version" && return 1
  echo "$tag|$date"
}

# Retry wrapper around get_latest_release with exponential backoff
# Usage: retry_api_call "owner/repo"
retry_api_call() {
  local repo="$1" attempt=1 max=3 result
  until [ $attempt -gt $max ]; do
    result=$(get_latest_release "$repo") && echo "$result" && return 0
    sleep $((2 ** attempt))
    attempt=$((attempt + 1))
  done
  # last result is an error
  echo "$result"
  return 1
}