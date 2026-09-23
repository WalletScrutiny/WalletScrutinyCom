#!/usr/bin/env node
// Verify every entry of a built redirects.map against a running server:
// each old URL must answer 301 with a Location ending in the mapped target,
// and each target must answer 200.
//
//   node scripts/checkRedirects.mjs https://beta.walletscrutiny.com [_site/redirects.map]
//
// Exit code 1 if any check fails.
import { readFile } from 'node:fs/promises';

const base = (process.argv[2] || '').replace(/\/$/, '');
const mapFile = process.argv[3] || '_site/redirects.map';
if (!base) {
  console.error('usage: node scripts/checkRedirects.mjs <base-url> [redirects.map]');
  process.exit(1);
}

const entries = [];
for (const line of (await readFile(mapFile, 'utf8')).split('\n')) {
  const m = line.match(/^"([^"]+)" "([^"]+)";$/);
  if (!m) continue;
  const [, key, target] = m;
  // case-collision entries are emitted as "~^<escaped>$"; unescape for the request
  const source = key.startsWith('~^') ? key.slice(2, -1).replace(/\\(.)/g, '$1') : key;
  entries.push({ source, target });
}

const targets = [...new Set(entries.map((e) => e.target))];
const failures = [];
const concurrency = 20;

async function head(url) {
  const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location') || '' };
}

async function run(items, check) {
  let i = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const item = items[i++];
      try {
        const problem = await check(item);
        if (problem) failures.push(problem);
      } catch (err) {
        failures.push(`${JSON.stringify(item)}: ${err.message}`);
      }
    }
  }));
}

await run(entries, async ({ source, target }) => {
  const { status, location } = await head(base + source);
  if (status !== 301) return `${source}: expected 301, got ${status}`;
  if (!location.endsWith(target)) return `${source}: expected Location ending in ${target}, got ${location}`;
  return null;
});
await run(targets, async (target) => {
  const { status } = await head(base + target);
  return status === 200 ? null : `${target}: expected 200, got ${status}`;
});

console.log(`${entries.length} redirects, ${targets.length} targets, ${failures.length} failures`);
for (const f of failures) console.log(`  ${f}`);
process.exit(failures.length ? 1 : 0);
