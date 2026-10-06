// Test 11: build inputs fetched outside the package manager (curl/wget,
// Dockerfile FROM, cmake downloads, git clones in scripts and CI).
import { analyzeOobDownloads } from '../oobDownloadAnalysis.mjs';

export default {
  description: 'Test 11: out-of-band downloads',
  container({ repoPath }) {
    analyzeOobDownloads(repoPath);
  },
};
