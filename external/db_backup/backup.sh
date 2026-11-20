#!/usr/bin/env bash
# Nightly snapshot of the WalletScrutiny SQLite databases, then a copy to another server.
# Needs: sqlite3, zstd, rsync (only for the copy). See README.md.
#
# For every "name=path" in WS_BACKUP_DATABASES:
#   sqlite3 .backup (a consistent snapshot while the service keeps writing)
#   -> PRAGMA integrity_check -> zstd -> $WS_BACKUP_DIR/<name>/<name>-<UTC time>.db.zst
# then the newest snapshots are kept (see WS_BACKUP_KEEP_*) and, if
# WS_BACKUP_PUSH_TARGET is set, the whole directory is copied with rsync.
# One failing database does not stop the others; the exit status is 1 if anything failed.
set -uo pipefail
umask 077

BACKUP_DIR="${WS_BACKUP_DIR:-/var/lib/walletscrutiny-db-backup}"
DATABASES="${WS_BACKUP_DATABASES:-verifications=/var/lib/walletscrutiny-build-server/verifications.db assets=/var/lib/walletscrutiny-source-analysis/assets.db notifications=/var/lib/walletscrutiny-ws-notifications/notifications.db}"
KEEP_NEWEST="${WS_BACKUP_KEEP_NEWEST:-14}"   # newest snapshots per database
KEEP_WEEKS="${WS_BACKUP_KEEP_WEEKS:-8}"      # plus the newest snapshot of each of this many weeks
PUSH_TARGET="${WS_BACKUP_PUSH_TARGET:-}"     # e.g. backup@host:/  (an rrsync-restricted key)
PUSH_SSH="${WS_BACKUP_PUSH_SSH:-ssh}"
PUSH_DELETE="${WS_BACKUP_PUSH_DELETE:-}"     # "yes": the copy mirrors this directory's retention

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

prune() { # name: keep the newest KEEP_NEWEST, plus the newest snapshot of each of the last KEEP_WEEKS weeks
  local name="$1" f base stamp week n=0
  local -a files=()
  local -A seen_week=() keep=()
  mapfile -t files < <(ls -1 "$BACKUP_DIR/$name"/"$name"-*.db.zst 2>/dev/null | sort -r)
  for f in "${files[@]}"; do      # newest first
    n=$((n + 1))
    [ "$n" -le "$KEEP_NEWEST" ] && keep[$f]=1
    base="$(basename "$f")"
    stamp="${base#"$name"-}"
    week="$(date -u -d "${stamp:0:4}-${stamp:4:2}-${stamp:6:2}" +%G-%V 2>/dev/null)" || continue
    if [ -z "${seen_week[$week]:-}" ] && [ "${#seen_week[@]}" -lt "$KEEP_WEEKS" ]; then
      seen_week[$week]=1
      keep[$f]=1
    fi
  done
  for f in "${files[@]}"; do
    [ -n "${keep[$f]:-}" ] || { rm -f "$f" && log "$name: pruned $(basename "$f")"; }
  done
}

for entry in $DATABASES; do
  name="${entry%%=*}"; path="${entry#*=}"
  snapshot "$name" "$path"
  prune "$name"
done

if [ -n "$PUSH_TARGET" ]; then
  args=(-a --partial --exclude '/.tmp/' -e "$PUSH_SSH")
  [ "$PUSH_DELETE" = "yes" ] && args+=(--delete --delete-excluded)
  if rsync "${args[@]}" "$BACKUP_DIR/" "$PUSH_TARGET"; then
    log "pushed to the remote copy"
  else
    err "rsync to the remote copy failed"
  fi
fi

exit "$failed"
