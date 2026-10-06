// Test 9: Semgrep CE (--config=auto) in its own container (SEMGREP_IMAGE),
// started by the host on the checkout the analysis container left behind.
import { analyzeCodeVulnerabilitiesSemgrep } from '../appAnalysis.mjs';

export default {
  description: 'Test 9: Semgrep',
  needsKnownAppType: true,
  async host({ repoPath }) {
    await analyzeCodeVulnerabilitiesSemgrep(repoPath);
  },
};
