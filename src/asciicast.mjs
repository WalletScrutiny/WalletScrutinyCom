/**
 * An asciicast recording, the file a build-server verification attaches as `*.cast`:
 * one JSON header line, then one JSON array per terminal event, `[time, "o", text]`.
 *
 * Only what the build log viewer needs is kept: the output events, each with the second
 * it was printed at. The header's width and height are read for information; input
 * events, markers and resizes are skipped. Version 2 times are absolute, version 3
 * times are the interval since the event before (asciinema 3.0), so both end up
 * absolute here. A line that is not an event is skipped, not fatal: the viewer shows
 * what it could read.
 *
 * The same shape as the Android app's Asciicast (ui/log/Asciicast.kt).
 */

/**
 * @typedef {{ time: number, text: string }} AsciicastFrame
 * @typedef {{ version: number, width: number, height: number, frames: AsciicastFrame[], duration: number }} AsciicastRecording
 */

function readHeader(line) {
  try {
    const header = JSON.parse(line);
    if (header && typeof header === 'object' && !Array.isArray(header)) {
      return header;
    }
  } catch {
    // Not JSON: an empty file or not a recording. The defaults below apply.
  }
  return {};
}

/**
 * @param {string} text the whole recording
 * @returns {AsciicastRecording}
 */
export function parseAsciicast(text) {
  const lines = String(text ?? '').split('\n');
  const header = readHeader(lines[0] ?? '');
  const version = Number.parseInt(header.version, 10) || 2;
  // Version 3 moved the size under "term": {"cols": 80, "rows": 24}.
  const width = Number.parseInt(header.width ?? header.term?.cols, 10) || 0;
  const height = Number.parseInt(header.height ?? header.term?.rows, 10) || 0;

  const frames = [];
  let clock = 0;
  let duration = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0 || line.charCodeAt(0) !== 0x5b /* [ */) {
      continue;
    }
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (!Array.isArray(event) || typeof event[0] !== 'number' || !Number.isFinite(event[0])) {
      continue;
    }
    const time = version >= 3 ? clock + event[0] : event[0];
    clock = time;
    if (event[1] === 'o' && typeof event[2] === 'string') {
      duration = time;
      frames.push({ time, text: event[2] });
    }
  }
  return { version, width, height, frames, duration };
}
