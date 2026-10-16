import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { parseTriage, applyTriage, decisionFor, decisionIndex, TRIAGE_STATUSES } from '../../src/dependency-triage.mjs';
import { buildTriage } from '../../scripts/build-dependency-triage.mjs';

const good = { advisory: 'GHSA-67hx-6x53-jw92', status: 'not_affected', justification: 'build-time only' };

describe('dependency triage', () => {
  test('parseTriage normalises entries and accepts an empty file', () => {
    const t = parseTriage({ decisions: [{ ...good, package: ' @babel/traverse ', date: new Date('2026-10-16'), by: 'Leo', developer: { status: 'not_affected', url: 'https://x/vex.json' } }] });
    assert.deepEqual(t.decisions, [{ ...good, package: '@babel/traverse', date: '2026-10-16', by: 'Leo', developer: { status: 'not_affected', url: 'https://x/vex.json' } }]);
    assert.deepEqual(parseTriage({}), { decisions: [] });
    assert.deepEqual(parseTriage({ decisions: null }), { decisions: [] });
    assert.deepEqual(parseTriage(undefined), { decisions: [] }, 'a file with only comments');
  });

  test('parseTriage rejects a bad status, a missing justification, a bad id, a duplicate, and lists them all', () => {
    assert.throws(() => parseTriage({ decisions: [
      { advisory: 'GHSA-1', status: 'nope', justification: 'x' },
      { advisory: 'GHSA-2', status: 'fixed' },
      { advisory: 'not an id', status: 'fixed', justification: 'x' },
      { advisory: 'GHSA-1', status: 'fixed', justification: 'x' },
      'string',
    ] }, { source: 'f.yml' }), (e) => {
      assert.match(e.message, /^f\.yml: /);
      assert.match(e.message, /status "nope" is not one of affected, not_affected, fixed, under_investigation/);
      assert.match(e.message, /GHSA-2\): "justification" is required/);
      assert.match(e.message, /"not an id" is not an advisory id/);
      assert.match(e.message, /GHSA-1 already decided in decisions\[0\]/);
      assert.match(e.message, /decisions\[4\]: must be a mapping/);
      return true;
    });
    assert.throws(() => parseTriage({ decisions: 'x' }), /"decisions" must be a list/);
    assert.throws(() => parseTriage([]), /must be a mapping/);
    assert.throws(() => parseTriage({ decisions: [{ ...good, developer: { status: 'maybe' } }] }), /developer\.status must be one of/);
    assert.throws(() => parseTriage({ decisions: [{ ...good, date: '16.10.2026' }] }), /"date" must be YYYY-MM-DD/);
    assert.deepEqual(TRIAGE_STATUSES, ['affected', 'not_affected', 'fixed', 'under_investigation']);
  });

  test('decisions match by id or alias; applyTriage counts the states', () => {
    const triage = { decisions: [
      { advisory: 'CVE-2023-45133', status: 'not_affected', justification: 'a' },
      { advisory: 'GHSA-x', status: 'affected', justification: 'b' },
    ] };
    const index = decisionIndex(triage);
    assert.equal(decisionFor({ id: 'GHSA-67hx', aliases: ['CVE-2023-45133'] }, index).status, 'not_affected');
    assert.equal(decisionFor({ id: 'GHSA-y', aliases: [] }, index), null);
    const { advisories, summary } = applyTriage([
      { id: 'GHSA-67hx', aliases: ['CVE-2023-45133'] }, { id: 'GHSA-x' }, { id: 'GHSA-z' },
    ], triage);
    assert.deepEqual(summary, { total: 3, decided: 2, undecided: 1, affected: 1, not_affected: 1, fixed: 0, under_investigation: 0 });
    assert.deepEqual(advisories.map(a => a.decision?.status || null), ['not_affected', 'affected', null]);
    assert.deepEqual(applyTriage([{ id: 'GHSA-z' }], null).summary, { total: 1, decided: 0, undecided: 1, affected: 0, not_affected: 0, fixed: 0, under_investigation: 0 });
  });

  test('buildTriage publishes one JSON per wallet file and refuses a broken one', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'triage-'));
    try {
      const src = join(tmp, 'src');
      const out = join(tmp, 'out');
      mkdirSync(src);
      writeFileSync(join(src, 'it.airgap.vault.yml'), 'decisions:\n  - advisory: GHSA-67hx-6x53-jw92\n    status: not_affected\n    justification: build-time only\n');
      writeFileSync(join(src, 'empty.yaml'), '# nothing decided yet\n');
      writeFileSync(join(src, 'notes.txt'), 'ignored');
      let r = buildTriage({ sourceDir: src, target: out });
      assert.deepEqual(r, { files: 2, decisions: 1, problems: [] });
      const json = JSON.parse(readFileSync(join(out, 'it.airgap.vault.json'), 'utf8'));
      assert.deepEqual(json, { schema: 1, appId: 'it.airgap.vault', decisions: [{ advisory: 'GHSA-67hx-6x53-jw92', status: 'not_affected', justification: 'build-time only' }] });
      assert.deepEqual(JSON.parse(readFileSync(join(out, 'empty.json'), 'utf8')).decisions, []);

      writeFileSync(join(src, 'bad.yml'), 'decisions:\n  - advisory: GHSA-1\n    status: maybe\n    justification: x\n');
      rmSync(out, { recursive: true });
      r = buildTriage({ sourceDir: src, target: out });
      assert.equal(r.problems.length, 1);
      assert.match(r.problems[0], /bad\.yml: decisions\[0\] \(GHSA-1\): status "maybe"/);
      assert.equal(existsSync(out), false, 'a rejected set publishes nothing');

      assert.deepEqual(buildTriage({ sourceDir: join(tmp, 'missing'), target: out }), { files: 0, decisions: 0, problems: [] });
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('the committed triage files are valid', () => {
    const r = buildTriage({ sourceDir: '_data/dependencyTriage', target: join(tmpdir(), `triage-out-${process.pid}`) });
    assert.deepEqual(r.problems, []);
    rmSync(join(tmpdir(), `triage-out-${process.pid}`), { recursive: true, force: true });
  });
});
