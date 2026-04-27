# WalletScrutiny homepage / Nostr check

Uptime-Kuma installation plus a Playwright script that opens the WalletScrutiny homepage, waits for verification UI text that is loaded from Nostr-backed data, then reports the result to **Uptime Kuma** using a **Push** monitor.

The dashboard is available in the Build Server at [http://66.29.128.152:3001/](http://66.29.128.152:3001/).

## Install this package

Copy the external/web-monitoring folder to your server:

```bash
cp -r external/web-monitoring .
cd web-monitoring
npm install
```

Install Playwright dependencies:

```bash
npx playwright install-deps
npx playwright install
```

Check if the script works:

```bash
npm run check-nostr
```

You should see the following output:

```bash
OK: found visible text matching "Reproducible when tested" on https://walletscrutiny.com/ (10000 ms)
```

## Install Uptime Kuma

### Install

These commands match the [Installation](https://codeberg.org/c8h4/uptime-kuma-deb#installation) section of the project README (repository key, `apt` sources, install). Ensure `/etc/apt/keyrings` exists if your system is older:

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl https://codeberg.org/api/packages/c8h4/debian/repository.key -o /etc/apt/keyrings/codeberg-c8h4.asc
sudo tee /etc/apt/sources.list.d/uptime-kuma.sources <<'EOF'
Types: deb
URIs: https://codeberg.org/api/packages/c8h4/debian
Suites: trixie
Components: uptime-kuma
Signed-by: /etc/apt/keyrings/codeberg-c8h4.asc
EOF

sudo apt update
sudo apt install uptime-kuma
```

Install sqlite3 manually:

```bash
cd /usr/share/nodejs/uptime-kuma
npm install sqlite3 --save --legacy-peer-deps
```

### Service, configuration

```bash
sudo systemctl enable --now uptime-kuma
sudo systemctl status uptime-kuma --no-pager
```

Adjust `/etc/uptime-kuma/env` if needed (see the [packager README](https://codeberg.org/c8h4/uptime-kuma-deb#configuration)).

Browse to [http://66.29.128.152:3001/](http://66.29.128.152:3001/).

After Uptime Kuma is running:

1. Add a new monitor.
2. Set **Monitor Type** to **Push**, and .
3. Save the monitor and copy the **Push URL** (it looks like `https://your-kuma-host/api/push/<token>`). It will be used in the crontab line.

## Connect the script to Uptime Kuma

Edit crontab to run the script every 4 minutes:

```bash
crontab -e
```

Add the following line:

```cron
*/4 * * * * cd /path/to/web-monitoring && UPTIME_KUMA_PUSH_URL='https://kuma.example.com/api/push/yourTokenHere' npm run check-nostr
```

### Cron notes

- Cron uses a minimal `PATH`. If `npm` is not found, set `PATH` at the top of the crontab (for example `PATH=/usr/bin:/bin`) and call `npm` with its absolute path (`command -v npm` in an interactive shell).
- To capture output, append `>>/var/log/check-nostr.log 2>&1` or another writable log path.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UPTIME_KUMA_PUSH_URL` | Yes for Kuma | Full Push monitor URL from Uptime Kuma. |
| `WALLETSCRUTINY_URL` | No | Page to open (default: `https://walletscrutiny.com/`). |
| `NOSTR_HEALTHCHECK_TEXT` | No | Substring to wait for (default: `Reproducible when tested`). |
| `HEALTHCHECK_TIMEOUT_MS` | No | Max wait for the text (default: `20000`). |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` | No | Path to Chromium/Chrome if Playwright’s bundled browser is not used. |

If `UPTIME_KUMA_PUSH_URL` is unset, the script only runs the browser check and prints the result (useful for local debugging). Exit code is `0` when the page check succeeds and `1` when it fails.

When `UPTIME_KUMA_PUSH_URL` is set, the script also sends `status=up` or `status=down` to Uptime Kuma. If that HTTP request fails after a successful page check, the process exits with `1` so the scheduler can surface a delivery problem.

## Discord alerts

Uptime Kuma does not send Discord messages by itself; you add a **notification** and attach it to your Push monitor (or use a default policy).

### 1. Webhook in Discord

1. Open your Discord server and go to the channel where alerts should appear.
2. **Channel settings** (gear next to the channel name) → **Integrations** → **Webhooks** → **Create Webhook** (or **New Webhook**).
3. Name the webhook (e.g. `Uptime Kuma`), then **Copy Webhook URL**. You only need this URL in Kuma.

Alternatively: **Server Settings** → **Integrations** → **Webhooks** → **Create Webhook**, pick the channel, copy the URL.

### 2. Notification in Uptime Kuma

1. In Uptime Kuma: **Settings** (gear) → **Notifications** → **Setup Notification**.
2. Choose **Discord** as the type.
3. Paste the **Webhook URL**, give the notification a friendly name, and save.
4. Use **Test** if available to confirm a message appears in the channel.

### 3. Attach the notification to this monitor

1. Open your **Push** monitor → **Edit**.
2. Under **Notifications**, enable the Discord notification you created (or add it to the list and tick it).
3. Save the monitor.

When the Push monitor goes **Down** (missing or failed `status=up` within the heartbeat window, or the script sends `status=down`), Uptime Kuma triggers the configured notifications, including Discord. Restores when the monitor is **Up** again, depending on your notification settings (e.g. “notify on recovery”).

For more notification options, see the [Uptime Kuma notifications wiki](https://github.com/louislam/uptime-kuma/wiki/Notification).
