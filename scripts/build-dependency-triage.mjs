#!/usr/bin/env node
/**
 * Publish the dependency triage files (_data/dependencyTriage/<appId>.yml:
 * our decision per advisory whether it affects the product, see
 * docs/dependency-check.md "Triage") as JSON under
 * _site/api/source-analysis/triage/<appId>.json, where the wallet page's
 * Dependencies panel reads them next to the source-analysis export.
 *
 * Every file is validated (src/dependency-triage.mjs parseTriage) and one bad
 * status, missing justification or duplicate advisory fails the build: a
 * decision nobody can read is worse than none. Runs after
 * copy-source-analysis-export.mjs, which recreates the target directory.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import yaml from 'js-yaml';
import { parseTriage } from '../src/dependency-triage.mjs';
import { safeName } from '../src/dependencies-panel-model.mjs';

const SITE_DIR = process.env.SITE_DIR || '_site';
const SOURCE_DIR = process.env.DEPENDENCY_TRIAGE_DIR || join('_data', 'dependencyTriage');
const TARGET = join(SITE_DIR, 'api', 'source-analysis', 'triage');

export function buildTriage({ sourceDir = SOURCE_DIR, target = TARGET } = {}) {
  if (!existsSync(sourceDir)) return { files: 0, decisions: 0, problems: [] };
  const files = readdirSync(sourceDir).filter(f => /\.ya?ml$/.test(f)).sort();
  const problems = [];
  const out = [];
  for (const file of files) {
    const appId = basename(file).replace(/\.ya?ml$/, '');
    let doc;
    try {
      doc = yaml.load(readFileSync(join(sourceDir, file), 'utf8'));
    } catch (error) {
      problems.push(`${join(sourceDir, file)}: ${error.message}`);
      continue;
    }
    try {
      const triage = parseTriage(doc, { source: join(sourceDir, file) });
      out.push({ appId, file, triage });
    } catch (error) {
      problems.push(error.message);
    }
  }
  if (problems.length) return { files: files.length, decisions: 0, problems };
  mkdirSync(target, { recursive: true });
  let decisions = 0;
  for (const { appId, triage } of out) {
    decisions += triage.decisions.length;
    writeFileSync(join(target, `${safeName(appId)}.json`), JSON.stringify({ schema: 1, appId, decisions: triage.decisions }));
  }
  return { files: files.length, decisions, problems };
}

function main() {
  if (!existsSync(SITE_DIR)) throw new Error(`${SITE_DIR} does not exist; run after the Jekyll build`);
  const { files, decisions, problems } = buildTriage();
  if (problems.length) {
    throw new Error(`dependency triage: ${problems.length} file(s) rejected\n${problems.join('\n')}`);
  }
  console.log(`dependency triage: ${files} file(s), ${decisions} decision(s) -> ${TARGET}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
