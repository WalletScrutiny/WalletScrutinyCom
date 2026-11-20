#!/usr/bin/env node
/**
 * cleanUndefinedFeatures.mjs
 *
 * Finds all product .md files that have feature keys not defined in _data/features.yml.
 * Moves undefined keys out of the frontmatter `features:` array and appends them
 * as a freeform comment block at the top of the review body, so the information
 * is preserved but doesn't break anything.
 *
 * Usage: node scripts/cleanUndefinedFeatures.mjs [--apply]
 *   (default: dry run, shows what would change)
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FEATURES_YML = path.join(ROOT, '_data', 'features.yml');
const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

const APPLY = process.argv.includes('--apply');

const featuresData = yaml.load(fs.readFileSync(FEATURES_YML, 'utf8'));
const validKeys = new Set(Object.keys(featuresData));

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try { return { fm: yaml.load(m[1]), raw: m[1], fullMatch: m[0] }; } catch { return null; }
}

function getReviewBody(content) {
  const m = content.match(/^---\n[\s\S]*?\n---\s*\n/);
  return m ? content.slice(m[0].length) : '';
}

let totalFixed = 0, totalProducts = 0;

for (const [plat, folder] of Object.entries(PLATFORMS)) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) continue;

  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.md')) continue;
    const filepath = path.join(dir, fn);
    const content = fs.readFileSync(filepath, 'utf8');
    const parsed = parseFrontmatter(content);
    if (!parsed) continue;

    const { fm } = parsed;
    if (!fm || !Array.isArray(fm.features) || fm.features.length === 0) continue;

    const validFeats = fm.features.filter(f => typeof f === 'string' && validKeys.has(f));
    const unknownFeats = fm.features.filter(f => typeof f === 'string' && !validKeys.has(f));
    // Keep non-string entries (objects with evidence) as-is
    const objectEntries = fm.features.filter(f => typeof f !== 'string');

    if (unknownFeats.length === 0) continue;

    totalProducts++;
    totalFixed += unknownFeats.length;
    const productId = `${plat}/${fn.slice(0, -3)}`;

    console.log(`\n${productId}`);
    console.log(`  Moving to freeform: ${unknownFeats.join(', ')}`);
    console.log(`  Keeping: ${validFeats.join(', ') || '(none)'}`);

    if (!APPLY) continue;

    // Update frontmatter
    fm.features = [...validFeats, ...objectEntries];
    if (fm.features.length === 0) delete fm.features;

    // Build freeform comment block
    const freeformBlock = `<!-- undefined-features: ${unknownFeats.join(', ')} -->\n`;

    // Rebuild file
    const reviewBody = getReviewBody(content);
    const newFm = yaml.dump(fm, { lineWidth: 120, quotingType: '"', forceQuotes: false }).trim();
    const newContent = `---\n${newFm}\n---\n\n${freeformBlock}${reviewBody.trimStart()}`;

    fs.writeFileSync(filepath, newContent);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Products affected: ${totalProducts}`);
console.log(`Undefined keys moved: ${totalFixed}`);
if (!APPLY) console.log('\nDry run — pass --apply to make changes');
else console.log('\nApplied!');
