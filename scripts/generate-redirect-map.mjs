#!/usr/bin/env node
/**
 * Write redirects.map (an nginx `map` body) from every page's `redirect_from`
 * front matter. Runs before Jekyll (see build.mjs); Jekyll copies the file to
 * _site/redirects.map and nginx includes it from the web root, see
 * external/configs/webserver_nginx/redirects-maps.conf.
 *
 * This replaces jekyll-redirect-from: instead of one "Redirecting…" stub page
 * (HTTP 200 + meta refresh) per old URL, nginx answers a real 301 from an
 * in-memory hash table.
 *
 * Rules:
 * - every key gets a trailing slash so it matches the normalised $uri;
 * - nginx map keys are case-insensitive, so sources that differ only by case
 *   are emitted as case-sensitive regex keys instead of plain strings;
 * - the same source pointing at two different targets fails the build, because
 *   nginx would reject the file at reload time and the deploy would go live
 *   with a stale map.
 *
 * Page URLs follow the site's permalink scheme: collections use
 * /:collection/:path/ (_config.yml), pages use their `permalink:` front matter.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'redirects.map');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

function normalise(p) {
  let out = String(p).trim();
  if (!out.startsWith('/')) out = `/${out}`;
  if (!out.endsWith('/')) out = `${out}/`;
  return out;
}

function* markdownFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* markdownFiles(full);
    else if (/\.(md|markdown|html)$/.test(entry.name)) yield full;
  }
}

/** Every rendered page with its URL: collections with `output: true`, plus pages with an explicit permalink. */
function* pages() {
  const config = yaml.load(fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8'));
  for (const [name, settings] of Object.entries(config.collections || {})) {
    if (!settings || !settings.output) continue;
    const dir = path.join(ROOT, `_${name}`);
    if (!fs.existsSync(dir)) continue;
    for (const file of markdownFiles(dir)) {
      const fm = parseFrontmatter(fs.readFileSync(file, 'utf8'));
      if (!fm) continue;
      const rel = path.relative(dir, file).replace(/\.[^.]+$/, '');
      const url = fm.permalink ? normalise(fm.permalink) : `/${name}/${rel.split(path.sep).join('/')}/`;
      yield { file: path.relative(ROOT, file), url, fm };
    }
  }
  for (const dir of ['_pages', '.']) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    const files = dir === '.'
      ? fs.readdirSync(full).filter((f) => /\.(md|markdown|html)$/.test(f)).map((f) => path.join(full, f))
      : [...markdownFiles(full)];
    for (const file of files) {
      const fm = parseFrontmatter(fs.readFileSync(file, 'utf8'));
      if (!fm || !fm.redirect_from) continue;
      if (!fm.permalink) {
        throw new Error(`${path.relative(ROOT, file)} has redirect_from but no permalink; add one so its URL is known`);
      }
      yield { file: path.relative(ROOT, file), url: normalise(fm.permalink), fm };
    }
  }
}

function collect() {
  const targets = new Map(); // source -> target
  for (const { file, url, fm } of pages()) {
    const list = Array.isArray(fm.redirect_from) ? fm.redirect_from : (fm.redirect_from ? [fm.redirect_from] : []);
    for (const from of list) {
      const source = normalise(from);
      if (targets.has(source) && targets.get(source) !== url) {
        throw new Error(`redirect_from ${source} points at both ${targets.get(source)} and ${url} (${file})`);
      }
      targets.set(source, url);
    }
  }
  return [...targets.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

function render(entries) {
  const byFold = new Map();
  for (const [source] of entries) {
    const key = source.toLowerCase();
    byFold.set(key, (byFold.get(key) || 0) + 1);
  }
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = entries.map(([source, target]) => (
    byFold.get(source.toLowerCase()) > 1
      ? `"~^${escapeRegex(source)}$" "${target}";` // case-only collision: `~` keys are case-sensitive
      : `"${source}" "${target}";`
  ));
  return `${lines.join('\n')}\n`;
}

try {
  const entries = collect();
  fs.writeFileSync(OUTPUT, render(entries));
  console.log(`redirects.map: ${entries.length} redirects`);
} catch (err) {
  console.error(`redirects.map: ${err.message}`);
  process.exit(1);
}
