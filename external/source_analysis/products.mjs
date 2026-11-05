// Which app of a repository each dependency file builds (issue 994). One
// repository can hold an Android app, an iPhone app, a desktop app, a server, a
// website and the docs; a wallet page counts only its own app's files and the
// shared ones.
//
// Only a rules file (rules/<host>/<owner>/<repo>.json) takes a file off a page.
// Folder and file names are guesses and a wrong guess hides libraries that are in
// the app: Coin Wallet's web/ folder is its phone and desktop app's code. So a file
// with no rule counts as shared, and a guess only names it for someone to review
// (unlistedFiles). Without a rule, a page leans towards counting too much. It can
// still count too little: a library in no file the checker reads is invisible,
// as with build tools such as cargo-ndk.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Another product built from the same repository, by folder name. A row's
// `part` in the export (the tree's "Where?") comes from this list alone.
const PRODUCT_PARTS = [
  ['desktop', /^(electron|desktop|electron-app|app-electron)$/i],
  ['server', /^(server|backend|api|services?)$/i],
  ['web', /^(web|website|webapp|site|landing)$/i],
  ['extension', /^(extension|browser-extension|chrome-extension|webextension)$/i],
  ['docs', /^(docs?|documentation)$/i],
];

// Words inside a folder or file name: phoenix-android, requirements-build-mac.txt.
const TARGET_WORDS = new Map([
  ...['android'].map(w => [w, 'android']),
  ...['ios', 'iphone'].map(w => [w, 'iphone']),
  ...['mac', 'macos', 'osx', 'darwin', 'windows', 'win', 'win32', 'wine', 'linux', 'appimage', 'flatpak'].map(w => [w, 'desktop']),
]);

// The words a rules file may use in belongs_to, and the target each one means.
// "mobile" is both phone apps but not the rest of the repository; server, docs,
// tests and "no app" are counted on no wallet page. The README's "Which app a file belongs to" has the format.
const BELONGS_TO = {
  'all apps': 'shared',
  'both phones': 'mobile',
  android: 'android',
  iphone: 'iphone',
  desktop: 'desktop',
  firmware: 'firmware',
  server: 'server',
  docs: 'docs',
  tests: 'tests',
  'no app': 'none',
};

// **/ is any folders or none, ** is anything, * and ? stop at a slash. Upper and
// lower case are the same: Kotlin's iosArm64 files are written both ways.
export function globToRegExp(glob) {
  const body = glob.split(/(\*\*\/|\*\*|\*|\?)/).map(part => ({
    '**/': '(?:.*/)?', '**': '.*', '*': '[^/]*', '?': '[^/]',
  }[part] ?? part.replace(/[.+^${}()|[\]\\]/g, '\\$&'))).join('');
  return new RegExp(`^${body}$`, 'i');
}

// One parsed rules file; throws on anything the format does not allow, so a
// mistake fails the tests instead of quietly changing a wallet's numbers.
export function parseRulesFile(json, repoKey) {
  const fail = (why) => { throw new Error(`rules/${repoKey}.json: ${why}`); };
  const data = JSON.parse(json);
  if (typeof data.release !== 'string' || !data.release) fail('needs "release"');
  if (Boolean(data.reviewed_by) !== Boolean(data.reviewed_on)) fail('needs both "reviewed_by" and "reviewed_on", or neither');
  if (data.reviewed_on && !/^\d{4}-\d{2}-\d{2}$/.test(data.reviewed_on)) fail('"reviewed_on" must be YYYY-MM-DD');
  const reviewed = data.reviewed_files ?? [];
  if (!Array.isArray(reviewed) || reviewed.some(f => typeof f !== 'string' || !f)) fail('"reviewed_files" must be a list of file paths');
  if (Boolean(data.reviewed_by) !== reviewed.length > 0) fail('"reviewed_by" and "reviewed_files" come together');
  if (!Array.isArray(data.rules) || !data.rules.length) fail('needs "rules"');
  const repoUrl = `https://${repoKey}/`.toLowerCase();
  const rules = data.rules.map((rule, i) => {
    const where = `rule ${i + 1}`;
    const files = [rule.files].flat();
    if (!files.length || files.some(f => typeof f !== 'string' || !f)) fail(`${where} needs "files"`);
    if (!Object.hasOwn(BELONGS_TO, rule.belongs_to ?? '')) fail(`${where}: "belongs_to" must be one of ${Object.keys(BELONGS_TO).join(', ')}`);
    if (typeof rule.why !== 'string' || !rule.why) fail(`${where} needs "why"`);
    if (!Array.isArray(rule.proof) || !rule.proof.length) fail(`${where} needs "proof"`);
    for (const link of rule.proof) {
      // A commit, not a tag: a tag can be moved after the review.
      if (typeof link !== 'string' || !link.toLowerCase().startsWith(repoUrl) || !/\/blob\/[0-9a-f]{40}\//.test(link)) {
        fail(`${where}: proof must link this repository at a full commit hash: ${link}`);
      }
    }
    return { patterns: files.map(globToRegExp), target: BELONGS_TO[rule.belongs_to] };
  });
  // A narrow rule below a wide one never applies. A rule that matches no reviewed
  // file is allowed: it can be there for another release's files.
  rules.forEach((rule, i) => {
    const hits = reviewed.filter(file => rule.patterns.some(re => re.test(file)));
    const earlier = rules.slice(0, i);
    if (hits.length && hits.every(file => earlier.some(r => r.patterns.some(re => re.test(file))))) {
      fail(`rule ${i + 1} is hidden: earlier rules catch every reviewed file it matches`);
    }
  });
  return { reviewedBy: data.reviewed_by || null, reviewedOn: data.reviewed_on || null, release: data.release, reviewedFiles: new Set(reviewed), rules };
}

// Every rules file under a folder, by repository: github.com/owner/repo, lower case.
export function loadRuleFiles(dir = fileURLToPath(new URL('./rules/', import.meta.url))) {
  const files = new Map();
  const walk = (folder, prefix) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const full = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(full, `${prefix}${entry.name}/`);
      else if (entry.name.endsWith('.json')) {
        const repoKey = `${prefix}${entry.name.slice(0, -'.json'.length)}`;
        files.set(repoKey.toLowerCase(), parseRulesFile(fs.readFileSync(full, 'utf8'), repoKey));
      }
    }
  };
  if (fs.existsSync(dir)) walk(dir, '');
  return files;
}

const RULE_FILES = loadRuleFiles();

// The repository of each app id. Results are stored under a repository's first
// record (appList.groupByRepository), and that record can change, so older results
// can sit under any of its ids: every id gets the rules. An id with no known
// repository gets none: every file counts, and the page says so.
const repositories = new Map();
export function useRepositories(jobs) {
  repositories.clear();
  for (const { appId, repoUrl, aliases = [] } of jobs) {
    const repo = String(repoUrl).replace(/^https?:\/\//, '').toLowerCase();
    for (const id of [appId, ...aliases.map(a => a.appId)]) repositories.set(id, repo);
  }
}

const rulesOf = (appId) => RULE_FILES.get(repositories.get(appId));
const matches = (rule, file) => rule.patterns.some(re => re.test(file));
// The first matching rule wins, so a narrow rule goes above a wide one.
const ruleFor = (file, appId) => rulesOf(appId)?.rules.find(rule => matches(rule, file));

// The targets each page counts. Platforms not listed (bearer, others) get no
// filter: nothing says which of a repository's files they build.
// src/dependencies-panel-model.mjs keeps the same map for the wallet page.
export const COUNTED_TARGETS = {
  android: ['shared', 'mobile', 'android'],
  iphone: ['shared', 'mobile', 'iphone'],
  desktop: ['shared', 'desktop'],
  hardware: ['shared', 'firmware'],
};

const wordsOf = name => name.toLowerCase().split(/[-_.]/);
const targetOfWords = name => wordsOf(name).map(w => TARGET_WORDS.get(w)).find(Boolean) || null;

export function productPartOf(lockfile) {
  for (const dir of String(lockfile || '').split('/').slice(0, -1)) {
    const hit = PRODUCT_PARTS.find(([, re]) => re.test(dir));
    if (hit) return hit[0];
  }
  return null;
}

// What the file's name suggests, for review; never takes a file off a page.
export function guessOfLockfile(lockfile) {
  const segments = String(lockfile || '').split('/');
  for (const dir of segments.slice(0, -1)) {
    const hit = PRODUCT_PARTS.find(([, re]) => re.test(dir));
    if (hit) return hit[0];
    const word = targetOfWords(dir);
    if (word) return word;
  }
  // "foo.txt" splits into foo and txt: harmless, no extension is a target word.
  return targetOfWords(segments.at(-1)) || 'shared';
}

// A row's `part`, the Tree's and CSV's "Where?": the folder-name guess, unless a
// rule contradicts it (Coin Wallet's web/ is its app, not a website). It never adds
// a label from a rule: the Tree leaves rows with a part out of its groups (issue
// 996), so a new label would hide them there.
export function partOfFile(lockfile, appId = null) {
  const part = productPartOf(lockfile);
  const rule = part && ruleFor(String(lockfile || ''), appId);
  return rule && rule.target !== part ? null : part;
}

// android | iphone | mobile | desktop | server | web | extension | docs | firmware | tests | none | shared
export function targetOfLockfile(lockfile, appId = null) {
  return ruleFor(String(lockfile || ''), appId)?.target || 'shared';
}

// The files that look like another product's but have no rule:
// they count on every page until someone checks them and adds a rule.
export function unlistedFiles(lockfiles, appId = null) {
  return [...new Set(lockfiles)].filter(f => !ruleFor(f, appId) && guessOfLockfile(f) !== 'shared').sort();
}

// The targets a row's lockfiles build, or undefined when all are shared, the
// case every single-product wallet is in, so its export stays as it was.
export function targetsOfLockfiles(lockfiles, appId = null) {
  const targets = [...new Set(lockfiles.map(l => targetOfLockfile(l, appId)))].sort();
  return targets.some(t => t !== 'shared') ? targets : undefined;
}

// What the wallet page says about a release's file sorting (the label comes from
// the rules file, so the two can't disagree): "none" with no rules file, "pending"
// without a person's review, "reviewed" with one. A review covers the exact files
// the person saw. Any other set of files is "pending", because a wide rule like
// app/** would otherwise accept a new file nobody looked at. filesOutside is how
// many files each page leaves out.
export function sortingOf(lockfiles, appId) {
  const files = [...new Set(lockfiles)];
  if (!files.length) return undefined;
  const rules = rulesOf(appId);
  if (!rules) return { status: 'none' };
  const filesOutside = Object.fromEntries(Object.entries(COUNTED_TARGETS).map(([platform, counted]) => (
    [platform, files.filter(f => !counted.includes(targetOfLockfile(f, appId))).length]
  )));
  if (!rules.reviewedBy) return { status: 'pending', filesOutside };
  const review = { by: rules.reviewedBy, on: rules.reviewedOn, release: rules.release };
  const same = files.length === rules.reviewedFiles.size && files.every(f => rules.reviewedFiles.has(f));
  if (!same) return { status: 'pending', changedSince: review, filesOutside };
  return { status: 'reviewed', ...review };
}
