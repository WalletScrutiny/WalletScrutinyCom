# WS Notifications

Publishes Nostr **kind=1** notes when new WalletScrutiny **verification** events (kind **30301**) are published on Nostr. Runs as a systemd oneshot service triggered hourly by a timer.

## What it does

1. Reads the `since` cursor from a local SQLite database (initialized to the start of the current UTC day on first run).
2. Fetches published verification events from Nostr relays (`#client: WalletScrutiny.com`, kind 30301).
3. For each new event not yet recorded in the database, publishes a kind=1 note with app, version, platform, status, and a link to the verification on walletscrutiny.com.
4. Records notified event IDs in SQLite and advances the `since` cursor to the latest `created_at` seen.

Draft verifications (kind 30801) are not notified.

## Requirements

- Node.js >= 18.6.0
- Nostr private key for the WalletScrutiny Bot account (same credential as the build server)

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
| `WS_NOTIFICATIONS_INITIAL_SINCE` | Override initial `since` cursor (unix seconds) |
| `WEBAPP_BASE_URL` | Base URL for verification links (default: `https://walletscrutiny.com`) |

## Install as a systemd timer

The service reuses the same encrypted credential as the build server (`build-server-ws-bot-pk`).

```bash
sudo cp config/walletscrutiny-ws-notifications.service /etc/systemd/system/
sudo cp config/walletscrutiny-ws-notifications.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now walletscrutiny-ws-notifications.timer
```

Check status:

```bash
systemctl status walletscrutiny-ws-notifications.timer
systemctl list-timers walletscrutiny-ws-notifications.timer
journalctl -u walletscrutiny-ws-notifications.service
```

Run manually:

```bash
sudo systemctl start walletscrutiny-ws-notifications.service
```

## Database schema

**`meta`** — key/value store

| key | value |
|-----|-------|
| `since` | Unix timestamp cursor for Nostr fetches |

**`notified_events`** — deduplication and audit log

| column | description |
|--------|-------------|
| `event_id` | Verification event id (primary key) |
| `created_at` | Verification `created_at` |
| `app_id`, `version`, `platform`, `status` | Verification metadata |
| `notified_at` | When the kind=1 note was published |

Production path: `/var/lib/walletscrutiny-ws-notifications/notifications.db`

## Notification format

```
New "Not Reproducible" verification for blockstreamgreen 3.4.0 (linux):

https://walletscrutiny.com/linux/blockstreamgreen/#verificationId=<event-id>
```

## Tests

```bash
npm test
```
