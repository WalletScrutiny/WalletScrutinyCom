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

  test('android app page links the latest release and the footer reaches it', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/androidApp/');

    await expect(page.locator('h1.page__title')).toContainText(/android app/i);

    const releaseBase = 'https://gitlab.com/walletscrutiny/walletscrutinyandroid/-/releases/permalink/latest/downloads/';
    await expect(page.getByRole('link', { name: /download apk/i })).toHaveAttribute('href', `${releaseBase}walletscrutiny-arm.apk`);
    await expect(page.getByRole('link', { name: /walletscrutiny-arm\.apk\.sha256/ })).toHaveAttribute('href', `${releaseBase}walletscrutiny-arm.apk.sha256`);
    await expect(page.getByRole('link', { name: /add to obtainium/i })).toHaveAttribute('href', /obtainium:\/\/add\/https:\/\/gitlab\.com\/walletscrutiny\/walletscrutinyandroid$/);

    await expect(page.locator('.landing-copy-row__value')).toHaveText('615bf6cba1c73c90b0515e74f871224ba4e7ed6d6355b9d5ee4a5d1c9d28cfb2');
    await expect(page.locator('.android-app-share img')).toBeVisible();

    const footerLink = page.locator('.site-footer__social a[href$="/androidApp/"]');
    await expect(footerLink).toHaveAttribute('aria-label', 'Android app');
    await expect(footerLink.locator('svg.ws-icon-android use')).toHaveAttribute('href', /#android$/);

    assertNoConsoleErrors();
  });

  test('source-available wallet review links the android app', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/mobile/com.mycelium.wallet/');

    const appLink = page.locator('.distribution-store-links a[href$="/androidApp/"]');
    await expect(appLink).toHaveText(/check your install/i);
    await expect(appLink.locator('svg.ws-icon-android')).toBeVisible();

    assertNoConsoleErrors();
  });
});
