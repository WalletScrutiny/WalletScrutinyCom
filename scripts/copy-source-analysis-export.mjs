#!/usr/bin/env node
/**
 * Put the source-analysis export (external/source_analysis/export.mjs output:
 * index.json, apps/, packages/) under _site/api/source-analysis/, where the
 * wallet page's Dependencies panel fetches it from (src/dependencies-panel.mjs,
 * EXPORT_BASE). Runs after Jekyll and before the post-processing so the JSON
 * gets its pre-compressed .br copies like everything else.
 *
 * Opt-in; a build without an export is a build without the panel (the panel
 * hides itself on 404). Two sources, directory first:
 *
 *   SOURCE_ANALYSIS_EXPORT_DIR   a directory with index.json at its top
 *                                (default: external/source_analysis/export,
 *                                used when it exists)
 *   SOURCE_ANALYSIS_EXPORT_URL   a .tar.gz with index.json at its top, fetched
 *                                and unpacked
 *
 * For local and preview builds only. On walletscrutiny.com the analyser
 * copies its export to the web server after every pass
 * (external/source_analysis/publish.mjs) and nginx serves it under the same
 * path, so new data never waits for a site build; there, build without an
 * export.
 */

import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE_DIR = process.env.SITE_DIR || '_site';
const TARGET = join(SITE_DIR, 'api', 'source-analysis');
const DEFAULT_DIR = join('external', 'source_analysis', 'export');

function copyDir(dir) {
  if (!existsSync(join(dir, 'index.json'))) {
    throw new Error(`${dir} has no index.json; not a source-analysis export`);
  }
  rmSync(TARGET, { recursive: true, force: true });
  mkdirSync(TARGET, { recursive: true });
  cpSync(dir, TARGET, { recursive: true });
  console.log(`source-analysis export: ${dir} -> ${TARGET}`);
}

async function fromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const tmp = mkdtempSync(join(tmpdir(), 'source-analysis-export-'));
  try {
    const archive = join(tmp, 'export.tar.gz');
    writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
    const unpacked = join(tmp, 'export');
    mkdirSync(unpacked);
    execFileSync('tar', ['-xzf', archive, '-C', unpacked], { stdio: 'inherit' });
    copyDir(unpacked);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function main() {
  if (!existsSync(SITE_DIR)) throw new Error(`${SITE_DIR} does not exist; run after the Jekyll build`);
  const dir = process.env.SOURCE_ANALYSIS_EXPORT_DIR || (existsSync(DEFAULT_DIR) ? DEFAULT_DIR : null);
  if (dir) {
    copyDir(dir);
    return;
  }
  if (process.env.SOURCE_ANALYSIS_EXPORT_URL) {
    await fromUrl(process.env.SOURCE_ANALYSIS_EXPORT_URL);
    return;
  }
  console.log('source-analysis export: none in this build (normal on the servers: the analyser publishes it and nginx serves /api/source-analysis/)');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
