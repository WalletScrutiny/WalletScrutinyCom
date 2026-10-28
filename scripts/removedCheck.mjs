#!/usr/bin/env node

/**
 * removedCheck.mjs
 *
 * Sets `android.meta: removed` only when no tracked channel still ships the app.
 * Runs in refresh.sh after the Play scraper and the F-Droid and Zapstore checks, so
 * `android.playStore` and `android.alternativeStores` are fresh.
 *
 * For every `_mobile/` file that Google Play no longer lists (`playStore: removed`, or
 * the older `meta: removed`, which only the Play scraper used to set):
 * - asks GitHub for a release with an APK in the last RECENT_RELEASE_MONTHS months
 *   when the app's repository is on GitHub and no other store lists it;
 * - `meta: removed` -> `ok` when F-Droid, Zapstore or GitHub still ships it,
 *   anything else -> `removed` when none does. A failed GitHub query changes nothing.
 *   An app that goes back to `ok` gets `playStore: removed` so the delisting is not lost
 *   (older files only carry it as `meta: removed`; they are not rewritten otherwise).
 *
 * Usage:
 *   node scripts/removedCheck.mjs [-g <githubToken>] [--dry-run]
 *
 * TSV columns (stdout, changed files only): file, appId, oldMeta, newMeta, channels
 */

import fs from 'fs';
import path from 'path';
import pLimit from 'p-limit';
import { createGitHubRequest } from './github_common.mjs';
import { MOBILE_DIR, loadMobileFromFile, writeMobileFile, metaUpdateContext } from './mobileWalletStore.mjs';
import {
  isDelistedFromPlay,
  githubRepoPath,
  hasRecentApkRelease,
  otherChannels,
  nextMeta
} from './androidAvailability.mjs';

process.env.TZ = 'UTC';

function parseArgs (argv) {
  const out = { token: undefined, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '-g' && argv[i + 1]) out.token = argv[++i];
    else if (argv[i] === '--dry-run') out.dryRun = true;
  }
  return out;
}

/** true / false, or null when GitHub could not answer. */
async function githubShips (github, repoPath) {
  try {
    const { data } = await github.get(`/repos/${repoPath}/releases`, { params: { per_page: 20 } });
    return hasRecentApkRelease(data);
  } catch (err) {
    if (err.response?.status === 404) return false;
    console.error(`GitHub releases of ${repoPath}: ${err.message}`);
    return null;
  }
}

async function main () {
  const { token, dryRun } = parseArgs(process.argv.slice(2));
  const github = createGitHubRequest(token);
  const limit = pLimit(token ? 8 : 2);

  const rows = [];
  for (const name of fs.readdirSync(MOBILE_DIR).sort()) {
    if (!name.endsWith('.md')) continue;
    const filePath = path.join(MOBILE_DIR, name);
    const loaded = loadMobileFromFile(filePath);
    const android = loaded.mobile.android;
    if (!android?.appId || !isDelistedFromPlay(android)) continue;
    rows.push({ filePath, ...loaded, android });
  }

  const counts = { ok: 0, removed: 0, unknown: 0 };
  await Promise.all(rows.map((r) => limit(async () => {
    const { android, mobile } = r;
    let ships = false;
    if (!otherChannels(android, false).channels.length) {
      const repoPath = githubRepoPath(android.repository || mobile.repository);
      if (repoPath) ships = await githubShips(github, repoPath);
    }
    const channels = otherChannels(android, ships);
    const meta = nextMeta(android, channels);
    if (!channels.known) counts.unknown++;

    if (!meta) return;
    console.log([r.filePath, android.appId, android.meta, meta, channels.channels.join(',') || '-'].join('\t'));
    android.playStore = 'removed';
    android.meta = meta;
    metaUpdateContext(mobile, 'android').date = new Date();
    counts[meta]++;
    if (!dryRun) writeMobileFile(r.filePath, mobile, r.body);
  })));

  const verb = dryRun ? 'would be ' : '';
  console.error(
    `\nSummary: ${rows.length} Android apps not on Google Play. ` +
      `meta ${verb}set to ok: ${counts.ok}, to removed: ${counts.removed}, ` +
      `left unchanged after a failed GitHub query: ${counts.unknown}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
