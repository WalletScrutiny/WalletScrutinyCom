import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { publishExport, publishFiles, rsyncArgs } from '../publish.mjs';

const hasRsync = spawnSync('rsync', ['--version']).status === 0;

describe('publishing the export', () => {
  test('no target, nothing published', () => {
    assert.deepEqual(publishExport('/nowhere', { target: '', run: () => assert.fail('rsync must not run') }), { published: false });
  });

  test('rsync arguments: the directory contents, the ssh command, a trailing slash on both', () => {
    const args = rsyncArgs('/var/lib/x/export', 'ws@web:/srv/source-analysis', { ssh: 'ssh -i /k' });
    assert.deepEqual(args.slice(-4), ['-e', 'ssh -i /k', '/var/lib/x/export/', 'ws@web:/srv/source-analysis/']);
    assert.ok(args.includes('--delay-updates') && args.includes('--delete-delay'));
  });

  test('a failing rsync is an error with its last stderr lines', () => {
    assert.throws(() => publishExport('/e', { target: '/t', run: () => ({ status: 23, stderr: 'a\nb\nc\nd' }) }), /rsync exited 23: b \/ c \/ d/);
  });

  test('copies the export and removes files the new export no longer has', { skip: !hasRsync && 'rsync not installed' }, () => {
    const tmp = mkdtempSync(join(tmpdir(), 'publish-'));
    try {
      const exportDir = join(tmp, 'export');
      const target = join(tmp, 'www');
      mkdirSync(join(exportDir, 'apps'), { recursive: true });
      mkdirSync(join(target, 'apps'), { recursive: true });
      writeFileSync(join(exportDir, 'index.json'), '{"schema":1}');
      writeFileSync(join(exportDir, 'apps', 'a.json'), '{}');
      writeFileSync(join(target, 'apps', 'gone.json'), '{}');
      assert.deepEqual(publishExport(exportDir, { target, ssh: '' }), { published: true, target });
      assert.equal(readFileSync(join(target, 'index.json'), 'utf8'), '{"schema":1}');
      assert.ok(existsSync(join(target, 'apps', 'a.json')));
      assert.equal(existsSync(join(target, 'apps', 'gone.json')), false);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('one app\'s files: only those, and nothing else on the target is removed', { skip: !hasRsync && 'rsync not installed' }, () => {
    const tmp = mkdtempSync(join(tmpdir(), 'publish-'));
    try {
      const exportDir = join(tmp, 'export');
      const target = join(tmp, 'www');
      mkdirSync(join(exportDir, 'apps', 'a', 'v1'), { recursive: true });
      mkdirSync(join(target, 'apps'), { recursive: true });
      writeFileSync(join(exportDir, 'index.json'), '{"schema":1,"apps":["a"]}');
      writeFileSync(join(exportDir, 'apps', 'a.json'), '{"new":true}');
      writeFileSync(join(exportDir, 'apps', 'a', 'v1', 'dependencies.json'), '{}');
      writeFileSync(join(exportDir, 'apps', 'b.json'), '{"unpublished":true}');
      writeFileSync(join(target, 'apps', 'other.json'), '{}');
      assert.deepEqual(publishFiles(exportDir, ['index.json', 'apps/a.json', 'apps/a/'], { target, ssh: '' }), { published: true, target });
      assert.equal(readFileSync(join(target, 'apps', 'a.json'), 'utf8'), '{"new":true}');
      assert.ok(existsSync(join(target, 'apps', 'a', 'v1', 'dependencies.json')));
      assert.ok(existsSync(join(target, 'index.json')));
      assert.ok(existsSync(join(target, 'apps', 'other.json')));
      assert.equal(existsSync(join(target, 'apps', 'b.json')), false);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('one app\'s files: no target or no files, nothing published', () => {
    const run = () => assert.fail('rsync must not run');
    assert.deepEqual(publishFiles('/e', ['index.json'], { target: '', run }), { published: false });
    assert.deepEqual(publishFiles('/e', [], { target: '/t', run }), { published: false });
  });
});
