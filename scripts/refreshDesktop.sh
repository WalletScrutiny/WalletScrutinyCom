#!/bin/bash

# Source the GitHub utilities
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
source "$SCRIPT_DIR/github_utils.sh"

# Default values
DETAILED_REPORT=false
GITHUB_TOKEN=""

# Parse command line arguments
while getopts "rg:" opt; do
  case $opt in
    r) DETAILED_REPORT=true ;;
    g) GITHUB_TOKEN="$OPTARG" ;;
    *) ;;
  esac
done

# Reset getopts
OPTIND=1

# Use the shared GitHub token parsing function
parse_github_token "$@"

# Show GitHub token usage message if not provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "\033[33mTo avoid rate limits: $0 -g YOUR_TOKEN  or  export GITHUB_TOKEN=YOUR_TOKEN\033[0m"
    
    # Check if GITHUB_TOKEN is in environment
    if [ ! -z "${GITHUB_TOKEN:-}" ]; then
        echo -e "\033[32mFound GITHUB_TOKEN in environment. Using that.\033[0m"
    fi
fi

# Notify about report mode
if [ "$DETAILED_REPORT" = true ]; then
    echo "Detailed report will be generated at the end of processing."
else
    echo "Tip: Run with -r flag to generate a detailed report of skipped files."
fi

# Set the directory containing the desktop wallet markdown files
DESKTOP_DIR="_desktop"
COUNT=0
UPDATED=0

# GitHub API rate limiting settings
API_DELAY=1       # Delay between API calls in seconds
MAX_RETRIES=3     # Maximum number of retries for rate-limited requests
RETRY_DELAY=5     # Delay between retries in seconds

# Initialize arrays for tracking skipped files
declare -a no_repo_files
declare -a wrong_verdict_files
declare -a verdict_reasons
declare -a fetch_failed_files
declare -a fetch_error_codes

# Function to extract value from frontmatter field
extract_field() {
    local file=$1
    local field=$2
    grep -m 1 "^$field: " "$file" | sed "s/^$field: //g"
}

# Function to update a value in a markdown file
update_value() {
    local file=$1
    local field=$2
    local old_value=$3
    local new_value=$4
    
    # Only update if the values are different
    if [ "$old_value" != "$new_value" ]; then
        sed -i "s/^$field: *$old_value *$/$field: $new_value/" "$file"
        # No message here, it's shown in the main loop
        UPDATED=$((UPDATED + 1))
    fi
}

# Use get_http_error_desc from github_utils.sh

# Function to get latest GitHub release version with rate limiting avoidance
get_latest_github_release() {
    local repo_url=$1
    local error_code=""
    
    # Extract owner and repo name from GitHub URL
    local repo_path=$(echo "$repo_url" | sed 's|https://github.com/||g')
    
    # Add a delay to avoid hitting rate limits
    sleep $API_DELAY
    
    # Use the shared function from github_utils.sh
    local result=$(retry_api_call "$repo_path")
    local status=$?
    
    # If request failed, return the error
    if [ $status -ne 0 ]; then
        echo "" # Empty version
        echo "$result" >&2 # Output error code to stderr
        return 1
    fi
    
    # Extract version from the result (format: tag|date)
    local latest_version=$(echo "$result" | cut -d'|' -f1)
    
    # If no version found
    if [ -z "$latest_version" ]; then
        echo "" # Empty version
        echo "NV:No version found" >&2 # Output error code to stderr
        return 1
    fi
    
    echo "$latest_version"
}

# Display progress indicator function
update_progress() {
    printf "\rProcessing files: %d" "$COUNT"
}

# Process each markdown file in the desktop directory
echo "Starting to process files..."
for file in "$DESKTOP_DIR"/*.md; do
    COUNT=$((COUNT + 1))
    filename=$(basename "$file")
    update_progress
    
    # Extract repository URL, current version, and verdict
    repo_url=$(extract_field "$file" "repository")
    current_version=$(extract_field "$file" "version")
    verdict=$(extract_field "$file" "verdict")
    
    # Skip if no repository URL
    if [ -z "$repo_url" ] || [ "$repo_url" = "false" ]; then
        no_repo_files+=("$filename")
        continue
    fi
    
    # Filter for specific verdicts
    if [[ "$verdict" != "sourceavailable" && "$verdict" != "wip" && "$verdict" != "reproducible" ]]; then
        wrong_verdict_files+=("$filename")
        verdict_reasons+=("$verdict")
        continue
    fi
    
    # Check if it's a GitHub repository
    if [[ "$repo_url" == *"github.com"* ]]; then
        # Get latest release version from GitHub and capture error code
        error_output=$(get_latest_github_release "$repo_url" 2>&1 1>/dev/null)
        latest_version=$(get_latest_github_release "$repo_url" 2>/dev/null)
        
        # Skip if couldn't get latest version
        if [ -z "$latest_version" ]; then
            # If we have an error code, use it
            if [ -n "$error_output" ]; then
                fetch_failed_files+=("$filename")
                fetch_error_codes+=("$error_output")
            else
                fetch_failed_files+=("$filename")
                fetch_error_codes+=("UNK") # Unknown error
            fi
            continue
        fi
        
        # Compare versions (simple string comparison for now)
        if [ "$current_version" != "$latest_version" ] && [ -n "$latest_version" ]; then
            echo -e "\nUpdating $(basename "$file")"
            echo "verdict: $verdict"
            echo -e "- version: $current_version\n+ \033[32mversion: $latest_version\033[0m"
            update_value "$file" "version" "$current_version" "$latest_version"
        fi
    else
        fetch_failed_files+=("$filename (not GitHub)")
    fi
done
echo -e "\n"

echo "Processing complete."
echo "Files processed: $COUNT"
echo "Files updated: $UPDATED"

# Generate detailed report if requested
if [ "$DETAILED_REPORT" = true ]; then
    echo -e "\n=== DETAILED REPORT ==="
    
    # Report files with no repository URL
    if [ ${#no_repo_files[@]} -gt 0 ]; then
        echo -e "\nFiles with no repository URL (${#no_repo_files[@]}):"
        for file in "${no_repo_files[@]}"; do
            echo "  - $file"
        done
    fi
    
    # Report files with wrong verdict
    if [ ${#wrong_verdict_files[@]} -gt 0 ]; then
        echo -e "\nFiles with non-matching verdict (${#wrong_verdict_files[@]}):"
        for i in "${!wrong_verdict_files[@]}"; do
            echo "  - ${wrong_verdict_files[$i]} (verdict: ${verdict_reasons[$i]})"
        done
    fi
    
    # Report files that failed to fetch version
    if [ ${#fetch_failed_files[@]} -gt 0 ]; then
        echo -e "\nFiles that failed to fetch latest version (${#fetch_failed_files[@]}):"
        echo "  Note: Error codes explained:"
        echo "    RL: Rate Limited - GitHub API rate limit reached"
        echo "    HTTP: HTTP Error - Server returned an error status"
        echo "    NV: No Version - No version tag found in repository"
        echo "    UNK: Unknown - Unexpected error occurred"
        
        for i in "${!fetch_failed_files[@]}"; do
            echo "  - ${fetch_failed_files[$i]} [${fetch_error_codes[$i]}]"
        done
        
        # Count error types
        rl_count=0
        http_count=0
        nv_count=0
        unk_count=0
        for code in "${fetch_error_codes[@]}"; do
            if [[ "$code" == RL* ]]; then
                rl_count=$((rl_count + 1))
            elif [[ "$code" == HTTP* ]]; then
                http_count=$((http_count + 1))
            elif [[ "$code" == NV* ]]; then
                nv_count=$((nv_count + 1))
            else
                unk_count=$((unk_count + 1))
            fi
        done
        
        echo -e "\n  Error breakdown:"
        echo "    Rate limited: $rl_count"
        echo "    HTTP errors: $http_count"
        echo "    No version: $nv_count"
        echo "    Unknown: $unk_count"
        
        if [ $rl_count -gt 0 ]; then
            echo -e "\n  GitHub API rate limit reached. The script attempted to work around this by:"
            echo "    - Adding delays between API calls ($API_DELAY seconds)"
            echo "    - Retrying rate-limited requests up to $MAX_RETRIES times"
            echo "    - Waiting $RETRY_DELAY seconds between retries"
            echo ""
            echo "  To avoid rate limiting in the future, you can:"
            echo "    1. Wait at least an hour before running again"
            echo "    2. Increase API_DELAY at the top of the script"
            echo "    3. Use a GitHub personal access token with the -g parameter"
        fi
    fi
    
    # Summary of skipped files
    total_skipped=$((${#no_repo_files[@]} + ${#wrong_verdict_files[@]} + ${#fetch_failed_files[@]}))
    echo -e "\nTotal files skipped: $total_skipped"
fi

# Display usage information
echo -e "\nUsage: $0 [-r] [-g TOKEN]"
echo "  -r  Generate detailed report of skipped files"
echo "  -g  GitHub Personal Access Token to avoid rate limits"
echo ""

exit 0
