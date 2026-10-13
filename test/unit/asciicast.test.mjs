import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { parseAsciicast } from '../../src/asciicast.mjs';

const HEADER_V2 = '{"version": 2, "width": 80, "height": 24, "timestamp": 1789557074, "env": {"SHELL": "/bin/bash"}}';

describe('parseAsciicast', () => {
  test('reads a version 2 recording: header size, output frames, absolute times', () => {
    const cast = [
      HEADER_V2,
      '[0.5, "o", "hello\\r\\n"]',
      '[1.25, "i", "typed"]',
      '[2.0, "o", "world"]',
    ].join('\n');
    const recording = parseAsciicast(cast);
    assert.equal(recording.version, 2);
    assert.equal(recording.width, 80);
    assert.equal(recording.height, 24);
    assert.deepEqual(recording.frames, [
      { time: 0.5, text: 'hello\r\n' },
      { time: 2.0, text: 'world' },
    ]);
    assert.equal(recording.duration, 2.0);
  });

  test('version 3 times are intervals and the size is under term', () => {
    const cast = [
      '{"version": 3, "term": {"cols": 120, "rows": 40}}',
      '[1.0, "o", "a"]',
      '[0.5, "o", "b"]',
      '[0.25, "m", ""]',
      '[0.25, "o", "c"]',
    ].join('\n');
    const recording = parseAsciicast(cast);
    assert.equal(recording.width, 120);
    assert.equal(recording.height, 40);
    assert.deepEqual(recording.frames.map(f => f.time), [1.0, 1.5, 2.0]);
    assert.equal(recording.duration, 2.0);
  });

  test('skips lines that are not events and keeps going', () => {
    const cast = [
      HEADER_V2,
      '[0.1, "o", "one\\n"]',
      'garbage',
      '[not json',
      '["x", "o", "bad time"]',
      '[0.2, "o", 42]',
      '',
      '[0.3, "o", "two"]',
      '',
    ].join('\n');
    const recording = parseAsciicast(cast);
    assert.deepEqual(recording.frames.map(f => f.text), ['one\n', 'two']);
  });

  test('an empty or headerless file yields no frames', () => {
    assert.deepEqual(parseAsciicast(''), { version: 2, width: 0, height: 0, frames: [], duration: 0 });
    assert.deepEqual(parseAsciicast(null).frames, []);
    const noHeader = parseAsciicast('[0.1, "o", "x"]');
    assert.deepEqual(noHeader.frames, []);
  });

  test('undoes JSON escapes in the output text', () => {
    const cast = `${HEADER_V2}\n[0.1, "o", "\\u001b[32mok\\u001b[0m\\t\\"q\\""]`;
    assert.equal(parseAsciicast(cast).frames[0].text, '\u001b[32mok\u001b[0m\t"q"');
  });
});
