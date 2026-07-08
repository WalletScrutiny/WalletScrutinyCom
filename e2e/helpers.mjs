import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from '@playwright/test';

/** @typedef {import('@playwright/test').Page} Page */

const E2E_DIR = fileURLToPath(new URL('.', import.meta.url));
const DROP_AREA_FIXTURE_DIR = join(E2E_DIR, 'fixtures', 'drop-area');

export const NOSTR_DATA_TIMEOUT_MS = 60_000;
export const NOSTR_PROFILE_TIMEOUT_MS = Number(process.env.NOSTR_PROFILE_TIMEOUT_MS || (process.env.CI ? 120_000 : 90_000));
export const SPINNER_TIMEOUT_MS = 60_000;
export const SEARCH_WORKING_TIMEOUT_MS = 30_000;
/** Max time for homepage search work after the debounce fires (filter + re-render). */
export const HOMEPAGE_COMMON_SEARCH_MAX_MS = Number(process.env.HOMEPAGE_SEARCH_MAX_MS || 500);
/** Upper bound while waiting for debounce + search to finish (not the performance assertion). */
export const HOMEPAGE_SEARCH_WAIT_TIMEOUT_MS = 15_000;

const IGNORED_CONSOLE_PATTERNS = [
  /^WebSocket connection to/,
  /^Failed to load resource: net::ERR_/,
  /^Failed to load resource: the server responded with a status of 404/,
  /No signer available/,
  /Failed to parse APK metadata/,
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
    null,
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
    null,
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
  }, null, { timeout });
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
  }, null, { timeout });
}

/**
 * @param {Page} page
 */
export async function assertNoLoadingSpinnerVisible(page) {
  const spinner = page.locator('#loadingSpinner');
  await spinner.waitFor({ state: 'hidden', timeout: 5_000 });
}

/**
 * Wait until the homepage query-string filter has been applied to the grid.
 * @param {Page} page
 * @param {string} queryText
 * @param {number} [timeout]
 */
export async function waitForHomepageQueryApplied(page, queryText, timeout = HOMEPAGE_SEARCH_WAIT_TIMEOUT_MS) {
  const expected = queryText.toUpperCase();
  await page.waitForFunction((query) => {
    const params = new URLSearchParams(window.location.search);
    const current = params.get('query-string');
    if (!current || decodeURIComponent(current).toUpperCase() !== query) {
      return false;
    }
    return document.querySelectorAll('.AppDisplayCard').length > 0;
  }, expected, { timeout });
}

/**
 * Measure homepage filter work after the 500ms input debounce (URL updated, grid not yet checked).
 * @param {Page} page
 * @param {string} queryText
 * @param {number} [timeout]
 * @returns {Promise<number>} milliseconds for filter + re-render after debounce
 */
export async function measureHomepageSearchAfterDebounce(page, queryText, timeout = HOMEPAGE_SEARCH_WAIT_TIMEOUT_MS) {
  const expected = queryText.toUpperCase();
  await page.waitForFunction((query) => {
    const params = new URLSearchParams(window.location.search);
    const current = params.get('query-string');
    return Boolean(current && decodeURIComponent(current).toUpperCase() === query);
  }, expected, { timeout });

  const startedAt = Date.now();
  await page.waitForFunction(() => document.querySelectorAll('.AppDisplayCard').length > 0, null, { timeout });
  return Date.now() - startedAt;
}

/**
 * Inject a minimal NIP-07 signer so zap flows can sign requests in E2E.
 * @param {Page} page
 */
export async function injectNip07Signer(page) {
  await page.addInitScript(() => {
    const pubkey = '0'.repeat(63) + '1';
    window.nostr = {
      getPublicKey: () => pubkey,
      signEvent: async (unsigned) => ({
        ...unsigned,
        pubkey,
        id: 'e'.repeat(64),
        sig: 'f'.repeat(128),
      }),
    };
  });
}

/**
 * Assert the zap modal QR canvas has been drawn with dark and light modules.
 * @param {import('@playwright/test').Locator} qrCanvas
 */
export async function assertQrCodeCanvasRendered(qrCanvas) {
  const hasQrPattern = await qrCanvas.evaluate((canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) {
      return false;
    }
    if (canvas.width < 32 || canvas.height < 32) {
      return false;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return false;
    }

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let darkPixels = 0;
    let lightPixels = 0;
    const totalPixels = canvas.width * canvas.height;

    for (let i = 0; i < data.length; i += 4) {
      const luminance = data[i] + data[i + 1] + data[i + 2];
      if (luminance < 128 * 3) {
        darkPixels += 1;
      } else if (luminance > 200 * 3) {
        lightPixels += 1;
      }
    }

    return darkPixels > totalPixels * 0.05 && lightPixels > totalPixels * 0.05;
  });

  if (!hasQrPattern) {
    throw new Error('Expected QR canvas to contain rendered dark and light modules');
  }
}

export const DROP_AREA_ANALYSIS_TIMEOUT_MS = 180_000;

/**
 * Wait until homepage drag-and-drop handlers are ready.
 * @param {Page} page
 */
export async function waitForHomepageDropAreaReady(page) {
  await waitForVerificationsUi(page);
  await page.locator('.hero .drop-areas').first().waitFor({ state: 'visible' });
  await page.waitForFunction(
    () => typeof window.calculateFileHash === 'function',
    null,
    { timeout: NOSTR_DATA_TIMEOUT_MS },
  );
}

/**
 * Drop a fixture file onto the homepage drop area.
 * Uses the hidden file input, which invokes the same handler as a native drop event.
 * @param {Page} page
 * @param {string} fixtureFileName file inside e2e/fixtures/drop-area
 */
export async function dropFileOnHomepageDropArea(page, fixtureFileName) {
  const filePath = join(DROP_AREA_FIXTURE_DIR, fixtureFileName);
  const dropArea = page.locator('.hero .drop-areas').first();
  const fileInput = dropArea.locator('input.fileElems').first();

  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for homepage drop-area analysis output.
 * @param {Page} page
 * @param {number} [timeout]
 */
export async function waitForHomepageDropAreaAnalysis(page, timeout = DROP_AREA_ANALYSIS_TIMEOUT_MS) {
  const resultBox = page.locator('.hero .drop-area-textbox').first();
  await waitForLoadingSpinnerHidden(page, timeout);
  await resultBox.waitFor({ state: 'attached', timeout });
  await page.waitForFunction(() => {
    const box = document.querySelector('.hero .drop-area-textbox');
    return box != null && box.textContent.trim().length > 0;
  }, null, { timeout });
  return resultBox;
}

/**
 * Wait until the verification modal is open and async sections have finished loading.
 * @param {Page} page
 * @param {{ requireBasedOn?: boolean, requireAttachments?: boolean, timeout?: number }} [options]
 */
export async function waitForVerificationModalReady(page, options = {}) {
  const {
    requireBasedOn = false,
    requireAttachments = false,
    timeout = NOSTR_DATA_TIMEOUT_MS,
  } = options;

  await page.waitForFunction(({ requireBasedOn, requireAttachments }) => {
    const modal = document.getElementById('verificationModal');
    if (!modal || modal.style.display !== 'flex') {
      return false;
    }

    const attemptBy = document.getElementById('attempt-by');
    if (!attemptBy || !attemptBy.textContent.trim()) {
      return false;
    }

    if (requireBasedOn) {
      const basedOn = document.getElementById('based-on-attempt-by');
      if (!basedOn || !basedOn.textContent.trim()) {
        return false;
      }
    }

    if (requireAttachments) {
      const attachmentsList = document.getElementById('verification-attachments-list');
      if (!attachmentsList || /loading scripts/i.test(attachmentsList.textContent)) {
        return false;
      }
    }

    return true;
  }, { requireBasedOn, requireAttachments }, { timeout });
}

/**
 * Wait until the asciinema player is visible and shows terminal output.
 * @param {Page} page
 * @param {number} [timeout]
 */
export async function waitForAsciinemaPlayerContent(page, timeout = NOSTR_DATA_TIMEOUT_MS) {
  const player = page.locator('#ascii_cast_player');
  await player.waitFor({ state: 'visible', timeout });
  await page.waitForFunction(() => {
    const playerEl = document.getElementById('ascii_cast_player');
    return playerEl != null && playerEl.textContent.trim().length > 0;
  }, null, { timeout });
}

function looksLikeNostrProfileFallback(text) {
  const value = String(text ?? '').trim();
  return /^(npub1|nprofile1|[0-9a-f]{64})/i.test(value) || /…/.test(value);
}

/**
 * Wait for a live Nostr profile display name, reloading once if stuck on npub/pubkey fallback.
 * @param {Page} page
 * @param {import('@playwright/test').Locator} locator
 * @param {string} displayName
 * @param {{ timeout?: number, reloadUrl?: string, reloadReady?: (page: Page) => Promise<void> }} [options]
 */
export async function waitForNostrDisplayName(page, locator, displayName, options = {}) {
  const {
    timeout = NOSTR_PROFILE_TIMEOUT_MS,
    reloadUrl,
    reloadReady,
  } = options;

  const deadline = Date.now() + timeout;
  let reloaded = false;

  while (Date.now() < deadline) {
    const text = (await locator.textContent())?.trim() ?? '';
    if (text.includes(displayName)) {
      return;
    }

    const remaining = deadline - Date.now();
    if (
      looksLikeNostrProfileFallback(text) &&
      reloadUrl &&
      reloadReady &&
      !reloaded &&
      remaining > 30_000
    ) {
      await page.goto(reloadUrl);
      await reloadReady(page);
      reloaded = true;
      continue;
    }

    await page.waitForTimeout(1_000);
  }

  await expect(locator).toContainText(displayName, { timeout: 5_000 });
}
