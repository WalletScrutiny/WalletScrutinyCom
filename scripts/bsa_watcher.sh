#!/usr/bin/env bash
#
# bsa_watcher.sh - Build Server Automation Log Watcher
# Version: v0.2.1
# Organization: WalletScrutiny.com
#
# Description:
#   Real-time monitoring tool for build server automation logs.
#   Displays build events, YAML results, and Nostr event URLs.
#
# Usage:
#   ./bsa_watcher.sh
#
# Requirements:
#   - logs/app*.log and logs/verifications*.log must exist
#   - GNU awk (gawk) for strftime() support
#   - inotifywait (optional, for real-time YAML monitoring)
#
set -euo pipefail
cd "$(dirname "$0")/.."  # repo root

BUILD_DIR="external/build_server_build_dir"
EVENT_COUNTER=0

# Print header
cat << 'EOF'
================================================================================
Build Server Automation Watcher v0.2.1
================================================================================

OUTPUT LEGEND:
  - START      mainProcess begins
  - QUEUE      Jobs queued (appId, arch, type, version)
  - RESULT     Build results (reproducible/not_reproducible)
  - DONE       Verification published
  - YAML       COMPARISON_RESULTS.yaml contents
  - NOSTR      Published verification event URLs

================================================================================
EOF

LOGS=($(ls logs/app*.log logs/verifications*.log 2>/dev/null || true))
if [ ${#LOGS[@]} -eq 0 ]; then
  echo "ERROR: No log files found in logs/" >&2
  exit 1
fi

# Background process to monitor COMPARISON_RESULTS.yaml files
yaml_monitor() {
  if command -v inotifywait >/dev/null 2>&1; then
    # Use inotifywait for real-time monitoring
    while true; do
      inotifywait -q -e create -e moved_to -r "$BUILD_DIR" 2>/dev/null | while read -r dir action file; do
        if [[ "$file" == "COMPARISON_RESULTS.yaml" ]]; then
          local yaml_path="${dir}${file}"
          local app_dir=$(basename "$(dirname "$yaml_path")")
          echo ""
          echo "╔════════════════════════════════════════════════════════════════════════════╗"
          echo "║ YAML: $app_dir"
          echo "╚════════════════════════════════════════════════════════════════════════════╝"
          cat "$yaml_path" 2>/dev/null || echo "  (file already deleted)"
          echo ""
        fi
      done
    done
  else
    # Fallback: periodic checking
    local seen_files=()
    while true; do
      sleep 2
      shopt -s nullglob  # Make non-matching globs expand to nothing
      for yaml in "$BUILD_DIR"/*/COMPARISON_RESULTS.yaml; do
        [[ -f "$yaml" ]] || continue
        local yaml_path="$yaml"
        # Check if we've seen this file
        local found=0
        for seen in "${seen_files[@]}"; do
          [[ "$seen" == "$yaml_path" ]] && found=1 && break
        done
        if [[ $found -eq 0 ]]; then
          seen_files+=("$yaml_path")
          local app_dir=$(basename "$(dirname "$yaml_path")")
          echo ""
          echo "╔════════════════════════════════════════════════════════════════════════════╗"
          echo "║ YAML: $app_dir"
          echo "╚════════════════════════════════════════════════════════════════════════════╝"
          cat "$yaml_path" 2>/dev/null || echo "  (file already deleted)"
          echo ""
        fi
      done
    done
  fi
}

# Start YAML monitor in background
yaml_monitor &
YAML_MONITOR_PID=$!

# Cleanup on exit
trap "kill $YAML_MONITOR_PID 2>/dev/null || true" EXIT

# Main log watcher with enhanced event parsing
stdbuf -oL tail -F "${LOGS[@]}" | awk -v event_counter=0 '
  BEGIN {
    pending_head = 1;
    pending_tail = 0;
  }
  /Starting mainProcess/ {
    printf "%s START mainProcess\n", strftime("[%Y-%m-%d %H:%M:%S]");
    next
  }
  /Add job to queue:/ {
    match($0,/build_dir\/([^_]+)_/,app);  # appId from path segment
    match($0,/architecture: ([^,]+)/,a);
    match($0,/type: ([^,]+)/,b);
    match($0,/new wallet version: ([^ ]+)/,c);
    printf "%s QUEUE %s %s %s %s\n", strftime("[%Y-%m-%d %H:%M:%S]"), (app[1]?app[1]:"app?"), a[1], b[1], c[1];
    next
  }
  /Published verification \(id:/ {
    match($0,/id: ([a-f0-9]+)\)/,id);
    match($0,/to ([0-9]+) relay/,relays);
    pending_tail++;
    event_ids[pending_tail] = (id[1] ? id[1] : "?");
    event_relays[pending_tail] = (relays[1] ? relays[1] : "?");
    next
  }
  /\\+\\+\\+ .* \\| Verification created:/ {
    match($0,/\\+\\+\\+ ([^ ]+) ([^ ]+)/,app);
    match($0,/Verification created: ([^ ]+) ([^ ]+) ([^ ]+)( [^ ]+)?/,a);
    event_counter++;
    current_id = (pending_head <= pending_tail ? event_ids[pending_head] : "?");
    current_relays = (pending_head <= pending_tail ? event_relays[pending_head] : "?");
    if (pending_head <= pending_tail) { pending_head++; }
    printf "\n";
    printf "╔════════════════════════════════════════════════════════════════════════════╗\n";
    printf "║ NOSTR EVENT #%d\n", event_counter;
    printf "╚════════════════════════════════════════════════════════════════════════════╝\n";
    printf "  Event ID: %s\n", current_id;
    printf "  Relays:   %s\n", current_relays;
    printf "  URL:      https://njump.me/%s\n", current_id;
    printf "  App:      %s\n", (app[1] ? app[1] : "unknown");
    printf "  Version:  %s\n", (app[2] ? app[2] : "unknown");
    printf "  Arch:     %s\n", (a[1] ? a[1] : "unknown");
    printf "  Type:     %s\n", (a[2] ? a[2] : "unknown");
    printf "  Verdict:  %s\n", (a[3] ? a[3] : "unknown");
    printf "\n";
    if (app[1] && a[3]) {
      printf "%s RESULT %s v%s %s %s %s\n", strftime("[%Y-%m-%d %H:%M:%S]"), app[1], app[2], (a[1]?a[1]:"*"), (a[2]?a[2]:"*"), a[3];
    }
    next
  }
  /Queue info - Waiting/ {
    match($0,/Waiting \(([^)]+)\).*Running \(([^)]+)\)/,a);
    printf "%s QUEUE waiting=%s running=%s\n", strftime("[%Y-%m-%d %H:%M:%S]"), a[1], a[2];
    next
  }
'
