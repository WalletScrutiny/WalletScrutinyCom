#!/bin/bash

# refreshHardware.sh - Script to check for updates in hardware wallet files
# This script checks GitHub repositories for new releases and updates the corresponding files
# with the latest version and release date.

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Source the GitHub utilities
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
source "$SCRIPT_DIR/github_utils.sh"

# Variables
HARDWARE_DIR="_hardware"
GITHUB_TOKEN=""
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

# Use the shared GitHub token parsing function
parse_github_token "$@"

# Debug function
debug() {
    if [ "$DEBUG" = true ]; then
        echo -e "${YELLOW}DEBUG: $1${NC}"
    fi
}

# Function to check GitHub rate limit - wrapper around the shared function
check_rate_limit() {
    # Call the shared function from github_utils.sh
    if ! check_rate_limit; then
        echo -e "${RED}GitHub API rate limit check failed${NC}"
        
        if [ -z "$GITHUB_TOKEN" ]; then
            echo -e "${YELLOW}Consider using a GitHub token with -g parameter to avoid rate limiting.${NC}"
            echo "Create a token at: https://github.com/settings/tokens"
        fi
        
        exit 1
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

# Function to get latest release from GitHub API - wrapper around the shared function
get_latest_release() {
    local repo_path=$1
    
    # Call the shared function from github_utils.sh
    local result=$(get_latest_release "$repo_path")
    local status=$?
    
    # Check if the call was successful
    if [ $status -eq 0 ]; then
        debug "Latest release info: $result"
        echo "$result"
        return 0
    else
        debug "Failed to get latest release: $result"
        echo "$result"
        return 1
    fi
}

# Function to retry API calls with exponential backoff - wrapper around the shared function
retry_api_call() {
    local repo_path=$1
    
    debug "Attempting API call for $repo_path with retries"
    
    # Call the shared function from github_utils.sh
    local result=$(retry_api_call "$repo_path")
    local status=$?
    
    if [ $status -eq 0 ]; then
        debug "API call successful: $result"
        echo "$result"
        return 0
    else
        debug "API call failed after retries: $result"
        echo "$result"
        return 1
    fi
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
