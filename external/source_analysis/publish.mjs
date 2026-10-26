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
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';

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
  const result = run('rsync', rsyncArgs(exportDir, target, { ssh }), { encoding: 'utf8', timeout: 10 * 60 * 1000 });
  if (result.error) throw new Error(`rsync: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`rsync exited ${result.status}: ${String(result.stderr || '').trim().split('\n').slice(-3).join(' / ')}`);
  return { published: true, target };
}
