#!/usr/bin/env bash
# Simple watcher for build server runs: emits one line per event from logs
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
  /reproducible|not_reproducible/ && / \\| / {
    # Example verifications log: "+++ app version | Verification created: arch type reproducible ..."
    match($0,/^\\+\\+\\+ ([^ ]+) ([^ ]+)/,app);                      # appId, version
    match($0,/\\| Verification created: ([^ ]*) ([^ ]*) ([^ ]*)/,a); # arch, type, status
    if (app[1] && a[1]) {
      printf "%s RESULT %s %s %s %s\n", strftime("[%Y-%m-%d %H:%M:%S]"), app[1], a[1], a[2], a[3];
    } else {
      gsub("\\|","",$0);
      printf "%s RESULT %s\n", strftime("[%Y-%m-%d %H:%M:%S]"), $0;
    }
    next
  }
  /Queue info - Waiting/ {
    match($0,/Waiting \(([^)]+)\).*Running \(([^)]+)\)/,a);
    printf "%s QUEUE waiting=%s running=%s\n", strftime("[%Y-%m-%d %H:%M:%S]"), a[1], a[2];
    next
  }
'
