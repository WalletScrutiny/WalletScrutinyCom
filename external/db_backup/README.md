# Database backup

Nightly snapshots of the SQLite databases the WalletScrutiny services keep on the
build server, copied to another server, and a script to pull them to your own
machine.

| Name | Written by | Database |
|------|-----------|----------|
| `verifications` | build server | `/var/lib/walletscrutiny-build-server/verifications.db` |
| `assets` | source analysis | `/var/lib/walletscrutiny-source-analysis/assets.db` |
| `notifications` | WS notifications | `/var/lib/walletscrutiny-ws-notifications/notifications.db` |

Not included: the Blossom server (its index and blobs need their own backup) and
Uptime Kuma. `WS_BACKUP_DATABASES` takes more `name=path` pairs.

How it works (`backup.sh`, run by `walletscrutiny-db-backup.timer` at 03:30 UTC):

1. `sqlite3 .backup` takes a consistent snapshot while the service keeps writing.
2. `PRAGMA integrity_check` on the snapshot. A snapshot that fails is not stored
   and the unit fails.
3. `zstd` into `/var/lib/walletscrutiny-db-backup/<name>/<name>-<UTC time>.db.zst`.
4. Retention: the newest 14 snapshots of each database, plus the newest snapshot
   of each of the last 8 weeks (`WS_BACKUP_KEEP_NEWEST`, `WS_BACKUP_KEEP_WEEKS`).
5. `rsync` of the whole directory to `WS_BACKUP_PUSH_TARGET`, if set. Without
   `WS_BACKUP_PUSH_DELETE=yes` the remote copy keeps everything the server has
   already pruned, so prune it there yourself.

One database failing (missing file, failed check) does not stop the others; the
unit then ends with exit status 1, so `systemctl --failed` and the journal show it.

## Setting up

**1. Build server: packages and files.**

```bash
sudo apt install sqlite3 zstd rsync
sudo mkdir -p /opt/db-backup /etc/walletscrutiny-db-backup
sudo cp backup.sh README.md /opt/db-backup/        # from external/db_backup
sudo chmod +x /opt/db-backup/backup.sh
sudo cp config/walletscrutiny-db-backup.service config/walletscrutiny-db-backup.timer /etc/systemd/system/
```

**2. Another server: a user that can write one directory and nothing else**
(suggested names; same pattern as the source analysis export).

```bash
# On the build server: the key the backup copies with
sudo ssh-keygen -t ed25519 -N '' -C db-backup-push -f /etc/walletscrutiny-db-backup/push_ed25519
sudo chown build-server: /etc/walletscrutiny-db-backup/push_ed25519
sudo cat /etc/walletscrutiny-db-backup/push_ed25519.pub     # goes into authorized_keys below
ssh-keyscan -t ed25519 BACKUP_HOST | sudo tee /etc/walletscrutiny-db-backup/known_hosts
# compare with `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on BACKUP_HOST

# On BACKUP_HOST
sudo adduser --disabled-password --gecos '' db-backup
sudo mkdir -p /srv/db-backup && sudo chown db-backup: /srv/db-backup
sudo -u db-backup mkdir -p -m 700 ~db-backup/.ssh
echo 'command="rrsync /srv/db-backup",restrict ssh-ed25519 AAAA... db-backup-push' \
  | sudo -u db-backup tee ~db-backup/.ssh/authorized_keys
```

Then on the build server, `/etc/walletscrutiny-db-backup/env`:

```bash
WS_BACKUP_PUSH_TARGET=db-backup@BACKUP_HOST:/
WS_BACKUP_PUSH_SSH="ssh -i /etc/walletscrutiny-db-backup/push_ed25519 -o UserKnownHostsFile=/etc/walletscrutiny-db-backup/known_hosts -o StrictHostKeyChecking=yes"
```

**3. Start and check.**

```bash
sudo systemctl daemon-reload
sudo systemctl start walletscrutiny-db-backup.service      # first run now
journalctl -u walletscrutiny-db-backup.service -n 20
sudo systemctl enable --now walletscrutiny-db-backup.timer
systemctl list-timers walletscrutiny-db-backup.timer
```

A restore loses at most the last day of writes. A snapshot taken during a long
write is still consistent (the last committed state).

## Pulling to your machine

`pull.sh` copies the snapshots from the build server to a local directory and
checks every new file with `zstd -t`. It never deletes locally, so your copy keeps
history beyond the server's retention. Needs `rsync` and `zstd`.

A key only for this, read-only, on the build server's `build-server` account
(`~build-server/.ssh/authorized_keys`; `rrsync -ro` limits it to reading the
backup directory):

```
command="rrsync -ro /var/lib/walletscrutiny-db-backup",restrict ssh-ed25519 AAAA... db-backup-pull
```

Then on your machine, by hand or from a cron job/systemd user timer:

```bash
./pull.sh build-server@BUILD_SERVER ~/walletscrutiny-db-backups ~/.ssh/db-backup-pull
```

The pull can also use the remote copy instead (a second read-only `rrsync -ro
/srv/db-backup` key on `db-backup`), which keeps your machine off the build
server.

## Restoring

```bash
zstd -d verifications-20261120T033012Z.db.zst -o verifications.db
sqlite3 verifications.db 'PRAGMA integrity_check;'
```

Stop the service, move the file to its path, make `build-server` the owner, start
the service. A restored `notifications.db` is at most a night old; the bot then
repeats at most that night's notifications.

## Notes

- `source_analysis` also copies `assets.db` to `backup/` next to the database at
  the start of each run (plain file copy, same disk). It protects against a bad
  run, not a lost server; this backup does not replace or touch it.
- The unit runs as `build-server`, the owner of the databases, with
  `ProtectSystem=strict` and write access only to the three data directories and
  its own state directory.
