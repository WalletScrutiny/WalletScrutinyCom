// Test 3: dependencies declared without a fixed version (^, ~, *, latest, ranges).
import { listDependenciesWithoutFixedVersions } from '../appAnalysis.mjs';

export default {
  description: 'Test 3: dependencies without a fixed version',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await listDependenciesWithoutFixedVersions(repoPath, appType);
  },
};
