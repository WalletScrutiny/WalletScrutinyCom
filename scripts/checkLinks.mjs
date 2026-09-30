#!/usr/bin/env node

// checkLinks.mjs — Check all frontmatter URLs in product files for broken links.
// For dead links, queries the Wayback Machine for archived versions.
//
// Usage:
//   node scripts/checkLinks.mjs [--concurrency N] [--timeout MS] [--output FILE]
//
// Outputs JSON report to stdout or --output file.

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PLATFORMS = ['_android', '_iphone', '_hardware', '_bearer', '_desktop', '_others'];
const URL_FIELDS = ['website', 'repository', 'bugbounty', 'providerWebsite', 'shop'];

// Parse args
const args = process.argv.slice(2);
let CONCURRENCY = 30;
let TIMEOUT_MS = 15000;
let OUTPUT_FILE = null;
let RESUME_FILE = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--concurrency' && args[i+1]) CONCURRENCY = parseInt(args[i+1]);
  if (args[i] === '--timeout' && args[i+1]) TIMEOUT_MS = parseInt(args[i+1]);
  if (args[i] === '--output' && args[i+1]) OUTPUT_FILE = args[i+1];
  if (args[i] === '--resume' && args[i+1]) RESUME_FILE = args[i+1];
}

// Simple frontmatter parser (no yaml dependency needed for just URLs)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const lines = match[1].split('\n');
  const result = {};
  let currentKey = null;
  let currentList = null;

  for (const line of lines) {
    // Array item
    if (line.match(/^- /) && currentKey) {
      if (!currentList) currentList = [];
      currentList.push(line.replace(/^- /, '').trim().replace(/^['"]|['"]$/g, ''));
      result[currentKey] = currentList;
      continue;
    }
    
    // Key-value
    const kvMatch = line.match(/^(\w+):\s*(.*)/);
    if (kvMatch) {
      if (currentList) currentList = null;
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim().replace(/^['"]|['"]$/g, '');
      if (val) {
        result[currentKey] = val;
      }
    }
  }
  return result;
}

// Also extract markdown links from body
function extractBodyUrls(content) {
  const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/);
  if (!bodyMatch) return [];
  const body = bodyMatch[1];
  const urls = [];
  // Markdown links: [text](url)
  const mdLinkRe = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
  let m;
  while ((m = mdLinkRe.exec(body)) !== null) {
    urls.push(m[2]);
  }
  // Bare URLs
  const bareRe = /(?<!\()(https?:\/\/[^\s<>\)]+)/g;
  while ((m = bareRe.exec(body)) !== null) {
    if (!urls.includes(m[1])) {
      urls.push(m[1]);
    }
  }
  return urls;
}

async function collectUrls() {
  const urlMap = {}; // url -> [{file, field}]
  
  for (const platform of PLATFORMS) {
    const dir = path.join(ROOT, platform);
    let files;
    try {
      files = await fs.readdir(dir);
    } catch { continue; }
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const fp = path.join(dir, file);
      const content = await fs.readFile(fp, 'utf8');
      const hdr = parseFrontmatter(content);
      if (!hdr) continue;
      
      const relPath = `${platform}/${file}`;
      
      // Frontmatter URL fields
      for (const field of URL_FIELDS) {
        const val = hdr[field];
        if (typeof val === 'string' && val.startsWith('http')) {
          if (!urlMap[val]) urlMap[val] = [];
          urlMap[val].push({ file: relPath, field });
        }
      }
      
      // Social array
      if (Array.isArray(hdr.social)) {
        for (const item of hdr.social) {
          if (typeof item === 'string' && item.startsWith('http')) {
            if (!urlMap[item]) urlMap[item] = [];
            urlMap[item].push({ file: relPath, field: 'social' });
          }
        }
      }
      
      // Body URLs
      const bodyUrls = extractBodyUrls(content);
      for (const url of bodyUrls) {
        if (!urlMap[url]) urlMap[url] = [];
        urlMap[url].push({ file: relPath, field: 'body' });
      }
    }
  }
  
  return urlMap;
}

// Check a single URL. Returns { url, status, statusCode, error, redirectUrl }
async function checkUrl(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    // Try HEAD first (faster)
    let res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WalletScrutiny-LinkChecker/1.0)',
        'Accept': '*/*',
      },
    });
    
    // Some servers reject HEAD, retry with GET
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WalletScrutiny-LinkChecker/1.0)',
          'Accept': 'text/html,*/*',
        },
      });
    }
    
    clearTimeout(timer);
    
    const result = {
      url,
      statusCode: res.status,
      status: res.ok ? 'ok' : 'error',
    };
    
    if (res.url !== url) {
      result.redirectUrl = res.url;
    }
    
    return result;
  } catch (err) {
    clearTimeout(timer);
    
    if (err.name === 'AbortError') {
      return { url, status: 'timeout', error: 'Request timed out' };
    }
    
    const msg = err.cause?.code || err.message || String(err);
    return { url, status: 'error', error: msg };
  }
}

// Check Wayback Machine for an archived version
async function checkWayback(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  
  try {
    const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WalletScrutiny-LinkChecker/1.0' },
    });
    clearTimeout(timer);
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const snapshot = data?.archived_snapshots?.closest;
    if (snapshot?.available) {
      return snapshot.url;
    }
    return null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// Run tasks with concurrency limit
async function runWithConcurrency(tasks, limit) {
  const results = [];
  let index = 0;
  
  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }
  
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.error('Collecting URLs from product files...');
  const urlMap = await collectUrls();
  const allUrls = Object.keys(urlMap);
  console.error(`Found ${allUrls.length} unique URLs across ${Object.values(urlMap).flat().length} references`);
  
  // Load resume data if available
  let checked = {};
  if (RESUME_FILE) {
    try {
      const resumeData = JSON.parse(await fs.readFile(RESUME_FILE, 'utf8'));
      if (resumeData.results) {
        for (const r of resumeData.results) {
          checked[r.url] = r;
        }
        console.error(`Resumed ${Object.keys(checked).length} previously checked URLs`);
      }
    } catch {}
  }
  
  // Filter out already-checked URLs
  const toCheck = allUrls.filter(u => !checked[u]);
  console.error(`Checking ${toCheck.length} URLs (concurrency: ${CONCURRENCY})...`);
  
  let done = 0;
  const startTime = Date.now();
  
  const tasks = toCheck.map(url => async () => {
    const result = await checkUrl(url);
    done++;
    if (done % 100 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const rate = (done / (Date.now() - startTime) * 1000).toFixed(1);
      console.error(`  ${done}/${toCheck.length} checked (${elapsed}s, ${rate}/s)`);
    }
    return result;
  });
  
  const results = await runWithConcurrency(tasks, CONCURRENCY);
  
  // Merge with resumed data
  for (const r of results) {
    checked[r.url] = r;
  }
  
  // Separate broken links
  const broken = [];
  const ok = [];
  const timeouts = [];
  
  for (const url of allUrls) {
    const r = checked[url];
    if (!r) continue;
    r.references = urlMap[url];
    
    if (r.status === 'ok') {
      ok.push(r);
    } else if (r.status === 'timeout') {
      timeouts.push(r);
    } else {
      broken.push(r);
    }
  }
  
  console.error(`\nResults: ${ok.length} ok, ${broken.length} broken, ${timeouts.length} timeouts`);
  
  // For broken links, check Wayback Machine
  if (broken.length > 0) {
    console.error(`\nChecking Wayback Machine for ${broken.length} broken URLs...`);
    let wbDone = 0;
    
    const wbTasks = broken.map(r => async () => {
      r.archiveUrl = await checkWayback(r.url);
      wbDone++;
      if (wbDone % 50 === 0) {
        console.error(`  Wayback: ${wbDone}/${broken.length}`);
      }
    });
    
    await runWithConcurrency(wbTasks, 10);  // Lower concurrency for archive.org
    
    const withArchive = broken.filter(r => r.archiveUrl);
    const noArchive = broken.filter(r => !r.archiveUrl);
    console.error(`  ${withArchive.length} have archive.org snapshots, ${noArchive.length} have none`);
  }
  
  // Build report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUrls: allUrls.length,
      ok: ok.length,
      broken: broken.length,
      timeouts: timeouts.length,
      withArchive: broken.filter(r => r.archiveUrl).length,
    },
    broken: broken.sort((a, b) => (b.references?.length || 0) - (a.references?.length || 0)),
    timeouts: timeouts.sort((a, b) => (b.references?.length || 0) - (a.references?.length || 0)),
    results: [...ok, ...broken, ...timeouts],  // Full data for resume
  };
  
  const json = JSON.stringify(report, null, 2);
  
  if (OUTPUT_FILE) {
    await fs.writeFile(OUTPUT_FILE, json);
    console.error(`\nReport written to ${OUTPUT_FILE}`);
  } else {
    console.log(json);
  }
  
  // Print summary to stderr
  console.error('\n=== BROKEN LINKS SUMMARY ===');
  for (const r of report.broken.slice(0, 50)) {
    const archiveTag = r.archiveUrl ? ' [ARCHIVED]' : ' [NO ARCHIVE]';
    const refs = r.references?.map(ref => ref.file).join(', ') || '?';
    console.error(`  ${r.statusCode || r.error || '???'} ${r.url}${archiveTag}`);
    console.error(`      → ${refs}`);
  }
  if (report.broken.length > 50) {
    console.error(`  ... and ${report.broken.length - 50} more`);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
