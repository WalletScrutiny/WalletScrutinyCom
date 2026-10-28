// New advisories for releases that do not change.
//
// A release is analysed once (hasReleaseAnalysis), and OSV.dev is only asked
// inside an analysis, so a wallet that stops releasing kept the advisories of
// the day it was analysed. Every pass looks the stored dependencies of each
// release up again (Leo, 2026-10-26: a product without code changes still
// gets new vulnerabilities in its dependencies). Nothing is cloned and
// nothing runs: one batched OSV.dev query per release.
import { getDependencies, getVulnerabilities, saveVulnerabilities, dependantsOfRow } from './ddbbUtils.mjs';
import { checkVulnerabilities } from './plugins/osv.mjs';
import { recordMalwareAlerts, deliverAlerts } from './alerts.mjs';

const boolOf = (v) => (v === null || v === undefined ? null : v === 1 || v === true);

// A stored dependency row back in the shape plugins/pinning.mjs makeEntry produces.
export function entryOfRow(r) {
  return {
    ecosystem: r.ecosystem, name: r.name, version: r.dep_version, resolved: r.resolved, integrity: r.integrity,
    lockfile: r.lockfile, direct: boolOf(r.direct), dev: boolOf(r.dev), scope: r.scope ?? null,
    dependants: dependantsOfRow(r.dependants), tier: r.tier,
  };
}

/**
 * Look up the stored releases of the given apps again. Releases analysed since
 * `since` (an SQLite CURRENT_TIMESTAMP string, the start of the pass) were
 * just looked up and are left alone. A failed lookup keeps the stored rows.
 * Returns { releases, failed, added, changed } where added counts advisories
 * that were not stored before and changed lists the apps whose stored
 * advisories differ afterwards in any way (new, withdrawn, or edited: a new
 * severity, fix version or summary), the ones whose files are out of date.
 */
export async function recheckStoredReleases(db, appIds, { since = null, check = checkVulnerabilities, deliver = deliverAlerts } = {}) {
  const versionsOf = db.prepare(`
    SELECT DISTINCT d.version FROM app_dependencies d
    WHERE d.app_id = ? AND NOT EXISTS (
      SELECT 1 FROM analyses a WHERE a.app_id = d.app_id AND a.kind = 'release' AND a.ref = d.version AND ? IS NOT NULL AND a.analysed_at >= ?)
    ORDER BY d.version`);
  const updateCount = db.prepare(`UPDATE analyses SET vulnerabilities = ?, osv_checked = ? WHERE app_id = ? AND kind = 'release' AND ref = ?`);
  let releases = 0, failed = 0, added = 0;
  const changed = new Set();
  for (const appId of appIds) {
    for (const { version } of versionsOf.all(appId, since, since)) {
      const entries = getDependencies(db, appId, version).map(entryOfRow);
      const result = await check([{ entries }]);
      if (!result) {
        console.log(`  ${appId} ${version}: OSV.dev lookup failed, keeping the stored advisories`);
        failed++;
        continue;
      }
      const stored = getVulnerabilities(db, appId, version);
      const before = new Set(stored.map(v => `${v.ecosystem}\u0000${v.name}\u0000${v.dep_version}\u0000${v.vuln_id}`));
      const fresh = result.findings.filter(f => !before.has(`${f.ecosystem}\u0000${f.name}\u0000${f.version}\u0000${f.id}`));
      saveVulnerabilities(db, appId, version, result);
      updateCount.run(result.findings.length, result.checked, appId, version);
      if (JSON.stringify(getVulnerabilities(db, appId, version)) !== JSON.stringify(stored)) changed.add(appId);
      recordMalwareAlerts(db, appId, version, result.findings);
      if (fresh.length) console.log(`  ${appId} ${version}: ${fresh.length} new advisories (${fresh.map(f => f.id).join(', ')})`);
      releases++;
      added += fresh.length;
    }
  }
  if (releases) await deliver(db);
  return { releases, failed, added, changed: [...changed] };
}
