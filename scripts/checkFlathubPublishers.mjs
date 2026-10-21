/**
 * checkFlathubPublishers.mjs
 *
 * Checks each page's `flathub.publisher` claim against Flathub's own verification record,
 * so a page cannot call a package "developer" published unless Flathub agrees.
 *
 *   node scripts/checkFlathubPublishers.mjs     exits 1 on any mismatch
 *
 * "developer" needs Flathub to have verified the app ID, through a website whose domain is
 * the page's website (or a parent of it), or through a GitHub/GitLab account that owns the
 * page's repository. Verification by anyone else does not count.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COLLECTIONS = ['_desktop', '_hardware', '_mobile', '_bearer', '_others'];
const APP_ID_RE = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)+\.[A-Za-z_][A-Za-z0-9_-]*$/;

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

function repoOwner(url) {
  try {
    const u = new URL(url);
    if (!['github.com', 'gitlab.com'].includes(u.hostname)) return null;
    return { host: u.hostname, owner: u.pathname.split('/')[1]?.toLowerCase() || null };
  } catch {
    return null;
  }
}

/**
 * Who Flathub says controls the app ID, if it is someone the page names.
 * @param {{ website?: string, repository?: string }} page
 * @param {{ verified?: boolean, method?: string, website?: string, login_provider?: string, login_name?: string }} status
 * @returns {string | null}
 */
export function developerEvidence(page, status) {
  if (status?.verified !== true) return null;
  if (status.method === 'website' && typeof status.website === 'string') {
    const verified = status.website.toLowerCase().replace(/^www\./, '');
    const site = hostOf(page.website);
    if (site && (site === verified || site.endsWith(`.${verified}`))) return `website ${verified}`;
    return null;
  }
  if (status.method === 'login_provider' && typeof status.login_name === 'string') {
    const repo = repoOwner(page.repository);
    if (repo && repo.host.startsWith(String(status.login_provider).toLowerCase())
        && repo.owner === status.login_name.toLowerCase()) {
      return `${repo.host}/${repo.owner}`;
    }
  }
  return null;
}

/**
 * @returns {{ ok: boolean, message: string }}
 */
export function checkPublisherClaim(page, status) {
  const evidence = developerEvidence(page, status);
  if (page.flathub.publisher === 'developer') {
    return evidence
      ? { ok: true, message: `developer, Flathub-verified via ${evidence}` }
      : { ok: false, message: `claims developer, but Flathub does not verify it to the page's website or repository (${JSON.stringify(status)})` };
  }
  return evidence
    ? { ok: false, message: `claims community, but Flathub verifies it via ${evidence}: should it be developer?` }
    : { ok: true, message: 'community, not verified to the developers' };
}

function readPages() {
  const pages = [];
  for (const dir of COLLECTIONS) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full).filter(n => n.endsWith('.md'))) {
      const text = fs.readFileSync(path.join(full, name), 'utf8');
      const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fm || !/^flathub:/m.test(fm[1])) continue;
      const data = yaml.load(fm[1]);
      if (data?.flathub) pages.push({ file: `${dir}/${name}`, ...data });
    }
  }
  return pages;
}

async function main() {
  let failed = 0;
  for (const page of readPages()) {
    const appId = page.flathub.appId;
    if (typeof appId !== 'string' || !APP_ID_RE.test(appId)) {
      console.log(`FAIL ${page.file}: appId ${JSON.stringify(appId)} is not a Flatpak app ID`);
      failed++;
      continue;
    }
    const res = await fetch(`https://flathub.org/api/v2/verification/${encodeURIComponent(appId)}/status`);
    if (!res.ok) {
      console.log(`FAIL ${page.file}: Flathub answered ${res.status} for ${appId}`);
      failed++;
      continue;
    }
    const { ok, message } = checkPublisherClaim(page, await res.json());
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${page.file} ${appId}: ${message}`);
    if (!ok) failed++;
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
