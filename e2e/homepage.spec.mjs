import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForNostrAssetInformation,
  NOSTR_DATA_TIMEOUT_MS,
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
});
