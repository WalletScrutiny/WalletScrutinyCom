# Build Server App

This Node.js application connects to Nostr to fetch verification scripts from wallets that have "reproducible" status and downloads them locally for execution if a new version of the wallet is found, or an asset has been registered by a user into our Asset Registry.

## What does it do?

1. Check for new versions of desktop and hardware apps
2. Gets all the wallet information from WS files, and the verifications information from Nostr (see `docs/verifications.md`)
3. For each wallet that has a new version, we filter the verifications to only include those with "reproducible" status and exclude "macos" platform (for now)
4. We check if the verification has attachment files ending with `build.sh`
5. The file gets downloaded from Nostr and executed with asciinema recording the execution
6. A new verification is created in Nostr with the result (reproducible or not) of the execution, and the asciinema recording file is attached to the verification

## Requirements
- Node.js >= 18.6.0
- asciinema
- docker.io and podman (for container-based verification scripts)
- Nix with flakes enabled (for Nix-native verification scripts; optional but required when a script uses `nix develop` or `nix build`)
- GitHub token (to refresh the desktop and hardware apps; build scripts get it only for the apps in `GITHUB_TOKEN_APP_IDS` in `config/config.mjs`)
- Public-only GitHub token for every other build script, so their GitHub API calls are not limited to 60 an hour: a fine-grained token on a separate GitHub account, repository access "Public repositories (read-only)", no permissions. Stored as the credential `build-server-gh-public-token`:
  `echo -n 'github_pat_xxx' | sudo systemd-creds encrypt --name=build-server-gh-public-token - /etc/credstore.encrypted/build-server-gh-public-token`
- Nostr private key from the `WalletScrutiny Bot` account

## Usage

### Manual execution for development or debug

```bash
cd external/build_server
npm install
node index.mjs --githubToken <github_token> --wsBotNostrPrivateKey  <nostr_private_key>
```

## Install and run as a systemd service

### Server preparation

- Create a new user for the application:
```bash
sudo adduser build-server
```

- Create the group for the application:
```bash
sudo addgroup build-server
```

- Add subgids and subuids to the build-server user:
```bash
sudo usermod --add-subgids 100000-165535 build-server
sudo usermod --add-subuids 100000-165535 build-server
```

- Enable linger for the build-server user. You'll have problems running containers if you don't do this:
```bash
sudo loginctl enable-linger build-server
```

- Create a new directory for the application:
```bash
sudo mkdir -p /opt/build-server/walletScrutinyCom
```

### Deploy from your machine

The ABS `WorkingDirectory` is `/opt/build-server/walletScrutinyCom/external/build_server` (`ExecStart=/usr/bin/node index.mjs`). Runtime imports `src/` and `scripts/` from the WalletScrutiny repo root, so each deploy copies the full project tree (excluding generated site assets, `images/`, `node_modules/`, and `.git`).

```bash
npm run deploy:build-server
```

Requires SSH to `build.walletscrutiny.com` as root (see `~/.ssh/config`).

### Install the application
- Copy the application to the server (or use `npm run deploy:build-server` above):
```bash
sudo cp -r walletScrutinyCom /opt/build-server/walletScrutinyCom
```

### Install the dependencies
```bash
sudo apt install asciinema docker.io podman nodejs npm -y
```

Note: if the version of nodejs is not greater than or equal to 18.6.0, you can use `nodesource` distribution to install a newer version with `curl -fsSL https://deb.nodesource.com/setup_20.x | bash -` and then `sudo apt install -y nodejs` or install it globally: `bash -c "sudo npm install --global npm@latest"`

### Install Nix (for Nix-native verification scripts)

Some verification scripts follow a vendor-documented Nix recipe instead of wrapping the build in a container. Install Nix on the host so those scripts can run `nix develop` or `nix build` directly:

```bash
sudo bash external/build_server/scripts/install-nix.sh
```

Verify that the `build-server` user can use Nix:

```bash
sudo -u build-server nix --version
sudo -u build-server nix flake metadata nixpkgs
```

The installer links Nix into `/usr/local/bin` because `sudo -u build-server` does not load `/etc/profile.d/nix.sh` (non-login shell). Without those symlinks, `nix: command not found` is expected even when Nix is installed.

If verification still fails, check that Nix exists at `/nix/var/nix/profiles/default/bin/nix` and re-run `sudo bash external/build_server/scripts/install-nix.sh`.

**Disk usage:** the `/nix/store` grows with each distinct build closure. Monitor free space; the first cold run of a Nix-based wallet can download several gigabytes. Parallel ABS jobs share the store safely (Nix handles locking).

**Garbage collection:** the install script above also enables a weekly GC timer. To install it manually (from the deployed repo on the server):

```bash
sudo cp /opt/build-server/walletScrutinyCom/external/build_server/config/walletscrutiny-build-server-nix-gc.service /etc/systemd/system/
sudo cp /opt/build-server/walletScrutinyCom/external/build_server/config/walletscrutiny-build-server-nix-gc.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now walletscrutiny-build-server-nix-gc.timer
```

To run GC manually: `sudo /opt/build-server/walletScrutinyCom/external/build_server/scripts/nix-store-gc.sh`

- Install npm modules:
```bash
cd /opt/build-server/walletScrutinyCom/external/build_server
sudo npm install
```

- Create the build directory. Build users can enter it but not create, rename or replace anything in it:
```bash
sudo mkdir -p /opt/build-server-builds
sudo chown build-server:build-server /opt/build-server-builds
sudo chmod 2750 /opt/build-server-builds
```

### Build users

Build scripts do not run as `build-server`, which can read ABS's credentials and database, but as one of two users of their own (`FEATURE_BUILD_USERS` in `config/config.mjs`):

- `abs-token` for the apps in `GITHUB_TOKEN_APP_IDS`, the only scripts that get the real `GITHUB_TOKEN`;
- `abs-runner` for every other app.

Only the apps in `BUILD_USER_APP_IDS` run as these users; every other app still runs as `build-server`. The users have no docker daemon, no `/dev/kvm` and no Windows VM key, so add an app only after a trial run of its newest script as its build user gave the verdict it gets today. List every app of `GITHUB_TOKEN_APP_IDS` before the first other app: a token app that is not listed builds as `build-server`, next to the listed plain builds, so ABS refuses to start with such a list.

Builds of only one of the two users run at a time, and that user is cleared before a build of the other one starts: a script that puts the token on a command line shows it to every account on the host. If clearing fails, the other user's builds keep waiting, and ABS retries every five minutes. A build that waits stays in the queue: it takes none of the three slots, its 6-hour limit starts only when it starts, and builds of other apps run meanwhile.

Each build folder belongs to the group of its user (`rwxrws---`), so a build cannot read or change the other user's builds. The cast is recorded into `/var/lib/walletscrutiny-build-server/casts`, which only `build-server` can write, and ABS refuses to read a file from a build folder that is a link or not where it claims to be. When a user has no build running, ABS clears what its builds left behind: processes, user systemd units and Podman quadlets, cron and at jobs, and Podman containers. It also sets the user's home back to `0700`, because `adduser --system` creates it `0755`.

- Create the users, with subuids for rootless Podman and linger for their user systemd. Pick subuid ranges that are free in `/etc/subuid` and `/etc/subgid`:
```bash
sudo addgroup --system abs-builds
for user in abs-runner abs-token; do
  sudo adduser --system --group --home "/home/${user}" --shell /bin/bash "${user}"
  sudo usermod -aG abs-builds "${user}"
  sudo loginctl enable-linger "${user}"
done
sudo usermod --add-subuids 165536-231071 --add-subgids 165536-231071 abs-runner
sudo usermod --add-subuids 231072-296607 --add-subgids 231072-296607 abs-token
sudo chgrp abs-builds /opt/build-server-builds
sudo usermod -aG abs-runner,abs-token build-server
```
Restart the service afterwards: a running `build-server` process does not get new groups.

- Install the helper ABS runs as root to delete build folders. It must be root-owned and outside `/opt/build-server`, which `build-server` can write: a copy in there would let it, or anything running as it, become root. `npm run deploy:build-server` reinstalls it on every deploy.
```bash
sudo install -o root -g root -m 755 external/build_server/scripts/build-server-safe-rmdir.sh /usr/local/sbin/build-server-safe-rmdir.sh
```

- Add the sudo rules with `sudo visudo`, in place of any older safe-rmdir rule. Put the two users' uids into the third line (`id -u abs-runner`, `id -u abs-token`):
```
build-server ALL=(root) NOPASSWD: /usr/local/sbin/build-server-safe-rmdir.sh *
build-server ALL=(abs-runner,abs-token) NOPASSWD:SETENV: ALL
build-server ALL=(root) NOPASSWD: /usr/bin/systemctl restart user@<abs-runner uid>.service, /usr/bin/systemctl restart user@<abs-token uid>.service
```
The first deletes build folders whose files belong to container UIDs. The second starts builds as the two users and clears what they leave behind; `SETENV` lets ABS pass `GITHUB_TOKEN` through sudo, and grants nothing beyond what those two users can already do. The third restarts a build user's systemd after clearing it.

- Check the result as root with the step-4 script from the Reproducible-Builds channel, once per user (`R=abs-runner` and `R=abs-token`).

### Install the service

```bash
sudo cp external/build_server/config/walletscrutiny-build-server.service /etc/systemd/system/
sudo cp external/build_server/config/walletscrutiny-build-server-builds-cleanup.service /etc/systemd/system/
sudo cp external/build_server/config/walletscrutiny-build-server-builds-cleanup.timer /etc/systemd/system/
sudo cp external/build_server/config/walletscrutiny-build-server-nix-gc.service /etc/systemd/system/
sudo cp external/build_server/config/walletscrutiny-build-server-nix-gc.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now walletscrutiny-build-server.service
sudo systemctl enable --now walletscrutiny-build-server-builds-cleanup.timer
sudo systemctl enable --now walletscrutiny-build-server-nix-gc.timer
```

`npm run deploy:build-server` copies these units and enables the service.

## Build Server admin

### Start/stop the WS Build Server service

```bash
service walletscrutiny-build-server start
service walletscrutiny-build-server stop
```

### Check the service status

```bash
sudo systemctl status walletscrutiny-build-server.service
```

### Check the service logs

```bash
sudo journalctl -u walletscrutiny-build-server.service -f
```

### Retry a build the ABS already attempted

The ABS skips a build whose earlier attempt with the same build script is `queued` or `error` in its database. To have it tried again (for example after an ABS fix), list the app's rows and delete the one that blocks it; the next pass picks the build up again.

```bash
cd /opt/build-server/walletScrutinyCom/external/build_server
sudo -u build-server node scripts/verifications-db.mjs list com.example.wallet          # all versions
sudo -u build-server node scripts/verifications-db.mjs list com.example.wallet 1.2.3    # one version
sudo -u build-server node scripts/verifications-db.mjs delete 42                        # by row id
```

It uses the service's database (`/var/lib/walletscrutiny-build-server/verifications.db`) unless `--db <path>` or `BUILD_SERVER_DB_PATH` says otherwise. A newer build script (a new build script event) is tried without deleting anything, and a build that already has a published WS Bot verification is skipped whatever the database says.

### Which build script an asset gets

For a registered asset the ABS tries the build scripts attached to the app's verifications, newest first, at most 3 (`MAX_SCRIPTS_TO_TRY`). For Android it first reads the APK's signing certificate (v3, else v2 signing block; a few range requests to Blossom, no full download) and orders the scripts by the APK each one was verified on:

1. same signer as the asset, newest first;
2. signer unknown (that APK is not on Blossom, or is v1-only), newest first, after every same-signer script;
3. a different signer: dropped. When every script is dropped, the asset is skipped and Carol is alerted (see below).

So an F-Droid re-signed APK goes to a script verified on an F-Droid build, however old, and never to the script for the developer-signed APK. If the asset's own signer cannot be read, the order is recency only. After 3 failed Blossom lookups in a cycle, the rest of that cycle treats uncached signers as unknown, and an absent or unreadable APK is asked again after a day. A store build reaches its script only once one verification with that script covers an APK that is on Blossom; register that APK in the Asset Registry, or verify an asset that is already there.

### Regression alerts to Buzz

With `FEATURE_REGRESSION_ALERTS` on (config; set to false to stop the alerts), a published `ftbfs` or `not_reproducible` verdict for a version newer than the reproducible verification whose script was used posts a message in the Buzz Reproducible-Builds channel on `buzz.walletscrutiny.com`, tagging Carol (`REGRESSION_ALERT_*` in config). An Android asset skipped because every script was verified only on other signers posts a second kind of alert in the same way. The first line says which kind it is, `[regression]` or `[skipped signer]`. Carol triages it, fixes or writes the script, and publishes the verdict with her own verifier key.

- Regressions are alerted only for apps in `REGRESSION_ALERT_APP_IDS`; skipped signers for apps in `SKIPPED_SIGNER_ALERT_APP_IDS` (empty = every app, the default).
- One skipped-signer alert per app and signer, in the `skipped_signer_alerts` table: once one APK on that signer is verified, ABS picks the script up by itself.
- One regression alert per app and version, recorded in the `regression_alerts` table of the service database. Each message lists every regression not delivered yet; a failed post stays pending and is retried at the start of the next cycle.
- Signed with the WalletScrutiny Notification account, the same credential as the source analysis units (`source-analysis-alert-nsec`, loaded as `ALERT_NOSTR_NSEC_FILE`). That account must be a member of the channel.
- A post times out after `REGRESSION_ALERT_TIMEOUT_SECONDS`; any error is logged and never blocks or changes a verdict.

## Technical notes

- The application connects to the same relays as WalletScrutiny.com and publishes the results to Nostr as `WalletScrutiny Bot`
- The application keeps running forever and loops: it scans the Asset Registry, drains the build queue and then sleeps `HOURS_BETWEEN_EXECUTIONS` (config) before the next cycle
- It also keeps a live subscription on the Asset Registry kinds; a new WalletScrutiny registration wakes the loop early (after `ASSET_WATCH_DEBOUNCE_SECONDS`), so a new version is normally picked up within a minute instead of at the next scheduled cycle. The subscription is self-healing (nostr-tools ping/reconnect plus a watchdog every `ASSET_WATCH_WATCHDOG_MINUTES`) but never load-bearing: the scheduled scan still runs
- **Platform filter**: Excludes automatically verifications for macOS for compatibility with Linux servers
