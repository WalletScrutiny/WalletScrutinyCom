/**
 * Copy the export to the web server at the end of a pass, so the wallet
 * pages show it without a site build: the panel fetches the files at page
 * load from /api/source-analysis/, which the web server serves from the
 * target directory (README, "Publishing the export").
 *
 * rsync with --delay-updates puts every changed file in place at the end of
 * the transfer and --delete-delay removes files only then, so a page loading
 * during the copy sees the old or the new export, not a mix for long.
 *
 *   SOURCE_ANALYSIS_PUBLISH_TARGET  rsync destination, a directory:
 *                                   user@host:/srv/source-analysis or a local path;
 *                                   unset = no publishing
 *   SOURCE_ANALYSIS_PUBLISH_SSH     the ssh command rsync uses (-e), for the key:
 *                                   "ssh -i /etc/... -o StrictHostKeyChecking=yes"
 *
 * Every .json goes with a brotli copy next to it (x.json.br), which nginx's
 * `brotli_static on` serves to browsers that accept br: a dependency list
 * shrinks to about a sixth.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Writes file.br unless it is already newer than file; renamed into place.
function compressFile(file) {
  const br = `${file}.br`;
  const stat = fs.statSync(file);
  try { if (fs.statSync(br).mtimeMs >= stat.mtimeMs) return; } catch { /* not compressed yet */ }
  const data = zlib.brotliCompressSync(fs.readFileSync(file), {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: stat.size },
  });
  const tmp = `${br}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, br);
}

// Compresses every .json under dir and removes a .br whose .json is gone, so
// nginx never serves a file the export no longer has.
export function compressTree(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) compressTree(file);
    else if (entry.name.endsWith('.json')) compressFile(file);
    else if (entry.name.endsWith('.json.br') && !fs.existsSync(file.slice(0, -3))) fs.rmSync(file);
  }
}

export function rsyncArgs(exportDir, target, { ssh = null } = {}) {
  return [
    '-rlt', '--compress', '--delete-delay', '--delay-updates', '--chmod=D755,F644',
    ...(ssh ? ['-e', ssh] : []),
    `${path.resolve(exportDir)}/`,
    target.endsWith('/') ? target : `${target}/`,
  ];
}

// Returns { published: false } when no target is set; throws when rsync fails.
export function publishExport(exportDir, { target = process.env.SOURCE_ANALYSIS_PUBLISH_TARGET, ssh = process.env.SOURCE_ANALYSIS_PUBLISH_SSH, run = spawnSync } = {}) {
  if (!target) return { published: false };
  if (fs.existsSync(exportDir)) compressTree(exportDir);
  const result = run('rsync', rsyncArgs(exportDir, target, { ssh }), { encoding: 'utf8', timeout: 10 * 60 * 1000 });
  if (result.error) throw new Error(`rsync: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`rsync exited ${result.status}: ${String(result.stderr || '').trim().split('\n').slice(-3).join(' / ')}`);
  return { published: true, target };
}

// One app's files (exportApp's list, relative to exportDir) as soon as its
// analysis ends: no --delete, so the rest of the published export stays.
// A short timeout, since the pass waits for it.
export function publishFiles(exportDir, files, { target = process.env.SOURCE_ANALYSIS_PUBLISH_TARGET, ssh = process.env.SOURCE_ANALYSIS_PUBLISH_SSH, run = spawnSync } = {}) {
  if (!target || !files.length) return { published: false };
  // A directory entry carries its .br files along; a file needs its own.
  const withBrotli = [];
  for (const f of files) {
    const full = path.join(exportDir, f);
    if (f.endsWith('/')) { if (fs.existsSync(full)) compressTree(full); withBrotli.push(f); }
    else if (f.endsWith('.json') && fs.existsSync(full)) { compressFile(full); withBrotli.push(f, `${f}.br`); }
    else withBrotli.push(f);
  }
  const args = ['-rlt', '--compress', '--delay-updates', '--chmod=D755,F644', '--files-from=-',
    ...(ssh ? ['-e', ssh] : []),
    `${path.resolve(exportDir)}/`,
    target.endsWith('/') ? target : `${target}/`];
  const result = run('rsync', args, { encoding: 'utf8', input: `${withBrotli.join('\n')}\n`, timeout: 2 * 60 * 1000 });
  if (result.error) throw new Error(`rsync: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`rsync exited ${result.status}: ${String(result.stderr || '').trim().split('\n').slice(-3).join(' / ')}`);
  return { published: true, target };
}
