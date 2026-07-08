import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
  waitForVerificationModalReady,
  waitForAsciinemaPlayerContent,
  waitForNostrDisplayName,
} from './helpers.mjs';

const ZEUS_VERIFICATION_PATH =
  '/mobile/app.zeusln.zeus/#verificationId=e0d4f6afce7bff841dd6ed6a4d158baf9c98a5a547581e0969087202e6b248c9';

test.describe('ZEUS verification detail page', () => {
  test.describe.configure({ retries: process.env.CI ? 2 : 0 });

  test('loads once and validates all verification sections', async ({ page }, testInfo) => {
    test.setTimeout(process.env.CI ? 300_000 : 180_000);

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

    const waitForZeusVerificationModal = async (targetPage) => {
      await waitForVerificationsUi(targetPage);
      await waitForLoadingSpinnerHidden(targetPage);
      await expect(targetPage.locator('#verificationModal')).toBeVisible({ timeout: 60_000 });
      await waitForVerificationModalReady(targetPage, {
        requireBasedOn: true,
        requireAttachments: true,
        timeout: 120_000,
      });
    };

    const nostrDisplayNameOptions = {
      reloadUrl: ZEUS_VERIFICATION_PATH,
      reloadReady: waitForZeusVerificationModal,
    };

    await test.step('Verification general info', async () => {
      await page.waitForFunction(() => window.currentVerification?.created_at != null);

      const { expectedCreatedAt, createdAtIso } = await page.evaluate(() => {
        const verification = window.currentVerification;
        const createdAtIso = new Date(verification.created_at * 1000).toISOString();
        const expectedCreatedAt = new Date(verification.created_at * 1000).toLocaleDateString(navigator.language, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return { expectedCreatedAt, createdAtIso };
      });

      expect(createdAtIso).toMatch(/^2026-05-08T16:59:/);

      await expect.soft(content).toContainText(
        'Hash of the binary reproduced: 709e379506f7d86cfb146493441fc72b7f20cb90578a9b26b9ca9da374782caf',
      );
      await expect.soft(content).toContainText('Application: ZEUS Wallet');
      await expect.soft(content).toContainText('Version: 13.0.1');
      await expect.soft(content).toContainText(`Created At: ${expectedCreatedAt}`);
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
      await waitForNostrDisplayName(page, attemptBy, 'walletscrutiny_bot', nostrDisplayNameOptions);
      await expect.soft(attemptBy).toContainText('walletscrutiny_bot');

      await expect.soft(content).toContainText('Based on an attempt by:');
      await waitForNostrDisplayName(page, basedOnAttemptBy, 'dannybuntu', nostrDisplayNameOptions);
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

    await test.step('Script preview works fine', async () => {
      const previewButton = content.locator('[title="Preview zeus_build.sh"]');
      const previewModal = page.locator('#attachmentPreviewModal');

      await previewButton.click();
      await expect.soft(previewModal).toBeVisible({ timeout: 30_000 });
      await expect.soft(page.locator('#previewFileName')).toHaveText('zeus_build.sh');
      await expect.soft(page.locator('#previewContent')).toContainText('SCRIPT_VERSION="v0.2.13"');

      await page.evaluate(() => {
        const preview = document.getElementById('attachmentPreviewModal');
        if (preview) {
          preview.style.display = 'none';
        }
      });
      await expect.soft(previewModal).toBeHidden();
    });

    await test.step('Comments', async () => {
      const commentsSection = content.locator('.comments-section');
      const commentAuthor = commentsSection.locator('.comment-author-name');

      await expect.soft(commentsSection).toContainText('Comments');
      await waitForNostrDisplayName(page, commentAuthor, 'btc_remnant', nostrDisplayNameOptions);
      await expect.soft(commentAuthor).toContainText('btc_remnant');
      await expect.soft(commentsSection.locator('.comment-body')).toContainText('Test comment! 1234');
    });

    await test.step('Information asciinema player', async () => {
      const player = content.locator('#ascii_cast_player');

      await expect.soft(content).toContainText('Information:');
      await expect.soft(player).toBeVisible();

      await waitForAsciinemaPlayerContent(page, 120_000);
      await expect.soft(player).not.toBeEmpty();
    });

    await test.step('Test endorsement modal', async () => {
      await expect(modal).toBeVisible();

      const endorseButton = page.locator('#verificationModalToolbar button[title="Endorse this verification"]');
      await endorseButton.click();

      const endorsementModal = page.locator('#endorsementModal');
      await expect.soft(endorsementModal).toBeVisible({ timeout: 10_000 });
      await expect.soft(endorsementModal).toContainText('Endorsing a verification means');
      await expect.soft(endorsementModal.locator('button')).toHaveCount(3);
      await expect.soft(page.locator('#endorseValidBtn')).toBeVisible();
      await expect.soft(page.locator('#endorseInvalidBtn')).toBeVisible();
      await expect.soft(page.locator('#endorseCancelBtn')).toBeVisible();

      await page.locator('#endorseCancelBtn').click();
      await expect.soft(endorsementModal).toBeHidden();
    });

    await test.step('Test Share on Nostr modal', async () => {
      await expect(modal).toBeVisible();

      const shareContainer = page.locator('#verificationShareButtonContainer');
      await shareContainer.getByRole('button', { name: 'Share' }).click();

      const shareOnNostr = shareContainer.locator('.js-share-nostr-open');
      await expect.soft(shareOnNostr).toBeVisible();
      await shareOnNostr.click();

      const shareNostrModal = page.locator('.share-nostr-modal').filter({ visible: true });
      await expect.soft(shareNostrModal).toBeVisible({ timeout: 10_000 });
      await expect.soft(shareNostrModal.locator('h2')).toHaveText('Share on Nostr');
      await expect.soft(shareNostrModal.locator('.share-nostr-textarea')).toHaveValue(
        /Check out this ZEUS Wallet v13\.0\.1 \(android\) verification!/,
      );
      await expect.soft(shareNostrModal.getByRole('button', { name: 'Share' })).toBeVisible();
    });

    assertNoConsoleErrors();
  });
});
