import { test, expect } from '@playwright/test';

import {
  attachConsoleGuards,
  waitForHomepageDropAreaReady,
  dropFileOnHomepageDropArea,
  waitForHomepageDropAreaAnalysis,
  DROP_AREA_ANALYSIS_TIMEOUT_MS,
} from './helpers.mjs';

const ANDROID_APK_METADATA_MISSING_MESSAGE =
  'This does not appear to be an Android application. We could not read an app ID and version from the APK metadata.';

const ANDROID_APK_VERSION_MISSING_MESSAGE =
  'We could not read the app version from the APK metadata. Include the base APK (not only split APKs) to register or verify this asset.';

test.describe('Homepage drop area', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForHomepageDropAreaReady(page);
  });

  test('rejects a fake APK without Android metadata', async ({ page }, testInfo) => {
    test.setTimeout(DROP_AREA_ANALYSIS_TIMEOUT_MS);
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await dropFileOnHomepageDropArea(page, 'not_a_real_apk.apk');
    const resultBox = await waitForHomepageDropAreaAnalysis(page);

    await expect(resultBox).toContainText(ANDROID_APK_METADATA_MISSING_MESSAGE);

    assertNoConsoleErrors();
  });

  test('rejects a split APK without the base APK', async ({ page }, testInfo) => {
    test.setTimeout(DROP_AREA_ANALYSIS_TIMEOUT_MS);
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await dropFileOnHomepageDropArea(page, 'split_config.en.apk');
    const resultBox = await waitForHomepageDropAreaAnalysis(page);

    await expect(resultBox).toContainText(ANDROID_APK_VERSION_MISSING_MESSAGE);

    assertNoConsoleErrors();
  });

  test('analyzes a real APK and shows metadata for an unknown application', async ({ page }, testInfo) => {
    test.setTimeout(DROP_AREA_ANALYSIS_TIMEOUT_MS);
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await dropFileOnHomepageDropArea(page, 'Phonesky.apk');
    const resultBox = await waitForHomepageDropAreaAnalysis(page);

    await expect(resultBox).toContainText('App ID: com.android.vending');
    await expect(resultBox).toContainText('Version: 39.6.25-290PR604467617');
    await expect(resultBox).toContainText('File: Phonesky.apk');
    await expect(resultBox).toContainText('Size: 42.29 MB');
    await expect(resultBox).toContainText('SHA-256: 3610eae865c3689cf857ca41602a2f19a52c5bee5b0d2d20e0baf06e10360fdb');
    await expect(resultBox).toContainText(
      'This is an APK for an unknown application. You can register it on Nostr so others can try to reproduce it.',
    );

    assertNoConsoleErrors();
  });

  test('analyzes a ZIP bundle with multiple APK files', async ({ page }, testInfo) => {
    test.setTimeout(DROP_AREA_ANALYSIS_TIMEOUT_MS);
    const assertNoConsoleErrors = attachConsoleGuards(testInfo, page);

    await dropFileOnHomepageDropArea(page, 'phonesky.zip');
    const resultBox = await waitForHomepageDropAreaAnalysis(page);

    await expect(resultBox).toContainText('App ID: com.android.vending');
    await expect(resultBox).toContainText('Version: 39.6.25-290PR604467617');
    await expect(resultBox).toContainText('Archive: phonesky.zip');
    await expect(resultBox).toContainText('APK files: 3');
    await expect(resultBox).toContainText('Phonesky.apk (42.29 MB)');
    await expect(resultBox).toContainText('SHA-256: 3610eae865c3689cf857ca41602a2f19a52c5bee5b0d2d20e0baf06e10360fdb');
    await expect(resultBox).toContainText('split_config.arm64_v8a.apk (6.35 MB)');
    await expect(resultBox).toContainText('SHA-256: f425367d89f9e91e67768f48f6be9d71d813c2c6ccaebbe5e7d0717694be2853');
    await expect(resultBox).toContainText('split_config.en.apk (444.40 KB)');
    await expect(resultBox).toContainText('SHA-256: 543422b82b282671bb1deac0dc77b89296714fd62954b98bfecd8d01d7e1511f');
    await expect(resultBox).toContainText(
      'This is an APK for an unknown application. You can register it on Nostr so others can try to reproduce it. The ZIP contains 3 APK files whose hashes will be included if you register or verify this asset.',
    );

    assertNoConsoleErrors();
  });
});
