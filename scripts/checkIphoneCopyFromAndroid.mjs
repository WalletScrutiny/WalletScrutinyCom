#!/usr/bin/env node
/**
 * For each _iphone wallet markdown file whose wsId also exists on some _android
 * file, report iPhone files that omit the copyFromAndroid include token and
 * have a post-frontmatter body of at most SHORT_BODY_MAX_CHARS characters
 * (after trim; see constant below).
 *
 * Usage: node scripts/checkIphoneCopyFromAndroid.mjs
 * Optional: --root /path/to/repo  (defaults to parent of this script directory)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Trimmed body length must exceed this value to count as non-short.
const SHORT_BODY_MAX_CHARS = 30;

function parseArgs (argv) {
  let root = path.resolve(__dirname, '..');
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) {
      root = path.resolve(argv[i + 1]);
      i++;
    }
  }
  return { root };
}

function splitFrontmatter (content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
    return { frontmatter: null, body: content };
  }
  const rest = content.replace(/^---\r?\n/, '');
  const end = rest.search(/\r?\n---\r?\n/);
  if (end === -1) {
    return { frontmatter: null, body: content };
  }
  const frontmatter = rest.slice(0, end);
  const body = rest.slice(end).replace(/^\r?\n---\r?\n/, '');
  return { frontmatter, body };
}

function extractWsId (frontmatter) {
  if (!frontmatter) return null;
  // Only horizontal whitespace after "wsId:"; JS \s includes newlines and would
  // swallow the line break after an empty value and capture the next line.
  const m = frontmatter.match(/^wsId:[ \t]*([^\n\r]*)$/m);
  if (!m) return null;
  let v = m[1].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v || null;
}

async function listMdFiles (dir) {
  const names = await fs.readdir(dir);
  return names.filter((n) => n.endsWith('.md')).map((n) => path.join(dir, n));
}

async function main () {
  const { root } = parseArgs(process.argv);
  const iphoneDir = path.join(root, '_iphone');
  const androidDir = path.join(root, '_android');

  const androidByWsId = new Map();
  for (const file of await listMdFiles(androidDir)) {
    const raw = await fs.readFile(file, 'utf8');
    const { frontmatter } = splitFrontmatter(raw);
    const wsId = extractWsId(frontmatter);
    if (!wsId) continue;
    if (!androidByWsId.has(wsId)) androidByWsId.set(wsId, []);
    androidByWsId.get(wsId).push(path.relative(root, file));
  }

  const issues = [];
  for (const file of await listMdFiles(iphoneDir)) {
    const raw = await fs.readFile(file, 'utf8');
    const { frontmatter, body } = splitFrontmatter(raw);
    const wsId = extractWsId(frontmatter);
    if (!wsId || !androidByWsId.has(wsId)) continue;

    const hasCopyToken = raw.includes('copyFromAndroid');
    const bodyLen = body.trim().length;
    const shortBody = bodyLen <= SHORT_BODY_MAX_CHARS;
    if (!hasCopyToken && shortBody) {
      const rel = path.relative(root, file);
      const androidRefs = androidByWsId.get(wsId).join(', ');
      const reasons = [
        'missing copyFromAndroid token',
        `body length ${bodyLen} (need >${SHORT_BODY_MAX_CHARS})`,
      ];
      issues.push({
        file: rel,
        wsId,
        androidRefs,
        reasons,
      });
    }
  }

  issues.sort((a, b) => a.file.localeCompare(b.file));

  if (issues.length === 0) {
    console.log(
      'No iPhone files with a matching Android wsId violate both copyFromAndroid and short-body rules.'
    );
    process.exit(0);
  }

  console.log(
    `Found ${issues.length} iPhone file(s) with matching Android wsId, missing copyFromAndroid, and short body (<=${SHORT_BODY_MAX_CHARS} chars):\n`
  );
  for (const row of issues) {
    console.log(`${row.file}`);
    console.log(`  wsId: ${row.wsId}`);
    console.log(`  android: ${row.androidRefs}`);
    console.log(`  ${row.reasons.join('; ')}`);
    console.log('');
  }

  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
