import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
  waitForVerificationModalReady,
  waitForBuildLogLines,
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

      // The header shows the first 8 characters of the hash, unlabelled, then the verdict; the copy icon copies the whole hash.
      await expect.soft(content).not.toContainText('Hash of the binary reproduced');
      const header = modal.locator('#verificationModalHeading');
      await expect.soft(header.locator('.verification-modal-title + .verification-modal-hashes + .verification-modal-badges + .verification-modal-subtitle')).toHaveCount(1);
      await expect.soft(header.locator('.verification-modal-hash')).toHaveText('709e3795');
      const copyHash = header.locator('.verification-modal-hash-row .js-copy-hash');
      await expect.soft(copyHash).toHaveAttribute('title', 'Copy entire hash');
      await expect.soft(copyHash).toHaveAttribute('data-hash', '709e379506f7d86cfb146493441fc72b7f20cb90578a9b26b9ca9da374782caf');
      // The header carries the verdict, the app and version, the platform and the date.
      const heading = modal.locator('#verificationModalHeading');
      await expect.soft(heading.locator('.verification-modal-title')).toHaveText('ZEUS Wallet 13.0.1');
      await expect.soft(heading.locator('.verification-modal-subtitle')).toHaveText(`Android · ${expectedCreatedAt}`);
      await expect.soft(heading.locator('.verification-modal-status')).toHaveText('Reproducible when tested');
      await expect.soft(heading.locator('.verification-modal-status')).toHaveClass(/verification-modal-status--good/);
      // The old one-paragraph build-server report, shown in today's layout.
      await expect.soft(content).toContainText(
        'Reproducible. We built version 13.0.1 from its public source code and got the same app users download.',
      );
      await expect.soft(content).toContainText('Script version: v0.2.13');
      await expect.soft(content).toContainText('Build script taken from verification 0cd139d8 by dannybuntu');
    });

    await test.step('Profile and based_on loading', async () => {
      const attemptBy = content.locator('#attempt-by');
      const basedOnAttemptBy = content.locator('#based-on-attempt-by');

      await expect.soft(content).toContainText('Attempt by');
      await waitForNostrDisplayName(page, attemptBy, 'walletscrutiny_bot', nostrDisplayNameOptions);
      await expect.soft(attemptBy).toContainText('walletscrutiny_bot');

      await expect.soft(content).toContainText('Based on an attempt by');
      await waitForNostrDisplayName(page, basedOnAttemptBy, 'dannybuntu', nostrDisplayNameOptions);
      await expect.soft(basedOnAttemptBy).toContainText('dannybuntu');
    });

    await test.step('Scripts loading', async () => {
      const attachmentsList = content.locator('#verification-attachments-list');

      await expect.soft(content).toContainText('Scripts used to reproduce');
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

      const previewScrollState = await page.evaluate(() => {
        const overlay = document.getElementById('attachmentPreviewModal');
        const panel = overlay?.firstElementChild;
        const preview = document.getElementById('previewContent');
        return {
          overlayOverflowY: overlay ? getComputedStyle(overlay).overflowY : null,
          panelOverflowY: panel ? getComputedStyle(panel).overflowY : null,
          previewOverflowY: preview ? getComputedStyle(preview).overflowY : null,
          overlayScrollable: overlay ? overlay.scrollHeight > overlay.clientHeight + 1 : null,
          panelScrollable: panel ? panel.scrollHeight > panel.clientHeight + 1 : null,
        };
      });
      expect.soft(previewScrollState.overlayOverflowY).toBe('hidden');
      expect.soft(previewScrollState.panelOverflowY).toBe('hidden');
      expect.soft(previewScrollState.previewOverflowY).toBe('auto');
      expect.soft(previewScrollState.overlayScrollable).toBe(false);
      expect.soft(previewScrollState.panelScrollable).toBe(false);

      await page.evaluate(() => {
        const preview = document.getElementById('attachmentPreviewModal');
        if (preview) {
          preview.style.display = 'none';
        }
      });
      await expect.soft(previewModal).toBeHidden();
    });

    await test.step('The report comes last', async () => {
      const commentsSection = content.locator('.comments-section');
      const commentAuthor = commentsSection.locator('.comment-author-name');

      await expect.soft(commentsSection).toContainText('Comments');
      await waitForNostrDisplayName(page, commentAuthor, 'btc_remnant', nostrDisplayNameOptions);
      await expect.soft(commentAuthor).toContainText('btc_remnant');
      await expect.soft(commentsSection.locator('.comment-body')).toContainText('Test comment! 1234');

      // Section order: facts, files, comments, then the (possibly very long) report at the end.
      const sectionCaptions = await content.locator('.verification-modal-section:visible').evaluateAll(
        nodes => nodes.map(node => node.querySelector('.verification-modal-caption, .comments-section > p')?.textContent?.trim() ?? ''),
      );
      expect.soft(sectionCaptions.slice(1)).toEqual(['Scripts used to reproduce', 'Output files', 'Comments', 'Report']);
    });

    await test.step('Build log viewer', async () => {
      const button = content.locator('.js-open-build-log');
      const viewer = page.locator('#buildLogViewer');

      // Beside the recording it plays, in the output files, and nowhere else.
      await expect(button).toHaveCount(1);
      await expect.soft(content.locator('.verification-modal-file', { has: page.locator('.js-open-build-log') }).locator('.verification-modal-file__name'))
        .toHaveAttribute('title', /\.cast$/);
      await expect(button).toBeVisible();
      await expect.soft(button).toContainText('View build log');

      await button.click();
      await expect(viewer).toBeVisible();
      await expect.soft(viewer.locator('.build-log-subtitle')).toContainText('ZEUS Wallet 13.0.1');

      await waitForBuildLogLines(page, 120_000);
      await expect.soft(viewer.locator('.build-log-state')).toBeHidden();
      await expect.soft(viewer.locator('.build-log-line').first()).not.toBeEmpty();
      await expect.soft(viewer.locator('.build-log-meta')).toContainText(/\d+ lines/);

      const jump = viewer.locator('.build-log-jump');
      await expect.soft(jump).toBeVisible();
      await jump.click();
      await expect.soft(jump).toBeHidden();

      await viewer.locator('.build-log-close').click();
      await expect(viewer).toBeHidden();
      await expect(modal).toBeVisible();
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
      await expect.soft(shareNostrModal.locator('.share-nostr-title')).toHaveText('Share on Nostr');
      await expect.soft(shareNostrModal.locator('.share-nostr-textarea')).toHaveValue(
        /Check out this ZEUS Wallet v13\.0\.1 \(android\) verification!/,
      );
      await expect.soft(shareNostrModal.getByRole('button', { name: 'Share' })).toBeVisible();
    });

    assertNoConsoleErrors();
  });
});
