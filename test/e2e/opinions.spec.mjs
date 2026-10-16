import { test, expect } from '@playwright/test';

import { attachConsoleGuards, injectNip07Signer, NOSTR_DATA_TIMEOUT_MS } from './helpers.mjs';

/** Wallet page with approved opinions on the relays (see _includes/allOpinions.json). */
const WALLET_PAGE_PATH = '/mobile/com.samourai.wallet/';

test.describe('Community opinions', () => {
  test('lists the approved opinions with their sentiment counts', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(WALLET_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    await expect(section).toBeVisible();
    await expect(section.locator('.opinions__headline')).toHaveText(/Community Opinions \(\d+\/\d+\)/, {
      timeout: NOSTR_DATA_TIMEOUT_MS,
    });

    await expect(section.locator('.opinions__counts li')).toHaveCount(3);
    await expect(section.locator('.opinions__filter[aria-pressed="true"]')).toHaveText('Approved');

    const cards = section.locator('.opinion-card');
    await expect(cards.first()).toBeVisible({ timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(cards.first().locator('.opinion-card__content')).not.toBeEmpty();
    await expect(cards.first().locator('.opinion-card__approved')).toBeVisible();
    await expect(cards.first().locator('.opinion-card__meta a')).toHaveAttribute('href', /njump\.me/);

    assertNoConsoleErrors();
  });

  test('opens the editor for a signed-in extension user', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await injectNip07Signer(page);

    await page.goto(WALLET_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    await expect(section.locator('.opinions__headline')).toHaveText(/Community Opinions \(\d+\/\d+\)/, {
      timeout: NOSTR_DATA_TIMEOUT_MS,
    });

    await section.getByRole('button', { name: 'Add your opinion' }).click();

    const panel = section.locator('.opinions__compose-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('.opinions__signed-in')).toContainText('Posting as');
    await expect(panel.locator('.opinions-sentiment-btn[aria-pressed="true"]')).toHaveText('Neutral');
    await expect(panel.locator('.toastui-editor-defaultUI')).toBeVisible({ timeout: 30_000 });
    await expect(panel.locator('.toastui-editor-toolbar-icons.image')).toHaveCount(0);

    await panel.getByRole('button', { name: 'Cancel' }).click();
    await expect(panel).toBeHidden();

    assertNoConsoleErrors();
  });

  test('shows a note instead of the posting controls without an extension', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(WALLET_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    await expect(section.locator('.opinions__headline')).toHaveText(/Community Opinions \(\d+\/\d+\)/, {
      timeout: NOSTR_DATA_TIMEOUT_MS,
    });

    await expect(section.locator('.opinions__no-extension')).toContainText('Nostr extension', { timeout: 15_000 });
    await expect(section.getByRole('button', { name: 'Add your opinion' })).toHaveCount(0);

    const firstCard = section.locator('.opinion-card').first();
    await expect(firstCard).toBeVisible({ timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(firstCard.getByRole('button', { name: 'Reply', exact: true })).toHaveCount(0);
    await expect(firstCard.getByRole('button', { name: 'Like', exact: true })).toBeDisabled();
    await expect(firstCard.getByRole('button', { name: 'Dislike' })).toBeDisabled();

    assertNoConsoleErrors();
  });
});
