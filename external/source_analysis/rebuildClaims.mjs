/**
 * Rebuild claims, rung "reproduced" of the dependency ladder: who has rebuilt
 * a package version from its source and got the file the registry serves.
 *
 * Other projects' claims are imported, never repeated, and always kept under
 * their name (issue 992 part G, Leo 2026-11-03):
 *
 *   oss-rebuild           Google's OSS Rebuild publishes one signed in-toto
 *                         attestation per rebuilt registry file in the public
 *                         bucket google-rebuild-attestations (npm, PyPI,
 *                         crates.io). It publishes successes only, so a
 *                         version missing there is "not tried or failed",
 *                         never "failed".
 *   reproducible-central  jvm-repo-rebuild/reproducible-central keeps a
 *                         .buildcompare per Maven release (ok/ko per file) and
 *                         a .buildinfo listing the artifacts it built. Read
 *                         from a local clone (RC_DIR), one per pass.
 *
 * Our own rebuilds (rebuildNpm.mjs) land in the same table with claimant `ws`.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

export const OSS_REBUILD_BUCKET = 'google-rebuild-attestations';
export const RC_REPO = 'https://github.com/jvm-repo-rebuild/reproducible-central';
const OSS_ECOSYSTEMS = { npm: 'npm', pip: 'pypi', cargo: 'cratesio' };
const LOOKUP_TTL_DAYS = 7;
const CONCURRENCY = 16;

/** PyPI names compare case- and separator-insensitively (PEP 503). */
export const pypiName = (n) => n.toLowerCase().replace(/[-_.]+/g, '-');

/** The bucket prefix holding every rebuilt version of one package, or null for an ecosystem OSS Rebuild does not cover. */
export function ossRebuildPrefix(ecosystem, name) {
  const eco = OSS_ECOSYSTEMS[ecosystem];
  if (!eco) return null;
  return `${eco}/${ecosystem === 'pip' ? pypiName(name) : name}/`;
}

/** Object names under a prefix → Map version → [{ artifact, url }]. */
export function parseOssListing(names, prefix) {
  const out = new Map();
  for (const n of names) {
    if (!n.startsWith(prefix) || !n.endsWith('/rebuild.intoto.jsonl')) continue;
    const [version, artifact] = n.slice(prefix.length).split('/');
    if (!version || !artifact) continue;
    if (!out.has(version)) out.set(version, []);
    out.get(version).push({ artifact, url: `https://storage.googleapis.com/${OSS_REBUILD_BUCKET}/${n}` });
  }
  return out;
}

export async function listOssRebuild(ecosystem, name, fetchImpl = fetch) {
  const prefix = ossRebuildPrefix(ecosystem, name);
  if (!prefix) return null;
  const names = [];
  let pageToken = '';
  do {
    const q = new URLSearchParams({ prefix, fields: 'items/name,nextPageToken', maxResults: '1000' });
    if (pageToken) q.set('pageToken', pageToken);
    const r = await fetchImpl(`https://storage.googleapis.com/storage/v1/b/${OSS_REBUILD_BUCKET}/o?${q}`, { signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw new Error(`OSS Rebuild ${prefix}: HTTP ${r.status}`);
    const doc = await r.json();
    for (const i of doc.items || []) names.push(i.name);
    pageToken = doc.nextPageToken || '';
  } while (pageToken);
  return parseOssListing(names, prefix);
}

/** key=value lines of a .buildcompare or .buildspec; quotes stripped. */
export function parseProperties(text) {
  const out = {};
  for (const line of String(text).split('\n')) {
    const m = /^([A-Za-z0-9_.]+)=(.*)$/.exec(line.trim());
    if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
  return out;
}

const words = (s) => (s || '').split(/\s+/).filter(Boolean);

/**
 * One Reproducible Central release (a .buildspec and its .buildcompare) → one
 * claim per Maven artifact compared. The group is the buildspec's groupId, the
 * artifacts are read off the compared file names (`artifact-1.2.3.jar`). An
 * artifact counts as reproduced when its main file (.jar, else .aar, else
 * .pom) is in okFiles, failed when it is in koFiles; ignored files give no claim.
 * The .buildinfo would name each file's group too, but is six times the size.
 */
export function rcClaims(buildspec, buildcompare, url) {
  const spec = parseProperties(buildspec), cmp = parseProperties(buildcompare);
  const version = cmp.version, groupId = spec.groupId;
  if (!version || !groupId || groupId.includes('$')) return [];
  const ok = new Set(words(cmp.okFiles)), ko = new Set(words(cmp.koFiles));
  const byArtifact = new Map();
  for (const file of [...ok, ...ko]) {
    const at = file.indexOf(`-${version}`);
    if (at <= 0) continue;
    const artifactId = file.slice(0, at);
    if (!byArtifact.has(artifactId)) byArtifact.set(artifactId, []);
    byArtifact.get(artifactId).push(file);
  }
  const claims = [];
  for (const [artifactId, files] of byArtifact) {
    const main = ['.jar', '.aar', '.pom'].map(ext => `${artifactId}-${version}${ext}`).find(f => files.includes(f));
    if (!main) continue;
    const others = files.filter(f => f !== main && ko.has(f));
    claims.push({
      ecosystem: 'gradle', name: `${groupId}:${artifactId}`, version, claimant: 'reproducible-central', artifact: main, url,
      result: ok.has(main) ? 'reproduced' : 'failed',
      note: ok.has(main) ? (others.length ? `${others.length} other file${others.length > 1 ? 's' : ''} of this release differ` : null) : `${main} differs`,
    });
  }
  return claims;
}

/** Every claim in a checkout of reproducible-central, as a Map `name\0version` → claim. */
export function readReproducibleCentral(dir) {
  const out = new Map();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.buildcompare')) continue;
      const spec = p.replace(/\.buildcompare$/, '.buildspec');
      if (!fs.existsSync(spec)) continue;
      const url = `${RC_REPO}/blob/master/${path.relative(dir, spec)}`;
      for (const c of rcClaims(fs.readFileSync(spec, 'utf8'), fs.readFileSync(p, 'utf8'), url)) {
        const key = `${c.name}\0${c.version}`;
        if (!out.has(key)) out.set(key, c);
      }
    }
  };
  walk(path.join(dir, 'content'));
  return out;
}

/**
 * Clone or update the parts of reproducible-central this needs: the
 * .buildspec and .buildcompare files, about 70 MB of the 600 MB checkout.
 */
export function syncReproducibleCentral(dir, { run = (args) => execFileSync('git', args, { stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000 }) } = {}) {
  if (!fs.existsSync(path.join(dir, '.git'))) {
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    run(['clone', '--quiet', '--depth', '1', '--filter=blob:none', '--no-checkout', `${RC_REPO}.git`, dir]);
    run(['-C', dir, 'sparse-checkout', 'set', '--no-cone', '/content/**/*.buildspec', '/content/**/*.buildcompare']);
    run(['-C', dir, 'checkout', '--quiet']);
  } else {
    run(['-C', dir, 'fetch', '--quiet', '--depth', '1', 'origin']);
    run(['-C', dir, 'reset', '--quiet', '--hard', 'FETCH_HEAD']);
  }
  return dir;
}

/**
 * Import outside claims for every package version the database holds.
 * OSS Rebuild: one bucket listing per package name, repeated after
 * LOOKUP_TTL_DAYS (rebuild_lookups). Reproducible Central: the whole clone at
 * rcDir, when given. Claims are replaced per (package version, claimant), so a
 * claim withdrawn upstream disappears at the next lookup.
 */
export async function importRebuildClaims(db, { fetchImpl = fetch, rcDir = null, all = false, log = () => {} } = {}) {
  const stats = { ossNames: 0, ossClaims: 0, rcClaims: 0, failed: 0 };
  const save = db.prepare(`INSERT OR REPLACE INTO package_rebuilds (ecosystem, name, version, claimant, result, artifact, url, note, checked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`);
  const dropFor = db.prepare(`DELETE FROM package_rebuilds WHERE ecosystem = ? AND name = ? AND claimant = ?`);
  const looked = db.prepare(`INSERT OR REPLACE INTO rebuild_lookups (claimant, ecosystem, name, checked_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`);

  const names = db.prepare(`
    SELECT DISTINCT p.ecosystem, p.name FROM packages p
    WHERE p.ecosystem IN ('npm', 'pip', 'cargo') AND p.version != ''
    ${all ? '' : `AND NOT EXISTS (SELECT 1 FROM rebuild_lookups l WHERE l.claimant = 'oss-rebuild' AND l.ecosystem = p.ecosystem AND l.name = p.name
      AND l.checked_at > datetime('now', '-${LOOKUP_TTL_DAYS} days'))`}
  `).all();
  const versionsOf = db.prepare(`SELECT DISTINCT version FROM packages WHERE ecosystem = ? AND name = ?`);
  const queue = [...names];
  const worker = async () => {
    while (queue.length) {
      const { ecosystem, name } = queue.shift();
      let listing;
      try { listing = await listOssRebuild(ecosystem, name, fetchImpl); } catch (e) { stats.failed++; log(e.message); continue; }
      stats.ossNames++;
      const ours = new Set(versionsOf.all(ecosystem, name).map(r => r.version));
      db.transaction(() => {
        dropFor.run(ecosystem, name, 'oss-rebuild');
        for (const [version, files] of listing) {
          if (!ours.has(version)) continue;
          save.run(ecosystem, name, version, 'oss-rebuild', 'reproduced', files.map(f => f.artifact).join(' '), files[0].url, null);
          stats.ossClaims++;
        }
        looked.run('oss-rebuild', ecosystem, name);
      })();
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (rcDir) {
    const rc = readReproducibleCentral(rcDir);
    const ours = db.prepare(`SELECT DISTINCT name, version FROM packages WHERE ecosystem = 'gradle' AND version != ''`).all();
    db.transaction(() => {
      db.prepare(`DELETE FROM package_rebuilds WHERE claimant = 'reproducible-central'`).run();
      for (const { name, version } of ours) {
        const c = rc.get(`${name}\0${version.replace(/@\w+$/, '')}`);
        if (!c) continue;
        save.run('gradle', name, version, c.claimant, c.result, c.artifact, c.url, c.note);
        stats.rcClaims++;
      }
    })();
  }
  return stats;
}
