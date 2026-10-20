#!/usr/bin/env node
// Level 1 APK check (apkContents.mjs): which declared dependencies are really
// in a released APK, which version, and what is in it that nothing declares.
// Usage: node apk-contents-cli.mjs --apk <file.apk> --deps <dependencies.json>
//          [--own <package prefix>]... [--cache <dir>] [--json <out.json>]
//   --deps   the export's apps/<appId>/<ref>/dependencies.json for the release the APK was built from
//   --own    the app's own code (e.g. app.michaelwuensch.bitbanana), left out of "undeclared"
//   --cache  where downloaded artifact class lists are kept (default .cache/apk-contents)
import fs from 'node:fs';
import path from 'node:path';
import minimist from 'minimist';
import { readApk, artifactContents, compare } from './apkContents.mjs';

const CONCURRENCY = 8;

async function artifactsFor(deps, cacheDir, log) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const out = new Map();
  const queue = deps.filter(d => d.ecosystem === 'gradle' && d.version).map(d => `${d.name}@${d.version}`);
  const worker = async () => {
    while (queue.length) {
      const key = queue.shift();
      if (out.has(key)) continue;
      const file = path.join(cacheDir, `${key.replace(/[^A-Za-z0-9._@-]/g, '_')}.json`);
      if (fs.existsSync(file)) {
        const c = JSON.parse(fs.readFileSync(file, 'utf8'));
        out.set(key, c && { url: c.url, classes: new Set(c.classes), native: new Map(c.native) });
        continue;
      }
      const [name, version] = [key.slice(0, key.lastIndexOf('@')), key.slice(key.lastIndexOf('@') + 1)];
      const c = await artifactContents(name, version);
      if (!c) log(`not found in any repository: ${key}`);
      fs.writeFileSync(file, JSON.stringify(c && { url: c.url, classes: [...c.classes], native: [...c.native] }));
      out.set(key, c);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  for (const [k, v] of [...out]) if (!v) out.delete(k);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { string: ['apk', 'deps', 'own', 'cache', 'json'] });
  if (!argv.apk || !argv.deps) {
    console.error('usage: apk-contents-cli.mjs --apk <file.apk> --deps <dependencies.json> [--own <prefix>]... [--cache <dir>] [--json <out>]');
    process.exit(1);
  }
  const apk = readApk(fs.readFileSync(argv.apk));
  const doc = JSON.parse(fs.readFileSync(argv.deps, 'utf8'));
  const deps = doc.dependencies || doc;
  const artifacts = await artifactsFor(deps, argv.cache || '.cache/apk-contents', console.error);
  const own = [].concat(argv.own || []).map(p => (p.endsWith('.') ? p : `${p}.`));
  const result = compare(apk, deps, artifacts, { ownPrefixes: own });
  if (argv.json) fs.writeFileSync(argv.json, JSON.stringify(result, null, 1));
  console.log(JSON.stringify(result.summary, null, 2));
  process.exit(0);
}
