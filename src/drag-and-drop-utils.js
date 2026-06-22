let apkParserPromise;
let fflateUnzipPromise;

function getApkParser() {
  apkParserPromise ??= import('app-info-parser/src/apk').then((module) => module.default);
  return apkParserPromise;
}

function getFflateUnzip() {
  fflateUnzipPromise ??= import('fflate').then((module) => module.unzip);
  return fflateUnzipPromise;
}

export const PENDING_ASSET_FILES_KEY = 'wsPendingAssetFiles';

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export const updateDomElementInClass = (className, htmlContent, searchFromElement = document) => {
  const element = searchFromElement.querySelector(`.${className}`);
  if (element) {
    element.innerHTML = htmlContent;
  }
}

export function getVersionFromFilename(filename) {
  const versionPatterns = [
    /[._-]v?(\d+\.\d+\.?\d*)/i,
    /[._-]version[._-]?(\d+\.\d+\.?\d*)/i,
    /[._-](\d+_\d+(?:_\d+)?)/,
    /_(\d+\.\d+\.?\d*)_(?:amd64|x86_64|arm64)/i,
    /[._-](\d+\.\d+\.?\d*)[._-]/i
  ];

  return versionPatterns
    .map(pattern => filename.match(pattern)?.[1])
    .find(Boolean)
    ?.replace(/_/g, '.') ?? null;
}

export async function calculateFileHash(file) {
  console.time("sha256");
  const arrayBuffer = await file.arrayBuffer();
  const hash = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hash));
  const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  console.timeEnd("sha256");
  return hex;
}

export const isPageForAppId = (appId) => window.pageAppId === appId;

export async function getApkInfo(file) {
  try {
    const AppInfoParser = await getApkParser();
    const parser = new AppInfoParser(file);
    return await parser.parse();
  } catch (error) {
    console.error('Failed to parse APK metadata:', error);
    return null;
  }
}

export const ANDROID_APK_METADATA_MISSING_MESSAGE =
  'This does not appear to be an Android application. We could not read an app ID and version from the APK metadata.';

export const ANDROID_APK_VERSION_MISSING_MESSAGE =
  'We could not read the app version from the APK metadata. Include the base APK (not only split APKs) to register or verify this asset.';

function normalizeApkString(value) {
  if (value == null) {
    return null;
  }
  const text = String(value).trim();
  return text || null;
}

export function isAndroidApkFileName(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  return extension === 'apk' || extension === 'aab';
}

export function isAndroidApkUpload(processedFiles, isApkBundle) {
  if (isApkBundle) {
    return true;
  }
  if (processedFiles.length !== 1) {
    return false;
  }
  return isAndroidApkFileName(processedFiles[0].fileName);
}

export function hasCompleteAndroidApkMetadata(apkInfo) {
  if (!apkInfo) {
    return false;
  }
  return Boolean(
    normalizeApkString(apkInfo.package) && normalizeApkString(apkInfo.versionName)
  );
}

export function processedFilesHaveCompleteAndroidMetadata(processedFiles) {
  return processedFiles.some(entry => hasCompleteAndroidApkMetadata(entry.apkInfo));
}

export function processedFilesHaveAndroidPackage(processedFiles) {
  return processedFiles.some(entry => normalizeApkString(entry.apkInfo?.package));
}

export async function populateApkInfoForAndroidUpload(processedFiles) {
  for (const entry of processedFiles) {
    if (!entry.apkInfo) {
      entry.apkInfo = await getApkInfo(entry.data);
    }
  }
}

export function canRegisterOrVerifyAndroidUpload(processedFiles, isApkBundle) {
  if (!isAndroidApkUpload(processedFiles, isApkBundle)) {
    return true;
  }
  return processedFilesHaveCompleteAndroidMetadata(processedFiles);
}

export function getAndroidUploadBlockingMessage(processedFiles, isApkBundle) {
  if (canRegisterOrVerifyAndroidUpload(processedFiles, isApkBundle)) {
    return null;
  }
  if (processedFilesHaveAndroidPackage(processedFiles)) {
    return ANDROID_APK_VERSION_MISSING_MESSAGE;
  }
  return ANDROID_APK_METADATA_MISSING_MESSAGE;
}

export function resolveCompleteApkInfoFromProcessedFiles(processedFiles) {
  const withCompleteMetadata = processedFiles.find(entry => hasCompleteAndroidApkMetadata(entry.apkInfo));
  return withCompleteMetadata?.apkInfo ?? null;
}

export function resolveApkInfoFromProcessedFiles(processedFiles) {
  const completeApkInfo = resolveCompleteApkInfoFromProcessedFiles(processedFiles);
  if (completeApkInfo) {
    return completeApkInfo;
  }

  const withAnyInfo = processedFiles.find(entry => entry.apkInfo);
  return withAnyInfo?.apkInfo ?? null;
}

function isZipEntryApk(path) {
  if (path.endsWith('/')) {
    return false;
  }
  if (path.includes('__MACOSX/')) {
    return false;
  }
  const baseName = path.split('/').pop();
  if (!baseName || baseName.startsWith('.')) {
    return false;
  }
  return baseName.toLowerCase().endsWith('.apk');
}

function isSplitApkFileName(fileName) {
  const lower = fileName.toLowerCase();
  return lower.startsWith('split_') || lower.includes('split_config.');
}

function sortApkEntries(a, b) {
  if (a.fileName === 'base.apk') {
    return -1;
  }
  if (b.fileName === 'base.apk') {
    return 1;
  }
  const aIsSplit = isSplitApkFileName(a.fileName);
  const bIsSplit = isSplitApkFileName(b.fileName);
  if (aIsSplit !== bIsSplit) {
    return aIsSplit ? 1 : -1;
  }
  return a.fileName.localeCompare(b.fileName);
}

export async function extractApkFilesFromZip(zipFile) {
  const unzip = await getFflateUnzip();
  const buffer = await zipFile.arrayBuffer();
  const entries = await new Promise((resolve, reject) => {
    unzip(new Uint8Array(buffer), (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  const apkFiles = [];
  for (const [path, content] of Object.entries(entries)) {
    if (!isZipEntryApk(path)) {
      continue;
    }
    const fileName = path.split('/').pop();
    apkFiles.push({
      fileName,
      file: new File([content], fileName, { type: 'application/vnd.android.package-archive' })
    });
  }

  apkFiles.sort(sortApkEntries);
  return apkFiles;
}

export async function expandDroppedFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension !== 'zip') {
    return {
      entries: [{ file, fileName: file.name }],
      sourceZip: null
    };
  }

  const apkFiles = await extractApkFilesFromZip(file);
  if (apkFiles.length === 0) {
    return {
      entries: [{ file, fileName: file.name }],
      sourceZip: null
    };
  }

  return {
    entries: apkFiles.map(({ file: apkFile, fileName }) => ({ file: apkFile, fileName })),
    sourceZip: file
  };
}

export function getPlatformFromFilename(filename, apkInfo = null) {
  const extension = filename.split('.').pop().toLowerCase();

  if (apkInfo || ['apk', 'aab'].includes(extension)) {
    return 'android';
  } else if (['exe', 'msi', 'msix', 'appx'].includes(extension)) {
    return 'windows';
  } else if (['appimage', 'deb', 'rpm', 'flatpak', 'snap'].includes(extension)) {
    return 'linux';
  } else if (['dmg', 'pkg', 'mpkg'].includes(extension)) {
    return 'macos';
  } else if (['ipa'].includes(extension)) {
    return 'ios';
  }

  return null;
}