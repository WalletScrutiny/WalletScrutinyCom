/**
 * Loads the WalletScrutiny homepage and waits for text that appears once
 * Nostr-backed verification data has been rendered (e.g. a reproducible status),
 * then notifies Uptime Kuma via a Push monitor URL.
 *
 * Environment:
 *   UPTIME_KUMA_PUSH_URL - full Push URL from Uptime Kuma (optional; if unset,
 *     only the browser check runs, useful for local runs)
 *   WALLETSCRUTINY_URL   - page to open (default: https://walletscrutiny.com/)
 *   NOSTR_HEALTHCHECK_TEXT - substring to wait for (default: Reproducible when tested)
 *   HEALTHCHECK_TIMEOUT_MS - max wait in ms (default: 20000)
 *   PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH - Chromium/Chrome binary (optional; common
 *     system paths are tried if unset; run `npm run install-browsers` where supported)
 *   UPTIME_KUMA_PUSH_TIMEOUT_MS - HTTP timeout for the push request (default: 30000)
 */

import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const pushUrlRaw = process.env.UPTIME_KUMA_PUSH_URL;
const url = process.env.WALLETSCRUTINY_URL ?? 'https://walletscrutiny.com/';
const expectedText =
  process.env.NOSTR_HEALTHCHECK_TEXT ?? 'Reproducible when tested';
const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS ?? 20_000);
const pushTimeoutMs = Number(process.env.UPTIME_KUMA_PUSH_TIMEOUT_MS ?? 30_000);

if (!Number.isFinite(timeoutMs) || timeoutMs < 1) {
  console.error('Invalid HEALTHCHECK_TIMEOUT_MS');
  process.exit(1);
}

if (!Number.isFinite(pushTimeoutMs) || pushTimeoutMs < 1) {
  console.error('Invalid UPTIME_KUMA_PUSH_TIMEOUT_MS');
  process.exit(1);
}

function resolveChromiumExecutable() {
  const fromEnv = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (fromEnv && existsSync(fromEnv)) {
    return fromEnv;
  }
  const candidates = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      return p;
    }
  }
  return undefined;
}

/**
 * @param {'up' | 'down'} status
 * @param {string} msg
 * @param {number | undefined} pingMs
 */
async function notifyUptimeKuma(status, msg, pingMs) {
  if (!pushUrlRaw) {
    return;
  }

  let target;
  try {
    target = new URL(pushUrlRaw);
  } catch {
    console.error('Invalid UPTIME_KUMA_PUSH_URL (not a valid URL)');
    process.exitCode = 1;
    throw new Error('Invalid push URL');
  }

  target.searchParams.set('status', status);
  target.searchParams.set('msg', msg.slice(0, 2000));
  if (pingMs != null && Number.isFinite(pingMs)) {
    target.searchParams.set('ping', String(Math.max(0, Math.round(pingMs))));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), pushTimeoutMs);
  let res;
  try {
    res = await fetch(target, { method: 'GET', signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Uptime Kuma push HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`
    );
  }
}

const executablePath = resolveChromiumExecutable();
const launchOptions = { headless: true };
if (executablePath) {
  launchOptions.executablePath = executablePath;
}

const browser = await chromium.launch(launchOptions);
let pageOk = false;
let pingMs;
let lastErrorMessage = '';

try {
  const t0 = Date.now();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  const locator = page.getByText(expectedText, { exact: false });
  await locator.first().waitFor({ state: 'visible', timeout: timeoutMs });

  pingMs = Date.now() - t0;
  pageOk = true;
  console.log(
    `OK: found visible text matching "${expectedText}" on ${url} (${pingMs} ms)`
  );
} catch (err) {
  lastErrorMessage = err && err.message ? err.message : String(err);
  console.error(`FAIL: did not find "${expectedText}" on ${url}`);
  console.error(lastErrorMessage);
  process.exitCode = 1;
} finally {
  await browser.close();
}

const kumaMsg = pageOk
  ? `Nostr UI: found "${expectedText}"`
  : `Nostr UI: missing "${expectedText}" (${lastErrorMessage})`;

try {
  await notifyUptimeKuma(pageOk ? 'up' : 'down', kumaMsg, pingMs);
} catch (err) {
  if (pushUrlRaw) {
    console.error('Uptime Kuma notification failed:', err.message || err);
    process.exitCode = 1;
  }
}

if (!pushUrlRaw) {
  console.error(
    'Note: UPTIME_KUMA_PUSH_URL is unset; Uptime Kuma was not notified.'
  );
}
