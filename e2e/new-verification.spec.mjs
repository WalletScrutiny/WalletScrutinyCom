import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
} from './helpers.mjs';

test.describe('New verification form', () => {
  test('App ID autocomplete suggests jade-related wallets', async ({ page }, testInfo) => {
    await page.goto('/new_verification/');
    await waitForVerificationsUi(page);
    await page.waitForFunction(
      () => Array.isArray(window.wallets) && window.wallets.length > 0,
      null,
      { timeout: 60_000 },
    );
    await waitForLoadingSpinnerHidden(page);

    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    const appIdInput = page.locator('#appId');
    await expect(appIdInput).toBeVisible();
    await appIdInput.fill('jade');

    const suggestions = page.locator('#appIdSuggestions .suggestion-item');
    await expect(suggestions.first()).toBeVisible({ timeout: 15_000 });

    const count = await suggestions.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      await expect(suggestions.nth(i)).toContainText(/jade/i);
    }

    assertNoConsoleErrors();
  });
});
