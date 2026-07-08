import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForNostrAssetInformation,
  waitForHomepageQueryApplied,
  measureHomepageSearchAfterDebounce,
  NOSTR_DATA_TIMEOUT_MS,
  HOMEPAGE_COMMON_SEARCH_MAX_MS,
  assertNoLoadingSpinnerVisible,
} from './helpers.mjs';

test.describe('Homepage', () => {
  test('loads wallet grid with Nostr verification data', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/');

    await expect(page).toHaveTitle(/WalletScrutiny/i);
    await expect(page.locator('h1, .page__title').first()).toContainText(/wallet/i);

    await expect(page.locator('.AppDisplayCard').first()).toBeVisible({ timeout: 30_000 });

    await waitForNostrAssetInformation(page, NOSTR_DATA_TIMEOUT_MS);

    const verificationIndicators = page.locator('.AppDisplayCard .score').filter({
      hasText: /Reproducible|Not reproducible|Not verified|Failed to build|Source not found/i,
    });
    await expect(verificationIndicators.first()).toBeVisible({ timeout: NOSTR_DATA_TIMEOUT_MS });

    await assertNoLoadingSpinnerVisible(page);
    assertNoConsoleErrors();
  });

  test('filters wallets via the homepage search input', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/');
    await expect(page.locator('.AppDisplayCard').first()).toBeVisible({ timeout: 30_000 });
    await waitForNostrAssetInformation(page);

    const searchInput = page.locator('#homepageSearch .query-string');
    await searchInput.fill('mycelium');
    await page.waitForTimeout(600);

    await expect(page.locator('.AppDisplayCard').filter({ hasText: /mycelium/i }).first()).toBeVisible({
      timeout: 15_000,
    });

    const visibleCards = page.locator('.AppDisplayCard');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(12);

    assertNoConsoleErrors();
  });

  test('filters a common term within a performance budget', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/');
    await expect(page.locator('.AppDisplayCard').first()).toBeVisible({ timeout: 30_000 });
    await waitForNostrAssetInformation(page);
    await page.waitForFunction(() => window.allWalletsLoaded === true, null, { timeout: 30_000 });

    const searchInput = page.locator('#homepageSearch .query-string');
    await searchInput.fill('bit');
    const searchWorkMs = await measureHomepageSearchAfterDebounce(page, 'bit');

    expect(
      searchWorkMs,
      `homepage filter+render for "bit" after debounce took ${searchWorkMs}ms`,
    ).toBeLessThan(HOMEPAGE_COMMON_SEARCH_MAX_MS);

    await waitForHomepageQueryApplied(page, 'bit');

    const visibleCards = page.locator('.AppDisplayCard');
    expect(await visibleCards.count()).toBeGreaterThan(0);
    expect(await visibleCards.count()).toBeLessThanOrEqual(12);

    assertNoConsoleErrors();
  });
});
