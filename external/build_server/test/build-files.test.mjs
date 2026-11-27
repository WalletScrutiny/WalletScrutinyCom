import './setup.mjs';
import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readBuildFileSync } from '../build-files.mjs';
import { readComparisonResults, uploadBuildLock } from '../verifications.mjs';

const tempDirs = [];
function makeTempDir(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `abs-build-files-${label}-`));
  tempDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true });
});

// A file only ABS can read, standing in for the bot key or a credential.
function makeSecret() {
  const dir = makeTempDir('secret');
  const file = path.join(dir, 'COMPARISON_RESULTS.yaml');
  fs.writeFileSync(file, 'verdict: SECRET-CANARY\n');
  const lockDir = path.join(dir, 'build-lock');
  fs.mkdirSync(lockDir);
  fs.writeFileSync(path.join(lockDir, 'build-lock.json'), 'SECRET-CANARY');
  return { dir, file };
}

describe('readBuildFileSync', () => {
  test('reads a regular file inside the build folder', () => {
    const buildDir = makeTempDir('plain');
    fs.writeFileSync(path.join(buildDir, 'a.txt'), 'hello');
    assert.equal(readBuildFileSync(buildDir, path.join(buildDir, 'a.txt'), { encoding: 'utf8' }), 'hello');
  });

  test('refuses a planted symlink to a secret', () => {
    const buildDir = makeTempDir('symlink');
    const { file } = makeSecret();
    fs.symlinkSync(file, path.join(buildDir, 'COMPARISON_RESULTS.yaml'));
    assert.throws(() => readBuildFileSync(buildDir, path.join(buildDir, 'COMPARISON_RESULTS.yaml')), /ELOOP|symbolic link/);
  });

  test('refuses a file reached through a symlinked folder', () => {
    const buildDir = makeTempDir('symlinked-parent');
    const { dir } = makeSecret();
    fs.symlinkSync(dir, path.join(buildDir, 'run'));
    assert.throws(() => readBuildFileSync(buildDir, path.join(buildDir, 'run', 'COMPARISON_RESULTS.yaml')), /outside/);
  });

  test('refuses a hard link', () => {
    const buildDir = makeTempDir('hardlink');
    const other = path.join(buildDir, 'other');
    fs.writeFileSync(other, 'x');
    fs.linkSync(other, path.join(buildDir, 'COMPARISON_RESULTS.yaml'));
    assert.throws(() => readBuildFileSync(buildDir, path.join(buildDir, 'COMPARISON_RESULTS.yaml')), /2 links/);
  });

  test('refuses a FIFO without blocking on it', () => {
    const buildDir = makeTempDir('fifo');
    const fifo = path.join(buildDir, 'COMPARISON_RESULTS.yaml');
    execFileSync('mkfifo', [fifo]);
    assert.throws(() => readBuildFileSync(buildDir, fifo), /not a regular file/);
  });

  test('refuses a file larger than maxBytes', () => {
    const buildDir = makeTempDir('big');
    fs.writeFileSync(path.join(buildDir, 'big'), Buffer.alloc(2048));
    assert.throws(() => readBuildFileSync(buildDir, path.join(buildDir, 'big'), { maxBytes: 1024 }), /larger than 1024/);
  });
});

describe('files ABS reads from a build folder', () => {
  test('a planted symlink as COMPARISON_RESULTS.yaml or build-lock.json is not read', async () => {
    const buildDir = makeTempDir('planted');
    const { file, dir } = makeSecret();
    fs.symlinkSync(file, path.join(buildDir, 'COMPARISON_RESULTS.yaml'));
    fs.mkdirSync(path.join(buildDir, 'build-lock'));
    fs.symlinkSync(path.join(dir, 'build-lock', 'build-lock.json'), path.join(buildDir, 'build-lock', 'build-lock.json'));
    assert.equal(readComparisonResults(buildDir), undefined);
    let uploads = 0;
    assert.equal(await uploadBuildLock(buildDir, async () => { uploads += 1; return 'x'; }), null);
    assert.equal(uploads, 0);
  });

  // A leftover process keeps swapping the file, and separately a folder on the
  // way to it, between a real one and a link to the secret, while ABS reads.
  // A check-then-read leaks here; reading the opened file must never.
  test('a process swapping the files for links during the reads never gets the secret read', async () => {
    const buildDir = makeTempDir('race');
    const { file, dir } = makeSecret();
    const flipper = spawn(process.execPath, ['-e', `
      const fs = require('fs'), path = require('path');
      const [buildDir, secretFile, secretDir] = process.argv.slice(1);
      const yaml = path.join(buildDir, 'COMPARISON_RESULTS.yaml');
      const run = path.join(buildDir, 'run');
      const parked = path.join(buildDir, 'run-parked');
      fs.mkdirSync(path.join(run, 'build-lock'), { recursive: true });
      fs.writeFileSync(path.join(run, 'build-lock', 'build-lock.json'), '{"lock":1}');
      for (let i = 0; ; i++) {
        const tmp = path.join(buildDir, '.tmp');
        try { fs.rmSync(tmp, { force: true }); } catch {}
        if (i % 2) fs.symlinkSync(secretFile, tmp); else fs.writeFileSync(tmp, 'verdict: reproducible\\n');
        fs.renameSync(tmp, yaml);
        // run/ is a real folder, then briefly a link to the secret's folder.
        if (i % 2) { fs.renameSync(run, parked); fs.symlinkSync(secretDir, run); }
        else if (fs.existsSync(parked)) { fs.unlinkSync(run); fs.renameSync(parked, run); }
      }
    `, buildDir, file, dir], { stdio: 'ignore' });
    try {
      // Let the flipper create both names first.
      for (let i = 0; i < 200 && !(fs.existsSync(path.join(buildDir, 'run')) || fs.existsSync(path.join(buildDir, 'COMPARISON_RESULTS.yaml'))); i++) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      let reads = 0;
      let verdicts = 0;
      let locks = 0;
      const leaks = [];
      const deadline = Date.now() + 1500;
      while (Date.now() < deadline) {
        reads += 1;
        const verdict = readComparisonResults(buildDir)?.verdict;
        if (verdict === 'reproducible') verdicts += 1;
        if (verdict && verdict !== 'reproducible') leaks.push(verdict);
        await uploadBuildLock(buildDir, async (uploaded) => {
          const text = await uploaded.text();
          if (text.includes('SECRET-CANARY')) leaks.push(text); else locks += 1;
          return 'x';
        });
      }
      assert.deepEqual(leaks, []);
      // The race was real: the harmless files were read many times.
      assert.ok(verdicts > 20 && locks > 0, `reads=${reads} verdicts=${verdicts} locks=${locks}`);
    } finally {
      flipper.kill('SIGKILL');
    }
  });
});
