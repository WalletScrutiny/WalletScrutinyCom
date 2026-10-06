// Test 2: number of direct dependencies.
import { countDirectDependencies } from '../appAnalysis.mjs';

export default {
  description: 'Test 2: number of direct dependencies',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await countDirectDependencies(repoPath, appType);
  },
};
