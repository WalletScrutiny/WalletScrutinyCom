import fs from 'fs';
import path from 'path';
import { pipeline } from 'node:stream/promises';
import { open as openZip } from 'yauzl';
import { appLog } from './logger.mjs';

const APK_EXT = /\.apk$/i;

function normalizeVersionName(value) {
  if (value == null) {
    return null;
  }
  const text = String(value).trim();
  return text || null;
}

function entryBaseName(fileName) {
  return path.posix.basename(String(fileName).replace(/\\/g, '/'));
}

function compareApkNames(a, b) {
  const score = (name) => {
    const lower = name.toLowerCase();
    if (lower === 'base.apk') {
      return 0;
    }
    if (lower.startsWith('split_config.')) {
      return 2;
    }
    return 1;
  };
  const delta = score(a) - score(b);
  if (delta !== 0) {
    return delta;
  }
  return a.localeCompare(b);
}

/**
 * APK files to try when reading versionName. Prefers base.apk over other splits.
 */
export function listAndroidApkCandidatePaths(binaryPath) {
  if (!binaryPath || !fs.existsSync(binaryPath)) {
    return [];
  }

  const stat = fs.statSync(binaryPath);
  if (stat.isFile()) {
    return APK_EXT.test(binaryPath) ? [binaryPath] : [];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  const apkNames = fs.readdirSync(binaryPath).filter(name => APK_EXT.test(name));
  apkNames.sort(compareApkNames);
  return apkNames.map(name => path.join(binaryPath, name));
}

/**
 * Among zip entry names, prefer base.apk, then a non-split APK, then split_config APKs.
 */
export function pickPreferredZipApkEntryName(entryNames) {
  const apkEntries = (entryNames ?? []).filter(name => {
    if (!name || name.endsWith('/')) {
      return false;
    }
    return APK_EXT.test(entryBaseName(name));
  });
  apkEntries.sort((a, b) => compareApkNames(entryBaseName(a), entryBaseName(b)));
  return apkEntries[0] ?? null;
}

export function describeVersionOverride(claimedVersion, apkVersion) {
  const claimed = normalizeVersionName(claimedVersion);
  const apk = normalizeVersionName(apkVersion);
  if (!claimed || !apk || claimed === apk) {
    return null;
  }
  return `The asset registration listed version ${claimed}; the APK versionName is ${apk}.`;
}

let apkParserPromise;

async function loadApkParser() {
  apkParserPromise ??= Promise.all([
    import('app-info-parser/src/apk.js'),
    import('app-info-parser/src/xml-parser/manifest.js'),
  ]).then(([apk, manifest]) => ({ ApkParser: apk.default, ManifestXmlParser: manifest.default }));
  return apkParserPromise;
}

/**
 * app-info-parser strips every character outside [\w\d-.] from versionName while reading
 * the binary manifest, so "2026.11.2 (1)" came out as "2026.11.21". It does that by writing
 * into its string pool, so hand it a pool that ignores writes once it has been read.
 */
function parseManifestWithRawVersionName(ManifestXmlParser, buffer) {
  const manifestParser = new ManifestXmlParser(buffer, {
    ignore: ['application.activity', 'application.service', 'application.receiver', 'application.provider', 'permission-group'],
  });
  const xmlParser = manifestParser.xmlParser;
  const readStringPool = xmlParser.readStringPool;
  xmlParser.readStringPool = function (...args) {
    this.strings = this.rawStrings ?? this.strings;
    const result = readStringPool.apply(this, args);
    this.rawStrings = this.strings;
    this.strings = new Proxy(this.rawStrings, { set: () => true });
    return result;
  };
  return manifestParser.parse();
}

export async function parseApkVersionName(apkPath) {
  try {
    const { ApkParser, ManifestXmlParser } = await loadApkParser();
    const parser = new ApkParser(apkPath);
    parser._parseManifest = buffer => parseManifestWithRawVersionName(ManifestXmlParser, buffer);
    const info = await parser.parse();
    return normalizeVersionName(info?.versionName);
  } catch (error) {
    appLog.warn(`Failed to read versionName from ${apkPath}: ${error?.message ?? error}`);
    return null;
  }
}

function listZipEntryNames(zipFilePath) {
  return new Promise((resolve, reject) => {
    openZip(zipFilePath, { lazyEntries: true }, (err, zipFile) => {
      if (err) {
        reject(err);
        return;
      }

      const names = [];
      zipFile.on('entry', (entry) => {
        names.push(entry.fileName);
        zipFile.readEntry();
      });
      zipFile.on('end', () => resolve(names));
      zipFile.on('error', reject);
      zipFile.readEntry();
    });
  });
}

function extractZipEntry(zipFilePath, entryName, destinationPath) {
  return new Promise((resolve, reject) => {
    openZip(zipFilePath, { lazyEntries: true }, (err, zipFile) => {
      if (err) {
        reject(err);
        return;
      }

      let settled = false;
      let found = false;
      const finish = (error, value) => {
        if (settled) {
          return;
        }
        settled = true;
        try {
          zipFile.close();
        } catch {
          // Ignore close errors; the extract result is what matters.
        }
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      };

      zipFile.on('entry', (entry) => {
        if (entry.fileName !== entryName) {
          zipFile.readEntry();
          return;
        }
        found = true;
        zipFile.openReadStream(entry, (streamErr, readStream) => {
          if (streamErr) {
            finish(streamErr);
            return;
          }
          const out = fs.createWriteStream(destinationPath);
          pipeline(readStream, out).then(() => finish(null, destinationPath)).catch(finish);
        });
      });
      zipFile.on('end', () => {
        if (!found) {
          finish(new Error(`Zip entry not found: ${entryName}`));
        }
      });
      zipFile.on('error', finish);
      zipFile.readEntry();
    });
  });
}

export async function extractPreferredApkFromZip(zipFilePath, destinationDir) {
  const entryNames = await listZipEntryNames(zipFilePath);
  const chosen = pickPreferredZipApkEntryName(entryNames);
  if (!chosen) {
    return null;
  }

  fs.mkdirSync(destinationDir, { recursive: true });
  const destPath = path.join(
    destinationDir,
    entryBaseName(chosen).replace(/[^a-zA-Z0-9.-]/g, '_')
  );
  return extractZipEntry(zipFilePath, chosen, destPath);
}

/**
 * For Android asset jobs, prefer the APK's versionName over the asset registration tag.
 * Falls back to the claimed version when the binary cannot be parsed.
 */
export async function resolveAndroidWalletVersion({
  binaryPath,
  claimedVersion,
  parseApk = parseApkVersionName,
} = {}) {
  const claimed = normalizeVersionName(claimedVersion);
  let candidates = listAndroidApkCandidatePaths(binaryPath);

  if (
    candidates.length === 0 &&
    binaryPath &&
    binaryPath.toLowerCase().endsWith('.zip') &&
    fs.existsSync(binaryPath)
  ) {
    try {
      const extractDir = path.join(path.dirname(binaryPath), '.apk-version-extract');
      const extracted = await extractPreferredApkFromZip(binaryPath, extractDir);
      if (extracted) {
        candidates = [extracted];
      }
    } catch (error) {
      appLog.warn(`Failed to extract APK from ${binaryPath} to read versionName: ${error?.message ?? error}`);
    }
  }

  for (const apkPath of candidates) {
    const versionName = await parseApk(apkPath);
    if (versionName) {
      if (claimed && versionName !== claimed) {
        appLog.warn(
          `APK versionName ${versionName} differs from asset registration version ${claimed} (${apkPath})`
        );
      } else {
        appLog.info(`Read APK versionName ${versionName} from ${apkPath}`);
      }
      return versionName;
    }
  }

  if (claimed) {
    appLog.warn(
      `Could not read APK versionName from ${binaryPath ?? '(missing binary)'}; ` +
      `using asset registration version ${claimed}`
    );
  }
  return claimed;
}
