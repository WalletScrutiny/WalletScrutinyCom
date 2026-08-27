import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatFileSize,
  getVersionFromFilename,
  getPlatformFromFilename,
  isAndroidApkFileName,
  isAndroidApkUpload,
  hasCompleteAndroidApkMetadata,
  processedFilesHaveCompleteAndroidMetadata,
  processedFilesHaveAndroidPackage,
  canRegisterOrVerifyAndroidUpload,
  getAndroidUploadBlockingMessage,
  resolveCompleteApkInfoFromProcessedFiles,
  resolveApkInfoFromProcessedFiles,
  isPageForAppId,
  ANDROID_APK_METADATA_MISSING_MESSAGE,
  ANDROID_APK_VERSION_MISSING_MESSAGE,
} from '../../src/drag-and-drop-utils.mjs';

describe('formatFileSize', () => {
  test('formats zero bytes', () => {
    assert.equal(formatFileSize(0), '0 Bytes');
  });

  test('formats kilobytes and megabytes', () => {
    assert.equal(formatFileSize(1024), '1 KB');
    assert.equal(formatFileSize(1536), '1.5 KB');
    assert.equal(formatFileSize(1048576), '1 MB');
  });
});

describe('getVersionFromFilename', () => {
  test('extracts dotted versions', () => {
    assert.equal(getVersionFromFilename('myapp-1.2.3.apk'), '1.2.3');
    assert.equal(getVersionFromFilename('wallet_v2.0.1_amd64.deb'), '2.0.1');
  });

  test('converts underscore versions to dots', () => {
    assert.equal(getVersionFromFilename('app_1_2_3.apk'), '1.2.3');
  });

  test('returns null when no version pattern matches', () => {
    assert.equal(getVersionFromFilename('wallet.apk'), null);
  });
});

describe('getPlatformFromFilename', () => {
  test('detects platforms from extensions', () => {
    assert.equal(getPlatformFromFilename('app.apk'), 'android');
    assert.equal(getPlatformFromFilename('setup.exe'), 'windows');
    assert.equal(getPlatformFromFilename('app.AppImage'), 'linux');
    assert.equal(getPlatformFromFilename('installer.dmg'), 'macos');
    assert.equal(getPlatformFromFilename('app.ipa'), 'ios');
  });

  test('prefers apk metadata over extension when provided', () => {
    assert.equal(getPlatformFromFilename('unknown.bin', { package: 'com.app' }), 'android');
  });

  test('returns null for unknown extensions', () => {
    assert.equal(getPlatformFromFilename('readme.txt'), null);
  });
});

describe('isAndroidApkFileName', () => {
  test('recognizes apk and aab extensions', () => {
    assert.equal(isAndroidApkFileName('base.apk'), true);
    assert.equal(isAndroidApkFileName('app.AAB'), true);
    assert.equal(isAndroidApkFileName('app.zip'), false);
  });
});

describe('hasCompleteAndroidApkMetadata', () => {
  test('requires package and versionName', () => {
    assert.equal(hasCompleteAndroidApkMetadata({ package: 'com.app', versionName: '1.0' }), true);
    assert.equal(hasCompleteAndroidApkMetadata({ package: 'com.app' }), false);
    assert.equal(hasCompleteAndroidApkMetadata(null), false);
  });
});

describe('canRegisterOrVerifyAndroidUpload', () => {
  const completeEntry = {
    fileName: 'base.apk',
    apkInfo: { package: 'com.app', versionName: '1.0' },
  };

  test('allows non-android uploads', () => {
    assert.equal(canRegisterOrVerifyAndroidUpload([{ fileName: 'app.deb' }], false), true);
  });

  test('blocks incomplete android metadata', () => {
    assert.equal(
      canRegisterOrVerifyAndroidUpload([{ fileName: 'base.apk', apkInfo: { package: 'com.app' } }], false),
      false,
    );
    assert.equal(canRegisterOrVerifyAndroidUpload([completeEntry], false), true);
  });

  test('treats apk bundles as android uploads', () => {
    assert.equal(canRegisterOrVerifyAndroidUpload([{ fileName: 'split.apk' }], true), false);
    assert.equal(canRegisterOrVerifyAndroidUpload([completeEntry], true), true);
  });
});

describe('getAndroidUploadBlockingMessage', () => {
  test('returns null when upload is allowed', () => {
    assert.equal(
      getAndroidUploadBlockingMessage(
        [{ fileName: 'base.apk', apkInfo: { package: 'com.app', versionName: '1.0' } }],
        false,
      ),
      null,
    );
  });

  test('distinguishes missing version from missing metadata', () => {
    assert.equal(
      getAndroidUploadBlockingMessage([{ fileName: 'base.apk', apkInfo: { package: 'com.app' } }], false),
      ANDROID_APK_VERSION_MISSING_MESSAGE,
    );
    assert.equal(
      getAndroidUploadBlockingMessage([{ fileName: 'base.apk', apkInfo: null }], false),
      ANDROID_APK_METADATA_MISSING_MESSAGE,
    );
  });
});

describe('resolveApkInfoFromProcessedFiles', () => {
  test('prefers entries with complete metadata', () => {
    const files = [
      { apkInfo: { package: 'com.app' } },
      { apkInfo: { package: 'com.app', versionName: '2.0' } },
    ];
    assert.equal(resolveCompleteApkInfoFromProcessedFiles(files).versionName, '2.0');
    assert.equal(resolveApkInfoFromProcessedFiles(files).versionName, '2.0');
  });

  test('falls back to any apk info when none is complete', () => {
    const files = [{ apkInfo: { package: 'com.app' } }];
    assert.equal(resolveApkInfoFromProcessedFiles(files).package, 'com.app');
    assert.equal(resolveCompleteApkInfoFromProcessedFiles(files), null);
  });
});

describe('isAndroidApkUpload', () => {
  test('treats apk bundles as android uploads', () => {
    assert.equal(isAndroidApkUpload([{ fileName: 'readme.txt' }], true), true);
  });

  test('requires a single apk/aab file for non-bundle uploads', () => {
    assert.equal(isAndroidApkUpload([{ fileName: 'base.apk' }], false), true);
    assert.equal(isAndroidApkUpload([{ fileName: 'base.apk' }, { fileName: 'split.apk' }], false), false);
    assert.equal(isAndroidApkUpload([{ fileName: 'app.deb' }], false), false);
  });
});

describe('processedFilesHaveCompleteAndroidMetadata', () => {
  test('returns true when any entry has package and versionName', () => {
    const files = [
      { apkInfo: { package: 'com.app' } },
      { apkInfo: { package: 'com.app', versionName: '1.2.3' } },
    ];
    assert.equal(processedFilesHaveCompleteAndroidMetadata(files), true);
  });

  test('returns false when no entry has complete metadata', () => {
    assert.equal(processedFilesHaveCompleteAndroidMetadata([{ apkInfo: null }]), false);
    assert.equal(processedFilesHaveCompleteAndroidMetadata([]), false);
  });
});

describe('processedFilesHaveAndroidPackage', () => {
  test('detects package name on any processed file', () => {
    assert.equal(
      processedFilesHaveAndroidPackage([{ apkInfo: { package: ' com.app ' } }]),
      true,
    );
    assert.equal(processedFilesHaveAndroidPackage([{ apkInfo: { package: '  ' } }]), false);
  });
});

describe('isPageForAppId', () => {
  test('matches the current page app id', () => {
    const previous = globalThis.window.pageAppId;
    globalThis.window.pageAppId = 'com.example.wallet';
    try {
      assert.equal(isPageForAppId('com.example.wallet'), true);
      assert.equal(isPageForAppId('com.other.wallet'), false);
    } finally {
      globalThis.window.pageAppId = previous;
    }
  });
});
