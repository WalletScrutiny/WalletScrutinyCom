import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { BOLD, TerminalLines, renderTerminalLine } from '../../src/terminal-lines.mjs';

function linesOf(...chunks) {
  const terminal = new TerminalLines();
  for (const chunk of chunks) {
    terminal.feed(chunk);
  }
  return { terminal, text: terminal.lines.map(String) };
}

describe('TerminalLines', () => {
  test('newline starts a line, carriage return overwrites the current one', () => {
    const { text } = linesOf('first\r\nsecond\n', 'progress 10%\rprogress 100%');
    assert.deepEqual(text, ['first', 'second', 'progress 100%']);
  });

  test('a shorter redraw after \\r leaves the tail unless the line is erased', () => {
    assert.deepEqual(linesOf('1234567\rab').text, ['ab34567']);
    assert.deepEqual(linesOf('1234567\rab\u001b[K').text, ['ab']);
    assert.deepEqual(linesOf('1234567\r\u001b[2K').text, ['']);
    assert.deepEqual(linesOf('12345\u001b[2D\u001b[1K').text, ['    5']);
  });

  test('backspace steps back, tab pads to the next stop, control characters are dropped', () => {
    assert.deepEqual(linesOf('abc\b\bX').text, ['aXc']);
    assert.deepEqual(linesOf('a\tb').text, ['a       b']);
    assert.deepEqual(linesOf('a\u0007b\u007fc').text, ['abc']);
  });

  test('moves along the line are followed, moves between lines set cursorMoved', () => {
    const along = linesOf('abcdef\u001b[3GX\u001b[2CY\u001b[1DZ');
    assert.deepEqual(along.text, ['abXdeZ']);
    assert.equal(along.terminal.cursorMoved, false);

    const between = linesOf('line one\n\u001b[1Aline two');
    assert.equal(between.terminal.cursorMoved, true);
    assert.deepEqual(between.text, ['line one', 'line two']);
  });

  test('SGR colours and bold are a style per character; extended colours are stepped over', () => {
    const { terminal } = linesOf('\u001b[1;32mok\u001b[0m \u001b[91mno\u001b[39m \u001b[38;5;208mx\u001b[m');
    const line = terminal.lines[0];
    assert.equal(line.toString(), 'ok no x');
    assert.equal(line.styleAt(0), BOLD | 3);
    assert.equal(line.styleAt(1), BOLD | 3);
    assert.equal(line.styleAt(2), 0);
    assert.equal(line.styleAt(3), 10);
    assert.equal(line.styleAt(5), 0);
    assert.equal(line.styleAt(6), 0);
  });

  test('an escape sequence cut between two chunks is still one sequence', () => {
    const { terminal, text } = linesOf('a\u001b[', '31mb\u001b', '[0mc');
    assert.deepEqual(text, ['abc']);
    assert.equal(terminal.lines[0].styleAt(1), 2);
    assert.equal(terminal.lines[0].styleAt(2), 0);
  });

  test('OSC titles and charset selections are dropped whole', () => {
    assert.deepEqual(linesOf('\u001b]0;title\u0007a\u001b]2;t\u001b\\b\u001b(Bc').text, ['abc']);
  });
});

describe('renderTerminalLine', () => {
  test('a plain line is one text node', () => {
    const { terminal } = linesOf('plain <b>text</b>');
    const element = renderTerminalLine(terminal.lines[0], document);
    assert.equal(element.className, 'build-log-line');
    assert.equal(element.childNodes.length, 1);
    assert.equal(element.textContent, 'plain <b>text</b>');
    assert.equal(element.querySelector('b'), null);
  });

  test('styled runs become spans with colour and bold classes', () => {
    const { terminal } = linesOf('\u001b[1;31mERR\u001b[0m: \u001b[34mpath\u001b[0m');
    const element = renderTerminalLine(terminal.lines[0], document);
    const spans = [...element.querySelectorAll('span')];
    assert.deepEqual(spans.map(s => [s.className, s.textContent]), [
      ['ws-log-c2 ws-log-b', 'ERR'],
      ['ws-log-c5', 'path'],
    ]);
    assert.equal(element.textContent, 'ERR: path');
  });
});
