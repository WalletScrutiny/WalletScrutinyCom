#!/usr/bin/env node

/**
 * fdroidSourceAvailableCheck.mjs
 *
 * Walks `_mobile/` markdown files with an `android.appId` (F-Droid hosts Android packages),
 * selects YAML front matter with verdict "sourceavailable", reads appId, and
 * checks whether the F-Droid package page exists:
 *   https://f-droid.org/packages/<appId>/
 *
 * When F-Droid lists the package (HTTP 2xx) and verdict is sourceavailable,
 * inserts under the `android:` block (surgical edit, after `android.appId`):
 *   alternativeStores:
 *   - fdroid
 *
 * When a file already lists fdroid under alternativeStores but the F-Droid
 * package page is gone (HTTP 404), fdroid is removed from that list; if no
 * entries remain, the whole alternativeStores key is removed. Transient
 * failures (timeouts, 5xx) do not trigger removal.
 *
 * Usage:
 *   node scripts/fdroidSourceAvailableCheck.mjs [--concurrency N] [--dry-run]
 *
 * Options:
 *   --concurrency N   Parallel HTTP checks (default: 12)
 *   --dry-run         Do not write .md files; only report
 *
 * Environment:
 *   DEBUG_FDROID_CHECK   When set, print per-wallet rows with outcome not_listed
 *                        (hidden by default to reduce noise)
 *
 * TSV columns (stdout): outcome, file, appId, httpStatus, fdroidUrl, srcAvail?,
 *   hadFdroid?, fileWriteAdd, fileWriteRemove, detail
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import pLimit from 'p-limit';

const fsp = fs.promises;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const F_DROID_ORIGIN = 'https://f-droid.org';
const USER_AGENT = 'walletscrutiny-fdroid-check/1.0 (+https://walletscrutiny.com)';

const MOBILE_DIR = '_mobile';

const DEBUG_FDROID_CHECK = process.env.DEBUG_FDROID_CHECK !== undefined;

const YAML_OPTS = { schema: yaml.FAILSAFE_SCHEMA };

function parseArgs(argv) {
  let concurrency = 12;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--concurrency' && argv[i + 1]) {
      concurrency = Math.max(1, parseInt(argv[++i], 10) || 12);
    } else if (argv[i] === '--dry-run') {
      dryRun = true;
    }
  }
  return { concurrency, dryRun };
}

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return null;
  try {
    return yaml.load(m[1], YAML_OPTS);
  } catch {
    return null;
  }
}

async function* walkMarkdownFiles(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walkMarkdownFiles(full);
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      yield full;
    }
  }
}

async function collectAndroidMarkdownPaths() {
  const base = path.join(REPO_ROOT, MOBILE_DIR);
  const paths = [];
  try {
    await fsp.access(base);
  } catch {
    return paths;
  }
  for await (const file of walkMarkdownFiles(base)) {
    paths.push(file);
  }
  return paths.sort();
}

function extractAndroidBlock(rawFm) {
  const m = rawFm.match(/^android:\n((?:[ \t].*\n)*)/m);
  if (!m) return null;
  return { prefix: 'android:\n', body: m[1], full: m[0] };
}

const FDROID_STORE_BLOCK_INDENTED = '  alternativeStores:\n  - fdroid';

function insertAlternativeStoresFdroidInAndroidBlock(androidBody) {
  if (/^  alternativeStores:\s*\n((?:[ \t].*\n)+)/m.test(androidBody)) {
    const listHead = androidBody.match(/^  alternativeStores:\s*\n((?:[ \t].*\n)+)/m);
    if (listHead && /^\s*-\s+fdroid\b/m.test(listHead[1])) {
      return { androidBody, changed: false };
    }
    return { androidBody, changed: false, conflict: true };
  }

  if (/^  alternativeStores:\s*fdroid\s*$/m.test(androidBody)) {
    return {
      androidBody: androidBody.replace(/^  alternativeStores:\s*fdroid\s*$/m, FDROID_STORE_BLOCK_INDENTED),
      changed: true
    };
  }

  const appIdLine = androidBody.match(/^  appId:.*\n/m);
  if (appIdLine) {
    return {
      androidBody: androidBody.replace(appIdLine[0], `${appIdLine[0]}${FDROID_STORE_BLOCK_INDENTED}\n`),
      changed: true
    };
  }
  return {
    androidBody: `${androidBody.trimEnd()}\n${FDROID_STORE_BLOCK_INDENTED}\n`,
    changed: true
  };
}

function stripFdroidFromAndroidBlock(androidBody) {
  const lines = androidBody.split('\n');
  const out = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];

    if (/^  alternativeStores:\s*fdroid\s*$/i.test(line)) {
      changed = true;
      i += 1;
      continue;
    }

    if (/^  alternativeStores:\s*$/.test(line)) {
      i += 1;
      const itemLines = [];
      while (i < lines.length && /^    -\s+.+$/.test(lines[i])) {
        itemLines.push(lines[i]);
        i += 1;
      }
      const kept = itemLines.filter((l) => !/^\s*-\s+fdroid\s*$/i.test(l));
      if (itemLines.length !== kept.length) changed = true;
      if (kept.length === 0) {
        continue;
      }
      out.push('  alternativeStores:');
      out.push(...kept);
      continue;
    }

    out.push(line);
    i += 1;
  }

  return { androidBody: out.join('\n'), changed };
}

async function fetchPackageStatus(appId, signal) {
  const url = `${F_DROID_ORIGIN}/packages/${encodeURIComponent(appId)}/`;
  const tryOnce = async () => {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal,
      headers: { 'user-agent': USER_AGENT, accept: '*/*' }
    });

    if (res.status === 405 || res.status === 501) {
      const getRes = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal,
        headers: { 'user-agent': USER_AGENT, accept: 'text/html' }
      });
      return { ok: getRes.ok, status: getRes.status, url };
    }

    return { ok: res.ok, status: res.status, url };
  };

  let out = await tryOnce();
  if (out.status >= 500 && out.status < 600) {
    await new Promise((r) => setTimeout(r, 750));
    out = await tryOnce();
  }
  return out;
}

function rel(p) {
  return path.relative(REPO_ROOT, p);
}

function splitLeadingFrontmatter(content) {
  const m = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!m) return null;
  const body = content.slice(m[0].length);
  return { open: m[1], rawFm: m[2], close: m[3], body };
}

const FDROID_STORE_BLOCK = 'alternativeStores:\n- fdroid';

function insertAlternativeStoresFdroid(rawFm) {
  const androidSection = extractAndroidBlock(rawFm);
  if (androidSection) {
    const { androidBody, changed, conflict } = insertAlternativeStoresFdroidInAndroidBlock(androidSection.body);
    if (conflict) return { rawFm, changed: false, conflict: true };
    if (!changed) return { rawFm, changed: false };
    const nextAndroid = `android:\n${androidBody}`;
    return {
      rawFm: rawFm.replace(androidSection.full, nextAndroid),
      changed: true
    };
  }

  const listHead = rawFm.match(/^alternativeStores:\s*\n((?:[ \t]*-[^\n]+\n)+)/m);
  if (listHead && /^\s*-\s+fdroid\b/m.test(listHead[1])) {
    return { rawFm, changed: false };
  }

  if (/^alternativeStores:/m.test(rawFm)) {
    return { rawFm, changed: false, conflict: true };
  }

  const m = rawFm.match(/^(appId:.*\n)/m);
  if (m) {
    return { rawFm: rawFm.replace(m[0], `${m[0]}${FDROID_STORE_BLOCK}\n`), changed: true };
  }
  return { rawFm: `${rawFm.trimEnd()}\n${FDROID_STORE_BLOCK}\n`, changed: true };
}

function fmHasFdroidInAlternativeStores(fm) {
  const s = fm?.android?.alternativeStores ?? fm?.alternativeStores;
  if (s == null) return false;
  if (typeof s === 'string') return s.trim().toLowerCase() === 'fdroid';
  if (Array.isArray(s)) return s.some((x) => String(x).trim().toLowerCase() === 'fdroid');
  return false;
}

function stripFdroidFromAlternativeStoresRaw(rawFm) {
  const androidSection = extractAndroidBlock(rawFm);
  if (androidSection) {
    const { androidBody, changed } = stripFdroidFromAndroidBlock(androidSection.body);
    if (!changed) return { rawFm, changed: false };
    const nextAndroid = `android:\n${androidBody}`;
    return {
      rawFm: rawFm.replace(androidSection.full, nextAndroid),
      changed: true
    };
  }

  const lines = rawFm.split('\n');
  const out = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];

    if (/^alternativeStores:\s*fdroid\s*$/i.test(line) || /^alternativeStores:\s*['"]fdroid['"]\s*$/i.test(line)) {
      changed = true;
      i += 1;
      continue;
    }

    const flowBracket = line.match(/^alternativeStores:\s*(\[[^\]]*\])\s*$/);
    if (flowBracket) {
      try {
        const inner = yaml.load(flowBracket[1], YAML_OPTS);
        if (Array.isArray(inner)) {
          const next = inner.filter((x) => String(x).trim().toLowerCase() !== 'fdroid');
          if (next.length !== inner.length) changed = true;
          if (next.length === 0) {
            i += 1;
            continue;
          }
          out.push('alternativeStores:');
          for (const item of next) {
            out.push(`- ${item}`);
          }
          i += 1;
          continue;
        }
      } catch {
        /* fall through */
      }
    }

    if (/^alternativeStores:\s*$/.test(line)) {
      i += 1;
      const itemLines = [];
      while (i < lines.length && /^\s*-\s+.+$/.test(lines[i])) {
        itemLines.push(lines[i]);
        i += 1;
      }
      const kept = itemLines.filter((l) => !/^\s*-\s+fdroid\s*$/i.test(l));
      if (itemLines.length !== kept.length) changed = true;
      if (kept.length === 0) {
        continue;
      }
      out.push('alternativeStores:');
      out.push(...kept);
      continue;
    }

    if (/^alternativeStores:\s+/.test(line)) {
      const rest = line.slice(line.indexOf(':') + 1).trim();
      if (rest.startsWith('[') && rest.endsWith(']')) {
        try {
          const v = yaml.load(rest, YAML_OPTS);
          if (Array.isArray(v)) {
            const next = v.filter((x) => String(x).trim().toLowerCase() !== 'fdroid');
            if (next.length !== v.length) changed = true;
            if (next.length === 0) {
              i += 1;
              continue;
            }
            out.push('alternativeStores:');
            for (const item of next) {
              out.push(`- ${item}`);
            }
            i += 1;
            continue;
          }
        } catch {
          /* keep line */
        }
      }
    }

    out.push(line);
    i += 1;
  }

  return { rawFm: out.join('\n'), changed };
}

function applyAlternativeStoresToFile(absPath, dryRun) {
  const content = fs.readFileSync(absPath, 'utf8');
  const parts = splitLeadingFrontmatter(content);
  if (!parts) return { status: 'no_frontmatter' };
  const { rawFm, open, close, body } = parts;
  const { rawFm: nextFm, changed, conflict } = insertAlternativeStoresFdroid(rawFm);
  if (conflict) return { status: 'alternativeStores_conflict' };
  if (!changed) return { status: 'unchanged' };
  const next = `${open}${nextFm}${close}${body}`;
  if (!dryRun) {
    fs.writeFileSync(absPath, next, 'utf8');
  }
  return { status: dryRun ? 'would_update' : 'updated' };
}

function applyRemoveFdroidFromAlternativeStoresFile(absPath, dryRun) {
  const content = fs.readFileSync(absPath, 'utf8');
  const parts = splitLeadingFrontmatter(content);
  if (!parts) return { status: 'no_frontmatter' };
  const { rawFm, open, close, body } = parts;
  const hadKey = /^alternativeStores:/m.test(rawFm);
  const { rawFm: nextFm, changed } = stripFdroidFromAlternativeStoresRaw(rawFm);
  if (!changed) {
    return hadKey ? { status: 'remove_unchanged_raw' } : { status: 'unchanged' };
  }
  const hasKeyAfter = /^alternativeStores:/m.test(nextFm);
  const next = `${open}${nextFm}${close}${body}`;
  if (!dryRun) {
    fs.writeFileSync(absPath, next, 'utf8');
  }
  if (!hasKeyAfter) {
    return { status: dryRun ? 'would_remove_key' : 'removed_key' };
  }
  return { status: dryRun ? 'would_strip_fdroid' : 'stripped_fdroid' };
}

async function main() {
  const { concurrency, dryRun } = parseArgs(process.argv.slice(2));
  const mdPaths = await collectAndroidMarkdownPaths();

  const rows = [];
  for (const absPath of mdPaths) {
    let content;
    try {
      content = await fsp.readFile(absPath, 'utf8');
    } catch (err) {
      rows.push({
        absPath,
        file: rel(absPath),
        appId: null,
        isSourceAvailable: false,
        hadFdroid: false,
        outcome: 'read_error',
        detail: err.message
      });
      continue;
    }

    const fm = parseFrontmatter(content);
    if (!fm) continue;

    const isSourceAvailable = fm.android?.verdict === 'sourceavailable' || fm.verdict === 'sourceavailable';
    const hadFdroid = fmHasFdroidInAlternativeStores(fm);
    if (!isSourceAvailable && !hadFdroid) continue;

    const appId = fm.android?.appId ?? fm.appId;
    if (typeof appId !== 'string' || !appId.trim()) {
      rows.push({
        absPath,
        file: rel(absPath),
        appId: null,
        isSourceAvailable,
        hadFdroid,
        outcome: 'no_app_id',
        detail: ''
      });
      continue;
    }

    rows.push({
      absPath,
      file: rel(absPath),
      appId: appId.trim(),
      isSourceAvailable,
      hadFdroid,
      outcome: 'pending',
      detail: ''
    });
  }

  const limit = pLimit(concurrency);
  const cache = new Map();

  async function resolveFdroid(appId) {
    if (cache.has(appId)) return cache.get(appId);
    const task = (async () => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 25000);
      try {
        const { ok, status, url } = await fetchPackageStatus(appId, controller.signal);
        if (ok && status >= 200 && status < 300) {
          return { outcome: 'listed', httpStatus: status, url };
        }
        if (status === 404) {
          return { outcome: 'not_listed', httpStatus: status, url };
        }
        return { outcome: 'unexpected_status', httpStatus: status, url };
      } catch (err) {
        const msg = err.name === 'AbortError' ? 'timeout' : err.message;
        return { outcome: 'http_error', httpStatus: null, url: `${F_DROID_ORIGIN}/packages/${encodeURIComponent(appId)}/`, detail: msg };
      } finally {
        clearTimeout(t);
      }
    })();
    cache.set(appId, task);
    return task;
  }

  await Promise.all(
    rows
      .filter((r) => r.outcome === 'pending')
      .map((r) =>
        limit(async () => {
          const res = await resolveFdroid(r.appId);
          r.outcome = res.outcome;
          r.httpStatus = res.httpStatus;
          r.fdroidUrl = res.url;
          if (res.detail) r.detail = res.detail;
        })
      )
  );

  const listed = rows.filter((r) => r.outcome === 'listed');
  const notListed = rows.filter((r) => r.outcome === 'not_listed');
  const problems = rows.filter((r) =>
    ['http_error', 'unexpected_status', 'read_error', 'no_app_id'].includes(r.outcome)
  );

  let addUpdated = 0;
  let addWouldUpdate = 0;
  let addUnchanged = 0;
  let removeStripped = 0;
  let removeWouldStrip = 0;
  let removeKeyRemoved = 0;
  let removeWouldRemoveKey = 0;
  let removeUnchanged = 0;
  let fileWriteErrors = 0;
  let fileConflicts = 0;
  let removeRawMismatch = 0;

  for (const r of rows) {
    if (r.outcome === 'pending' || r.outcome === 'read_error') continue;
    r.fileWriteAdd = '';
    r.fileWriteRemove = '';

    const isListed = r.outcome === 'listed';
    const isNotListed = r.outcome === 'not_listed';

    if (isListed && r.isSourceAvailable && r.absPath) {
      try {
        const w = applyAlternativeStoresToFile(r.absPath, dryRun);
        r.fileWriteAdd = w.status;
        if (w.status === 'updated') addUpdated++;
        else if (w.status === 'would_update') addWouldUpdate++;
        else if (w.status === 'unchanged') addUnchanged++;
        else if (w.status === 'alternativeStores_conflict') fileConflicts++;
        else if (w.status === 'no_frontmatter') fileWriteErrors++;
      } catch (err) {
        r.fileWriteAdd = 'write_error';
        r.detail = r.detail ? `${r.detail}; ${err.message}` : err.message;
        fileWriteErrors++;
      }
    }

    if (isNotListed && r.hadFdroid && r.absPath) {
      try {
        const w = applyRemoveFdroidFromAlternativeStoresFile(r.absPath, dryRun);
        r.fileWriteRemove = w.status;
        if (w.status === 'stripped_fdroid') removeStripped++;
        else if (w.status === 'would_strip_fdroid') removeWouldStrip++;
        else if (w.status === 'removed_key') removeKeyRemoved++;
        else if (w.status === 'would_remove_key') removeWouldRemoveKey++;
        else if (w.status === 'unchanged' || w.status === 'remove_unchanged_raw') {
          removeUnchanged++;
          if (w.status === 'remove_unchanged_raw') removeRawMismatch++;
        } else if (w.status === 'no_frontmatter') fileWriteErrors++;
      } catch (err) {
        r.fileWriteRemove = 'write_error';
        r.detail = r.detail ? `${r.detail}; ${err.message}` : err.message;
        fileWriteErrors++;
      }
    }
  }

  for (const r of rows) {
    if (r.outcome === 'pending') continue;
    if (r.outcome === 'not_listed' && !DEBUG_FDROID_CHECK) continue;
    const parts = [
      r.outcome,
      r.file,
      r.appId || '-',
      r.httpStatus ?? '-',
      r.fdroidUrl || '',
      r.isSourceAvailable ? 'srcAvail' : '-',
      r.hadFdroid ? 'hadFdroid' : '-',
      r.fileWriteAdd || '',
      r.fileWriteRemove || '',
      r.detail || ''
    ].map((c) => String(c).replace(/\t/g, ' '));
    console.log(parts.join('\t'));
  }

  console.error('');
  console.error(
    `Summary: ${listed.length} listed on F-Droid, ${notListed.length} not listed (404), ${problems.length} other issues, ` +
      `${mdPaths.length} markdown files scanned under _mobile/.` +
      (dryRun
        ? ` Add fdroid: ${addWouldUpdate} would update, ${addUnchanged} unchanged, ${fileConflicts} conflicts.` +
            ` Remove fdroid (404 only): ${removeWouldStrip} would strip entry, ${removeWouldRemoveKey} would drop key, ${removeUnchanged} unchanged` +
            (removeRawMismatch ? ` (${removeRawMismatch} had fdroid in YAML but raw strip no-op)` : '') +
            `, ${fileWriteErrors} errors.`
        : ` Add fdroid: ${addUpdated} updated, ${addUnchanged} unchanged, ${fileConflicts} conflicts.` +
            ` Remove fdroid (404 only): ${removeStripped} stripped entry, ${removeKeyRemoved} dropped empty key, ${removeUnchanged} unchanged` +
            (removeRawMismatch ? ` (${removeRawMismatch} had fdroid in YAML but raw strip no-op)` : '') +
            `, ${fileWriteErrors} errors.`)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
