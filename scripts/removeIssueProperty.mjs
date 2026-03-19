#!/usr/bin/env node
/**
 * removeIssueProperty.mjs
 *
 * Finds all .md files in folders starting with _ and removes the `issue` property
 * from the YAML frontmatter.
 * If `issue` contains a URL, it is removed and the following line is appended
 * at the end of the body: "An issue has been opened at <url>".
 *
 * Usage: node scripts/removeIssueProperty.mjs [--apply]
 *   (default: dry run, shows what would change)
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const APPLY = process.argv.includes('--apply');

const issueLineRegex = /^issue:.*$/m;
const issueWithValueRegex = /^issue:[ \t]*\S/m;
const issueValueRegex = /^issue:[ \t]*(.*)$/m;
const urlRegex = /(https?:\/\/[^\s'"]+)/;

function getUnderscoreFolders() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name.startsWith('_'))
    .map((e) => path.join(ROOT, e.name));
}

function getMdFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...getMdFiles(fullPath));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return { frontmatter: m[1], fullMatch: m[0], rest: content.slice(m[0].length) };
}

function removeIssueFromFrontmatter(fmContent) {
  const lines = fmContent.split('\n');
  const filtered = lines.filter((line) => !issueLineRegex.test(line));
  return filtered.join('\n');
}

let totalModified = 0;
let totalScanned = 0;

const folders = getUnderscoreFolders();

for (const folder of folders) {
  if (!fs.existsSync(folder)) continue;

  const mdFiles = getMdFiles(folder);

  for (const filepath of mdFiles) {
    totalScanned++;
    const content = fs.readFileSync(filepath, 'utf8');
    const parsed = parseFrontmatter(content);

    if (!parsed) continue;

    const hasIssue = issueLineRegex.test(parsed.frontmatter);
    if (!hasIssue) continue;

    const hasIssueValue = issueWithValueRegex.test(parsed.frontmatter);
    if (!hasIssueValue) continue;

    const newFrontmatter = removeIssueFromFrontmatter(parsed.frontmatter);
    let newBody = parsed.rest;
    const issueValueMatch = parsed.frontmatter.match(issueValueRegex);
    const issueValue = issueValueMatch?.[1]?.trim();
    const urlMatch = issueValue?.match(urlRegex);
    const issueUrl = urlMatch?.[1] ?? null;

    if (issueUrl) {
      const trimmedBody = parsed.rest.replace(/\s*$/, '');
      const issueUrlLink = `[${issueUrl}](${issueUrl})`;
      const lineToAppend = `An issue has been opened at ${issueUrlLink}`;
      // Avoid duplicating if the script is re-run.
      if (!trimmedBody.includes(lineToAppend)) {
        newBody = `${trimmedBody}\n\n${lineToAppend}\n`;
      } else {
        newBody = `${trimmedBody}\n`;
      }
    }

    const newContent = '---\n' + newFrontmatter + '\n---' + newBody;

    const relPath = path.relative(ROOT, filepath);
    console.log(APPLY ? 'Modified: ' : 'Would modify: ', relPath);

    if (APPLY) {
      fs.writeFileSync(filepath, newContent, 'utf8');
      totalModified++;
    } else {
      totalModified++;
    }
  }
}

console.log('');
console.log('Scanned', totalScanned, 'files in', folders.length, 'underscore folders');
console.log(APPLY ? 'Modified' : 'Would modify', totalModified, 'files');
if (!APPLY && totalModified > 0) {
  console.log('Run with --apply to apply changes');
}
