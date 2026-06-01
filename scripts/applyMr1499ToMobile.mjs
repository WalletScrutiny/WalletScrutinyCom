#!/usr/bin/env node
/**
 * Port MR 1499 (branch wips/2026-05-27) wallet updates into _mobile/ format.
 *
 * Usage:
 *   node scripts/applyMr1499ToMobile.mjs
 *   node scripts/applyMr1499ToMobile.mjs --branch origin/wips/2026-05-27
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMobileFromFile, writeMobileFile } from './mobileWalletStore.mjs';
import {
  splitFrontmatter,
  parseYamlFrontmatter,
  buildMobileHeader,
  buildBody,
  isEmpty,
} from './migrateToMobile.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const mobileDir = path.join(root, '_mobile');

const PAIRS = [
  ['com.app.degate.md', 'com.app.degate.md'],
  ['com.cypherock.cysync.md', 'com.cypherock.cysync.md'],
  ['com.earnbit.app.exchange.md', 'com.earnBit.exchange.app.md'],
  ['com.exchange1.ex1.md', 'com.exchange1.exapp.md'],
  ['com.frt.globe.md', 'com.globeDerivativeTrading.globe.prod.md'],
  ['com.getbitmoney.getbit.md', 'in.getbitmoney.getbit.md'],
];

const ANDROID_ONLY = [
  'com.coinrabbit.md',
  'com.coins.black.exchanger.md',
  'com.coinsher.coinsherapp.md',
  'com.gee_fi.md',
];

function parseArgs(argv) {
  let branch = 'origin/wips/2026-05-27';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--branch' && argv[i + 1]) {
      branch = argv[i + 1];
      i++;
    }
  }
  return { branch };
}

function gitShow(revision, repoPath) {
  try {
    return execSync(`git show ${revision}:${repoPath}`, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

function readRepoFile(repoPath, { branch, wipHead = 'HEAD' }) {
  const full = path.join(root, repoPath);
  if (fs.existsSync(full)) {
    const raw = fs.readFileSync(full, 'utf8');
    if (!raw.includes('<<<<<<<')) {
      return raw;
    }
  }
  return gitShow(wipHead, repoPath) || gitShow(branch, repoPath);
}

function parseLegacyWallet(raw) {
  const { frontmatter, body } = splitFrontmatter(raw);
  const header = parseYamlFrontmatter(frontmatter);
  return { header, body: body || '' };
}

function basenameToSlug(basename) {
  return basename.replace(/\.md$/i, '');
}

/** migrateToMobile strips date/developerName from platform blocks; restore from legacy header. */
function applyLegacyHeaderFields(mobile, legacyHeader) {
  if (!legacyHeader) return;
  if (!isEmpty(legacyHeader.wsId)) {
    mobile.wsId = legacyHeader.wsId;
  }
  if (!isEmpty(legacyHeader.date)) {
    mobile.date = legacyHeader.date;
  }
  if (mobile.android) {
    if (!isEmpty(legacyHeader.developerName)) {
      mobile.android.developerName = legacyHeader.developerName;
    }
    if (!isEmpty(legacyHeader.reviews)) {
      mobile.android.reviews = legacyHeader.reviews;
    }
    if (!isEmpty(legacyHeader.signer)) {
      mobile.android.signer = legacyHeader.signer;
    }
    if (!isEmpty(legacyHeader.builds)) {
      mobile.android.builds = legacyHeader.builds;
    }
  }
  if (mobile.iphone && !isEmpty(legacyHeader.developerName) && isEmpty(mobile.iphone.developerName)) {
    mobile.iphone.developerName = legacyHeader.developerName;
  }
}

function addLegacyRedirects(mobile, androidBasename, iphoneBasename) {
  const redirects = new Set(mobile.redirect_from || []);
  if (androidBasename) {
    redirects.add(`/android/${basenameToSlug(androidBasename)}/`);
  }
  if (iphoneBasename) {
    redirects.add(`/iphone/${basenameToSlug(iphoneBasename)}/`);
  }
  if (redirects.size > 0) {
    mobile.redirect_from = [...redirects];
  }
}

function writeMobile(outBasename, mobile, body) {
  if (isEmpty(mobile.title)) {
    console.error(`Skip ${outBasename}: missing title`);
    return false;
  }
  const outPath = path.join(mobileDir, outBasename);
  writeMobileFile(outPath, mobile, body || '');
  console.log(`Wrote ${outPath}`);
  return true;
}

function mergeExistingIphone(mobile, existing) {
  if (existing?.iphone && Object.keys(existing.iphone).length > 0) {
    mobile.iphone = { ...existing.iphone };
  }
}

function extractIphoneBody(existingBody) {
  const trimmed = (existingBody || '').trim();
  if (!trimmed) return '';
  const marker = '\n---\n\n## iPhone\n\n';
  const idx = trimmed.indexOf(marker);
  if (idx === -1) return '';
  return trimmed.slice(idx + marker.length).trim();
}

function applyPair(branch, androidBasename, iphoneBasename) {
  const androidRaw = readRepoFile(`_android/${androidBasename}`, { branch });
  const iphoneRaw = readRepoFile(`_iphone/${iphoneBasename}`, { branch });
  if (!androidRaw) {
    console.error(`Missing _android/${androidBasename} on ${branch}`);
    return;
  }

  const android = parseLegacyWallet(androidRaw);
  const iphone = iphoneRaw ? parseLegacyWallet(iphoneRaw) : null;

  const { mobile: rawMobile } = buildMobileHeader(android.header, iphone?.header ?? null);
  applyLegacyHeaderFields(rawMobile, android.header);
  if (iphone?.header) {
    const iphoneBlock = rawMobile.iphone || (rawMobile.iphone = {});
    if (!isEmpty(iphone.header.developerName)) {
      iphoneBlock.developerName = iphone.header.developerName;
    }
    if (!isEmpty(iphone.header.idd)) {
      iphoneBlock.idd = iphone.header.idd;
    }
  }
  addLegacyRedirects(
    rawMobile,
    androidBasename,
    iphone ? iphoneBasename : null
  );

  const body = buildBody(android.body, iphone?.body ?? '');
  writeMobile(androidBasename, rawMobile, body);
}

function applyAndroidOnly(branch, basename) {
  const androidRaw = readRepoFile(`_android/${basename}`, { branch });
  if (!androidRaw) {
    console.error(`Missing _android/${basename} on ${branch}`);
    return;
  }

  const android = parseLegacyWallet(androidRaw);
  const { mobile: rawMobile } = buildMobileHeader(android.header, null);
  applyLegacyHeaderFields(rawMobile, android.header);
  const mobilePath = path.join(mobileDir, basename);
  let existingBody = '';
  let iphoneBasename = null;
  if (fs.existsSync(mobilePath)) {
    const existing = loadMobileFromFile(mobilePath);
    mergeExistingIphone(rawMobile, existing.mobile);
    existingBody = extractIphoneBody(existing.body);
    if (existing.mobile?.iphone?.appId) {
      iphoneBasename = `${existing.mobile.iphone.appId}.md`;
    }
  }

  addLegacyRedirects(rawMobile, basename, iphoneBasename);

  const body = existingBody
    ? buildBody(android.body, existingBody)
    : buildBody(android.body, '');
  writeMobile(basename, rawMobile, body);
}

function copyIphoneIcons(branch) {
  const paths = [
    'images/wIcons/iphone/com.app.degate.jpg',
    'images/wIcons/iphone/com.cypherock.cysync.jpg',
    'images/wIcons/iphone/com.earnBit.exchange.app.jpg',
    'images/wIcons/iphone/com.exchange1.exapp.jpg',
    'images/wIcons/iphone/com.globeDerivativeTrading.globe.prod.jpg',
    'images/wIcons/iphone/in.getbitmoney.getbit.jpg',
    'images/wIcons/iphone/small/com.app.degate.jpg',
    'images/wIcons/iphone/small/com.cypherock.cysync.jpg',
    'images/wIcons/iphone/small/com.earnBit.exchange.app.jpg',
    'images/wIcons/iphone/small/com.exchange1.exapp.jpg',
    'images/wIcons/iphone/small/com.globeDerivativeTrading.globe.prod.jpg',
    'images/wIcons/iphone/small/in.getbitmoney.getbit.jpg',
    'images/wIcons/iphone/tiny/com.app.degate.jpg',
    'images/wIcons/iphone/tiny/com.cypherock.cysync.jpg',
    'images/wIcons/iphone/tiny/com.earnBit.exchange.app.jpg',
    'images/wIcons/iphone/tiny/com.exchange1.exapp.jpg',
    'images/wIcons/iphone/tiny/com.globeDerivativeTrading.globe.prod.jpg',
    'images/wIcons/iphone/tiny/in.getbitmoney.getbit.jpg',
  ];
  for (const repoPath of paths) {
    try {
      if (fs.existsSync(path.join(root, repoPath))) {
        continue;
      }
      execSync(`git checkout ${branch} -- ${repoPath}`, { cwd: root, stdio: 'pipe' });
      console.log(`Copied ${repoPath}`);
    } catch {
      console.warn(`Skip missing ${repoPath}`);
    }
  }
}

function main() {
  const { branch } = parseArgs(process.argv);
  console.log(`Applying MR wallet updates from ${branch} to _mobile/\n`);

  for (const [androidBasename, iphoneBasename] of PAIRS) {
    applyPair(branch, androidBasename, iphoneBasename);
  }

  for (const basename of ANDROID_ONLY) {
    applyAndroidOnly(branch, basename);
  }

  copyIphoneIcons(branch);
  console.log('\nDone.');
}

main();
