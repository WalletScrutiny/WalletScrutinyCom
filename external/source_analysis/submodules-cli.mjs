#!/usr/bin/env node
// The three claims (submoduleIdentity.mjs) for every git submodule a wallet
// pins at one commit, recursively.
// Usage: node submodules-cli.mjs --repo <url> --ref <tag|commit> [--app <appId> --version <v>] [--json]
//   --app/--version  look up claim 1 (the product's build verification, kind 30301)
// GITHUB_TOKEN_FILE raises GitHub's rate limit for the fork lookups.
import minimist from 'minimist';
import path from 'node:path';
import { CACHE_DIR } from './config.mjs';
import { loadSecret } from './utils.mjs';
import { lsRemoteTags, matchTag } from './sourceIdentity.mjs';
import { checkSubmodules, githubUpstream } from './submoduleIdentity.mjs';
import { queryRelays, reproducibleVersions, VERIFICATION_KIND, VERIFICATION_RELAYS } from './reproducible.mjs';

const HINT_TEXT = {
  'fix-in-history': 'fix commit in its history',
  'fix-patch-present': 'fix patch already in the tree',
  'fix-patch-absent': 'fix patch applies, so likely missing',
  'cant-tell': "can't tell",
};

const SCOPE_TEXT = {
  'not-built': 'not in the app',
  'test-only': 'tests only, not in the app',
};

async function resolveRef(repo, ref) {
  if (/^[0-9a-f]{40}$/.test(ref)) return { commit: ref, tag: null };
  const tags = await lsRemoteTags(repo);
  const tag = tags.has(ref) ? ref : matchTag(tags, '', ref);
  if (!tag) throw new Error(`${repo} has no tag ${ref}`);
  return { commit: tags.get(tag), tag };
}

async function rbClaim(appId, version) {
  const events = await queryRelays(VERIFICATION_RELAYS, { kinds: [VERIFICATION_KIND], '#i': [appId] });
  const hit = (reproducibleVersions(events).get(appId) || []).find(v => v.version === version);
  return hit ? { status: 'reproducible', verifiedAt: hit.verifiedAt, platform: hit.platform } : { status: 'not-verified' };
}

function render({ repo, ref, commit, rb, rows }) {
  const out = [`${repo} ${ref} (${commit.slice(0, 10)})`];
  if (rb) out.push(`claim 1, RB: ${rb.status === 'reproducible' ? `reproducible (verified ${new Date(rb.verifiedAt * 1000).toISOString().slice(0, 10)}${rb.platform ? `, ${rb.platform}` : ''}); covers every submodule built into it` : 'no reproducible verification for this version'}`);
  for (const r of rows) {
    const pad = '  '.repeat(r.depth + 1);
    out.push('', `${pad}${r.path} @ ${r.commit.slice(0, 10)}  ${r.url}${r.upstream ? `  (fork of ${r.upstream})` : ''}`);
    if (r.scope && r.scope.status !== 'assumed') out.push(`${pad}  scope: ${SCOPE_TEXT[r.scope.status]}: ${r.scope.why}${r.scope.via ? ` (via ${r.scope.via})` : ''}`);
    if (r.error) { out.push(`${pad}  error: ${r.error}`); continue; }
    const id = r.identity;
    const idText = r.firstParty ? `first-party: the wallet's own repository${id.base ? `, ${id.ahead ?? '?'} commit(s) after ${id.base}` : ''}` : {
      'upstream-tag': `upstream release ${id.tag}${id.viaTree ? ' (same tree, different history)' : ''}, unmodified`,
      'upstream-commit': `upstream commit${id.base ? `, ${id.ahead} after ${id.base}` : ''}, unmodified`,
      derived: `derived from ${id.base}: ${id.ahead} commit(s) upstream does not have${id.files ? `, ${id.files.length} file(s) changed` : ''}`,
      'unknown-origin': 'no upstream release in its history',
    }[id.status];
    out.push(`${pad}  claim 2, identity: ${idText}`);
    const a = r.advisories;
    if (a.status === 'affected') out.push(`${pad}  claim 3, advisories: ${a.applies.length} apply: ${a.applies.join(' ')}`);
    else if (a.status === 'none-listed') out.push(`${pad}  claim 3, advisories: OSV lists none for this commit`);
    else if (a.status === 'none-listed-for-base') out.push(`${pad}  claim 3, advisories: none listed for ${a.base}; the changes on top are unreviewed`);
    else if (a.unknown?.length) {
      out.push(`${pad}  claim 3, advisories: status unknown (OSV does not know this commit). ${a.unknown.length} for ${a.base}:`);
      for (const u of a.unknown) out.push(`${pad}    ${u.id}: ${HINT_TEXT[u.hint]}`);
    } else out.push(`${pad}  claim 3, advisories: unknown`);
  }
  return out.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { boolean: ['json'], string: ['repo', 'ref', 'app', 'version'] });
  if (!argv.repo || !argv.ref) { console.error('usage: submodules-cli.mjs --repo <url> --ref <tag|commit> [--app <appId> --version <v>] [--json]'); process.exit(1); }
  const token = loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE' });
  const { commit } = await resolveRef(argv.repo, String(argv.ref));
  const rb = argv.app ? await rbClaim(argv.app, String(argv.version || argv.ref)) : null;
  const rows = await checkSubmodules(argv.repo, commit, {
    cacheDir: path.join(CACHE_DIR, 'submodules'),
    upstreamOf: (u) => githubUpstream(u, { token }),
    log: (m) => console.error(m),
  });
  const report = { repo: argv.repo, ref: String(argv.ref), commit, rb, rows };
  console.log(argv.json ? JSON.stringify(report, null, 2) : render(report));
  process.exit(rows.some(r => r.error) ? 2 : 0);
}
