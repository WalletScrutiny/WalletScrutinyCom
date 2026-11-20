// Rebuild one npm package version in the sandbox and compare it with the
// tarball the registry serves. Comparison rules, image choice and failure
// wording are source_analysis/rebuildNpm.mjs's; what differs is the sandbox
// (clone and install with the network but without lifecycle scripts, the
// package's own scripts without any network, see npm-sandbox.sh).
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { fetchNpmVersion, nodeImage, compareTarballs, diffNote, failureLine, rebuildEvent, CLONE_IMAGE } from '../source_analysis/rebuildNpm.mjs';
import { resolveRepo } from '../source_analysis/sourceRepos.mjs';
import { lsRemoteTags, identityOf, npmProvenance } from '../source_analysis/sourceIdentity.mjs';
import { sandboxArgs, runPhase, CONTAINER_CLI, LIMITS } from './sandbox.mjs';

const LOG_LIMIT = 200000;
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

/** Repository and tag/commit to build from, asked of the registry and the remote; repository cached in db.sources. */
export async function sourceOf(db, name, version) {
  let src = db.prepare(`SELECT repo_url FROM sources WHERE ecosystem = 'npm' AND name = ?`).get(name);
  if (!src) {
    const r = await resolveRepo({ ecosystem: 'npm', name, version });
    db.prepare(`INSERT OR REPLACE INTO sources (ecosystem, name, repo_url) VALUES ('npm', ?, ?)`).run(name, r.url || null);
    src = { repo_url: r.url || null };
  }
  if (!src.repo_url) return null;
  const tags = await lsRemoteTags(src.repo_url).catch(() => null);
  const npm = await npmProvenance(name, version).catch(() => null);
  const id = identityOf({ ecosystem: 'npm', name, version }, tags, npm);
  const ref = id.tag || id.commit;
  return { repoUrl: src.repo_url, ref: ref || null, commit: id.commit || null };
}

/** Never throws for a failed build, only for a registry the host cannot reach. */
export async function rebuildNpm({ name, version, source, workRoot, fetchImpl = fetch, cli = CONTAINER_CLI, limits = LIMITS }) {
  const facts = await fetchNpmVersion(name, version, fetchImpl);
  const slug = `${name.replace(/[^a-zA-Z0-9.-]/g, '_')}@${version}`;
  const dir = path.join(workRoot, slug);
  fs.rmSync(dir, { recursive: true, force: true });
  const workDir = path.join(dir, 'work'), outDir = path.join(dir, 'out');
  fs.mkdirSync(workDir, { recursive: true }); fs.mkdirSync(outDir, { recursive: true });
  const logFile = path.join(dir, 'build.log');
  const t0 = Date.now();

  const r = await fetchImpl(facts.tarball, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`${facts.tarball}: HTTP ${r.status}`);
  const registryBuf = Buffer.from(await r.arrayBuffer());
  const integrity = `sha512-${createHash('sha512').update(registryBuf).digest('base64')}`;
  if (facts.integrity?.startsWith('sha512-') && facts.integrity !== integrity) throw new Error(`${name}@${version}: the downloaded tarball does not match the registry's integrity`);
  const x = sha256(registryBuf);
  const image = nodeImage(facts.nodeVersion);
  const row = { ecosystem: 'npm', name, version, sha256: x, artifact: path.basename(new URL(facts.tarball).pathname), commit: source?.commit || null, ref: source?.ref || null, repoUrl: source?.repoUrl || null, toolchain: `${image.split('/').pop()} npm ${facts.npmVersion || 'default'}`, sandbox: 'clone+install: network, no scripts; build: no network', log: logFile };
  const done = (result, note) => {
    const out = { ...row, result, note, seconds: Math.round((Date.now() - t0) / 1000) };
    out.event = rebuildEvent({ name, version, sha256: x, result, repoUrl: row.repoUrl, commit: row.commit, toolchain: row.toolchain, note });
    fs.rmSync(workDir, { recursive: true, force: true });
    return out;
  };

  if (!source?.repoUrl) return done('failed', 'No source repository found for this package');
  if (!source.ref) return done('failed', 'No git tag or commit for this version');
  fs.writeFileSync(logFile, `== ${name}@${version} registry sha256 ${x}\n== image ${image}\n`);
  const env = { REPO: source.repoUrl, REF: source.ref, DIR: facts.directory || '', NPMV: facts.npmVersion || '' };
  const cname = `dr-${process.pid}-${slug.replace(/[^a-zA-Z0-9.-]/g, '_')}`.slice(0, 100);
  const phases = [
    { phase: 'clone', image: CLONE_IMAGE, network: 'default' },
    { phase: 'install', image, network: 'default' },
    { phase: 'build', image, network: 'none', out: true },
  ];
  let run = { code: 0 }, failedPhase = null;
  for (const p of phases) {
    fs.appendFileSync(logFile, `\n=== phase ${p.phase} (${p.network === 'none' ? 'no network' : 'network, no package scripts'})\n`);
    const name2 = `${cname}-${p.phase}`;
    run = await runPhase({
      cli, name: name2, logFile, workDir, limits,
      args: sandboxArgs({ image: p.image, name: name2, workDir, outDir: p.out ? outDir : null, env: { ...env, PHASE: p.phase }, network: p.network, cli, limits }),
    });
    if (run.code !== 0 || run.timedOut || run.tooBig) { failedPhase = p.phase; break; }
  }
  const logText = fs.readFileSync(logFile, 'utf8');
  if (logText.length > LOG_LIMIT) fs.writeFileSync(logFile, logText.slice(0, LOG_LIMIT / 2) + '\n…\n' + logText.slice(-LOG_LIMIT / 2));
  const commit = /^commit ([0-9a-f]{40})/m.exec(logText)?.[1];
  if (commit) row.commit = commit;
  const npmUsed = /^== npm \S+ packed nothing, packing with the image's npm (\S+)/m.exec(logText)?.[1] || /^== node \S+ npm (\S+)/m.exec(logText)?.[1];
  if (npmUsed) row.toolchain = `${image.split('/').pop()} npm ${npmUsed}`;
  if (run.timedOut) return done('failed', `The ${failedPhase} step did not finish in ${limits.phaseMs / 60000} minutes`);
  if (run.tooBig) return done('failed', `The ${failedPhase} step used more than ${Math.round(limits.diskBytes / 2 ** 30)} GB of disk`);
  const packed = fs.readdirSync(outDir).filter(f => f.endsWith('.tgz'));
  if (run.code !== 0 || packed.length !== 1) return done('failed', `${failedPhase || 'build'} failed: ${failureLine(logText).slice(0, 160)}`);
  const cmp = compareTarballs(registryBuf, fs.readFileSync(path.join(outDir, packed[0])));
  fs.appendFileSync(logFile, `== comparison ${JSON.stringify({ ...cmp, missing: cmp.missing.slice(0, 50), extra: cmp.extra.slice(0, 50), changed: cmp.changed.slice(0, 50) })}\n`);
  if (cmp.match) return done('reproduced', cmp.identical ? 'Byte-identical tarball' : `All ${cmp.files} files identical; tarball metadata differs`);
  return done('failed', `Rebuilt tarball differs: ${diffNote(cmp)}`);
}
