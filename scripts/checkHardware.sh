#!/bin/bash

# checkHardware.sh - Script to check for updates in hardware wallet files
# This script checks GitHub repositories for new releases and updates the corresponding files
# with the latest version and release date.

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
HARDWARE_DIR="/home/dannybuntu/work/walletScrutinyCom/_hardware"
GITHUB_TOKEN=""
RATE_LIMIT_REMAINING=0
RATE_LIMIT_RESET=0
FILES_ANALYZED=0
FILES_UPDATED=0
FILES_SKIPPED=0
SKIPPED_REASONS=()
DEBUG=false

# Function to display usage information
usage() {
    echo "Usage: $0 [-g GITHUB_TOKEN] [-d]"
    echo "  -g GITHUB_TOKEN    GitHub Personal Access Token to avoid rate limiting"
    echo "  -d                 Enable debug mode"
    exit 1
}

# Parse command line arguments
while getopts "g:d" opt; do
    case $opt in
        g)
            GITHUB_TOKEN=$OPTARG
            ;;
        d)
            DEBUG=true
            ;;
        *)
            usage
            ;;
    esac
done

# Check if GitHub token is provided or available in environment
if [ -z "$GITHUB_TOKEN" ]; then
    if [ ! -z "$GITHUB_API_TOKEN" ]; then
        GITHUB_TOKEN=$GITHUB_API_TOKEN
    fi
fi

# Debug function
debug() {
    if [ "$DEBUG" = true ]; then
        echo -e "${YELLOW}DEBUG: $1${NC}"
    fi
}

# Function to check GitHub rate limit
check_rate_limit() {
    local response
    local auth_header=""

    # Ensure jq is installed
    if ! command -v jq >/dev/null 2>&1; then
        echo -e "${RED}The jq utility is required for this script to run.${NC}"
        echo -e "${YELLOW}Install it with: sudo apt install jq${NC}"
        exit 1
    fi

    # Set up authorization header if token is provided
    if [ -n "$GITHUB_TOKEN" ]; then
        auth_header="Authorization: token $GITHUB_TOKEN"
        debug "Using GitHub token for rate limit check"
    else
        debug "No GitHub token provided for rate limit check"
    fi

    # Make API request with proper timeout
    if [ -n "$auth_header" ]; then
        response=$(curl -s -m 10 -H "$auth_header" https://api.github.com/rate_limit)
    else
        response=$(curl -s -m 10 https://api.github.com/rate_limit)
    fi

    if [ "$DEBUG" = true ]; then
        debug "Rate limit API response: $response"
    fi

    # Check if we got a valid response
    if [[ -z "$response" || "$response" != *"rate"* ]]; then
        echo -e "${RED}Failed to get rate limit information from GitHub API${NC}"
        RATE_LIMIT_REMAINING=0
        return 1
    fi

    # Use jq to extract rate limit information
    RATE_LIMIT_REMAINING=$(echo "$response" | jq '.rate.remaining')
    RATE_LIMIT_RESET=$(echo "$response" | jq '.rate.reset')

    debug "Rate limit remaining: $RATE_LIMIT_REMAINING"
    debug "Rate limit reset: $RATE_LIMIT_RESET"

    # Check if rate limit is low
    if [ -z "$RATE_LIMIT_REMAINING" ] || [ "$RATE_LIMIT_REMAINING" -lt 10 ]; then
        local reset_time="unknown time"
        if [ "$RATE_LIMIT_RESET" -gt 0 ]; then
            reset_time=$(date -d @$RATE_LIMIT_RESET 2>/dev/null || date -r $RATE_LIMIT_RESET 2>/dev/null)
        fi

        echo -e "${RED}GitHub API rate limit nearly exhausted. Limit will reset at: $reset_time${NC}"

        if [ -z "$GITHUB_TOKEN" ]; then
            echo -e "${YELLOW}Consider using a GitHub token with -g parameter to avoid rate limiting.${NC}"
            echo "Create a token at: https://github.com/settings/tokens"
        fi

        if [ -z "$RATE_LIMIT_REMAINING" ] || [ "$RATE_LIMIT_REMAINING" -lt 5 ]; then
            echo -e "${RED}Exiting due to API rate limit.${NC}"
            exit 1
        fi
    fi

    return 0
}

# Function to extract front matter field
extract_field() {
    local file=$1
    local field=$2
    grep -m 1 "^$field:" "$file" | sed "s/^$field: *//;s/[\"']//g"
}

# Function to update a field in the front matter
update_field() {
    local file=$1
    local field=$2
    local old_value=$3
    local new_value=$4

    if [ "$old_value" != "$new_value" ]; then
        # Use perl with different delimiters to avoid issues with slashes in version strings
        perl -i -pe "s|^$field: .*|$field: $new_value|" "$file"
        echo -e "- '$field: $old_value'"
        echo -e "+ '$field: $new_value'"
        return 0
    fi
    return 1
}

# Function to get latest release from GitHub API
get_latest_release() {
    local repo=$1
    local api_url="https://api.github.com/repos/$repo/releases/latest"
    local response
    local status_code
    local auth_header=""

    debug "Getting latest release for repo: $repo"
    debug "API URL: $api_url"

    # Set up authorization header if token is provided
    if [ -n "$GITHUB_TOKEN" ]; then
        auth_header="Authorization: token $GITHUB_TOKEN"
        debug "Using GitHub token for API request"
    else
        debug "No GitHub token provided for API request"
    fi

    # Make API request with proper timeout to avoid hanging
    if [ -n "$auth_header" ]; then
        response=$(curl -s -m 10 -w "%{http_code}" -H "$auth_header" "$api_url")
    else
        response=$(curl -s -m 10 -w "%{http_code}" "$api_url")
    fi

    # Extract status code from response
    status_code=${response: -3}
    response=${response:0:${#response}-3}

    debug "API response status code: $status_code"

    if [ "$DEBUG" = true ]; then
        debug "API response (truncated): ${response:0:100}..."
    fi

    # Handle HTTP errors
    if [ "$status_code" != "200" ]; then
        case $status_code in
            404)
                echo "ERROR|$status_code: Repository not found or no releases available."
            ;;
            403)
                echo "ERROR|$status_code: API rate limit exceeded or access forbidden."
                check_rate_limit
            ;;
            401)
                echo "ERROR|$status_code: Unauthorized. Check your GitHub token."
            ;;
            000)
                echo "ERROR|$status_code: Connection timeout or network issue."
            ;;
            *)
                echo "ERROR|$status_code: HTTP status $status_code when accessing GitHub API."
            ;;
        esac
        return 1
    fi

    # Check for empty response
    if [ -z "$response" ]; then
        echo "ERROR: Empty response from GitHub API."
        return 1
    fi

    # Try to find releases in the response
    if [[ ! "$response" == *"tag_name"* ]]; then
        echo "ERROR: No releases found in the GitHub API response."
        return 1
    fi

    # Extract version and date using jq
    local version=$(echo "$response" | jq -r '.tag_name // .[0].tag_name // empty')
    local published_date=$(echo "$response" | jq -r '.published_at // .[0].published_at // empty' | cut -d'T' -f1)
    
    # Debug the extracted version
    debug "Raw extracted version: $version"

    debug "Extracted version: $version"
    debug "Extracted date: $published_date"

    if [ -z "$version" ]; then
        echo "ERROR: Could not extract version from GitHub API response."
        return 1
    fi

    if [ -z "$published_date" ]; then
        echo "WARNING: Could not extract published date, using today's date."
        published_date=$(date +%Y-%m-%d)
    fi

    echo "$version|$published_date"
    return 0
}

# Function to retry API calls with exponential backoff
retry_api_call() {
    local repo=$1
    local max_attempts=3
    local attempt=1
    local result
    local status_code

    while [ $attempt -le $max_attempts ]; do
        # Pass both result and status code back using a delimiter
        result=$(get_latest_release "$repo")
        status=$?
        
        # Extract status code if present (format: ERROR|404)
        if [[ "$result" == ERROR\|* ]]; then
            status_code=$(echo "$result" | cut -d'|' -f2)
            result="ERROR"
        else
            status_code=""
        fi
        
        if [ $status -eq 0 ]; then
            echo "$result"
            return 0
        fi

        # Only show retry message if not on last attempt
        if [ $attempt -lt $max_attempts ]; then
            echo -e "${YELLOW}Attempt $attempt failed. Retrying in $((2**attempt)) seconds...${NC}"
            sleep $((2**attempt))
        fi
        ((attempt++))
    done

    # Return both error and status code
    if [ -n "$status_code" ]; then
        echo "ERROR|$status_code"
    else
        echo "ERROR"
    fi
    return 1
}

# Main function to process hardware wallet files
process_files() {
    # Check rate limit before starting
    check_rate_limit

    # Process all markdown files in the hardware directory
    for file in "$HARDWARE_DIR"/*.md; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}No hardware wallet files found in $HARDWARE_DIR${NC}"
            return 1
        fi

        ((FILES_ANALYZED++))

        # Extract verdict
        verdict=$(extract_field "$file" "verdict")

        # Check if verdict matches our criteria
        if [[ "$verdict" == "reproducible" || "$verdict" == "sourceavailable" || "$verdict" == "wip" ]]; then
            # Extract repository URL
            repo_url=$(extract_field "$file" "repository")

            # Skip if no repository URL
            if [ -z "$repo_url" ] || [ "$repo_url" == "https://github.com/" ]; then
                ((FILES_SKIPPED++))
                SKIPPED_REASONS+=("$(basename "$file"): Missing or invalid repository URL")
                continue
            fi

            # Extract GitHub repo path from URL
            repo_path=$(echo "$repo_url" | sed -E 's|https://github.com/||;s|/$||')

            # Skip if not a GitHub repository
            if [ -z "$repo_path" ]; then
                ((FILES_SKIPPED++))
                SKIPPED_REASONS+=("$(basename "$file"): Not a GitHub repository")
                continue
            fi

            # Extract current version and updated date
            current_version=$(extract_field "$file" "version")
            current_updated=$(extract_field "$file" "updated")

            echo -e "${BLUE}Processing $(basename "$file")${NC}"
            echo "current 'verdict: $verdict'"

            # Get latest release info
            release_info=$(retry_api_call "$repo_path")
            if [ $? -ne 0 ]; then
                # Extract status code if present
                status_code=""
                if [[ "$release_info" == ERROR\|* ]]; then
                    status_code=$(echo "$release_info" | cut -d'|' -f2)
                fi
                
                # Display error with status code and repository URL
                if [ -n "$status_code" ]; then
                    echo -e "${RED}Failed to get latest release for $repo_path ($status_code)${NC}"
                else
                    echo -e "${RED}Failed to get latest release for $repo_path${NC}"
                fi
                echo -e "${YELLOW}Repository URL: https://github.com/$repo_path${NC}"
                
                ((FILES_SKIPPED++))
                SKIPPED_REASONS+=("$(basename "$file"): Failed to get latest release")
                continue
            fi

            # Extract version and date from release info
            IFS='|' read -r latest_version release_date <<< "$release_info"

            # Update version and date if different
            updated=false

            if [ "$current_version" != "$latest_version" ] && [ -n "$latest_version" ]; then
                update_field "$file" "version" "$current_version" "$latest_version"
                update_field "$file" "updated" "$current_updated" "$release_date"
                updated=true
                ((FILES_UPDATED++))
                echo -e "${GREEN}Updated to latest version.${NC}"
                echo ""
            else
                echo -e "${YELLOW}Already up to date.${NC}"
                echo ""
            fi

            # Check rate limit after each API call
            check_rate_limit
        else
            ((FILES_SKIPPED++))
            SKIPPED_REASONS+=("$(basename "$file"): Verdict not in criteria (current: $verdict)")
        fi
    done
}

# Run the main function
process_files

# Print summary
echo -e "${BLUE}===== Summary =====${NC}"
echo "Number of files analyzed: $FILES_ANALYZED"
echo "Number of files updated: $FILES_UPDATED"
echo "Number of files skipped/errored: $FILES_SKIPPED"

if [ ${#SKIPPED_REASONS[@]} -gt 0 ]; then
    echo -e "${YELLOW}Reasons for skipping:${NC}"
    for reason in "${SKIPPED_REASONS[@]}"; do
        echo "- $reason"
    done
fi

exit 0
