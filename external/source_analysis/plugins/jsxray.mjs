// Test 7: js-x-ray warnings in JS/TS files; test files are skipped unless
// --include-test-files.
import { analyzeCodeVulnerabilitiesJSXRay } from '../appAnalysis.mjs';

export default {
  description: 'Test 7: js-x-ray',
  async container({ repoPath, options }) {
    await analyzeCodeVulnerabilitiesJSXRay(repoPath, { includeTestFiles: options.includeTestFiles });
  },
};
