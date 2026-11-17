// Upstream triage: the "this advisory does not affect us, because…" files a
// project keeps for its own scanner, read at the exact tag or commit a wallet
// ships. AirGap's .trivyignore.yaml was the first (docs/dependency-check.md,
// "Triage"); the same kind of file in a direct user's repository says how
// that library judged an advisory on one of its own dependencies.
//
// None of these files is a standard: each scanner has its own format, and a
// plain .trivyignore lists ids without a reason. So this only harvests: per
// file, the advisory ids it names, the line, and the reason written next to
// it when there is one. What a harvested entry means for a wallet row is
// decided elsewhere; here it is a hint with a link to the line.
//
// Files are fetched raw from GitHub and GitLab (no API, no token); other
// hosts are skipped and counted.

import { dependantsOfRow } from './ddbbUtils.mjs';

// Where each scanner keeps its ignore list or VEX document, at the
// repository root. `keys` marks general files that only count when they carry
// an ignore list (package.json, .yarnrc.yml).
export const TRIAGE_FILES = [
  { path: '.trivyignore', tool: 'trivy' },
  { path: '.trivyignore.yaml', tool: 'trivy' },
  { path: 'osv-scanner.toml', tool: 'osv-scanner' },
  { path: '.snyk', tool: 'snyk' },
  { path: '.grype.yaml', tool: 'grype' },
  { path: 'deny.toml', tool: 'cargo-deny' },
  { path: 'audit.toml', tool: 'cargo-audit' },
  { path: '.cargo/audit.toml', tool: 'cargo-audit' },
  { path: '.nsprc', tool: 'better-npm-audit' },
  { path: 'audit-ci.json', tool: 'audit-ci' },
  { path: 'audit-ci.jsonc', tool: 'audit-ci' },
  { path: '.yarnrc.yml', tool: 'yarn', keys: /npmAuditIgnoreAdvisories/ },
  { path: 'package.json', tool: 'pnpm', keys: /"auditConfig"/ },
  { path: 'vex.json', tool: 'vex' },
  { path: '.vex.json', tool: 'vex' },
  { path: 'openvex.json', tool: 'vex' },
  { path: '.openvex.json', tool: 'vex' },
];

export const ADVISORY_RE = /\b(GHSA(?:-[0-9a-z]{4}){3}|CVE-\d{4}-\d{4,}|RUSTSEC-\d{4}-\d{4}|PYSEC-\d{4}-\d+|GO-\d{4}-\d{4,}|SNYK-[A-Z0-9]+(?:-[A-Z0-9.]+)+|MAL-\d{4}-\d+)\b/gi;

const REASON_RE = /^\s*-?\s*["']?(statement|reason|notes?|comment|description|justification)["']?\s*[:=]\s*(.+)$/i;
const COMMENT_RE = /^\s*(#|\/\/)\s?(.*)$/;

// A YAML block scalar (`statement: >-`) continues on the lines indented deeper than its key.
const BLOCK_SCALAR_RE = /^[>|][-+]?\s*$/;
const indentOf = (line) => line.match(/^\s*/)[0].length;
function blockScalar(lines, j) {
  const base = indentOf(lines[j]);
  const parts = [];
  for (let k = j + 1; k < lines.length && (!lines[k].trim() || indentOf(lines[k]) > base); k++) parts.push(lines[k].trim());
  return parts.join(' ').replace(/\s+/g, ' ').trim() || null;
}
// The line ranges inside block scalars: an id written in a reason is prose, not an ignore.
function blockScalarLines(lines) {
  const inside = new Set();
  lines.forEach((line, j) => {
    const m = line.match(/:\s*([>|][-+]?)\s*$/);
    if (!m) return;
    const base = indentOf(line);
    for (let k = j + 1; k < lines.length && (!lines[k].trim() || indentOf(lines[k]) > base); k++) inside.add(k);
  });
  return inside;
}

const clean = (s) => s.replace(/^["'\s]+|["',\s]+$/g, '').trim();

// The reason written next to the id on line `i`: a `reason = "…"` on the
// line itself (an inline table), a `reason = …`-style field within the few
// lines that follow (the entry's own block), else the comment
// lines right above it, else a comment at the end of the line itself.
export function reasonNear(lines, i) {
  const inline = lines[i].match(/\b(?:statement|reason|notes?|comment|justification)["']?\s*[:=]\s*["']([^"']+)["']/i);
  if (inline) return inline[1].trim();
  for (let j = i; j < Math.min(lines.length, i + 7); j++) {
    if (j > i && ADVISORY_RE.test(lines[j])) { ADVISORY_RE.lastIndex = 0; break; } // the next entry starts
    ADVISORY_RE.lastIndex = 0;
    const m = lines[j].match(REASON_RE);
    if (m && BLOCK_SCALAR_RE.test(m[2])) {
      const text = blockScalar(lines, j);
      if (text) return text;
    } else if (m && clean(m[2])) return clean(m[2]);
  }
  const above = [];
  for (let j = i - 1; j >= 0 && above.length < 6; j--) {
    const m = lines[j].match(COMMENT_RE);
    if (!m) break;
    above.unshift(m[2].trim());
  }
  const text = above.filter(Boolean).join(' ');
  if (text && !/^[-=#*\s]*$/.test(text)) return text;
  const trailing = lines[i].match(/\s(#|\/\/)\s*(.+)$/);
  return trailing ? trailing[2].trim() : null;
}

/**
 * The advisory entries in one file's text: `[{ id, line, reason }]`, one per
 * id and line (1-based). `file` is a TRIAGE_FILES entry; a general file
 * without its ignore key yields nothing.
 */
export function parseTriageFile(file, text) {
  if (typeof text !== 'string' || !text) return [];
  if (file.keys && !file.keys.test(text)) return [];
  let lines = text.split(/\r?\n/);
  let offset = 0;
  if (file.path === 'package.json') {
    // only the pnpm audit configuration, not every CVE named in a script or description
    const start = lines.findIndex(l => l.includes('"auditConfig"'));
    let depth = 0;
    let end = start;
    for (; end < lines.length; end++) {
      depth += (lines[end].match(/[{[]/g) || []).length - (lines[end].match(/[}\]]/g) || []).length;
      if (end > start && depth <= 0) break;
    }
    offset = start;
    lines = lines.slice(start, end + 1);
  }
  const out = [];
  const seen = new Set();
  const prose = blockScalarLines(lines);
  lines.forEach((line, i) => {
    if (prose.has(i)) return;
    if (COMMENT_RE.test(line)) return; // a comment explains, or is a commented-out id; neither is an ignore
    for (const m of line.matchAll(ADVISORY_RE)) {
      const id = /^ghsa/i.test(m[1]) ? `GHSA${m[1].slice(4).toLowerCase()}` : m[1].toUpperCase();
      const key = `${id}\0${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ id, line: offset + i + 1, reason: reasonNear(lines, i) });
    }
  });
  return out;
}

/**
 * The raw URL of `path` at `ref` in a repository, or null for a host this
 * does not read. `repoUrl` is normalised (https://github.com/owner/repo).
 */
export function rawUrl(repoUrl, ref, path) {
  const m = String(repoUrl || '').match(/^https:\/\/(github\.com|gitlab\.com)\/(.+?)(?:\.git)?\/?$/);
  if (!m || !ref) return null;
  const r = encodeURI(ref).replace(/#/g, '%23');
  if (m[1] === 'github.com') return `https://raw.githubusercontent.com/${m[2]}/${r}/${path}`;
  return `https://gitlab.com/${m[2]}/-/raw/${r}/${path}`;
}

// The human link to a line, for a statement's evidence.
export function blobUrl(repoUrl, ref, path, line) {
  const m = String(repoUrl || '').match(/^https:\/\/(github\.com|gitlab\.com)\/(.+?)(?:\.git)?\/?$/);
  if (!m) return null;
  const r = encodeURI(ref).replace(/#/g, '%23');
  return m[1] === 'github.com' ? `https://github.com/${m[2]}/blob/${r}/${path}#L${line}` : `https://gitlab.com/${m[2]}/-/blob/${r}/${path}#L${line}`;
}

/**
 * Every triage file of one repository at one ref: `{ status, files: [{ path,
 * tool, entries }] }`. status is `ok`, `unsupported-host`, or `error` (a
 * fetch failed other than with 404, so absence is not established).
 */
export async function harvestRepo(repoUrl, ref, { fetchImpl = fetch, files = TRIAGE_FILES, timeoutMs = 20_000, sleep = (ms) => new Promise(r => setTimeout(r, ms)) } = {}) {
  if (!rawUrl(repoUrl, ref, 'x')) return { status: 'unsupported-host', files: [] };
  const found = [];
  let failed = null;
  for (const file of files) {
    const url = rawUrl(repoUrl, ref, file.path);
    let res;
    try {
      // the raw host rate-limits a long run: wait as told and try again
      for (let attempt = 0; ; attempt++) {
        res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), redirect: 'follow' });
        if (res.status !== 429 || attempt >= 4) break;
        const after = Number(res.headers?.get?.('retry-after'));
        await sleep((Number.isFinite(after) && after > 0 ? after : 30 * (attempt + 1)) * 1000);
      }
    } catch (e) {
      failed = e.message;
      continue;
    }
    if (res.status === 404) continue;
    if (!res.ok) {
      failed = `HTTP ${res.status} for ${file.path}`;
      continue;
    }
    const text = await res.text();
    const entries = parseTriageFile(file, text);
    if (entries.length || !file.keys) found.push({ path: file.path, tool: file.tool, entries });
  }
  return { status: failed && !found.length ? 'error' : 'ok', error: failed, files: found };
}

const GITHUB_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/;

/**
 * The same as harvestRepo for many GitHub refs at once, through the GraphQL
 * API: one query reads every triage file of `batch` refs (raw.githubusercontent
 * rate-limits a long run into minutes of 429s). `token` is a GitHub token.
 * Returns a Map from `repo\0ref` to harvestRepo's result.
 */
export async function harvestGithub(targets, { token, fetchImpl = fetch, files = TRIAGE_FILES, batch = 5, sleep = (ms) => new Promise(r => setTimeout(r, ms)) } = {}) {
  const results = new Map();
  for (let i = 0; i < targets.length; i += batch) {
    const chunk = targets.slice(i, i + batch);
    const parts = chunk.map((t, n) => {
      const [, owner, name] = t.repo.match(GITHUB_RE);
      const objects = files.map((f, k) => `f${k}: object(expression: ${JSON.stringify(`${t.ref}:${f.path}`)}) { ... on Blob { text } }`).join(' ');
      return `r${n}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${objects} }`;
    });
    let body = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await fetchImpl('https://api.github.com/graphql', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `query { ${parts.join(' ')} }` }),
          signal: AbortSignal.timeout(60_000),
        });
        if (res.status === 403 || res.status === 429 || res.status >= 500) {
          const after = Number(res.headers?.get?.('retry-after'));
          await sleep((Number.isFinite(after) && after > 0 ? after : 30 * (attempt + 1)) * 1000);
          continue;
        }
        body = await res.json();
        break;
      } catch (e) {
        body = { transportError: e.message };
      }
    }
    chunk.forEach((t, n) => {
      const repo = body?.data?.[`r${n}`];
      // a repository that is gone or renamed answers null with a NOT_FOUND error: nothing to read, not a failure
      const missing = repo === null && (body?.errors || []).some(e => e.path?.[0] === `r${n}` && e.type === 'NOT_FOUND');
      if (!repo && !missing) {
        results.set(`${t.repo}\0${t.ref}`, { status: 'error', error: body?.transportError || body?.errors?.[0]?.message || body?.message || 'no answer', files: [] });
        return;
      }
      const found = [];
      files.forEach((f, k) => {
        const text = repo?.[`f${k}`]?.text;
        if (typeof text !== 'string') return;
        const entries = parseTriageFile(f, text);
        if (entries.length || !f.keys) found.push({ path: f.path, tool: f.tool, entries });
      });
      results.set(`${t.repo}\0${t.ref}`, { status: 'ok', error: missing ? 'repository not found' : null, files: found });
    });
  }
  return results;
}

export const isGithub = (repoUrl) => GITHUB_RE.test(String(repoUrl || ''));

/**
 * The hints per wallet, for the panel: `{ appId: { advisoryId: [entry] } }`
 * where an entry is `{ kind, repo, ref, file, line, url, reason, package }`.
 * `own` comes from the wallet's own repository at an analysed tag; `upstream`
 * from a direct user the wallet ships, at the shipped version: one of the
 * row's `dependants` when the analyser recorded them, else any of the
 * wallet's direct users (gradle and older rows have no graph).
 */
export function hintsByApp(db) {
  const entries = db.prepare('SELECT repo_url, ref, file, tool, line, vuln_id, reason FROM upstream_triage').all();
  const byRef = new Map();
  for (const e of entries) {
    const k = `${e.repo_url}\0${e.ref}`;
    if (!byRef.has(k)) byRef.set(k, []);
    byRef.get(k).push(e);
  }
  const ownRefs = new Map();
  for (const r of db.prepare(`SELECT a.app_id, a.ref, ap.repository FROM analyses a JOIN apps ap ON ap.app_id = a.app_id WHERE a.kind = 'release' AND a.status = 'ok'`).all()) {
    const k = `${r.repository.replace(/\.git$/, '')}\0${r.ref}`;
    if (!byRef.has(k)) continue;
    if (!ownRefs.has(r.app_id)) ownRefs.set(r.app_id, new Set());
    ownRefs.get(r.app_id).add(k);
  }
  const repoOf = db.prepare('SELECT repo_url FROM package_sources WHERE ecosystem = ? AND name = ? AND repo_url IS NOT NULL');
  const refOf = db.prepare('SELECT COALESCE(tag, commit_sha) AS ref FROM package_identity WHERE ecosystem = ? AND name = ? AND version = ?');
  // per (app, release): package name -> [ref keys with entries], for its direct users and dependants
  const shipped = new Map();
  for (const r of db.prepare(`SELECT d.app_id, d.version AS app_version, p.ecosystem, p.name, p.version FROM app_dependencies d JOIN packages p ON p.id = d.package_id`).all()) {
    const repo = repoOf.get(r.ecosystem, r.name)?.repo_url;
    const ref = repo && refOf.get(r.ecosystem, r.name, r.version)?.ref;
    const k = ref && `${repo}\0${ref}`;
    if (!k || !byRef.has(k)) continue;
    const rel = `${r.app_id}\0${r.app_version}`;
    if (!shipped.has(rel)) shipped.set(rel, new Map());
    shipped.get(rel).set(`${r.ecosystem}:${r.name}`, { key: k, pkg: `${r.ecosystem}:${r.name}@${r.version}`, direct: true });
  }
  const directOf = new Set(db.prepare('SELECT DISTINCT d.app_id, d.version, p.ecosystem, p.name FROM app_dependencies d JOIN packages p ON p.id = d.package_id WHERE d.direct = 1').all().map(r => `${r.app_id}\0${r.version}\0${r.ecosystem}:${r.name}`));
  const out = {};
  const add = (appId, id, entry) => {
    out[appId] ||= {};
    out[appId][id] ||= [];
    if (!out[appId][id].some(e => e.url === entry.url)) out[appId][id].push(entry);
  };
  const toEntry = (e, kind, pkg = null) => ({ kind, repo: e.repo_url, ref: e.ref, file: e.file, line: e.line, url: blobUrl(e.repo_url, e.ref, e.file, e.line), reason: e.reason, package: pkg });
  const vulns = db.prepare(`SELECT v.app_id, v.version, v.ecosystem, v.vuln_id, v.aliases, v.dependants FROM app_vulnerabilities v
    JOIN analyses a ON a.app_id = v.app_id AND a.ref = v.version AND a.kind = 'release' AND a.status = 'ok'`).all();
  for (const v of vulns) {
    const ids = new Set([v.vuln_id, ...String(v.aliases || '').split(/[,\s]+/).filter(Boolean)]);
    for (const k of ownRefs.get(v.app_id) || []) for (const e of byRef.get(k)) if (ids.has(e.vuln_id)) add(v.app_id, v.vuln_id, toEntry(e, 'own'));
    const rel = shipped.get(`${v.app_id}\0${v.version}`);
    if (!rel) continue;
    const dependants = dependantsOfRow(v.dependants);
    const eco = v.ecosystem === 'crates.io' ? 'cargo' : v.ecosystem;
    const candidates = dependants?.length
      ? dependants.map(d => rel.get(`${eco}:${d}`)).filter(Boolean)
      : [...rel.entries()].filter(([name]) => directOf.has(`${v.app_id}\0${v.version}\0${name}`)).map(([, x]) => x);
    for (const c of candidates) for (const e of byRef.get(c.key)) if (ids.has(e.vuln_id)) add(v.app_id, v.vuln_id, toEntry(e, 'upstream', c.pkg));
  }
  return out;
}

