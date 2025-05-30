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
  
  # Debug output if token is present
  if [ -n "$GITHUB_TOKEN" ]; then
    echo "Using GitHub token: ${GITHUB_TOKEN:0:4}..." >&2
  else
    echo "No GitHub token provided. API rate limits may apply." >&2
  fi
}

# =============================================================================
# Enhanced GitHub API functions from MR 462
# =============================================================================

# Fetch tags from a GitHub repository with proper error handling
# Usage: fetch_github_tags "owner" "repo" [per_page]
# Returns: JSON array of tags or error message
fetch_github_tags() {
  local owner="$1"
  local repo="$2"
  local per_page="${3:-100}"
  
  local response
  response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$owner/$repo/tags?per_page=$per_page")
  
  # Check for errors
  if echo "$response" | jq -e 'has("message")' > /dev/null 2>&1; then
    handle_github_error "$response"
    return $?
  fi
  
  echo "$response"
  return 0
}

# Extract version from tag name using optional pattern
# Usage: extract_version_from_tag "tag_name" [pattern]
# Returns: Extracted version or original tag if no match
extract_version_from_tag() {
  local tag="$1"
  local pattern="$2"
  
  if [[ -n "$pattern" ]]; then
    if [[ "$tag" =~ $pattern ]]; then
      echo "${BASH_REMATCH[1]}"
    else
      echo "$tag"
    fi
  else
    # Default: extract any version pattern
    if [[ "$tag" =~ ([0-9]+\.[0-9]+\.[0-9]+) ]]; then
      echo "${BASH_REMATCH[0]}"
    else
      echo "$tag"
    fi
  fi
}

# Handle GitHub API errors with appropriate messages
# Usage: handle_github_error "response_json"
# Returns: 1 for general errors, 2 for rate limit errors
handle_github_error() {
  local response="$1"
  local error_msg
  error_msg=$(echo "$response" | jq -r '.message')
  
  if [[ "$error_msg" == *"API rate limit exceeded"* ]]; then
    local rate_limit
    rate_limit=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
      "https://api.github.com/rate_limit")
    
    local reset_time
    reset_time=$(echo "$rate_limit" | jq -r '.resources.core.reset')
    local reset_date
    reset_date=$(date -d "@$reset_time" +"%H:%M:%S")
    
    echo "GitHub API rate limit exceeded. Resets at $reset_date" >&2
    return 2
  else
    echo "GitHub API error: $error_msg" >&2
    return 1
  fi
}

# Get the date of a specific commit
# Usage: get_commit_date "owner" "repo" "commit_sha"
# Returns: Commit date in ISO format
get_commit_date() {
  local owner="$1"
  local repo="$2"
  local commit_sha="$3"
  
  local commit
  commit=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$owner/$repo/commits/$commit_sha")
  
  if echo "$commit" | jq -e 'has("message")' > /dev/null 2>&1; then
    handle_github_error "$commit"
    return $?
  fi
  
  echo "$commit" | jq -r '.commit.author.date'
  return 0
}

# Find tags matching a specific pattern
# Usage: match_tags_by_pattern "tags_json" "regex_pattern"
# Returns: Name of the latest matching tag or empty string
match_tags_by_pattern() {
  local tags_json="$1"
  local pattern="$2"
  
  echo "$tags_json" | jq -r --arg pattern "$pattern" \
    '[.[] | select(.name | test($pattern))] | sort_by(.name) | reverse | .[0].name // ""'
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