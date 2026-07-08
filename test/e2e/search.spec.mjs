import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForSearchControlsIdle,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
} from './helpers.mjs';

test.describe('Navbar search', () => {
  test('finds wallets and clears the search spinner', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/assets/');
    await waitForVerificationsUi(page);
    await waitForLoadingSpinnerHidden(page);

    const searchbar = page.locator('.searchbar');
    await expect(searchbar).toBeVisible();

    await searchbar.click();
    await searchbar.fill('mycelium');

    await waitForSearchControlsIdle(page);

    const results = page.locator('.results-target');
    await expect(results).toHaveClass(/visible/);
    await expect(results.locator('li').first()).toBeVisible();
    await expect(results.locator('text=/mycelium/i').first()).toBeVisible();

    assertNoConsoleErrors();
  });

  test('shows no matches message for nonsense queries', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/methodology/');
    await expect(page.locator('.searchbar')).toBeVisible();

    await page.locator('.searchbar').fill('zzzznotawalletname99999');
    await waitForSearchControlsIdle(page);

    await expect(page.locator('.results-target')).toContainText(/no matches/i);
    assertNoConsoleErrors();
  });
});
