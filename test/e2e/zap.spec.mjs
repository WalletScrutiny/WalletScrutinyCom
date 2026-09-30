import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  injectNip07Signer,
  waitForVerificationsUi,
  assertQrCodeCanvasRendered,
} from './helpers.mjs';

/** Hex pubkey for Danny (approved build verifier with Lightning address). */
const VERIFIER_PUBKEY_HEX = '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed';
const VERIFIER_PAGE_PATH = `/verifier/?pubkey=${VERIFIER_PUBKEY_HEX}`;

test.describe('Verifier zap flow', () => {
  test('shows a QR code after selecting 1K and sending a zap', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await injectNip07Signer(page);

    await page.goto(VERIFIER_PAGE_PATH);
    await waitForVerificationsUi(page);

    const zapButton = page.getByRole('button', { name: 'Zap this verifier' });
    await expect(zapButton).toBeVisible({ timeout: 60_000 });
    await expect(zapButton).toBeEnabled();

    await zapButton.click();

    const modal = page.locator('.zap-modal');
    await expect(modal).toBeVisible();
    await modal.locator('.zap-amounts button', { hasText: '1K' }).click();
    await modal.locator('#zapSendBtn').click();

    const qrSection = modal.locator('#zapQR.active');
    await expect(qrSection).toBeVisible({ timeout: 60_000 });

    const qrCanvas = modal.locator('#zapQRCode');
    await expect(qrCanvas).toBeVisible();
    await assertQrCodeCanvasRendered(qrCanvas);

    const zapError = modal.locator('#zapError');
    await expect(zapError).toBeEmpty();

    assertNoConsoleErrors();
  });
});
