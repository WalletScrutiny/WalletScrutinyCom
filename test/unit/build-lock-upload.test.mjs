import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  BUILD_LOCK_FILE_NAME,
  MISSING_BUILD_LOCK_MESSAGE,
  NO_BUILD_NAMED_MESSAGE,
  SECOND_BUILD_LOCK_MESSAGE,
  anotherBuildMessage,
  buildLockProblem,
  buildLockSubmitProblem,
  isBuildLockEntry,
  parseBuildLockText,
  readBuildLock,
  scriptCallsBuildLock,
} from '../../src/build-lock-upload.mjs';

const header = { schema: 2, appId: 'app.michaelwuensch.bitbanana', appVersion: '1.1.1', platform: 'android' };
const lockText = (fields = {}) => JSON.stringify({
  schema: 2, tool: 'ws-buildlock', version: '0.3.0',
  appId: header.appId, appVersion: header.appVersion, platform: header.platform, commit: null,
  generatedAt: '2026-11-10T08:40:44Z', lockfiles: [], artifacts: [], ...fields,
}, null, 1);
const form = { appId: 'app.michaelwuensch.bitbanana', version: '1.1.1', platform: 'android' };

describe('recognising a build-lock', () => {
  test('by content, pretty-printed or not', () => {
    assert.deepEqual(parseBuildLockText(lockText()), header);
    assert.deepEqual(parseBuildLockText(JSON.stringify(JSON.parse(lockText()))), header);
  });

  test('other JSON, an asciicast and broken text are not build-locks', () => {
    for (const text of [
      '{"tool":"ws-depcheck","artifacts":[]}',
      '{"version": 2, "width": 80}\n[0.1, "o", "ws-buildlock"]\n',
      '{"tool":"ws-buildlock",',
      '["ws-buildlock"]',
      '',
    ]) assert.equal(parseBuildLockText(text), null, text);
  });

  test('a schema 1 file is a build-lock with no build named', () => {
    assert.deepEqual(parseBuildLockText('{"schema":1,"tool":"ws-buildlock","artifacts":[]}'),
      { schema: 1, appId: null, appVersion: null, platform: null });
  });

  test('readBuildLock reads the file whatever its name', async () => {
    const file = new File([lockText()], 'build-lock (1).json', { type: 'application/json' });
    assert.deepEqual(await readBuildLock(file), header);
    assert.equal(await readBuildLock(new File(['plain log'], 'build-lock.json')), null);
  });

  test('a draft output file is a build-lock by its saved name', () => {
    assert.equal(isBuildLockEntry({ name: BUILD_LOCK_FILE_NAME, hash: 'x' }), true);
    assert.equal(isBuildLockEntry({ name: 'build.cast', hash: 'x' }), false);
    assert.equal(isBuildLockEntry({ name: 'renamed.json', buildLock: header }), true);
  });
});

describe('refusing a build-lock', () => {
  test('one from this build is fine', () => {
    assert.equal(buildLockProblem(header, form), null);
    assert.equal(buildLockProblem(header, form, { complete: true }), null);
  });

  test('another build names the field and both values', () => {
    assert.equal(buildLockProblem(header, { ...form, version: '1.1.0' }),
      'This build-lock.json belongs to another build: it says version 1.1.1, this verification says 1.1.0.');
    assert.equal(buildLockProblem(header, { ...form, platform: 'iphone' }), anotherBuildMessage('platform', 'android', 'iphone'));
    assert.equal(buildLockProblem(header, { ...form, appId: 'com.other' }), anotherBuildMessage('app', header.appId, 'com.other'));
  });

  test('case and blanks around the form value are ignored, as in the checker', () => {
    assert.equal(buildLockProblem(header, { ...form, platform: 'Android' }), null);
    assert.equal(buildLockProblem(header, { ...form, platform: ' ANDROID ' }, { complete: true }), null);
    assert.equal(buildLockProblem({ ...header, platform: 'Android' }, form), null);
    assert.equal(buildLockProblem(header, { ...form, appId: 'App.MichaelWuensch.BitBanana' }), null);
    assert.equal(buildLockProblem(header, { ...form, platform: 'iPhone' }), anotherBuildMessage('platform', 'android', 'iPhone'));
  });

  test('an empty form field is compared only on submit', () => {
    assert.equal(buildLockProblem(header, { ...form, version: '' }), null);
    assert.equal(buildLockProblem(header, { ...form, version: '' }, { complete: true }),
      'This build-lock.json belongs to another build: it says version 1.1.1, this verification says (none).');
  });

  test('schema 1 or a null field names no build', () => {
    assert.equal(buildLockProblem({ ...header, schema: 1 }, form), NO_BUILD_NAMED_MESSAGE);
    for (const field of ['appId', 'appVersion', 'platform']) {
      assert.equal(buildLockProblem({ ...header, [field]: null }, form), NO_BUILD_NAMED_MESSAGE, field);
    }
  });

  test('the messages read as in scripts/rb/README.md', () => {
    assert.equal(NO_BUILD_NAMED_MESSAGE, "This build-lock.json doesn't say which build it belongs to. Run ws-buildlock.sh 0.3.0 or later with --app-id, --version and --platform, and upload the new file.");
    assert.equal(SECOND_BUILD_LOCK_MESSAGE, 'Only one build-lock.json can go with a verification. Remove the other one.');
  });
});

describe('checking on submit', () => {
  const lockEntry = { name: BUILD_LOCK_FILE_NAME, hash: 'a', buildLock: header };
  const cast = { name: 'build.cast', hash: 'b' };
  const script = 'bash ws-buildlock.sh --out "$out" --gradle-home "$gh"';

  test('a good build-lock passes', () => {
    assert.equal(buildLockSubmitProblem({ outputFiles: [cast, lockEntry], scripts: [script], form, status: 'reproducible' }), null);
  });

  test('two build-locks are refused, a draft one included', () => {
    assert.equal(buildLockSubmitProblem({ outputFiles: [lockEntry, { name: BUILD_LOCK_FILE_NAME, hash: 'c' }], form }), SECOND_BUILD_LOCK_MESSAGE);
  });

  test('the form changed after the file was added', () => {
    assert.equal(buildLockSubmitProblem({ outputFiles: [lockEntry], form: { ...form, version: '1.2.0' } }),
      anotherBuildMessage('version', '1.1.1', '1.2.0'));
  });

  test('a draft build-lock has no content to compare and passes', () => {
    assert.equal(buildLockSubmitProblem({ outputFiles: [{ name: BUILD_LOCK_FILE_NAME, hash: 'a' }], form: { ...form, version: '9' } }), null);
  });

  test('a script that runs ws-buildlock.sh needs the file, unless the build failed', () => {
    assert.equal(buildLockSubmitProblem({ outputFiles: [cast], scripts: ['#!/bin/sh', script], form, status: 'reproducible' }), MISSING_BUILD_LOCK_MESSAGE);
    assert.equal(buildLockSubmitProblem({ outputFiles: [cast], scripts: [script], form, status: 'ftbfs' }), null);
    assert.equal(buildLockSubmitProblem({ outputFiles: [cast], scripts: ['./gradlew assembleRelease', undefined], form, status: 'reproducible' }), null);
  });

  test('scriptCallsBuildLock looks for the script name', () => {
    assert.equal(scriptCallsBuildLock(script), true);
    assert.equal(scriptCallsBuildLock('build-lock.json is mentioned, the script is not'), false);
    assert.equal(scriptCallsBuildLock(null), false);
  });

  test('a ws-buildlock.sh named only in a comment is not a call', () => {
    const commentOnly = '#!/bin/sh\n  # later: call ws-buildlock.sh\n./gradlew assembleRelease\n';
    assert.equal(scriptCallsBuildLock(commentOnly), false);
    assert.equal(scriptCallsBuildLock(`${commentOnly}${script} # writes build-lock.json\n`), true);
    assert.equal(buildLockSubmitProblem({ outputFiles: [cast], scripts: [commentOnly], form, status: 'reproducible' }), null);
  });
});
