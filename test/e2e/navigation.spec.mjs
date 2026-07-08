import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForNostrAssetInformation,
  waitForVerificationsUi,
  assertNoLoadingSpinnerVisible,
} from './helpers.mjs';

test.describe('Navigation and read-only pages', () => {
  test('wallet review page shows analysis content and verification table', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/mobile/com.mycelium.wallet/');

    await expect(page.locator('h1.page__title')).toContainText(/mycelium/i);
    await expect(page.locator('.app-review, .page__content').first()).toBeVisible();

    await waitForVerificationsUi(page);
    await waitForNostrAssetInformation(page);

    const verificationTable = page.locator('#appsTable-android table, #appsTable-iphone table, #appsTable table').first();
    await expect(verificationTable).toBeVisible({ timeout: 60_000 });
    await expect(verificationTable.locator('tr').nth(1)).toBeVisible();

    await assertNoLoadingSpinnerVisible(page);
    assertNoConsoleErrors();
  });

  test('methodology page loads static documentation', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/methodology/');

    await expect(page.locator('h1.page__title')).toContainText(/methodology/i);
    await expect(page.locator('.tabulation .tab').first()).toBeVisible();
    await expect(page.locator('.tab-payloads .tab-container').first()).not.toBeEmpty();

    assertNoConsoleErrors();
  });

  test('about page loads team information', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/about/');

    await expect(page.locator('h1').first()).toContainText(/transparency/i);
    await expect(page.getByRole('heading', { name: /meet our core team/i })).toBeVisible();

    assertNoConsoleErrors();
  });
});
