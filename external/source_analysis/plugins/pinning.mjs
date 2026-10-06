// Test 10: supply-chain pinning of every dependency in the lock and manifest
// files. Its result (the pinning analyses, one per ecosystem) is what
// gradle-resolution completes and osv checks; for a release, the host stores
// the resolved rows (packages, app_dependencies).
import { analyzePinning } from '../pinningAnalysis.mjs';

export default {
  description: 'Test 10: supply-chain pinning',
  container({ repoPath }) {
    return analyzePinning(repoPath);
  },
  async host({ name, version, db, results }) {
    if (!db || !version) return;
    const { saveDependencies } = await import('../ddbbUtils.mjs');
    const stored = saveDependencies(db, name, version, results.pinning);
    console.log(`Stored ${stored} dependency rows for ${name} ${version}`);
  },
};
