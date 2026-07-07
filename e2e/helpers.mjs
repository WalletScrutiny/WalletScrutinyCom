/** @typedef {import('@playwright/test').Page} Page */

export const NOSTR_DATA_TIMEOUT_MS = 60_000;
export const SPINNER_TIMEOUT_MS = 60_000;
export const SEARCH_WORKING_TIMEOUT_MS = 30_000;

const IGNORED_CONSOLE_PATTERNS = [
  /^WebSocket connection to/,
  /^Failed to load resource: net::ERR_/,
  /No signer available/,
];

function shouldIgnoreConsoleMessage(text) {
  return IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Attach listeners that fail the test on unexpected console/page errors.
 * @param {import('@playwright/test').TestInfo} testInfo
 * @param {Page} page
 */
export function attachConsoleGuards(testInfo, page) {
  const errors = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error') {
      return;
    }
    const text = msg.text();
    if (shouldIgnoreConsoleMessage(text)) {
      return;
    }
    errors.push(`console.error: ${text}`);
  });

  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err?.message || String(err)}`);
  });

  return () => {
    if (errors.length > 0) {
      throw new Error(`Unexpected browser errors:\n${errors.join('\n')}`);
    }
  };
}

/**
 * Wait until Nostr asset information has been loaded into the page.
 * @param {Page} page
 * @param {number} [timeout]
 */
export async function waitForNostrAssetInformation(page, timeout = NOSTR_DATA_TIMEOUT_MS) {
  await page.waitForFunction(
    () => typeof window.allAssetInformation !== 'undefined' && window.allAssetInformation !== null,
    { timeout },
  );
}

/**
 * Wait until verification UI bundles are available.
 * @param {Page} page
 * @param {number} [timeout]
 */
export async function waitForVerificationsUi(page, timeout = NOSTR_DATA_TIMEOUT_MS) {
  await page.waitForFunction(
    () => typeof window.renderAssetsTable === 'function',
    { timeout },
  );
}

/**
 * Wait for the global loading overlay to be hidden.
 * @param {Page} page
 * @param {number} [timeout]
 */
export async function waitForLoadingSpinnerHidden(page, timeout = SPINNER_TIMEOUT_MS) {
  await page.waitForFunction(() => {
    const spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
      return true;
    }
    const style = window.getComputedStyle(spinner);
    return style.display === 'none' || style.visibility === 'hidden';
  }, { timeout });
}

/**
 * Wait for masthead search debounce/spinner to finish.
 * @param {Page} page
 * @param {number} [timeout]
 */
export async function waitForSearchControlsIdle(page, timeout = SEARCH_WORKING_TIMEOUT_MS) {
  await page.waitForFunction(() => {
    const controls = document.querySelector('.search-controls');
    if (!controls) {
      return true;
    }
    return !controls.classList.contains('working');
  }, { timeout });
}

/**
 * @param {Page} page
 */
export async function assertNoLoadingSpinnerVisible(page) {
  const spinner = page.locator('#loadingSpinner');
  await spinner.waitFor({ state: 'hidden', timeout: 5_000 });
}
