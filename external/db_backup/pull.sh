#!/usr/bin/env bash
# Run on your own machine: bring the database snapshots from the web host here.
#   ./pull.sh db-backup@walletscrutiny.com [local-dir [ssh-key]]
# local-dir defaults to ~/walletscrutiny-db-backups. Nothing is ever deleted here
# (snapshots the server has already pruned stay), so this is your long-term copy.
# Needs rsync and zstd. See README.md, "Pulling to your machine".
set -euo pipefail
umask 077

remote="${1:?usage: pull.sh user@host [local-dir [ssh-key]]}"
dest="${2:-$HOME/walletscrutiny-db-backups}"
key="${3:-}"
ssh_cmd=(ssh)
[ -n "$key" ] && ssh_cmd+=(-i "$key" -o IdentitiesOnly=yes)

mkdir -p "$dest"
new="$(mktemp)"
trap 'rm -f "$new"' EXIT

# The key on the remote account is limited to a read-only rrsync of the backup
# directory, so the source is its root. Snapshot files never change once written.
bad=0
if ! rsync -a --partial --exclude '/.tmp/' --out-format='%n' -e "${ssh_cmd[*]}" "$remote:/" "$dest/" > "$new"; then
  echo "ERROR: rsync from $remote failed" >&2; bad=1
fi

# what did arrive is still checked
count=0
while IFS= read -r f; do
  [[ "$f" == *.db.zst ]] || continue
  count=$((count + 1))
  if zstd -tq "$dest/$f"; then echo "ok   $f"; else echo "BAD  $f" >&2; bad=1; fi
done < "$new"
[ "$count" -gt 0 ] || echo "no new snapshots"
exit "$bad"
