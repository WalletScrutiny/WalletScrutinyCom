// Test 1: the full dependency tree, printed as a list.
import { showDependencyTree } from '../appAnalysis.mjs';

export default {
  description: 'Test 1: full dependency tree',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await showDependencyTree(repoPath, appType);
  },
};
