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

  for (const path of ['/methodology/', '/']) {
    test(`on phones ${path} hides the box behind the magnifier next to the menu button`, async ({ page }, testInfo) => {
      const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);

      const searchbar = page.locator('.searchbar');
      const shortcut = page.locator('.mobile-search-shortcut');
      const menuToggle = page.locator('.greedy-nav__toggle');
      await expect(searchbar).toBeHidden();
      await expect(shortcut).toBeVisible();
      await expect(menuToggle).toBeVisible();

      const shortcutBox = await shortcut.boundingBox();
      const menuBox = await menuToggle.boundingBox();
      expect(shortcutBox.x).toBeLessThan(menuBox.x);
      expect(menuBox.x - (shortcutBox.x + shortcutBox.width)).toBeLessThan(40);

      await shortcut.click();
      await expect(searchbar).toBeVisible();
      await expect(searchbar).toBeFocused();
      const barBox = await searchbar.boundingBox();
      expect(barBox.y).toBeGreaterThan(menuBox.y + menuBox.height);

      await searchbar.fill('mycelium');
      await waitForSearchControlsIdle(page);
      await expect(page.locator('.results-target li').first()).toBeVisible();

      await shortcut.click();
      await expect(searchbar).toBeHidden();
      assertNoConsoleErrors();
    });
  }

  test('on desktop the homepage masthead has no search box', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/');
    await expect(page.locator('.masthead .searchbar')).toBeHidden();
    await expect(page.locator('.mobile-search-shortcut')).toBeHidden();
    assertNoConsoleErrors();
  });
});
