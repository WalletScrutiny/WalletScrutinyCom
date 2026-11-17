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
import { readApk, artifactsFor, compare } from './apkContents.mjs';

/**
 * What the wallet page reads: per declared package `ecosystem:name@version`
 * its status in the APK, the undeclared native files and code (largest
 * first) and the summary counts; `apk` names the file that was checked.
 */
export function apkExport(result, { ref, apkName, apkSha256 }) {
  const packages = {};
  for (const r of result.rows) packages[`gradle:${r.name}@${r.version}`] = r.shippedVersion && r.shippedVersion !== r.version ? `${r.status}:${r.shippedVersion}` : r.status;
  const s = result.summary;
  return {
    schema: 1,
    ref,
    apk: { name: apkName, sha256: apkSha256 },
    summary: { declared: s.declared, present: s.present, otherVersionShipped: s.otherVersionShipped, cantTell: s.cantTell, native: s.native, nativeIdentical: s.nativeIdentical, nativeDiffers: s.nativeDiffers, undeclaredClasses: s.undeclaredClasses },
    packages,
    // the panel names the native libraries no dependency declares, and the five largest undeclared packages
    nativeFiles: result.nativeFiles.filter(n => n.verdict === 'undeclared').map(n => ({ path: n.path, verdict: n.verdict })),
    undeclared: result.undeclared.slice(0, 5).map(u => ({ package: u.package })),
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
  const artifacts = await artifactsFor(deps, { cacheDir: argv.cache || '.cache/apk-contents', log: console.error });
  const own = [].concat(argv.own || []).map(p => (p.endsWith('.') ? p : `${p}.`));
  const result = compare(apk, deps, artifacts, { ownPrefixes: own });
  if (argv.json) fs.writeFileSync(argv.json, JSON.stringify(result, null, 1));
  if (argv.export) {
    if (!argv['app-id'] || !argv.ref) throw new Error('--export needs --app-id and --ref');
    const doc = apkExport(result, { ref: argv.ref, apkName: path.basename(argv.apk), apkSha256: createHash('sha256').update(apkBuf).digest('hex') });
    fs.mkdirSync(path.join(argv.export, 'apk'), { recursive: true });
    fs.writeFileSync(path.join(argv.export, 'apk', `${argv['app-id'].replace(/[^A-Za-z0-9._+-]/g, '_')}.json`), JSON.stringify(doc));
  }
  console.log(JSON.stringify(result.summary, null, 2));
  process.exit(0);
}
