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
// OSS Rebuild publishes in bursts (most of the versions it has of ours came in
// one week), so each package name is asked once a day: one bucket listing per
// name, about 6,700 names, under three minutes for all of them.
const LOOKUP_TTL_DAYS = 1;
const CONCURRENCY = 16;
// Attestations are downloaded once each (they never change), gently: a
// refusal stops the downloads for this pass, the rest wait for the next.
const DETAILS_CONCURRENCY = 4;

/** PyPI names compare case- and separator-insensitively (PEP 503). */
export const pypiName = (n) => n.toLowerCase().replace(/[-_.]+/g, '-');

/** The bucket prefix holding every rebuilt version of one package, or null for an ecosystem OSS Rebuild does not cover. */
export function ossRebuildPrefix(ecosystem, name) {
  const eco = OSS_ECOSYSTEMS[ecosystem];
  if (!eco) return null;
  return `${eco}/${ecosystem === 'pip' ? pypiName(name) : name}/`;
}

/** The attestation of one rebuilt artifact (as parseOssListing reads the bucket), or null for an ecosystem OSS Rebuild does not cover. */
export function ossRebuildUrl(ecosystem, name, version, artifact) {
  const prefix = ossRebuildPrefix(ecosystem, name);
  return prefix ? `https://storage.googleapis.com/${OSS_REBUILD_BUCKET}/${prefix}${version}/${artifact}/rebuild.intoto.jsonl` : null;
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

/**
 * What a person wants from one OSS Rebuild attestation (rebuild.intoto.jsonl:
 * one DSSE envelope per line, each a base64 in-toto statement). The Rebuild
 * statement says what was built; ArtifactEquivalence whether the rebuilt file
 * equals the registry's byte for byte or only after Google's normalization
 * ("stabilized"). Null when the file holds no Rebuild statement.
 */
export function parseOssAttestation(text) {
  const statements = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try { statements.push(JSON.parse(Buffer.from(JSON.parse(line).payload, 'base64').toString('utf8'))); } catch { /* not an envelope */ }
  }
  const typeOf = (s) => s?.predicate?.buildDefinition?.buildType || '';
  const rebuild = statements.find(s => /\/Rebuild@/.test(typeOf(s)));
  if (!rebuild) return null;
  const { buildDefinition: def = {}, runDetails: run = {} } = rebuild.predicate;
  const out = {};
  const recipe = (run.byproducts || []).find(b => b.name === 'build.json');
  let build = null;
  if (recipe?.content) {
    try {
      const [kind, params] = Object.entries(JSON.parse(Buffer.from(recipe.content, 'base64').toString('utf8')))[0] || [];
      if (kind) build = { kind, params: params || {} };
    } catch { /* no recipe */ }
  }
  const git = (def.resolvedDependencies || []).find(d => d.name?.startsWith('git+'));
  const repo = build?.params.repo || git?.name.slice(4);
  const commit = build?.params.ref || (git && Object.values(git.digest || {})[0]);
  if (repo) out.repo = repo;
  if (commit) out.commit = commit;
  if (build) {
    out.recipe = build.kind;
    const tools = Object.entries(build.params).filter(([k, v]) => k.endsWith('_version') && v).map(([k, v]) => `${k.slice(0, -'_version'.length)} ${v}`);
    if (tools.length) out.tools = tools.join(', ');
    if (build.params.dir && build.params.dir !== '.') out.dir = build.params.dir;
  }
  const built = run.metadata?.finishedOn || run.metadata?.startedOn;
  if (built) out.built = String(built).slice(0, 10);
  const eq = statements.find(s => /\/ArtifactEquivalence@/.test(typeOf(s)));
  const digests = (eq?.predicate?.buildDefinition?.resolvedDependencies || []).map(d => d.digest?.sha256).filter(Boolean);
  if (digests.length === 2) out.exact = digests[0] === digests[1];
  return out;
}

/**
 * Downloads and decodes the attestations behind OSS Rebuild claims that have
 * no stored summary yet (oss_rebuild_details, keyed by URL). A 404 is skipped;
 * any other failure stops the downloads until the next pass.
 */
export async function importOssDetails(db, { fetchImpl = fetch, log = () => {} } = {}) {
  const stats = { downloaded: 0, stopped: false };
  const urls = db.prepare(`SELECT DISTINCT r.url FROM package_rebuilds r
    WHERE r.claimant = 'oss-rebuild' AND r.url IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM oss_rebuild_details d WHERE d.url = r.url)`).all().map(r => r.url);
  const save = db.prepare(`INSERT OR REPLACE INTO oss_rebuild_details (url, details, checked_at) VALUES (?, ?, CURRENT_TIMESTAMP)`);
  const worker = async () => {
    while (urls.length && !stats.stopped) {
      const url = urls.shift();
      let r;
      try { r = await fetchImpl(url, { signal: AbortSignal.timeout(30000) }); } catch (e) { stats.stopped = true; log(`OSS Rebuild attestation ${url}: ${e.message}`); break; }
      if (r.status === 404) continue;
      if (!r.ok) { stats.stopped = true; log(`OSS Rebuild attestation ${url}: HTTP ${r.status}, the rest next pass`); break; }
      const details = parseOssAttestation(await r.text());
      if (!details) continue;
      save.run(url, JSON.stringify(details));
      stats.downloaded++;
    }
  };
  await Promise.all(Array.from({ length: DETAILS_CONCURRENCY }, worker));
  return stats;
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

/**
 * The name of the .buildcompare a .buildspec belongs to. Reproducible Central
 * names it after the build's .buildinfo, which the buildspec gives in
 * `buildinfo=` and which is often not the buildspec's own name: the build of
 * guava-33.2.1-jre.buildspec is compared in guava-parent-33.2.1-jre.buildcompare.
 * Null when the line is missing or uses something other than the buildspec's
 * own values.
 */
export function rcCompareName(buildspec) {
  const spec = parseProperties(buildspec);
  let name = /([^\s\/"]+)\.buildinfo/.exec(spec.buildinfo || '')?.[1];
  for (let i = 0; i < 3 && name?.includes('${'); i++) name = name.replace(/\$\{(\w+)\}/g, (all, key) => spec[key] ?? all);
  return name && !name.includes('$') ? `${name}.buildcompare` : null;
}

/** Every claim in a checkout of reproducible-central, as a Map `name\0version` → claim. */
export function readReproducibleCentral(dir) {
  const out = new Map();
  const walk = (d) => {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    const files = new Set(entries.filter(e => !e.isDirectory()).map(e => e.name));
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.buildspec')) continue;
      const spec = fs.readFileSync(p, 'utf8');
      // else under the buildspec's own name, as before: a few buildspecs have no buildinfo line that can be read
      const cmp = [rcCompareName(spec), e.name.replace(/\.buildspec$/, '.buildcompare')].find(n => n && files.has(n));
      if (!cmp) continue;
      const url = `${RC_REPO}/blob/master/${path.relative(dir, p)}`;
      for (const c of rcClaims(spec, fs.readFileSync(path.join(d, cmp), 'utf8'), url)) {
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
 * LOOKUP_TTL_DAYS (rebuild_lookups), then each new claim's attestation once
 * (importOssDetails). Reproducible Central: the whole clone at
 * rcDir, when given. Claims are replaced per (package version, claimant), so a
 * claim withdrawn upstream disappears at the next lookup.
 */
/**
 * Our own dependency rebuilder (external/dep_rebuilder) publishes its results as
 * one file, rebuilds.json, on the website server. Each row that is a package
 * version some analysed release ships becomes a `ws` claim, replacing the one
 * we had. Rows for other versions are left out; a feed that cannot be read or is
 * not the expected shape changes nothing. Returns the number of claims written.
 *
 * The feed is everything the rebuilder stands by: a claim taken from an earlier
 * feed that is no longer in it is withdrawn. Only "reproduced" rows are taken:
 * that our build did not give the published file is no claim about the package
 * (the feed carried such rows as "failed" until 2026-11-20).
 * Claims of rebuild-npm-cli.mjs, which carry the file's hash and an event, stay.
 */
export async function importWsFeed(db, url, { fetchImpl = fetch, log = () => {} } = {}) {
  let feed;
  try {
    const r = await fetchImpl(url, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    feed = await r.json();
  } catch (e) { log(`rebuild feed ${url}: ${e.message}`); return { claims: 0, failed: true }; }
  if (feed?.schema !== 1 || feed.claimant !== 'ws' || !Array.isArray(feed.rows)) { log(`rebuild feed ${url}: unexpected shape`); return { claims: 0, failed: true }; }
  const ours = db.prepare(`SELECT 1 FROM packages WHERE ecosystem = ? AND name = ? AND version = ? LIMIT 1`);
  // a reproduced rebuild of rebuild-npm-cli.mjs says more (hash, event): the feed's row does not replace it
  const byHand = db.prepare(`SELECT 1 FROM package_rebuilds WHERE ecosystem = ? AND name = ? AND version = ? AND claimant = 'ws'
    AND result = 'reproduced' AND (sha256 IS NOT NULL OR event IS NOT NULL)`);
  const save = db.prepare(`INSERT OR REPLACE INTO package_rebuilds (ecosystem, name, version, claimant, result, commit_sha, note, checked_at)
    VALUES (?, ?, ?, 'ws', ?, ?, ?, ?)`);
  let claims = 0;
  db.transaction(() => {
    db.prepare(`DELETE FROM package_rebuilds WHERE claimant = 'ws' AND sha256 IS NULL AND event IS NULL`).run();
    for (const r of feed.rows) {
      if (!['npm', 'pip', 'cargo'].includes(r?.ecosystem) || typeof r.name !== 'string' || typeof r.version !== 'string') continue;
      if (r.result !== 'reproduced') continue; // a rebuild of ours that did not match says nothing about the package
      if (!ours.get(r.ecosystem, r.name, r.version)) continue;
      if (byHand.get(r.ecosystem, r.name, r.version)) continue;
      const day = /^\d{4}-\d\d-\d\d$/.test(r.date || '') ? `${r.date} 00:00:00` : new Date().toISOString().slice(0, 19).replace('T', ' ');
      save.run(r.ecosystem, r.name, r.version, r.result, /^[0-9a-f]{40}$/.test(r.commit || '') ? r.commit : null, typeof r.note === 'string' ? r.note.slice(0, 300) : null, day);
      claims++;
    }
  })();
  return { claims, failed: false };
}

export async function importRebuildClaims(db, { fetchImpl = fetch, rcDir = null, wsFeedUrl = null, all = false, log = () => {} } = {}) {
  const stats = { ossNames: 0, ossClaims: 0, ossDetails: 0, rcClaims: 0, wsClaims: 0, failed: 0 };
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
  stats.ossDetails = (await importOssDetails(db, { fetchImpl, log })).downloaded;

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
  if (wsFeedUrl) {
    const ws = await importWsFeed(db, wsFeedUrl, { fetchImpl, log });
    stats.wsClaims = ws.claims;
    if (ws.failed) stats.failed++;
  }
  return stats;
}
