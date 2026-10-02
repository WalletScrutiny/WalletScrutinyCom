// Parallel passes: at most `limit` jobs in flight, results in list order, a
// failing job stops nothing, and every log line of a job (its container's
// output included) carries the job's tag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { runPool, tagConsole } from '../pool.mjs';
import { runInContainer } from '../containerRunner.mjs';

const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Captured console output (tagConsole wraps whatever console.log is at the time).
const lines = [];
console.log = (...args) => lines.push(args.join(' '));
console.error = (...args) => lines.push(args.join(' '));
tagConsole();

test('runPool: never more than `limit` in flight, results in list order, errors returned', async () => {
  let inFlight = 0;
  let peak = 0;
  const results = await runPool([1, 2, 3, 4, 5, 6, 7], 3, async (n) => {
    inFlight++;
    peak = Math.max(peak, inFlight);
    await sleep(n % 2 ? 30 : 10);
    inFlight--;
    if (n === 4) throw new Error('four failed');
    return n * 10;
  });
  assert.equal(peak, 3);
  assert.deepEqual(results.slice(0, 3), [10, 20, 30]);
  assert.match(results[3].message, /four failed/);
  assert.deepEqual(results.slice(4), [50, 60, 70]);
});

test('runPool: a limit above the job count or below 1 still runs every job', async () => {
  assert.deepEqual(await runPool([1, 2], 10, async n => n), [1, 2]);
  assert.deepEqual(await runPool([1, 2], 0, async n => n), [1, 2]);
  assert.deepEqual(await runPool([1, 2], NaN, async n => n), [1, 2]);
  assert.deepEqual(await runPool([], 3, async n => n), []);
});

test('tagConsole: lines of parallel jobs carry their own tag, lines outside a job none', async () => {
  lines.length = 0;
  await runPool(['a', 'b'], 2, async (id) => {
    console.log(`\nstart ${id}`);
    await sleep(id === 'a' ? 20 : 5);
    console.error('done', id);
  }, id => id);
  console.log('summary');
  assert.ok(lines.includes('[a] \n[a] start a'), lines.join('|'));
  assert.ok(lines.includes('[b] done b'), lines.join('|'));
  assert.ok(lines.includes('[a] done a'), lines.join('|'));
  assert.equal(lines.at(-1), 'summary');
});

test('runInContainer: the container output goes through console with the job tag', async () => {
  const dir = tmp('sa-docker-');
  const cli = path.join(dir, 'docker');
  fs.writeFileSync(cli, `#!/usr/bin/env bash
[ "$1" = run ] || exit 0
W=$(for a in "$@"; do case "$a" in *:/work:rw) echo "\${a%:/work:rw}";; esac; done)
echo "cloning"; echo "oops" >&2
echo '{"ok":true,"commit":"abc"}' > "$W/result.json"
`);
  fs.chmodSync(cli, 0o755);
  lines.length = 0;
  const [result] = await runPool(['wallet-x'], 3, (name) =>
    runInContainer({ name, repoUrl: 'u', workDir: tmp('sa-work-'), cli, cacheDir: tmp('sa-cache-'), timeoutMs: 10000 }), n => n);
  assert.equal(result.commit, 'abc');
  assert.ok(lines.includes('[wallet-x] cloning'), lines.join('|'));
  assert.ok(lines.includes('[wallet-x] oops'), lines.join('|'));
});
