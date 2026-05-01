/**
 * Loads the WalletScrutiny homepage and waits for text that appears once
 * Nostr-backed verification data has been rendered (e.g. a reproducible status),
 * then notifies Uptime Kuma via a Push monitor URL.
 *
 * Environment:
 *   UPTIME_KUMA_CONTENT_PUSH_URL - Push URL for the "text is visible" check
 *     (optional; if unset, this check is not pushed to Kuma)
 *   UPTIME_KUMA_JS_PUSH_URL - Push URL for the "no JavaScript errors" check
 *     (optional; if unset, this check is not pushed to Kuma)
 *   WALLETSCRUTINY_URL   - page to open (default: https://walletscrutiny.com/)
 *   NOSTR_HEALTHCHECK_TEXT - substring to wait for (default: Reproducible when tested)
 *   HEALTHCHECK_TIMEOUT_MS - max wait in ms (default: 40000)
 *   PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH - Chromium/Chrome binary (optional; common
 *     system paths are tried if unset; run `npm run install-browsers` where supported)
 *   UPTIME_KUMA_PUSH_TIMEOUT_MS - HTTP timeout for the push request (default: 30000)
 */

import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const contentPushUrlRaw = process.env.UPTIME_KUMA_CONTENT_PUSH_URL;
const jsPushUrlRaw = process.env.UPTIME_KUMA_JS_PUSH_URL;
const url = process.env.WALLETSCRUTINY_URL ?? 'https://walletscrutiny.com/';
const expectedText =
  process.env.NOSTR_HEALTHCHECK_TEXT ?? 'Reproducible when tested';
const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS ?? 40_000);
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
 * @param {string | undefined} pushUrlRaw
 * @param {'up' | 'down'} status
 * @param {string} msg
 * @param {number | undefined} pingMs
 */
async function notifyUptimeKuma(pushUrlRaw, status, msg, pingMs) {
  if (!pushUrlRaw) {
    return;
  }

  let target;
  try {
    target = new URL(pushUrlRaw);
  } catch {
    console.error(
      'Invalid push URL (check UPTIME_KUMA_CONTENT_PUSH_URL / UPTIME_KUMA_JS_PUSH_URL)'
    );
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
let contentOk = false;
let jsOk = false;
let pingMs;
let contentErrorMessage = '';
let jsErrorMessage = '';
const consoleErrors = [];

try {
  const t0 = Date.now();
  const page = await browser.newPage();

  // Track both explicit console.error calls and uncaught runtime exceptions.
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.startsWith('WebSocket connection to')) {
        consoleErrors.push(`console.error: ${text}`);
      }
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(`pageerror: ${err && err.message ? err.message : String(err)}`);
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  const locator = page.getByText(expectedText, { exact: false });
  await locator.first().waitFor({ state: 'visible', timeout: timeoutMs });

  pingMs = Date.now() - t0;
  contentOk = true;
  console.log(
    `OK: found visible text matching "${expectedText}" on ${url} (${pingMs} ms)`
  );
} catch (err) {
  contentErrorMessage = err && err.message ? err.message : String(err);
  console.error(`FAIL: did not find "${expectedText}" on ${url}`);
  console.error(contentErrorMessage);
} finally {
  await browser.close();
}

if (consoleErrors.length > 0) {
  jsErrorMessage = `Detected ${consoleErrors.length} JavaScript console/runtime error(s): ${consoleErrors.join(
    ' | '
  )}`;
  console.error(`FAIL: ${jsErrorMessage}`);
} else {
  jsOk = true;
  console.log(`OK: no JavaScript console/runtime errors detected on ${url}`);
}

try {
  const contentKumaMsg = contentOk
    ? `Nostr UI seen "${expectedText}"`
    : `Nostr UI missing "${expectedText}" (${contentErrorMessage})`;
  await notifyUptimeKuma(
    contentPushUrlRaw,
    contentOk ? 'up' : 'down',
    contentKumaMsg,
    pingMs
  );
} catch (err) {
  if (contentPushUrlRaw) {
    console.error('Uptime Kuma content notification failed:', err.message || err);
    process.exitCode = 1;
  }
}

try {
  const jsKumaMsg = jsOk
    ? 'No JavaScript errors'
    : `JavaScript errors detected (${jsErrorMessage})`;
  await notifyUptimeKuma(jsPushUrlRaw, jsOk ? 'up' : 'down', jsKumaMsg, pingMs);
} catch (err) {
  if (jsPushUrlRaw) {
    console.error('Uptime Kuma JS notification failed:', err.message || err);
    process.exitCode = 1;
  }
}

if (!contentPushUrlRaw && !jsPushUrlRaw) {
  console.error(
    'Note: no Uptime Kuma push URL is set; checks ran locally only.'
  );
}

if (!contentOk || !jsOk) {
  process.exitCode = 1;
}
