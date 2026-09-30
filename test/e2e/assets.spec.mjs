import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
  assertNoLoadingSpinnerVisible,
} from './helpers.mjs';

test.describe('Assets registry', () => {
  test('renders the assets table and hides the loading spinner', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/assets/');

    await expect(page.locator('h1.page__title')).toContainText(/asset registry/i);

    await waitForVerificationsUi(page);
    await waitForLoadingSpinnerHidden(page);
    await assertNoLoadingSpinnerVisible(page);

    const table = page.locator('#binariesTable table');
    await expect(table).toBeVisible({ timeout: 60_000 });
    await expect(table.locator('tbody tr, tr').nth(1)).toBeVisible();

    assertNoConsoleErrors();
  });
});
