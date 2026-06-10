import AppInfoParser from 'app-info-parser/src/apk';
import { unzip } from 'fflate';

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
    const parser = new AppInfoParser(file);
    return await parser.parse();
  } catch (error) {
    return null;
  }
}

export function resolveApkInfoFromProcessedFiles(processedFiles) {
  const withPackageAndVersion = processedFiles.find(
    entry => entry.apkInfo?.package && entry.apkInfo?.versionName
  );
  if (withPackageAndVersion) {
    return withPackageAndVersion.apkInfo;
  }

  const withPackage = processedFiles.find(entry => entry.apkInfo?.package);
  if (withPackage) {
    return withPackage.apkInfo;
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

function sortApkEntries(a, b) {
  if (a.fileName === 'base.apk') {
    return -1;
  }
  if (b.fileName === 'base.apk') {
    return 1;
  }
  return a.fileName.localeCompare(b.fileName);
}

export async function extractApkFilesFromZip(zipFile) {
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