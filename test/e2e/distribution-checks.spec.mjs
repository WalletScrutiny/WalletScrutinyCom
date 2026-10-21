import { test, expect } from './relay-fixture.mjs';

import { attachConsoleGuards } from './helpers.mjs';

// The Flathub step on Bisq's page (_includes/review/steps/flathub.html,
// assets/js/distribution-checks.js). Production builds carry no check results yet, so each
// test puts its own into the page; the preview's sample fixtures are replaced too.
const PAGE = '/desktop/bisq/';
const COMMIT = '1b2f946862e570352cc7945ade0d0f14cca64116ee9b8e23c237d63574e36de3';
const PARENT = '6ce1c90858c91f951d9ab640c85f7787588357154b9b4ee108860703d2afe2df';
const UNKNOWN = 'f'.repeat(64);
const CHECKS = [
  {
    commit: COMMIT, version: '1.10.9', checked: '2026-10-21', result: 'matches',
    file: 'Bisq-64bit-1.10.9.deb', sha256: 'a'.repeat(64), verdict: 'ftbfs',
  },
  {
    commit: PARENT, version: '1.10.8', checked: '2026-09-18', result: 'matches',
    file: 'Bisq-64bit-1.10.8.deb', sha256: 'b'.repeat(64), verdict: null,
  },
];
const INFO = `
Bisq - A decentralized bitcoin exchange network

          ID: network.bisq.Bisq
         Ref: app/network.bisq.Bisq/x86_64/stable
     Version: 1.10.9
      Origin: flathub

      Commit: ${COMMIT}
      Parent: ${PARENT}
`;

/** Serves the page with `checks` (or none) as its check results. */
async function withChecks(page, checks) {
  await page.route(`**${PAGE}`, async (route) => {
    const res = await route.fetch();
    let html = (await res.text()).replace(/<script type="application\/json">[^<]*<\/script>/g, '');
    if (checks) {
      const json = JSON.stringify({ checks }).replace(/</g, '\\u003c');
      html = html.replace(/(<div class="distribution-checks"[^>]*>)/, `$1<script type="application/json">${json}</script>`);
    }
    await route.fulfill({ response: res, body: html });
  });
}

async function lookUp(page, text) {
  const form = page.locator('form.distribution-version-lookup');
  await form.locator('textarea').fill(text);
  await form.getByRole('button', { name: 'Look up' }).click();
  return form;
}

test.describe('Flathub step: check results and version lookup', () => {
  test('shows the latest check and history, coloured by the wrapped verdict', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await withChecks(page, CHECKS);
    await page.goto(PAGE);

    const status = page.locator('.distribution-status');
    const headline = status.locator('.distribution-result').first();
    await expect(headline).toContainText('WalletScrutiny checked Flathub 1.10.9 (commit 1b2f9468) on 2026-10-21');
    await expect(headline).toContainText('matches Bisq-64bit-1.10.9.deb, whose verdict is failed to build from source');
    await expect(headline).toHaveClass(/distribution-tone-bad/);
    await expect(status.locator('table.distribution-history tbody tr')).toHaveCount(2);
    await expect(page.locator('details.distribution-diy')).not.toHaveAttribute('open', '');
    assertNoConsoleErrors();
  });

  test('says "not checked yet" when there are no results', async ({ page }) => {
    await withChecks(page, null);
    await page.goto(PAGE);
    await expect(page.locator('.distribution-status .distribution-result')).toHaveText('Not checked by WalletScrutiny yet.');
    await expect(page.locator('.distribution-version-picker')).toBeHidden();
  });

  test('a full flatpak info paste finds the installed commit, not the parent', async ({ page }) => {
    await withChecks(page, CHECKS);
    await page.goto(PAGE);
    const form = await lookUp(page, INFO);
    const answer = form.locator('.distribution-lookup-output');
    await expect(answer).toContainText('Flathub 1.10.9 (commit 1b2f9468)');
    await expect(answer).not.toContainText('1.10.8');
    await expect(form.locator('.distribution-lookup-error')).toBeHidden();
  });

  test('a commit-only paste works', async ({ page }) => {
    await withChecks(page, CHECKS);
    await page.goto(PAGE);
    const form = await lookUp(page, `      Commit: ${PARENT}`);
    await expect(form.locator('.distribution-lookup-output')).toContainText('matches Bisq-64bit-1.10.8.deb, whose verdict is no verdict');
  });

  test('an unknown commit says "not checked by us" and opens the fallback', async ({ page }) => {
    await withChecks(page, CHECKS);
    await page.goto(PAGE);
    const form = await lookUp(page, UNKNOWN);
    await expect(form.locator('.distribution-lookup-output')).toContainText('Not checked by us');
    await expect(page.locator('details.distribution-diy')).toHaveAttribute('open', '');
  });

  test('malformed input shows an error and renders nothing', async ({ page }) => {
    await withChecks(page, CHECKS);
    await page.goto(PAGE);
    for (const text of ['Commit: <img src=x onerror=window.pwned=1>', 'hello', `${COMMIT}\n${PARENT}`]) {
      const form = await lookUp(page, text);
      await expect(form.locator('.distribution-lookup-error')).toBeVisible();
      await expect(form.locator('.distribution-lookup-output')).toBeEmpty();
    }
    const otherApp = await lookUp(page, INFO.replace('ID: network.bisq.Bisq', 'ID: org.example.Other'));
    await expect(otherApp.locator('.distribution-lookup-error')).toContainText('another app');
    expect(await page.evaluate(() => window.pwned)).toBeUndefined();
    await expect(page.locator('.distribution-checks img')).toHaveCount(0);
  });

  test('a malformed check entry is dropped, not shown', async ({ page }) => {
    await withChecks(page, [{ ...CHECKS[0], file: '<img src=x onerror=window.pwned=1>' }, CHECKS[1]]);
    await page.goto(PAGE);
    await expect(page.locator('.distribution-status table tbody tr')).toHaveCount(1);
    await expect(page.locator('.distribution-status .distribution-result').first()).toContainText('1.10.8');
    expect(await page.evaluate(() => window.pwned)).toBeUndefined();
  });

  test('picking a version lists its checked commits', async ({ page }) => {
    await withChecks(page, CHECKS);
    await page.goto(PAGE);
    await page.locator('.distribution-version-picker select').selectOption('1.10.8');
    await expect(page.locator('.distribution-lookup-output')).toContainText('Flathub 1.10.8 (commit 6ce1c908)');
  });
});

test.describe('Flathub step without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('says why there is no result and still offers the commands', async ({ page }) => {
    await page.goto(PAGE);
    const step = page.locator('.flathub-package');
    await expect(step.locator('.distribution-status')).toContainText('Not checked by WalletScrutiny yet.');
    await expect(step.locator('.distribution-status')).toContainText('Our results need JavaScript');
    await expect(step.locator('form.distribution-version-lookup')).toBeHidden();
    await step.locator('details.distribution-diy summary').click();
    await expect(step.locator('details.distribution-diy pre')).toContainText('flatpak install --user --no-deploy');
  });
});
