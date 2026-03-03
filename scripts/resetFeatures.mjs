#!/usr/bin/env node
/**
 * resetFeatures.mjs
 *
 * Removes all features and featureEvidence includes from product reviews.
 * Used to reset the repository before a fresh feature verification run.
 *
 * Usage: node scripts/resetFeatures.mjs [--apply]
 *   (default: dry run, shows what would change)
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

const APPLY = process.argv.includes('--apply');

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try { return { fm: yaml.load(m[1]), raw: m[1], fullMatch: m[0] }; } catch { return null; }
}

function getReviewBody(content) {
  const m = content.match(/^---\n[\s\S]*?\n---\s*\n/);
  return m ? content.slice(m[0].length) : '';
}

function stripFeaturesFromFrontmatter(fmRaw) {
  // Remove features: block from YAML frontmatter
  return fmRaw.replace(/\nfeatures:\s*\n(- .+\n)*/g, '\n');
}

function stripFeatureEvidence(body) {
  // Remove all {% include featureEvidence.html ... %} lines
  return body.replace(/\n*\{% include featureEvidence\.html[^%]*%\}\n*/g, '\n\n');
}

let totalFixed = 0, totalProducts = 0, skipped = 0;

for (const [plat, folder] of Object.entries(PLATFORMS)) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) continue;

  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.md')) continue;
    const filepath = path.join(dir, fn);
    const content = fs.readFileSync(filepath, 'utf8');
    const parsed = parseFrontmatter(content);
    if (!parsed) { skipped++; continue; }

    const { fm, raw, fullMatch } = parsed;
    const body = getReviewBody(content);
    
    const hasFeatures = fm && fm.features && Array.isArray(fm.features) && fm.features.length > 0;
    const hasEvidence = body.includes('{% include featureEvidence.html');
    
    if (!hasFeatures && !hasEvidence) { skipped++; continue; }

    totalProducts++;
    const cleanedFm = stripFeaturesFromFrontmatter(raw);
    const cleanedBody = stripFeatureEvidence(body);
    const newContent = `---\n${cleanedFm.trim()}\n---\n\n${cleanedBody.trim()}\n`;

    if (APPLY) {
      fs.writeFileSync(filepath, newContent, 'utf8');
      console.log(`✓ ${plat}/${fn}: removed ${hasFeatures ? 'features list' : ''}${hasFeatures && hasEvidence ? ' + ' : ''}${hasEvidence ? 'evidence includes' : ''}`);
      totalFixed++;
    } else {
      console.log(`Would clean ${plat}/${fn}: ${hasFeatures ? fm.features.length + ' features' : ''}${hasFeatures && hasEvidence ? ', ' : ''}${hasEvidence ? 'evidence includes' : ''}`);
      if (hasFeatures) console.log(`  Features: ${fm.features.join(', ')}`);
    }
  }
}

console.log(`\n${APPLY ? 'Fixed' : 'Would fix'}: ${totalFixed} products, Skipped: ${skipped}`);
if (!APPLY) {
  console.log('Run with --apply to execute changes');
}
