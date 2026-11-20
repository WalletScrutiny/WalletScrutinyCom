# Database backup

Nightly snapshots of the SQLite databases the WalletScrutiny services keep on the
build server, copied to another server, and a script to pull them to your own
machine.

| Name | Written by | Database |
|------|-----------|----------|
| `verifications` | build server | `/var/lib/walletscrutiny-build-server/verifications.db` |
| `assets` | source analysis | `/var/lib/walletscrutiny-source-analysis/assets.db` |
| `notifications` | WS notifications | `/var/lib/walletscrutiny-ws-notifications/notifications.db` |
| `dep-rebuilder` | dependency rebuilder | `/var/lib/dep-rebuilder/data/dep-rebuilder.db` |

Not included: the Blossom server (its index and blobs need their own backup) and
Uptime Kuma. `WS_BACKUP_DATABASES` takes more `name=path` pairs.

How it works (`backup.sh`, run by `walletscrutiny-db-backup.timer` at 03:30 UTC):

1. `sqlite3 .backup` takes a consistent snapshot while the service keeps writing.
2. `PRAGMA integrity_check` on the snapshot. A snapshot that fails is not stored
   and the unit fails.
3. `zstd` into `/var/lib/walletscrutiny-db-backup/<name>/<name>-<UTC time>.db.zst`.
4. Retention: snapshots older than 21 days are deleted (`WS_BACKUP_KEEP_DAYS`).
   The newest snapshot of each database is always kept, even if it is older.
5. `rsync` of the directory to `WS_BACKUP_PUSH_TARGET`, if set. The remote copy
   holds the same 3 weeks: when a database prunes a snapshot here, that database's
   directory there is brought in line. It is not a mirror: nothing is deleted there
   for a database that pruned nothing in that run, so losing this directory (new
   server) does not empty the remote copy. `WS_BACKUP_PUSH_DELETE=no` makes it keep
   everything.

The rebuilder's database belongs to its own user `dep-rebuilder` (build code runs as
that user, so it does not run as `build-server`). The backup reads it as `build-server`
with the supplementary group `dep-rebuilder`, which `deploy:db-backup` adds through a
drop-in once that group exists; `db.mjs` of the rebuilder makes the data directory 770
and the database 660 on its next start (a WAL database is also written when read).
Before the rebuilder is deployed the database is skipped, not an error; deploy the
backup again after `deploy:dep-rebuilder` (until then the unit fails with "no
permission to read"). The same key and web-host account serve all four databases:
`dep-rebuilder` cannot read that key.

One database failing (missing file, failed check) does not stop the others; the
unit then ends with exit status 1, so `systemctl --failed` and the journal show it.

## Setting up

**1. Build server: packages and files.** Install the packages once:

```bash
sudo apt install sqlite3 zstd rsync
```

The script and units are deployed from your machine, here and for every later
change (`/opt/db-backup`, root-owned, plus the systemd units; the timer is
enabled; the snapshots and `/etc/walletscrutiny-db-backup/env` are not touched):

```bash
npm run deploy:db-backup          # RUN_NOW=1 takes snapshots right after the deploy
```

**2. Web host (walletscrutiny.com): a directory and a user for the copy.** The
build server already has a key and a pinned `known_hosts` for this host (source
analysis export), so this reuses both. The directory must **not** be
`/srv/source-analysis`: nginx serves that one publicly under `/api/source-analysis/`.
It must not be inside `/var/www/walletscrutiny.com` either (`deploy:prod` empties it).
No nginx location may point at it.

```bash
# On the web host
sudo adduser --disabled-password --gecos '' db-backup
sudo mkdir -p /srv/db-backup && sudo chmod 700 /srv/db-backup && sudo chown db-backup: /srv/db-backup
# sshd reads authorized_keys from the home in /etc/passwd, which is not always
# /home/db-backup (and `~db-backup` only matches it if the account exists)
HOME_DB=$(getent passwd db-backup | cut -d: -f6); echo "home: $HOME_DB"
sudo -u db-backup mkdir -p -m 700 "$HOME_DB/.ssh"
# the public key of the existing source-analysis publish key (on the build server:
# cat /etc/walletscrutiny-source-analysis/publish_ed25519.pub)
echo 'command="rrsync /srv/db-backup",restrict ssh-ed25519 AAAA... source-analysis-publish' \
  | sudo -u db-backup tee "$HOME_DB/.ssh/authorized_keys"
sudo chmod 600 "$HOME_DB/.ssh/authorized_keys"
```

The same key now has two restricted accounts: `source-analysis` (its public
export directory) and `db-backup` (this one). Another host works the same way
with its own key (`ssh-keygen`, `ssh-keyscan`, `rrsync`, as in the source
analysis README, "Setting up from scratch", step 2).

Then on the build server, `/etc/walletscrutiny-db-backup/env`:

```bash
WS_BACKUP_PUSH_TARGET=db-backup@walletscrutiny.com:/
WS_BACKUP_PUSH_SSH="ssh -i /etc/walletscrutiny-source-analysis/publish_ed25519 -o UserKnownHostsFile=/etc/walletscrutiny-source-analysis/known_hosts -o StrictHostKeyChecking=yes -o BatchMode=yes"
```

The key file stays readable by `build-server` only; the unit can read it but not
change it (`ProtectSystem=strict`).

Check before the first run, like the source analysis does:

```bash
sudo -u build-server rsync -e "$(. /etc/walletscrutiny-db-backup/env; echo "$WS_BACKUP_PUSH_SSH")" --list-only db-backup@walletscrutiny.com:/
```

A line ending in ` .` means it works. `Permission denied (publickey)` means the web
host does not accept the key for `db-backup`: no `authorized_keys` yet, the
`AAAA...` placeholder still in it, or the key line broken across two lines. Without
`BatchMode=yes` ssh would fall back to asking for a password instead.

**3. Start and check.**

The deploy has already enabled the timer. After step 2 (the `env` file), run it
once by hand and look at the result:

```bash
sudo systemctl start --no-block walletscrutiny-db-backup.service      # or RUN_NOW=1 npm run deploy:db-backup
journalctl -fu walletscrutiny-db-backup.service
systemctl list-timers walletscrutiny-db-backup.timer
```

Without `--no-block` the command waits until the copy to the web host is done. The
run ends with `pushed to the remote copy`, or with an `ERROR:` line and exit status 1.

A restore loses at most the last day of writes. A snapshot taken during a long
write is still consistent (the last committed state).

## Pulling to your machine

`pull.sh` copies the snapshots from the web host to a local directory and
checks every new file with `zstd -t`. It never deletes locally, so your copy keeps
history beyond the server's retention. It exits with status 1 if the copy or a
check failed. Needs `rsync` and `zstd`.

A key only for this, read-only, on the `db-backup` account of the web host
(`authorized_keys` in the home of `db-backup`, one more line next to the build server's;
`rrsync -ro` limits it to reading `/srv/db-backup`). This keeps your machine off
the build server.

```
command="rrsync -ro /srv/db-backup",restrict ssh-ed25519 AAAA... db-backup-pull
```

Then on your machine, by hand or from a cron job/systemd user timer:

```bash
./pull.sh db-backup@walletscrutiny.com ~/walletscrutiny-db-backups ~/.ssh/db-backup-pull
```

## Restoring

```bash
zstd -d verifications-20261120T033012Z.db.zst -o verifications.db
sqlite3 verifications.db 'PRAGMA integrity_check;'
```

Stop the service, move the file to its path, make `build-server` (`dep-rebuilder`
for that database, mode 660) the owner, start the service. A restored
`notifications.db` is at most a night old; the bot then repeats at most that
night's notifications.

On a new server, restore the databases before the services first run. The backup
can be deployed at any point: the snapshots on the web host stay until the new
server has pruned for the first time, 3 weeks later.

## Notes

- `source_analysis` also copies `assets.db` to `backup/` next to the database at
  the start of each run (plain file copy, same disk). It protects against a bad
  run, not a lost server; this backup does not replace or touch it.
- The unit runs as `build-server`, the owner of the databases, with
  `ProtectSystem=strict` and write access only to the data directories of the
  databases and its own state directory.
