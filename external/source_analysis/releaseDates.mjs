/**
 * The day each analysed release came out, for releases without a dated GitHub
 * release asset (assets.published_at): Bitcoin Core, Electrum, Trezor and
 * others tag releases but publish no files on GitHub. The date is that of the
 * commit the tag points at, from the forge's API (GitHub, GitLab), kept in the
 * release_dates table. A tag does not move, so each ref is asked once; a ref
 * the forge does not know is stored with no date, and a failed request is
 * asked again next pass. The export reads both (export.mjs, releasedAt) for
 * the /news/ page's release-age filter.
 */

const TIMEOUT_MS = 30_000;
const CONCURRENCY = 6;

// { host: 'github' | 'gitlab', path: 'owner/repo' } for a repository URL, or null.
export function forgeOf(repoUrl) {
  const m = /^https?:\/\/(?:www\.)?(github\.com|gitlab\.com)\/([^/]+\/[^/#?]+?)(?:\.git)?\/?$/i.exec(String(repoUrl || '').trim());
  if (!m) return null;
  return { host: m[1].toLowerCase() === 'github.com' ? 'github' : 'gitlab', path: m[2] };
}

// The analysed releases that have neither a dated asset nor a release_dates row, with their repository.
export function undatedReleases(db) {
  return db.prepare(`
    SELECT r.app_id AS appId, r.ref AS ref, (SELECT repository FROM apps a WHERE a.app_id = r.app_id ORDER BY platform LIMIT 1) AS repository
    FROM (SELECT app_id, ref FROM analyses WHERE kind = 'release' UNION SELECT app_id, version FROM app_dependencies) r
    WHERE NOT EXISTS (SELECT 1 FROM assets s WHERE s.app_id = r.app_id AND s.version = r.ref AND s.published_at IS NOT NULL)
      AND NOT EXISTS (SELECT 1 FROM release_dates d WHERE d.app_id = r.app_id AND d.ref = r.ref)
    ORDER BY r.app_id, r.ref`).all();
}

// "2026-10-08" for the commit `ref` names, null when the forge does not know
// it; throws on anything else (rate limit, network), so the ref is asked again.
export async function commitDay(forge, ref, { fetchImpl = globalThis.fetch, githubToken = null } = {}) {
  const url = forge.host === 'github'
    ? `https://api.github.com/repos/${forge.path}/commits/${encodeURIComponent(ref)}`
    : `https://gitlab.com/api/v4/projects/${encodeURIComponent(forge.path)}/repository/commits/${encodeURIComponent(ref)}`;
  const headers = { Accept: 'application/json', ...(forge.host === 'github' && githubToken ? { Authorization: `token ${githubToken}` } : {}) };
  const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (response.status === 404 || response.status === 422) return null;
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const body = await response.json();
  const date = forge.host === 'github' ? (body?.commit?.committer?.date || body?.commit?.author?.date) : (body?.committed_date || body?.created_at);
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : null;
}

// Looks up every undated release; returns { looked, dated, failed }.
export async function fillReleaseDates(db, { fetchImpl = globalThis.fetch, githubToken = null, log = console } = {}) {
  const todo = undatedReleases(db).map(r => ({ ...r, forge: forgeOf(r.repository) })).filter(r => r.forge);
  const save = db.prepare('INSERT OR REPLACE INTO release_dates (app_id, ref, released_at) VALUES (?, ?, ?)');
  const result = { looked: todo.length, dated: 0, failed: 0 };
  let next = 0;
  const worker = async () => {
    while (next < todo.length) {
      const r = todo[next++];
      try {
        const day = await commitDay(r.forge, r.ref, { fetchImpl, githubToken });
        save.run(r.appId, r.ref, day);
        if (day) result.dated++;
      } catch (error) {
        result.failed++;
        if (result.failed <= 3) log.warn(`release date of ${r.appId} ${r.ref}: ${error.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, worker));
  return result;
}
