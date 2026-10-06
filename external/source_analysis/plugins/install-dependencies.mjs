// Installs the repository's dependencies (npm/yarn install, pip install -r
// requirements.txt; gradle and maven fetch theirs when tests 1-5 run them).
// Tests 1-3 and 5 need it. A failed install is logged and does not fail the
// analysis.
import { installDependencies } from '../appAnalysis.mjs';

export default {
  description: 'Install the dependencies (npm/yarn, pip)',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await installDependencies(repoPath, appType);
  },
};
