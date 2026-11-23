// Candidates: every exact package version in the dependency lists WalletScrutiny
// publishes (source_analysis export, apps/<app>/<ref>/dependencies.json),
// counted by distinct wallets. The export is read from a URL or a directory.
import fs from 'fs';
import path from 'path';

export const EXPORT_BASE = process.env.DEP_REBUILDER_EXPORT || 'https://walletscrutiny.com/api/source-analysis';
const CONCURRENCY = 8;

// same rule as source_analysis/export.mjs safeName
export const safeName = (s) => String(s).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '_') || '_';

async function getJson(base, rel, fetchImpl) {
  if (/^https?:\/\//.test(base)) {
    const r = await fetchImpl(`${base.replace(/\/$/, '')}/${rel}`, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`${rel}: HTTP ${r.status}`);
    return r.json();
  }
  return JSON.parse(fs.readFileSync(path.join(base, rel), 'utf8'));
}

async function pool(items, fn, n = CONCURRENCY) {
  const queue = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (queue.length) await fn(queue.shift()); }));
}

/**
 * Rows { ecosystem, name, version, wallets, wallets_any, walletIds } for exact versions,
 * walletIds being the app ids `wallets` counts, sorted.
 * `releases`: 'latest' (one release per wallet) or 'all'. A wallet counts once
 * per package version however many of its releases or build files list it.
 */
export async function collectCandidates({ base = EXPORT_BASE, releases = 'all', ecosystems = ['npm'], fetchImpl = fetch, log = () => {} } = {}) {
  const index = await getJson(base, 'index.json', fetchImpl);
  const seen = new Map(); // eco\0name\0version -> { app: Set, any: Set }
  const add = (d, appId) => {
    if (!ecosystems.includes(d.ecosystem) || !d.version || !/^\d/.test(d.version)) return;
    const k = `${d.ecosystem}\0${d.name}\0${d.version}`;
    if (!seen.has(k)) seen.set(k, { app: new Set(), any: new Set() });
    const e = seen.get(k);
    e.any.add(appId);
    if (d.scope === 'app') e.app.add(appId);
  };
  await pool(index.apps, async ({ appId }) => {
    try {
      const doc = await getJson(base, `apps/${safeName(appId)}.json`, fetchImpl);
      const rels = (doc.releases || []).filter(r => r.status === 'ok');
      const take = releases === 'latest' ? rels.slice(0, 1) : rels;
      for (const rel of take) {
        const deps = await getJson(base, `apps/${safeName(appId)}/${safeName(rel.ref)}/dependencies.json`, fetchImpl);
        for (const d of deps.dependencies || []) add(d, appId);
      }
    } catch (e) { log(`${appId}: ${e.message}`); }
  });
  return [...seen].map(([k, v]) => {
    const [ecosystem, name, version] = k.split('\0');
    return { ecosystem, name, version, wallets: v.app.size, wallets_any: v.any.size, walletIds: [...v.app].sort() };
  });
}
