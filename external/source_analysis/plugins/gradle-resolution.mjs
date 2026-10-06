// Test 10b: runs the project's own gradle wrapper to resolve the full
// dependency graph and completes the gradle rows of pinning's result in place.
import { resolveGradleDependencies } from '../gradleResolution.mjs';

export default {
  description: 'Test 10b: resolved gradle dependency graph',
  requires: ['pinning'],
  async container({ repoPath, results }) {
    await resolveGradleDependencies(repoPath, results.pinning);
  },
};
