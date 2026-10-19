/**
 * Source repository of a dependency, from the registry's own metadata.
 *
 * npm: the `repository` field of the registry document; crates.io: the
 * `repository` field of the crate; Maven: `<scm><url>` of the POM, then of its
 * parent POMs, then a `<url>` that points at a code host. Nothing here is a
 * search: a package whose registry names no repository stays unresolved and is
 * reported as such. Runs on the host, no repository code is executed.
 *
 * Results are keyed by (ecosystem, name): the repository of a package does not
 * change per version, and one lookup then serves every release and wallet.
 */
const TIMEOUT_MS = 20000;
const RETRIES = 2;
const MAX_PARENT_HOPS = 4;
const CODE_HOSTS = /^(github\.com|gitlab\.com|codeberg\.org|bitbucket\.org|git\.sr\.ht|sr\.ht|gitea\.com|git\.kernel\.org|android\.googlesource\.com|git\.savannah\.gnu\.org|salsa\.debian\.org|invent\.kde\.org)$/;
const MAVEN_BASES = ['https://repo1.maven.org/maven2', 'https://dl.google.com/dl/android/maven2', 'https://jitpack.io'];

/**
 * A browsable https URL for whatever a registry put in a repository field
 * (`git+ssh://git@github.com/o/r.git`, `github:o/r`, `scm:git:git://...`,
 * `git@host:o/r.git`, `o/r` shorthand), or null when it is not a URL we can
 * link to. Paths below the repository (`/tree/main/packages/x`) are cut for
 * the code hosts whose layout we know.
 */
export function normaliseRepoUrl(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.trim().replace(/^scm:(git|svn|hg):/, '').replace(/^git\+/, '');
  if (!s) return null;
  let m;
  if ((m = /^(github|gitlab|bitbucket):(.+)$/.exec(s))) s = `https://${m[1]}.${m[1] === 'bitbucket' ? 'org' : 'com'}/${m[2]}`;
  else if (/^[\w.-]+\/[\w.-]+$/.test(s)) s = `https://github.com/${s}`; // npm shorthand
  else if ((m = /^(?:ssh:\/\/)?git@([^:/]+)[:/](.+)$/.exec(s))) s = `https://${m[1]}/${m[2]}`;
  else if (/^(git|ssh|http):\/\//.test(s)) s = s.replace(/^(git|ssh|http):\/\/(?:[^@/]+@)?/, 'https://');
  let url;
  try { url = new URL(s); } catch { return null; }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const parts = url.pathname.replace(/\.git$/, '').split('/').filter(Boolean);
  if (CODE_HOSTS.test(host) && host !== 'git.kernel.org' && host !== 'android.googlesource.com') {
    if (parts.length < 2) return null;
    // gitlab nests groups; github and the others are owner/repo
    const depth = host === 'gitlab.com' ? parts.findIndex(p => p === '-' || p === 'tree' || p === 'blob') : -1;
    const kept = host === 'gitlab.com' ? (depth > 1 ? parts.slice(0, depth) : parts) : parts.slice(0, 2);
    return `https://${host}/${kept.join('/')}`;
  }
  if (!parts.length) return null;
  return `https://${host}/${parts.join('/')}`;
}

const isCodeHost = (url) => { try { return CODE_HOSTS.test(new URL(url).hostname.replace(/^www\./, '')); } catch { return false; } };

// crates.io asks for at most one request per second per client.
let cratesNext = 0;
async function cratesSlot() {
  const at = Math.max(Date.now(), cratesNext);
  cratesNext = at + 1100;
  if (at > Date.now()) await new Promise(res => setTimeout(res, at - Date.now()));
}

async function get(fetchImpl, url, { json = false } = {}) {
  let last;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      if (url.startsWith('https://crates.io/')) await cratesSlot();
      const r = await fetchImpl(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'user-agent': 'walletscrutiny-source-analysis' } });
      if (r.status === 404) return null;
      if (r.ok) return json ? await r.json() : await r.text();
      last = new Error(`${url}: HTTP ${r.status}`);
      if (r.status < 500 && r.status !== 429) break;
    } catch (e) { last = e; }
    if (attempt < RETRIES) await new Promise(res => setTimeout(res, 2000 * (attempt + 1)));
  }
  throw last;
}

export async function npmRepo(name, fetchImpl = fetch) {
  const doc = await get(fetchImpl, `https://registry.npmjs.org/${name.replace('/', '%2F')}/latest`, { json: true });
  if (!doc) return { url: null, source: 'npm', note: 'not on the registry' };
  const repo = typeof doc.repository === 'string' ? doc.repository : doc.repository?.url;
  const url = normaliseRepoUrl(repo);
  if (url) return { url, source: 'npm', directory: doc.repository?.directory || null };
  const home = normaliseRepoUrl(doc.homepage);
  if (home && isCodeHost(home)) return { url: home, source: 'npm-homepage' };
  return { url: null, source: 'npm', note: 'registry names no repository' };
}

export async function cargoRepo(name, fetchImpl = fetch) {
  const doc = await get(fetchImpl, `https://crates.io/api/v1/crates/${encodeURIComponent(name)}`, { json: true });
  if (!doc) return { url: null, source: 'crates.io', note: 'not on the registry' };
  const url = normaliseRepoUrl(doc.crate?.repository);
  if (url) return { url, source: 'crates.io' };
  const home = normaliseRepoUrl(doc.crate?.homepage);
  if (home && isCodeHost(home)) return { url: home, source: 'crates.io-homepage' };
  return { url: null, source: 'crates.io', note: 'registry names no repository' };
}

const tag = (xml, name) => {
  const m = new RegExp(`<${name}>\\s*([^<]*?)\\s*</${name}>`).exec(xml);
  return m ? m[1] : null;
};
const block = (xml, name) => {
  const m = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(xml.replace(/<!--[\s\S]*?-->/g, ''));
  return m ? m[1] : null;
};

async function fetchPom(fetchImpl, group, artifact, version) {
  const file = `${group.replace(/\./g, '/')}/${artifact}/${version}/${artifact}-${version}.pom`;
  for (const base of MAVEN_BASES) {
    const pom = await get(fetchImpl, `${base}/${file}`);
    if (pom) return pom.replace(/<!--[\s\S]*?-->/g, '');
  }
  return null;
}

/** `group:artifact` at `version`: scm url from the POM, walking up parent POMs. */
export async function mavenRepo(name, version, fetchImpl = fetch) {
  const [group, artifact] = name.split(':');
  if (!group || !artifact || !version) return { url: null, source: 'maven', note: 'no version to read a POM for' };
  let g = group, a = artifact, v = version;
  let homepage = null;
  for (let hop = 0; hop <= MAX_PARENT_HOPS; hop++) {
    const pom = await fetchPom(fetchImpl, g, a, v);
    if (!pom) return { url: null, source: 'maven', note: hop ? 'parent POM not found' : 'POM not found' };
    const scm = block(pom, 'scm');
    if (scm) {
      for (const field of ['url', 'connection', 'developerConnection']) {
        const url = normaliseRepoUrl(tag(scm, field));
        if (url) return { url, source: hop ? 'maven-parent-scm' : 'maven-scm' };
      }
    }
    if (!homepage) {
      // only the project's own <url>, not the one inside <licenses>/<developers>
      const top = pom.replace(/<(licenses|developers|contributors|organization|issueManagement|ciManagement|distributionManagement|repositories|pluginRepositories|build|profiles|dependencies|dependencyManagement)>[\s\S]*?<\/\1>/g, '').replace(/<parent>[\s\S]*?<\/parent>/, '');
      const home = normaliseRepoUrl(tag(top, 'url'));
      if (home && isCodeHost(home)) homepage = home;
    }
    const parent = block(pom, 'parent');
    if (!parent) break;
    g = tag(parent, 'groupId'); a = tag(parent, 'artifactId'); v = tag(parent, 'version');
    if (!g || !a || !v) break;
  }
  if (homepage) return { url: homepage, source: 'maven-url' };
  return { url: null, source: 'maven', note: 'POM chain names no repository' };
}

/**
 * Last-resort patterns for packages whose metadata sits on the parent
 * repository, not the leaf package. Applied only after the registry said
 * nothing, and labelled as such.
 */
export function knownPatternRepo(ecosystem, name) {
  if (ecosystem === 'npm' && name.startsWith('@types/')) return 'https://github.com/DefinitelyTyped/DefinitelyTyped';
  if (ecosystem === 'npm' && name.endsWith('-cjs') && !name.startsWith('@')) return null;
  if (ecosystem === 'gradle' && /^androidx\./.test(name.split(':')[0])) return 'https://android.googlesource.com/platform/frameworks/support';
  return null;
}

export async function resolveRepo({ ecosystem, name, version }, fetchImpl = fetch) {
  let result;
  if (ecosystem === 'npm') result = await npmRepo(name, fetchImpl);
  else if (ecosystem === 'cargo') result = await cargoRepo(name, fetchImpl);
  else if (ecosystem === 'gradle') result = await mavenRepo(name, version, fetchImpl);
  else return { url: null, source: ecosystem, note: 'ecosystem not supported' };
  if (!result.url) {
    const pattern = knownPatternRepo(ecosystem, name);
    if (pattern) return { url: pattern, source: 'known-pattern', note: result.note };
  }
  return result;
}
