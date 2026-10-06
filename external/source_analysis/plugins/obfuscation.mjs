// Test 8: obfuscated JS/TS files (obfuscation-detector).
import { analyzeObfuscation } from '../appAnalysis.mjs';

export default {
  description: 'Test 8: obfuscated JS/TS files',
  async container({ repoPath }) {
    await analyzeObfuscation(repoPath);
  },
};
