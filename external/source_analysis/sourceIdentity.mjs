/**
 * Identity check, rung one of the dependency ladder (identity, provenance,
 * reproduced, closed): does the version a wallet ships exist in the source
 * repository the registry names?
 *
 * Three facts per (ecosystem, name, version), none of them a build:
 *   tag         a tag of the repository that reads as this version (`v1.2.3`,
 *               `1.2.3`, `name@1.2.3`, `name-1.2.3`, `release-1.2.3`)
 *   commit      the commit that tag points at (peeled to the commit)
 *   provenance  npm only: the registry holds a sigstore attestation for the
 *               publish (dist.attestations), i.e. the publish names the commit
 *               and workflow that built it
 * A tag that exists says the version was cut from this repository; it does not
 * say the published artifact equals that source. That is the next rung.
 */
import { spawn } from 'child_process';

const TIMEOUT_MS = 60000;

/** Tag names of a repository with the commit each points at (annotated tags peeled). */
export function parseLsRemote(text) {
  const tags = new Map();
  for (const line of String(text).split('\n')) {
    const m = /^([0-9a-f]{40})\trefs\/tags\/(.+?)(\^\{\})?$/.exec(line);
    if (!m) continue;
    if (m[3] || !tags.has(m[2])) tags.set(m[2], m[1]); // the peeled line is the commit
  }
  return tags;
}

export function lsRemoteTags(repoUrl, { run = spawnGit } = {}) {
  return run(['ls-remote', '--tags', repoUrl]).then(out => parseLsRemote(out));
}

// Without --refs git also prints the peeled `^{}` line of annotated tags,
// which parseLsRemote prefers: that is the commit, not the tag object.
function spawnGit(a) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', a, { env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: 'true' }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), TIMEOUT_MS);
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('close', code => { clearTimeout(timer); code === 0 ? resolve(out) : reject(new Error(err.trim().split('\n').pop() || `git exit ${code}`)); });
  });
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The tag that names `version` of `name`, or null. Package-qualified tags
 * (`name@1.2.3`, `artifact-1.2.3`) win over bare ones in a monorepo, where
 * `v1.2.3` may belong to a sibling.
 */
export function matchTag(tags, name, version) {
  const names = [...tags.keys ? tags.keys() : tags];
  const v = escapeRe(version);
  const leaf = name.includes(':') ? name.split(':')[1] : name.replace(/^@[^/]+\//, '');
  const qualified = new RegExp(`^(?:rel/|release/|releases/)?(?:${escapeRe(name)}|${escapeRe(leaf)})[@/_-]v?${v}$`, 'i');
  const bare = new RegExp(`^(?:v|V|r|rel|release|releases|version)?[-_/ ]?${v}$`);
  return names.find(t => qualified.test(t)) || names.find(t => bare.test(t)) || null;
}

export async function npmProvenance(name, version, fetchImpl = fetch) {
  const r = await fetchImpl(`https://registry.npmjs.org/${name.replace('/', '%2F')}/${encodeURIComponent(version)}`, { signal: AbortSignal.timeout(20000) });
  if (r.status === 404) return { provenance: false, gitHead: null, published: false };
  if (!r.ok) throw new Error(`npm ${name}@${version}: HTTP ${r.status}`);
  const doc = await r.json();
  return { provenance: Boolean(doc.dist?.attestations?.url), gitHead: doc.gitHead || null, published: true };
}

/**
 * Identity facts for one package version given its repository's tag map.
 * `tags` null = the repository could not be listed (gone, private).
 */
export function identityOf({ ecosystem, name, version }, tags, npm = null) {
  const out = { tag: null, commit: null, provenance: null, status: 'repo-unreachable' };
  if (npm) { out.provenance = npm.provenance; if (npm.published === false) out.status = 'not-on-registry'; }
  if (!tags) return out;
  const tag = matchTag(tags, name, version);
  if (tag) return { ...out, tag, commit: tags.get(tag), status: 'tag-found' };
  if (npm?.gitHead) return { ...out, commit: npm.gitHead, status: 'commit-named' };
  return { ...out, status: 'no-tag' };
}
