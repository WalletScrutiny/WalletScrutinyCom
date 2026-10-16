import { test, expect } from '@playwright/test';

import { attachConsoleGuards, injectNip07Signer, NOSTR_DATA_TIMEOUT_MS } from './helpers.mjs';

/** Wallet page with approved opinions on the relays (see _includes/allOpinions.json). */
const WALLET_PAGE_PATH = '/mobile/com.samourai.wallet/';
/** Android wallet with an approved opinion here and a comment on Zapstore (relay.zapstore.dev). */
const BOTH_SOURCES_PAGE_PATH = '/mobile/io.bluewallet.bluewallet/';
/** Android wallet whose only Zapstore comments come from an account without a Nostr profile. */
const UNIDENTIFIED_ZAPSTORE_PAGE_PATH = '/mobile/de.schildbach.wallet/';
/** Android wallet with comments on Zapstore but no opinion on WalletScrutiny. */
const ZAPSTORE_ONLY_PAGE_PATH = '/mobile/com.blitzwallet/';
/** Android wallet with comments on Zapstore and only unknown-author opinions here. */
const UNAPPROVED_AND_ZAPSTORE_PAGE_PATH = '/mobile/com.cakewallet.cake_wallet/';

/** The widget has fetched the opinions (or failed); the body drops aria-busy either way. */
async function expectLoaded(section) {
  await expect(section.locator('.opinions__body')).not.toHaveAttribute('aria-busy', 'true', {
    timeout: NOSTR_DATA_TIMEOUT_MS,
  });
  await expect(section.locator('.opinions__status--error')).toHaveCount(0);
}

/** Every card names its author: a profile picture or a profile name, never only a shortened npub. */
async function expectIdentifiedAuthors(section) {
  const cards = await section.locator('.opinion-card').all();
  expect(cards.length).toBeGreaterThan(0);
  for (const card of cards) {
    const name = await card.locator('.opinion-card__name').first().innerText();
    const avatar = await card.locator('.opinion-card__avatar').first().getAttribute('src');
    expect(/^npub1/.test(name) && /profile-placeholder/.test(avatar ?? ''), `${name} ${avatar}`).toBe(false);
  }
}

test.describe('Community opinions', () => {
  test('lists the approved opinions with their sentiment counts', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(WALLET_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    await expect(section).toBeVisible();
    await expectLoaded(section);

    await expect(section.locator('.opinions__counts li')).toHaveCount(3);
    await expect(section.locator('.opinions__filter[aria-pressed="true"]')).toHaveText('Approved');

    const cards = section.locator('.opinion-card');
    await expect(cards.first()).toBeVisible({ timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(cards.first().locator('.opinion-card__content')).not.toBeEmpty();
    await expect(cards.first().locator('.opinion-card__approved')).toBeVisible();
    await expect(cards.first().locator('.opinion-card__sentiment')).toHaveText(/^(Positive|Neutral|Negative) opinion$/);
    await expect(cards.first().locator('.opinion-card__meta a')).toHaveCount(0);
    await expect(cards.first().locator('.opinion-card__date')).toHaveText(/ago$|^\d/);
    await expectIdentifiedAuthors(section);

    assertNoConsoleErrors();
  });

  test('hides comments from accounts without a Nostr profile', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(UNIDENTIFIED_ZAPSTORE_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    await expectLoaded(section);
    await expect(section.locator('.opinion-card').first()).toBeVisible({ timeout: NOSTR_DATA_TIMEOUT_MS });
    // Zapstore has comments for this app, all by a pubkey without a kind 0: no tab, no trace.
    await expect(section.locator('.opinions__tab')).toHaveCount(0);
    await expect(section.locator('.opinions__source-note')).toHaveCount(0);
    await expectIdentifiedAuthors(section);
    await section.locator('.opinions__filter', { hasText: 'All opinions' }).click();
    await page.getByRole('button', { name: 'Agree' }).click();
    await expect(section.locator('.opinion-card').nth(1)).toBeVisible();
    await expectIdentifiedAuthors(section);

    assertNoConsoleErrors();
  });

  test('opens the editor for a signed-in extension user', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await injectNip07Signer(page);

    await page.goto(WALLET_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    await expectLoaded(section);

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
    await expectLoaded(section);

    await expect(section.locator('.opinions__no-extension')).toContainText('Nostr extension', { timeout: 15_000 });
    await expect(section.getByRole('button', { name: 'Add your opinion' })).toHaveCount(0);

    const firstCard = section.locator('.opinion-card').first();
    await expect(firstCard).toBeVisible({ timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(firstCard.getByRole('button', { name: 'Reply', exact: true })).toHaveCount(0);
    await expect(firstCard.getByRole('button', { name: 'Like', exact: true })).toBeDisabled();
    await expect(firstCard.getByRole('button', { name: 'Dislike' })).toBeDisabled();

    assertNoConsoleErrors();
  });

  test('offers a Zapstore tab next to the opinions posted here', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(BOTH_SOURCES_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    const tabs = section.locator('.opinions__tab');
    await expect(tabs).toHaveCount(2, { timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(tabs.nth(0)).toContainText('WalletScrutiny');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(1)).toContainText('Zapstore');
    await expect(tabs.nth(1).locator('.opinions__tab-count')).toHaveText(/^[1-9]\d*$/);
    await expect(section.locator('.opinions__filter')).toHaveCount(2);
    await expect(section.locator('.opinion-card__version')).toHaveCount(0);

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(section.locator('.opinions__source-note')).toContainText('posted on Zapstore');
    await expect(section.locator('.opinions__filter')).toHaveCount(0);
    const card = section.locator('.opinion-card').first();
    await expect(card).toBeVisible();
    await expect(card).not.toHaveClass(/opinion-card--reply/);
    await expect(card.locator('.opinion-card__version')).toHaveText(/^v\d/);
    await expect(card.locator('.opinion-card__content')).not.toBeEmpty();
    await expect(card.getByRole('button', { name: 'Like', exact: true })).toHaveCount(0);
    await expect(card.getByRole('button', { name: 'Reply', exact: true })).toHaveCount(0);
    await expect(section.locator('.opinions__compose')).toBeVisible();
    await expectIdentifiedAuthors(section);

    await tabs.nth(0).click();
    await expect(section.locator('.opinions__filter[aria-pressed="true"]')).toHaveText('Approved');
    await expect(section.locator('.opinion-card__version')).toHaveCount(0);

    assertNoConsoleErrors();
  });

  test('shows the Zapstore comments with a note when nobody posted an opinion here', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(ZAPSTORE_ONLY_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    const note = section.locator('.opinions__source-note');
    await expect(note).toContainText('No opinions on WalletScrutiny yet', { timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(section.locator('.opinions__tab')).toHaveCount(0);
    await expect(section.locator('.opinions__toolbar')).toHaveCount(0);
    const card = section.locator('.opinion-card').first();
    await expect(card).toBeVisible();
    await expect(card).not.toHaveClass(/opinion-card--reply/);
    await expect(card.locator('.opinion-card__version')).toHaveText(/^v\d/);
    await expect(card.getByRole('button', { name: 'Like', exact: true })).toHaveCount(0);
    await expectIdentifiedAuthors(section);

    assertNoConsoleErrors();
  });

  test('opens on the Zapstore tab when no approved opinion exists here', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(UNAPPROVED_AND_ZAPSTORE_PAGE_PATH);

    const section = page.locator('#communityOpinions');
    const tabs = section.locator('.opinions__tab');
    await expect(tabs).toHaveCount(2, { timeout: NOSTR_DATA_TIMEOUT_MS });
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(section.locator('.opinions__source-note')).not.toContainText('No opinions on WalletScrutiny yet');
    await expect(section.locator('.opinion-card__version').first()).toBeVisible();

    await tabs.nth(0).click();
    await expect(section.getByRole('button', { name: /Show \d+ opinions? of unknown authors?\./ })).toBeVisible();

    assertNoConsoleErrors();
  });
});
