import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
  waitForVerificationModalReady,
  waitForAsciinemaPlayerContent,
} from './helpers.mjs';

const ZEUS_VERIFICATION_PATH =
  '/mobile/app.zeusln.zeus/#verificationId=e0d4f6afce7bff841dd6ed6a4d158baf9c98a5a547581e0969087202e6b248c9';

test.describe('ZEUS verification detail page', () => {
  test('loads once and validates all verification sections', async ({ page }, testInfo) => {
    test.setTimeout(180_000);

    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await page.goto(ZEUS_VERIFICATION_PATH);
    await waitForVerificationsUi(page);
    await waitForLoadingSpinnerHidden(page);

    const modal = page.locator('#verificationModal');
    const content = page.locator('#verificationContent');

    await expect(modal).toBeVisible({ timeout: 60_000 });
    await waitForVerificationModalReady(page, {
      requireBasedOn: true,
      requireAttachments: true,
      timeout: 120_000,
    });

    await test.step('Verification general info', async () => {
      await expect.soft(content).toContainText(
        'Hash of the binary reproduced: 709e379506f7d86cfb146493441fc72b7f20cb90578a9b26b9ca9da374782caf',
      );
      await expect.soft(content).toContainText('Application: ZEUS Wallet');
      await expect.soft(content).toContainText('Version: 13.0.1');
      await expect.soft(content).toContainText(/Created At:\s*(?:8\s+\w+\.?\s+2026,\s*18:59|May 8, 2026, 06:59 PM)/i);
      await expect.soft(content).toContainText('Build status:');
      await expect.soft(content).toContainText('Reproducible when tested');
      await expect.soft(content).toContainText(
        'Automatic verification by WalletScrutiny Build Server for wallet version 13.0.1',
      );
    });

    await test.step('Profile and based_on loading', async () => {
      const attemptBy = content.locator('#attempt-by');
      const basedOnAttemptBy = content.locator('#based-on-attempt-by');

      await expect.soft(content).toContainText('Attempt by:');
      await expect.soft(attemptBy).toContainText('walletscrutiny_bot');

      await expect.soft(content).toContainText('Based on an attempt by:');
      await expect.soft(basedOnAttemptBy).toContainText('dannybuntu');
    });

    await test.step('Scripts loading', async () => {
      const attachmentsList = content.locator('#verification-attachments-list');

      await expect.soft(content).toContainText('Scripts used to reproduce:');
      await expect.soft(attachmentsList).toContainText('zeus_build.sh');
      await expect.soft(attachmentsList).toContainText('33 kB');
      await expect.soft(attachmentsList.locator('[title="Download zeus_build.sh"]')).toBeVisible();
      await expect.soft(attachmentsList.locator('[title="Preview zeus_build.sh"]')).toBeVisible();
    });

    await test.step('Comments', async () => {
      const commentsSection = content.locator('.comments-section');

      await expect.soft(commentsSection).toContainText('Comments');
      await expect.soft(commentsSection.locator('.comment-author-name')).toContainText('btc_remnant', {
        timeout: 60_000,
      });
      await expect.soft(commentsSection.locator('.comment-body')).toContainText('Test comment! 1234');
    });

    await test.step('Information asciinema player', async () => {
      const player = content.locator('#ascii_cast_player');

      await expect.soft(content).toContainText('Information:');
      await expect.soft(player).toBeVisible();

      await waitForAsciinemaPlayerContent(page, 120_000);
      await expect.soft(player).not.toBeEmpty();
    });

    assertNoConsoleErrors();
  });
});
