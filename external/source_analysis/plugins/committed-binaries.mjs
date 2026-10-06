// Test 12: compiled artifacts checked into the tree.
import { analyzeCommittedBinaries } from '../committedBinaryAnalysis.mjs';

export default {
  description: 'Test 12: committed binaries',
  container({ repoPath }) {
    analyzeCommittedBinaries(repoPath);
  },
};
