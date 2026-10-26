#!/usr/bin/env node
// The APK check for the reproducible-build scripts (scripts/rb/ws-depcheck.sh
// --apk): the Maven packages osv-scanner found in the checkout against the
// APK the build produced or the store shipped (apkContents.mjs). Node only,
// so the build script can fetch it by commit and check its hash.
// Usage: node apk-scan-cli.mjs <osv-scanner.json> <app.apk> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { readApk, artifactsFor, compare } from './apkContents.mjs';

// The Maven packages of an osv-scanner JSON report, as dependency rows.
export function mavenPackages(scan) {
  const seen = new Map();
  for (const r of scan?.results || []) {
    for (const p of r.packages || []) {
      const pkg = p.package || {};
      if (pkg.ecosystem !== 'Maven' || !pkg.name || !pkg.version) continue;
      seen.set(`${pkg.name}@${pkg.version}`, { ecosystem: 'gradle', name: pkg.name, version: pkg.version, scope: null });
    }
  }
  return [...seen.values()];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [scanFile, apkFile, outFile] = process.argv.slice(2);
  if (!scanFile || !apkFile || !outFile) {
    console.error('usage: apk-scan-cli.mjs <osv-scanner.json> <app.apk> <out.json>');
    process.exit(2);
  }
  const deps = mavenPackages(JSON.parse(readFileSync(scanFile, 'utf8')));
  const apk = readApk(readFileSync(apkFile));
  const artifacts = await artifactsFor(deps, { log: (m) => console.error(m) });
  const { rows, nativeFiles, undeclared, summary } = compare(apk, deps, artifacts);
  writeFileSync(outFile, JSON.stringify({ summary, rows, nativeFiles, undeclared: undeclared.slice(0, 50) }, null, 1));
  console.error(JSON.stringify(summary));
  process.exit(0);
}
