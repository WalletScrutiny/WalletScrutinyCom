#!/usr/bin/env bash
# ==============================================================================
# dryrunreport.sh - Build Server Dry Run Results Monitor
# ==============================================================================
# Purpose: Monitor and display build server verification results from dry run
# Usage:   ./dryrunreport.sh [--watch] [--app <appId>]
# ==============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_SERVER_DIR="$PROJECT_ROOT/external/build_server"
LOGS_DIR="$BUILD_SERVER_DIR/logs"
BUILD_DIR_PREFIX="$PROJECT_ROOT/external/build_server_build_dir"

# Options
WATCH_MODE=false
FILTER_APP=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --watch|-w)
            WATCH_MODE=true
            shift
            ;;
        --app|-a)
            FILTER_APP="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --watch, -w          Watch mode (refresh every 5 seconds)"
            echo "  --app, -a <appId>    Filter by app ID (e.g., bitcoincore, electrum)"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $(basename "$0")                    # Show all results once"
            echo "  $(basename "$0") --watch            # Watch mode"
            echo "  $(basename "$0") --app bitcoincore  # Filter by app"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Function to display header
show_header() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}          ${BLUE}Build Server Dry Run - Verification Results${NC}              ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Last updated: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    if [[ -n "$FILTER_APP" ]]; then
        echo -e "${YELLOW}Filtering: $FILTER_APP${NC}"
    fi
    echo ""
}

# Function to get latest verification log
get_verification_results() {
    local log_file
    log_file=$(ls -t "$LOGS_DIR"/verifications-*.log 2>/dev/null | head -1)
    
    if [[ -z "$log_file" ]]; then
        echo -e "${RED}No verification logs found${NC}"
        return 1
    fi
    
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Recent Verifications:${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Parse verification log
    local filter_pattern="."
    if [[ -n "$FILTER_APP" ]]; then
        filter_pattern="$FILTER_APP"
    fi
    
    tail -100 "$log_file" | grep -E "(\+\+\+|---)" | grep "$filter_pattern" | while IFS= read -r line; do
        if [[ $line == *"+++"* ]]; then
            # Success line
            if [[ $line == *"reproducible"* ]]; then
                echo -e "${GREEN}✓${NC} $line" | sed 's/+++//'
            else
                echo -e "${YELLOW}⚠${NC} $line" | sed 's/+++//'
            fi
        elif [[ $line == *"---"* ]]; then
            # Error line
            echo -e "${RED}✗${NC} $line" | sed 's/---//'
        fi
    done
    
    echo ""
}

# Function to show YAML results
show_yaml_results() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Latest COMPARISON_RESULTS.yaml Files:${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Find latest YAML files
    local yaml_files
    yaml_files=$(find "$BUILD_DIR_PREFIX"* -name "COMPARISON_RESULTS.yaml" -type f 2>/dev/null | head -10)
    
    if [[ -z "$yaml_files" ]]; then
        echo -e "${YELLOW}No COMPARISON_RESULTS.yaml files found yet${NC}"
        echo ""
        return
    fi
    
    echo "$yaml_files" | while IFS= read -r yaml_file; do
        local dir_name
        dir_name=$(basename "$(dirname "$yaml_file")")
        
        # Extract key info from YAML
        local app_id version status
        app_id=$(grep "^app_id:" "$yaml_file" 2>/dev/null | awk '{print $2}' || echo "unknown")
        version=$(grep "^version:" "$yaml_file" 2>/dev/null | awk '{print $2}' || echo "unknown")
        status=$(grep "^status:" "$yaml_file" 2>/dev/null | awk '{print $2}' || echo "unknown")
        
        # Apply filter
        if [[ -n "$FILTER_APP" ]] && [[ "$app_id" != "$FILTER_APP" ]]; then
            continue
        fi
        
        # Color code status
        local status_display
        case "$status" in
            reproducible)
                status_display="${GREEN}✓ REPRODUCIBLE${NC}"
                ;;
            not_reproducible)
                status_display="${RED}✗ NOT REPRODUCIBLE${NC}"
                ;;
            ftbfs)
                status_display="${YELLOW}⚠ FTBFS${NC}"
                ;;
            *)
                status_display="${YELLOW}? $status${NC}"
                ;;
        esac
        
        echo -e "  ${BLUE}$app_id${NC} v$version - $status_display"
        echo -e "    ${CYAN}File:${NC} $yaml_file"
        echo ""
    done
}

# Function to show queue status
show_queue_status() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Build Queue Status:${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    local app_log
    app_log=$(ls -t "$LOGS_DIR"/app-*.log 2>/dev/null | head -1)
    
    if [[ -z "$app_log" ]]; then
        echo -e "${YELLOW}No app logs found${NC}"
        echo ""
        return
    fi
    
    # Get latest queue info
    local queue_info
    queue_info=$(tail -50 "$app_log" | grep "Queue info" | tail -1)
    
    if [[ -n "$queue_info" ]]; then
        echo -e "  $queue_info"
    else
        echo -e "${YELLOW}No queue information available${NC}"
    fi
    
    echo ""
}

# Function to show summary
show_summary() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Summary:${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    local log_file
    log_file=$(ls -t "$LOGS_DIR"/verifications-*.log 2>/dev/null | head -1)
    
    if [[ -z "$log_file" ]]; then
        echo -e "${YELLOW}No data available${NC}"
        echo ""
        return
    fi
    
    local total reproducible not_reproducible failed
    total=$(tail -200 "$log_file" | grep -c "+++" || echo "0")
    reproducible=$(tail -200 "$log_file" | grep "+++" | grep -c "reproducible" || echo "0")
    not_reproducible=$(tail -200 "$log_file" | grep "+++" | grep -c "not_reproducible" || echo "0")
    failed=$(tail -200 "$log_file" | grep -c "---" || echo "0")
    
    echo -e "  ${BLUE}Total Verifications:${NC} $total"
    echo -e "  ${GREEN}Reproducible:${NC}        $reproducible"
    echo -e "  ${RED}Not Reproducible:${NC}    $not_reproducible"
    echo -e "  ${YELLOW}Failed:${NC}              $failed"
    echo ""
}

# Main display function
display_report() {
    show_header
    get_verification_results
    show_yaml_results
    show_queue_status
    show_summary
    
    if [[ "$WATCH_MODE" == true ]]; then
        echo -e "${CYAN}Watching... (Press Ctrl+C to exit)${NC}"
    fi
}

# Main execution
if [[ "$WATCH_MODE" == true ]]; then
    while true; do
        display_report
        sleep 5
    done
else
    display_report
fi
