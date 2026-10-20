#!/usr/bin/env node
// Level 1 APK check (apkContents.mjs): which declared dependencies are really
// in a released APK, which version, and what is in it that nothing declares.
// Usage: node apk-contents-cli.mjs --apk <file.apk> --deps <dependencies.json>
//          [--own <package prefix>]... [--cache <dir>] [--json <out.json>]
//   --deps   the export's apps/<appId>/<ref>/dependencies.json for the release the APK was built from
//   --own    the app's own code (e.g. app.michaelwuensch.bitbanana), left out of "undeclared"
//   --cache  where downloaded artifact class lists are kept (default .cache/apk-contents)
//   --export <dir> --app-id <id> --ref <tag>   also write <dir>/apk/<appId>.json for the
//            wallet page (what is in the APK per declared package; apkExport below)
import fs from 'node:fs';
import path from 'node:path';
import minimist from 'minimist';
import { createHash } from 'node:crypto';
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

/**
 * What the wallet page needs: per declared package `ecosystem:name@version`
 * its status in the APK, the native files, the undeclared code (largest
 * first) and the summary; `apk` names the file that was checked.
 */
export function apkExport(result, { appId, ref, apkName, apkSha256, checkedAt = new Date().toISOString() }) {
  const packages = {};
  for (const r of result.rows) packages[`gradle:${r.name}@${r.version}`] = r.shippedVersion && r.shippedVersion !== r.version ? `${r.status}:${r.shippedVersion}` : r.status;
  return {
    schema: 1,
    appId,
    ref,
    apk: { name: apkName, sha256: apkSha256 },
    checkedAt,
    summary: result.summary,
    packages,
    nativeFiles: result.nativeFiles.map(n => ({ path: n.path, verdict: n.verdict, providers: n.providers.filter(p => p.identical).map(p => `${p.name}@${p.version}`) })),
    undeclared: result.undeclared.slice(0, 30),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { string: ['apk', 'deps', 'own', 'cache', 'json', 'export', 'app-id', 'ref'] });
  if (!argv.apk || !argv.deps) {
    console.error('usage: apk-contents-cli.mjs --apk <file.apk> --deps <dependencies.json> [--own <prefix>]... [--cache <dir>] [--json <out>]');
    process.exit(1);
  }
  const apkBuf = fs.readFileSync(argv.apk);
  const apk = readApk(apkBuf);
  const doc = JSON.parse(fs.readFileSync(argv.deps, 'utf8'));
  const deps = doc.dependencies || doc;
  const artifacts = await artifactsFor(deps, argv.cache || '.cache/apk-contents', console.error);
  const own = [].concat(argv.own || []).map(p => (p.endsWith('.') ? p : `${p}.`));
  const result = compare(apk, deps, artifacts, { ownPrefixes: own });
  if (argv.json) fs.writeFileSync(argv.json, JSON.stringify(result, null, 1));
  if (argv.export) {
    if (!argv['app-id'] || !argv.ref) throw new Error('--export needs --app-id and --ref');
    const doc = apkExport(result, { appId: argv['app-id'], ref: argv.ref, apkName: path.basename(argv.apk), apkSha256: createHash('sha256').update(apkBuf).digest('hex') });
    fs.mkdirSync(path.join(argv.export, 'apk'), { recursive: true });
    fs.writeFileSync(path.join(argv.export, 'apk', `${argv['app-id'].replace(/[^A-Za-z0-9._+-]/g, '_')}.json`), JSON.stringify(doc));
  }
  console.log(JSON.stringify(result.summary, null, 2));
  process.exit(0);
}
