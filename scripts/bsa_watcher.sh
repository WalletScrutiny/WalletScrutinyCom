#!/usr/bin/env bash
#
# bsa_watcher.sh - Build Server Automation Log Watcher
# Version: v0.1.0
# Organization: WalletScrutiny.com
#
# Description:
#   Real-time monitoring tool for build server automation logs.
#   Parses app.log and verifications.log to emit concise event summaries:
#   - START: mainProcess begins
#   - QUEUE: Jobs added/status
#   - RESULT: Verification results
#   - DONE: Verification published
#
# Usage:
#   ./bsa_watcher.sh
#
# Requirements:
#   - logs/app*.log and logs/verifications*.log must exist
#   - GNU awk (gawk) for strftime() support
#
set -euo pipefail
cd "$(dirname "$0")/.."  # repo root

LOGS=($(ls logs/app*.log logs/verifications*.log 2>/dev/null || true))
if [ ${#LOGS[@]} -eq 0 ]; then
  echo "No log files found in logs/" >&2
  exit 1
fi

stdbuf -oL tail -F "${LOGS[@]}" | awk '
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
  /Verification created:/ {
    match($0,/^\\+\\+\\+ ([^ ]+) ([^ ]+)/,app);                   # appId, version
    match($0,/Verification created: ([^ ]*) ([^ ]*) ([^ ]*)/,a); # arch, type, status
    printf "%s DONE %s %s %s %s\n", strftime("[%Y-%m-%d %H:%M:%S]"), (app[1]?app[1]:"app?"), a[1], a[2], a[3];
    next
  }
  /\\+\\+\\+ .* \\| Verification created:/ {
    match($0,/^\\+\\+\\+ ([^ ]+) ([^ ]+)/,app);
    match($0,/Verification created: ([^ ]*) ([^ ]*) ([^ ]*)/,a);
    if (app[1] && a[3]) {
      printf "%s RESULT %s %s %s %s\n", strftime("[%Y-%m-%d %H:%M:%S]"), app[1], a[1], a[2], a[3];
    }
    next
  }
  /Queue info - Waiting/ {
    match($0,/Waiting \(([^)]+)\).*Running \(([^)]+)\)/,a);
    printf "%s QUEUE waiting=%s running=%s\n", strftime("[%Y-%m-%d %H:%M:%S]"), a[1], a[2];
    next
  }
'
