// Test 5: packages without a release in YEARS_FOR_OUTDATED_CHECK years, and
// packages under MIN_DOWNLOADS_THRESHOLD monthly downloads.
import { analyzeDependencies } from '../appAnalysis.mjs';

export default {
  description: 'Test 5: outdated and little-used dependencies',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await analyzeDependencies(repoPath, appType);
  },
};
