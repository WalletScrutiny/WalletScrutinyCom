// The old test 4: npm audit / yarn audit. Replaced by the osv plugin, which
// covers gradle, pip and cargo too.
import { scanVulnerabilities } from '../appAnalysis.mjs';

export default {
  description: 'Old test 4: npm/yarn audit',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await scanVulnerabilities(repoPath, appType);
  },
};
