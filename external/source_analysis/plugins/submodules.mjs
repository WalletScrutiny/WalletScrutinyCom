// Libraries a release pins as git submodules, each as three separate claims
// (submoduleIdentity.mjs): the product's RB covers them, whether the pinned
// tree is upstream code, and which advisories apply. Host only: git and OSV
// over the network, recursively from the release commit; of the checkout only
// the presence of .gitmodules is looked at, and nothing from the repositories runs.
import fs from 'fs';
import path from 'path';
import { CACHE_DIR } from '../config.mjs';
import { checkSubmodules, githubUpstream } from '../submoduleIdentity.mjs';
import { loadSecret } from '../utils.mjs';

export default {
  description: 'git submodules: upstream identity, build scope and advisories',
  async host({ name, version, db, repoUrl, commit, repoPath }) {
    if (!repoUrl || !commit) return { submodules: null, skipped: 'no repository or commit' };
    if (repoPath && !fs.existsSync(path.join(repoPath, '.gitmodules'))) return { submodules: 0 };
    const token = loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE' });
    const rows = await checkSubmodules(repoUrl, commit, {
      cacheDir: path.join(CACHE_DIR, 'submodules'),
      upstreamOf: (u) => githubUpstream(u, { token }),
      log: (m) => console.log(`submodule ${m}`),
    });
    if (db && rows.length) {
      const { saveSubmodules } = await import('../ddbbUtils.mjs');
      saveSubmodules(db, name, version || commit, commit, rows);
    }
    // A submodule that could not be checked keeps its error in its row; the
    // others still stand, so it does not fail the analysis.
    return { submodules: rows.length, errors: rows.filter(r => r.error).length };
  },
};
