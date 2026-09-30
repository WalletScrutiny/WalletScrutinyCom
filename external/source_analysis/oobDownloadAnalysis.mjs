import fs from 'fs';
import path from 'path';

/**
 * Test 11: Out-of-band download detection.
 *
 * Statically finds build inputs that arrive OUTSIDE the package manager:
 * curl/wget in shell scripts, Dockerfiles and CI configs, cmake
 * FetchContent/ExternalProject/file(DOWNLOAD), git clones of foreign repos,
 * and container base images (FROM lines). Nothing from the repository is
 * executed. Each finding is graded on:
 *   hashCheck  - is there content-hash evidence near the download
 *                (sha256sum --check, EXPECTED_HASH/URL_HASH, @sha256: digest,
 *                a 64-hex literal, or a 40-hex commit checkout for clones)?
 *   stability  - does the URL look immutable (release asset, hash-addressed)
 *                or rolling (continuous/latest/nightly/branch HEAD)?
 *
 * Known blind spot, by design: dynamically-constructed URLs and fetches done
 * by code that only runs at build time. Static analysis cannot see those;
 * they are reported nowhere rather than guessed at.
 */

const IGNORED_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'Pods', 'vendor', 'temp_repos']);
const MAX_SCAN_DEPTH = 4;
const HASH_EVIDENCE_WINDOW = 6; // lines before/after a finding searched for hash evidence

const SCAN_FILE_RE = /^(Dockerfile.*|.*\.(sh|bash|yml|yaml|cmake|mk|ps1)|Makefile.*|CMakeLists\.txt|.*\.gitlab-ci\.yml)$/;

const URL_RE = /https?:\/\/[^\s"'`)\]}>\\]+/g;

const ROLLING_URL_RE = /\/(continuous|latest|nightly|snapshot)\b|\/(master|main|trunk|HEAD)\//i;
const IMMUTABLE_URL_RE = /\/releases\/download\/(?!continuous)|files\.pythonhosted\.org|@sha256:|[0-9a-f]{40}/i;

const HASH_EVIDENCE_RE = /sha(256|512)sum\s+(-c|--check)|shasum\s+-a\s*(256|512)|EXPECTED_HASH|URL_HASH|--hash[= ]|@sha256:|integrity|\b[0-9a-f]{64}\b/;
const COMMIT_EVIDENCE_RE = /\b[0-9a-f]{40}\b|--revision|checkout\s+[0-9a-f]{7,}/;

function findFiles(rootPath, depth = 0, results = []) {
  if (depth > MAX_SCAN_DEPTH) return results;
  let entries;
  try {
    entries = fs.readdirSync(rootPath, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) findFiles(full, depth + 1, results);
    } else if (SCAN_FILE_RE.test(entry.name) || full.includes(`${path.sep}.github${path.sep}workflows${path.sep}`)) {
      results.push(full);
    }
  }
  return results;
}

/** Join backslash-continued lines so one command is one logical line; remember
 *  the first physical line number of each. */
function logicalLines(text) {
  const out = [];
  const physical = text.split('\n');
  let buf = '', startLine = 1;
  for (let i = 0; i < physical.length; i++) {
    const line = physical[i];
    if (!buf) startLine = i + 1;
    if (/\\\s*$/.test(line)) {
      buf += line.replace(/\\\s*$/, ' ');
      continue;
    }
    out.push({ line: startLine, text: buf + line });
    buf = '';
  }
  if (buf) out.push({ line: startLine, text: buf });
  return out;
}

function classifyCommand(text) {
  if (/^\s*FROM\s+/i.test(text)) return 'container-base-image';
  if (/\bcurl\b/.test(text)) return 'curl';
  if (/\bwget\b/.test(text)) return 'wget';
  if (/\bgit\s+clone\b/.test(text)) return 'git-clone';
  if (/FetchContent_Declare|ExternalProject_Add/i.test(text)) return 'cmake-fetch';
  if (/file\s*\(\s*DOWNLOAD/i.test(text)) return 'cmake-file-download';
  if (/\bpip3?\s+install\b.*(https?:\/\/|git\+)/.test(text)) return 'pip-url-install';
  return null;
}

function stabilityOf(url) {
  if (ROLLING_URL_RE.test(url)) return 'rolling';
  if (IMMUTABLE_URL_RE.test(url)) return 'immutable-ish';
  return 'unspecified';
}

function relative(repoPath, file) {
  return path.relative(repoPath, file) || '.';
}

export function analyzeOobDownloads(repoPath) {
  console.log('\n--- Test 11: Out-of-band download detection (static, nothing executed) ---');
  const files = findFiles(repoPath);
  const findings = [];

  for (const file of files) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    if (text.length > 2_000_000) continue; // generated/vendored monsters
    // Multi-stage Dockerfiles: FROM <stage-name> references an earlier stage in
    // the same file, not a registry pull — collect stage names to skip them.
    const stageNames = new Set(
      [...text.matchAll(/^\s*FROM\s+(?:--platform=\S+\s+)?\S+\s+AS\s+(\S+)/gim)].map(m => m[1].toLowerCase()));
    const lines = logicalLines(text);
    for (let i = 0; i < lines.length; i++) {
      const { line, text: raw } = lines[i];
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;
      const kind = classifyCommand(raw);
      if (!kind) continue;

      const urls = [...new Set(raw.match(URL_RE) || [])]
        .filter(u => !/^https?:\/\/(www\.)?(github\.com\/[^/]+\/[^/]+\/?$|example\.|localhost)/.test(u));
      let ref = null;
      if (kind === 'container-base-image') {
        const m = raw.match(/^\s*FROM\s+(?:--platform=\S+\s+)?(\S+)/i);
        if (m && !/^scratch$/i.test(m[1]) && !stageNames.has(m[1].toLowerCase())) ref = m[1];
        if (!ref) continue;
      } else if (!urls.length && !/git\+/.test(raw)) {
        continue;
      }

      // Hash evidence: on the logical line itself or within a few neighbours.
      const windowText = lines
        .slice(Math.max(0, i - HASH_EVIDENCE_WINDOW), i + HASH_EVIDENCE_WINDOW + 1)
        .map(l => l.text)
        .join('\n');
      const evidenceRe = kind === 'git-clone' ? COMMIT_EVIDENCE_RE : HASH_EVIDENCE_RE;
      const hashCheck = evidenceRe.test(kind === 'container-base-image' ? raw : windowText);

      const targets = kind === 'container-base-image' ? [ref] : (urls.length ? urls : ['(git+ url)']);
      for (const target of targets) {
        findings.push({
          file: relative(repoPath, file),
          line,
          kind,
          target: target.length > 140 ? target.slice(0, 140) + '…' : target,
          hashCheck,
          stability: kind === 'container-base-image'
            ? (/@sha256:/.test(target) ? 'immutable-ish' : 'rolling')
            : stabilityOf(target),
        });
      }
    }
  }

  // Dedup identical (file, target) pairs that appear on multiple lines.
  const seen = new Set();
  const unique = findings.filter(f => {
    const key = `${f.file}|${f.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!unique.length) {
    console.log('No out-of-band downloads found in Dockerfiles, shell scripts, CI configs, cmake or make files.');
    console.log('(Blind spot: dynamically-constructed URLs and fetches performed by build-time code are not visible statically.)');
    return unique;
  }

  const unpinned = unique.filter(f => !f.hashCheck);
  const rollingPinned = unique.filter(f => f.hashCheck && f.stability === 'rolling');
  console.log(`Found ${unique.length} out-of-band build input(s): ` +
    `${unique.length - unpinned.length} with hash/commit evidence nearby, ${unpinned.length} without.`);
  if (rollingPinned.length) {
    console.log(`NOTE: ${rollingPinned.length} hash-checked download(s) point at ROLLING URLs — the pin can go stale ` +
      'and the original bytes become unavailable (integrity without availability).');
  }
  for (const f of unique) {
    const grade = f.hashCheck ? 'hash/commit-checked' : 'UNPINNED';
    console.log(`  [${grade} | ${f.stability}] ${f.kind} ${f.target}`);
    console.log(`      at ${f.file}:${f.line}`);
  }
  console.log('(Blind spot: dynamically-constructed URLs and fetches performed by build-time code are not visible statically.)');
  return unique;
}
