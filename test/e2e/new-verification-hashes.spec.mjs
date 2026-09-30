import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  attachConsoleGuards,
  waitForVerificationsUi,
  waitForLoadingSpinnerHidden,
} from './helpers.mjs';

const FIXTURE_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'drop-area');
const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const SPLIT_EN_APK_SHA256 = '543422b82b282671bb1deac0dc77b89296714fd62954b98bfecd8d01d7e1511f';

async function openNewVerification(page, query = '') {
  await page.goto(`/new_verification/${query}`);
  await waitForVerificationsUi(page);
  await waitForLoadingSpinnerHidden(page);
  await expect(page.locator('#newHash')).toBeVisible();
}

async function openNewAsset(page, query = '') {
  await page.goto(`/new_asset/${query}`);
  await waitForVerificationsUi(page);
  await waitForLoadingSpinnerHidden(page);
  await expect(page.locator('#assetFilesDropZone')).toBeVisible();
}

test.describe('New verification hash field', () => {
  test('adds pasted sha256sum output with file names and has no plus button', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(page);

    await expect(page.locator('#addHash')).toHaveCount(0);

    const input = page.locator('#newHash');
    await input.fill(`${HASH_A}  base.apk\n${HASH_B} *split_config.arm64_v8a.apk\n`);

    const items = page.locator('#hashList .hash-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).locator('.hash-item-hash')).toHaveText(HASH_A);
    await expect(items.nth(0).locator('.hash-item-name')).toHaveValue('base.apk');
    await expect(items.nth(1).locator('.hash-item-hash')).toHaveText(HASH_B);
    await expect(items.nth(1).locator('.hash-item-name')).toHaveValue('split_config.arm64_v8a.apk');
    await expect(input).toHaveValue('');
    await expect(page.locator('#hashInputHint')).toBeEmpty();

    assertNoConsoleErrors();
  });

  test('adds a hash the moment its 64th character is typed', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(page);

    const input = page.locator('#newHash');
    await input.pressSequentially(HASH_A.slice(0, 63));
    await expect(page.locator('#hashList .hash-item')).toHaveCount(0);
    await expect(page.locator('#hashInputHint')).toBeEmpty();

    await input.pressSequentially('a');
    await expect(page.locator('#hashList .hash-item')).toHaveCount(1);
    await expect(input).toHaveValue('');

    assertNoConsoleErrors();
  });

  test('keeps text that is not a hash and flags it on blur', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(page);

    const input = page.locator('#newHash');
    await input.fill(`${HASH_A}\nthis is not a hash`);
    await expect(page.locator('#hashList .hash-item')).toHaveCount(1);
    await expect(input).toHaveValue('this is not a hash');

    await input.blur();
    await expect(page.locator('#hashInputHint')).toContainText('Not a SHA-256 hash');
    await expect(page.locator('#hashInputHint')).toContainText('this is not a hash');

    assertNoConsoleErrors();
  });

  test('does not list the same hash twice and keeps the first file name', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(page);

    const input = page.locator('#newHash');
    await input.fill(`${HASH_A} base.apk`);
    await input.fill(`${HASH_A.toUpperCase()} other.apk`);

    const items = page.locator('#hashList .hash-item');
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.hash-item-name')).toHaveValue('base.apk');

    assertNoConsoleErrors();
  });

  test('prefills hashes and file names from URL parameters', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(
      page,
      `?sha256=${HASH_A}&hash=${HASH_B}&apkFileName=base.apk&apkFileName=split_config.en.apk`,
    );

    const items = page.locator('#hashList .hash-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).locator('.hash-item-hash')).toHaveText(HASH_A);
    await expect(items.nth(0).locator('.hash-item-name')).toHaveValue('base.apk');
    await expect(items.nth(1).locator('.hash-item-hash')).toHaveText(HASH_B);
    await expect(items.nth(1).locator('.hash-item-name')).toHaveValue('split_config.en.apk');

    assertNoConsoleErrors();
  });

  test('computes hash and file name from a picked file', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(page);
    await page.waitForFunction(() => typeof window.calculateFileHash === 'function');

    await page.locator('#hashFileInput').setInputFiles(join(FIXTURE_DIR, 'split_config.en.apk'));

    const items = page.locator('#hashList .hash-item');
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.hash-item-hash')).toHaveText(SPLIT_EN_APK_SHA256);
    await expect(items.first().locator('.hash-item-name')).toHaveValue('split_config.en.apk');
    await waitForLoadingSpinnerHidden(page);

    assertNoConsoleErrors();
  });

  test('removing a hash removes its row', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewVerification(page, `?sha256=${HASH_A}&hash=${HASH_B}`);

    const items = page.locator('#hashList .hash-item');
    await expect(items).toHaveCount(2);
    await items.nth(0).locator('.remove-hash').click();
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.hash-item-hash')).toHaveText(HASH_B);

    assertNoConsoleErrors();
  });
});

test.describe('New asset file names', () => {
  test('a hash from the URL gets an empty, optional name field', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewAsset(page, `?sha256=${HASH_A}`);

    const items = page.locator('#assetFilesList .file-item');
    await expect(items).toHaveCount(1);
    const nameInput = items.first().locator('.file-item-name-input');
    await expect(nameInput).toHaveValue('');
    await expect(nameInput).toHaveAttribute('placeholder', /optional/);
    await expect(items.first().locator('.file-item-hash')).toHaveText(HASH_A);

    await nameInput.fill('base.apk');
    await expect(nameInput).toHaveValue('base.apk');

    assertNoConsoleErrors();
  });

  test('URL file names are prefilled per hash', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewAsset(page, `?sha256=${HASH_A}&hash=${HASH_B}&apkFileName=base.apk&apkFileName=split_config.en.apk`);

    const inputs = page.locator('#assetFilesList .file-item-name-input');
    await expect(inputs).toHaveCount(2);
    await expect(inputs.nth(0)).toHaveValue('base.apk');
    await expect(inputs.nth(1)).toHaveValue('split_config.en.apk');

    assertNoConsoleErrors();
  });

  test('a picked file is named after itself and the name can be edited', async ({ page }, testInfo) => {
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);
    await openNewAsset(page);
    await page.waitForFunction(() => typeof window.calculateFileHash === 'function');

    // A plain file: APKs go through Android metadata checks that reject the fixtures on purpose.
    await page.locator('#assetFilesInput').setInputFiles({
      name: 'firmware-1.2.3.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('not really firmware'),
    });

    const items = page.locator('#assetFilesList .file-item');
    await expect(items).toHaveCount(1);
    const nameInput = items.first().locator('.file-item-name-input');
    await expect(nameInput).toHaveValue('firmware-1.2.3.bin');
    await nameInput.fill('renamed.bin');
    await expect(nameInput).toHaveValue('renamed.bin');

    assertNoConsoleErrors();
  });
});
