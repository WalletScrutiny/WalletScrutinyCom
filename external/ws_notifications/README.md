# WS Notifications

Publishes Nostr **kind=1** notes when new WalletScrutiny **verification** events (kind **30301**) are published on Nostr. Runs as a systemd oneshot service triggered hourly by a timer.

## What it does

1. Reads the `since` cursor from a local SQLite database (initialized to the start of the current UTC day on first run).
2. Fetches published verification events from Nostr relays (kind 30301, filtered to `client=WalletScrutiny.com` in code).
3. For each new event not yet recorded in the database, checks that the wallet page exists on walletscrutiny.com (HTTP HEAD), then publishes a kind=1 note with app, version, platform, status, and a link to the verification. Events whose wallet page is missing are skipped and logged as errors.
4. Records notified event IDs in SQLite and advances the `since` cursor to the latest `created_at` seen.

Draft verifications (kind 30801) are not notified.

## Requirements

- Node.js >= 18.6.0
- Nostr private key for the WalletScrutiny Bot account (same credential as the build server: `build-server-ws-bot-pk`)
- Linux server with systemd

This service is self-contained: deploy only the contents of this directory to `/opt/ws-notifications`. It does not depend on other paths in the WalletScrutiny repository at runtime.

## Development

```bash
cd external/ws_notifications
npm install
node index.mjs --wsBotNostrPrivateKey <nsec>
node index.mjs --dry-run
```

Optional flags and environment variables:

| Variable / flag | Purpose |
|----------------|---------|
| `--debug` | Use debug verification kind 32304 instead of 30301 |
| `--dry-run` | Fetch and preview notifications without publishing, without updating `since`, and without recording notified events (Nostr private key not required) |
| `--wsBotNostrPrivateKey` | Dev-only Nostr private key (required except in `--dry-run`) |
| `WS_NOTIFICATIONS_DB_PATH` | SQLite path (default: `./notifications.db`) |
| `WS_NOTIFICATIONS_LOG_DIR` | Log file directory (default: `./logs`; production systemd uses `/var/log/ws-notifications`) |
| `WS_NOTIFICATIONS_FETCH_TIMEOUT_MS` | Max wait per Nostr fetch page (default: `120000`) |
| `WS_NOTIFICATIONS_PUBLISH_DELAY_MS` | Pause between kind=1 publishes in ms (default: `3000`; set `0` to disable) |
| `WS_NOTIFICATIONS_URL_CHECK_TIMEOUT_MS` | Timeout for HTTP HEAD wallet page checks (default: `15000`) |
| `WS_NOTIFICATIONS_INITIAL_SINCE` | Override initial `since` cursor (unix seconds) |
| `WEBAPP_BASE_URL` | Base URL for verification links (default: `https://walletscrutiny.com`) |

## Install on the server

Production install path: **`/opt/ws-notifications`**

The service runs as the existing **`build-server`** user and reuses the same encrypted Nostr bot credential as the build server (`/etc/credstore.encrypted/build-server-ws-bot-pk`). If the build server is already installed, you can skip user and credential setup.

### 1. Prerequisites

- Node.js >= 18.6.0 (`node --version`)
- `build-server` system user (create only if it does not exist yet):

```bash
sudo adduser --system --group --home /opt/build-server build-server
```

- Encrypted credential for the WalletScrutiny Bot Nostr private key (same as build server). If not set up yet, follow the build server README credential steps, then continue.

### 2. Deploy application files

From your checkout (or a release tarball), copy **only this directory** to the server:

```bash
sudo mkdir -p /opt/ws-notifications
sudo rsync -a --delete \
  external/ws_notifications/ \
  /opt/ws-notifications/
```

Or from the server, if the repo is already on the machine:

```bash
sudo mkdir -p /opt/ws-notifications
sudo rsync -a --delete \
  /path/to/walletScrutinyCom/external/ws_notifications/ \
  /opt/ws-notifications/
```

Install production dependencies:

```bash
cd /opt/ws-notifications
sudo -u build-server npm install --omit=dev
```

Set ownership:

```bash
sudo chown -R build-server:build-server /opt/ws-notifications
```

### 3. Install systemd units

```bash
sudo cp /opt/ws-notifications/config/walletscrutiny-ws-notifications.service /etc/systemd/system/
sudo cp /opt/ws-notifications/config/walletscrutiny-ws-notifications.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now walletscrutiny-ws-notifications.timer
```

systemd creates automatically (via `StateDirectory` / `LogsDirectory`):

| Path | Purpose |
|------|---------|
| `/var/lib/walletscrutiny-ws-notifications/notifications.db` | SQLite database |
| `/var/log/ws-notifications/` | Rotating log files |

### 4. Verify

Check that the timer is scheduled:

```bash
systemctl list-timers walletscrutiny-ws-notifications.timer
```

Run once manually:

```bash
sudo systemctl start walletscrutiny-ws-notifications.service
systemctl status walletscrutiny-ws-notifications.service
journalctl -u walletscrutiny-ws-notifications.service -n 50
```

Dry-run on the server (no publish, no DB writes; key optional):

```bash
sudo -u build-server node /opt/ws-notifications/index.mjs --dry-run
```

### 5. Upgrade

```bash
sudo rsync -a --delete /path/to/walletScrutinyCom/external/ws_notifications/ /opt/ws-notifications/
cd /opt/ws-notifications
sudo -u build-server npm install --omit=dev
sudo cp config/walletscrutiny-ws-notifications.service /etc/systemd/system/
sudo cp config/walletscrutiny-ws-notifications.timer /etc/systemd/system/
sudo systemctl daemon-reload
```

No need to restart a long-running process: the timer launches a fresh oneshot each hour.

## Database schema

**`meta`** — key/value store

| key | value |
|-----|-------|
| `since` | Unix timestamp of the last processed verification (`created_at`); Nostr fetches use `since + 1` |

**`notified_events`** — deduplication (verification event ids already notified)

| column | description |
|--------|-------------|
| `event_id` | Verification event id (primary key) |

## Notification format

```
New "Not Reproducible" verification for blockstreamgreen 3.4.0 (linux):

https://walletscrutiny.com/desktop/blockstreamgreen/#verificationId=<event-id>
```

## Tests

```bash
npm test
```
