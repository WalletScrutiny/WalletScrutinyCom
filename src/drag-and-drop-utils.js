import AppInfoParser from 'app-info-parser';

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