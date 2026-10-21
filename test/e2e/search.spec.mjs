import { test, expect } from './relay-fixture.mjs';

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

  test('result cards show no test bars and order each platform: store, stamps, tests, verification', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/assets/');
    await waitForVerificationsUi(page);
    await waitForLoadingSpinnerHidden(page);

    await page.locator('.searchbar').fill('bluewallet');
    await waitForSearchControlsIdle(page);

    const results = page.locator('.results-target');
    const rows = results.locator('.wallet-platform-row--compact');
    await expect(rows).toHaveCount(2);
    await expect(results.locator('.pass, .fail')).toHaveCount(0);
    await expect(results).toContainText(/Passed all\s+\d+ tests/);
    await expect(results).not.toContainText('Not verified yet');
    const lines = await rows.evaluateAll((els) => els.map((el) =>
      [...el.children].map((c) => c.className || c.textContent.trim())));
    for (const line of lines) {
      expect(line.slice(0, 2)).toEqual(['wallet-platform-row__head', 'stats-platform-stamps']);
      expect(line[2]).toMatch(/^Passed /);
      if (line.length > 3) expect(line[3]).toMatch(/^[✅❌] /);
      expect(line.length).toBeLessThanOrEqual(4);
    }

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

  test('a broad term renders a first batch and more rows as the list scrolls', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/methodology/');
    await page.waitForFunction(() => window.wallets && window.wallets.length > 1000);

    await page.locator('.mobile-search-shortcut').click();
    const searchbar = page.locator('.searchbar');
    await searchbar.fill('bitco');
    await waitForSearchControlsIdle(page);

    const rows = page.locator('.results-target li.actionable');
    const firstBatch = await rows.count();
    expect(firstBatch).toBeGreaterThan(0);
    expect(firstBatch).toBeLessThan(100);
    await expect(page.locator('.results-target .search-results-more')).toHaveCount(1);

    await page.locator('.results-target').evaluate((list) => { list.scrollTop = list.scrollHeight; });
    await expect.poll(() => rows.count()).toBeGreaterThan(firstBatch);

    assertNoConsoleErrors();
  });

  test('on desktop the homepage masthead has no search box', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto('/');
    await expect(page.locator('.masthead .searchbar')).toBeHidden();
    await expect(page.locator('.mobile-search-shortcut')).toBeHidden();
    assertNoConsoleErrors();
  });
});
