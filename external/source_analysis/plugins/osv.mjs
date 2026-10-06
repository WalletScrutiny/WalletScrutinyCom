// Test 4: known vulnerabilities of every dependency pinning resolved to an
// exact registry version, from OSV.dev, looked up from the host. A failed
// lookup fails the analysis, so an unchanged default branch is retried next
// pass instead of being skipped without a vulnerability result. Stored per
// release (app_vulnerabilities).
import { checkVulnerabilities } from '../osvCheck.mjs';

export default {
  description: 'Test 4: known vulnerabilities (OSV.dev)',
  requires: ['pinning'],
  async host({ name, version, db, results }) {
    const vulnerabilities = await checkVulnerabilities(results.pinning || []);
    if (!vulnerabilities) throw new Error('the OSV.dev lookup failed');
    if (db && version) {
      const { saveVulnerabilities } = await import('../ddbbUtils.mjs');
      const stored = saveVulnerabilities(db, name, version, vulnerabilities);
      console.log(`Stored ${stored} vulnerability rows for ${name} ${version}`);
    }
    return vulnerabilities;
  },
};
