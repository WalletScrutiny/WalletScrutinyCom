#!/usr/bin/env bash
# Nightly snapshot of the WalletScrutiny SQLite databases, then a copy to another server.
# Needs: sqlite3, zstd, rsync (only for the copy). See README.md.
#
# For every "name=path" in WS_BACKUP_DATABASES:
#   sqlite3 .backup (a consistent snapshot while the service keeps writing)
#   -> PRAGMA integrity_check -> zstd -> $WS_BACKUP_DIR/<name>/<name>-<UTC time>.db.zst
# then snapshots older than WS_BACKUP_KEEP_DAYS (21) are deleted and, if
# WS_BACKUP_PUSH_TARGET is set, the directory is mirrored with rsync.
# One failing database does not stop the others; the exit status is 1 if anything failed.
set -uo pipefail
umask 077

BACKUP_DIR="${WS_BACKUP_DIR:-/var/lib/walletscrutiny-db-backup}"
DATABASES="${WS_BACKUP_DATABASES:-verifications=/var/lib/walletscrutiny-build-server/verifications.db assets=/var/lib/walletscrutiny-source-analysis/assets.db notifications=/var/lib/walletscrutiny-ws-notifications/notifications.db}"
KEEP_DAYS="${WS_BACKUP_KEEP_DAYS:-21}"      # snapshots older than this are deleted (the newest is always kept)
PUSH_TARGET="${WS_BACKUP_PUSH_TARGET:-}"     # e.g. backup@host:/  (an rrsync-restricted key)
PUSH_SSH="${WS_BACKUP_PUSH_SSH:-ssh}"
PUSH_DELETE="${WS_BACKUP_PUSH_DELETE:-yes}"  # "yes": the remote copy mirrors this directory, so it keeps the same window; "no": it keeps everything

failed=0
log() { printf '%s\n' "$*"; }
err() { printf 'ERROR: %s\n' "$*" >&2; failed=1; }

mkdir -p "$BACKUP_DIR/.tmp" || { err "cannot create $BACKUP_DIR"; exit 1; }
tmp_dir="$BACKUP_DIR/.tmp"
trap 'rm -f "$tmp_dir"/*.db "$tmp_dir"/*.part' EXIT

snapshot() { # name path
  local name="$1" src="$2" stamp raw out
  if [ ! -f "$src" ]; then err "$name: $src does not exist"; return; fi
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  raw="$tmp_dir/$name.db"
  out="$BACKUP_DIR/$name/$name-$stamp.db.zst"
  mkdir -p "$BACKUP_DIR/$name"
  rm -f "$raw"
  if ! sqlite3 "$src" ".timeout 60000" ".backup '$raw'"; then err "$name: sqlite3 .backup failed"; return; fi
  local check
  check="$(sqlite3 "$raw" 'PRAGMA integrity_check;' 2>&1)"
  if [ "$check" != "ok" ]; then err "$name: integrity_check of the snapshot said: $check"; return; fi
  if ! zstd -q -19 -T0 -f -o "$tmp_dir/$name.part" "$raw" || ! zstd -tq "$tmp_dir/$name.part"; then
    err "$name: compression failed"; return
  fi
  mv "$tmp_dir/$name.part" "$out" && rm -f "$raw"
  log "$name: $(basename "$out") $(stat -c %s "$out") bytes"
}

prune() { # name: delete snapshots older than KEEP_DAYS, but never the newest one
  local name="$1" f base stamp cutoff first=1
  cutoff="$(date -u -d "$KEEP_DAYS days ago" +%Y%m%dT%H%M%SZ)" || { err "$name: cannot compute the retention cutoff"; return; }
  while IFS= read -r f; do        # newest first
    if [ "$first" = 1 ]; then first=0; continue; fi
    base="$(basename "$f")"
    stamp="${base#"$name"-}"; stamp="${stamp%.db.zst}"
    [[ "$stamp" =~ ^[0-9]{8}T[0-9]{6}Z$ ]] || continue
    [[ "$stamp" < "$cutoff" ]] && { rm -f "$f" && log "$name: pruned $(basename "$f")"; }
  done < <(ls -1 "$BACKUP_DIR/$name"/"$name"-*.db.zst 2>/dev/null | sort -r)
}

for entry in $DATABASES; do
  name="${entry%%=*}"; path="${entry#*=}"
  snapshot "$name" "$path"
  prune "$name"
done

if [ -n "$PUSH_TARGET" ]; then
  args=(-a --partial --exclude '/.tmp/' -e "$PUSH_SSH")
  [ "$PUSH_DELETE" != "no" ] && args+=(--delete --delete-excluded)
  if rsync "${args[@]}" "$BACKUP_DIR/" "$PUSH_TARGET"; then
    log "pushed to the remote copy"
  else
    err "rsync to the remote copy failed"
  fi
fi

exit "$failed"
