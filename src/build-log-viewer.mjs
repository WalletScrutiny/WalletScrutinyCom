/**
 * The file viewer of a verification: its build log and the scripts used to reproduce it.
 * A build log is the build server's recording of a build, shown as the log a terminal
 * would have printed - the whole of it at once, in monospace, the way a reader checking a
 * verdict wants it. A script is shown the same way, as plain text. Full screen on a phone
 * and a large panel over the page on a wider screen; closing returns to the verification.
 * A round button at the bottom right jumps to the end, where a build's outcome is,
 * instead of a long scroll.
 *
 * A recording is downloaded only once the viewer is opened, by the hash the
 * verification names, and is not shown unless it hashes to that.
 *
 * The web twin of the Android app's CompilationLogActivity. Loaded lazily from
 * assets-table-modal.mjs, so it costs nothing until a build log is opened.
 */
import { parseAsciicast } from './asciicast.mjs';
import { TerminalLines, renderTerminalLine } from './terminal-lines.mjs';
import { getBlossomFileURL } from './blossom-utils.mjs';
import { el, isSha256Hex } from './html-utils.mjs';
import { wsIcon } from './icon.mjs';

export const BUILD_LOG_VIEWER_ID = 'buildLogViewer';

/** Lines rendered per animation frame: the first screen shows at once, the rest follows. */
const RENDER_CHUNK = 1500;

let viewer = null;
/** Bumped on every open and close so a download that outlives its viewer does nothing. */
let session = 0;
let opener = null;
/** The text the copy button copies, made when it is clicked: a build log can be long. */
let copyText = null;

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

function hexOf(buffer) {
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
}

function ensureViewer() {
  if (viewer) {
    return viewer;
  }

  const close = el('button', {
    type: 'button',
    className: 'build-log-close',
    'aria-label': 'Close the build log',
    title: 'Close',
    html: wsIcon('chevron-left'),
  });
  const title = el('h2', { id: 'buildLogViewerTitle', className: 'build-log-title' });
  const subtitle = el('p', { className: 'build-log-subtitle' });
  const meta = el('p', { className: 'build-log-meta' });
  const copy = el('button', {
    type: 'button',
    className: 'build-log-copy',
    'aria-label': 'Copy to clipboard',
    title: 'Copy to clipboard',
    hidden: true,
    html: wsIcon('copy'),
  });
  const header = el('header', { className: 'build-log-header' },
    close,
    el('div', { className: 'build-log-heading' }, title, subtitle),
    meta,
    copy,
  );

  const notice = el('p', { className: 'build-log-notice', hidden: true },
    'This recording moved the cursor between lines, which a plain log cannot show: some lines may be out of order or overwritten.',
  );

  const lines = el('div', { className: 'build-log-lines' });
  const body = el('div', { className: 'build-log-body', tabindex: '0' }, lines);

  const stateText = el('p', { className: 'build-log-state-text', 'aria-live': 'polite' });
  const spinner = el('span', { className: 'build-log-spinner', 'aria-hidden': 'true' });
  const retry = el('button', { type: 'button', className: 'btn build-log-retry' }, 'Retry');
  const state = el('div', { className: 'build-log-state' }, spinner, stateText, retry);

  const jump = el('button', {
    type: 'button',
    className: 'build-log-jump',
    'aria-label': 'Jump to the end of the log',
    title: 'Jump to the end',
    html: wsIcon('arrow-down'),
  });

  const panel = el('div', { className: 'build-log-panel' }, header, notice, body, state, jump);
  const root = el('div', {
    id: BUILD_LOG_VIEWER_ID,
    className: 'build-log-viewer',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'buildLogViewerTitle',
  }, panel);

  // The verification modal closes on any click outside its panel and on Escape; the
  // viewer sits outside that panel, so its events must not reach the window. A click
  // beside the viewer's own panel, on a wide screen, closes it.
  root.addEventListener('click', (event) => {
    event.stopPropagation();
    if (event.target === root) {
      closeBuildLogViewer();
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('is-open')) {
      event.stopPropagation();
      event.preventDefault();
      closeBuildLogViewer();
    }
  }, true);

  close.addEventListener('click', () => closeBuildLogViewer());
  copy.addEventListener('click', () => {
    if (!copyText) {
      return;
    }
    navigator.clipboard.writeText(copyText())
      .then(() => window.showToast?.(`${viewer.title.textContent} copied to clipboard`, 'success'))
      .catch((error) => {
        console.error('Failed to copy text:', error);
        window.showToast?.('Failed to copy to clipboard', 'error');
      });
  });
  jump.addEventListener('click', () => {
    body.scrollTop = body.scrollHeight;
    body.focus({ preventScroll: true });
  });
  body.addEventListener('scroll', () => updateJump(), { passive: true });
  window.addEventListener('resize', () => updateJump());

  document.body.appendChild(root);
  viewer = { root, close, title, subtitle, meta, copy, notice, body, lines, state, stateText, spinner, retry, jump, hash: '' };
  retry.addEventListener('click', () => {
    if (viewer.hash) {
      void load(viewer.hash, ++session);
    }
  });
  return viewer;
}

/** The jump button is there while the log goes on below the screen, and away at the end. */
function updateJump() {
  if (!viewer) {
    return;
  }
  const { body, jump, root } = viewer;
  const more = root.classList.contains('is-open')
    && viewer.lines.childElementCount > 0
    && body.scrollHeight - body.scrollTop - body.clientHeight > 4;
  jump.classList.toggle('is-visible', more);
}

function showState(text, { busy = false, failed = false } = {}) {
  const { state, stateText, spinner, retry, body } = viewer;
  state.hidden = false;
  body.hidden = true;
  stateText.textContent = text;
  spinner.hidden = !busy;
  retry.hidden = !failed;
  body.setAttribute('aria-busy', busy ? 'true' : 'false');
}

function showLines() {
  const { state, body } = viewer;
  state.hidden = true;
  body.hidden = false;
  body.setAttribute('aria-busy', 'false');
}

/**
 * The file from Blossom as bytes, with progress while it comes. The content length is
 * what the server says, so the "of" part is missing when it does not say.
 */
async function download(url, onProgress) {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const total = Number.parseInt(response.headers.get('content-length') ?? '', 10) || 0;
  if (!response.body?.getReader) {
    return new Uint8Array(await response.arrayBuffer());
  }
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    received += value.byteLength;
    onProgress(received, total);
  }
  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function nextFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Lines in the viewer, `renderLine` making each one's element. They are added a chunk
 * per frame so a long log does not freeze the page while the first screen is already
 * readable.
 */
async function renderLines(lines, renderLine, mySession) {
  viewer.meta.textContent = `${lines.length.toLocaleString()} lines`;
  viewer.lines.replaceChildren();
  viewer.copy.hidden = false;
  showLines();
  for (let start = 0; start < lines.length; start += RENDER_CHUNK) {
    if (mySession !== session) {
      return;
    }
    const fragment = document.createDocumentFragment();
    const end = Math.min(start + RENDER_CHUNK, lines.length);
    for (let i = start; i < end; i++) {
      fragment.appendChild(renderLine(lines[i]));
    }
    viewer.lines.appendChild(fragment);
    updateJump();
    if (end < lines.length) {
      await nextFrame();
    }
  }
  viewer.body.focus({ preventScroll: true });
}

/** A plain text line, as a text node: a script's bytes never go through innerHTML. */
export function renderTextLine(text, doc = document) {
  const element = doc.createElement('div');
  element.className = 'build-log-line';
  element.textContent = text;
  return element;
}

/** The recording's text as the lines a terminal would have shown. */
async function render(text, mySession) {
  const recording = parseAsciicast(text);
  const terminal = new TerminalLines();
  for (const frame of recording.frames) {
    terminal.feed(frame.text);
  }
  const lines = terminal.lines;
  // A recording that ends with a newline leaves an empty last line; it is not content.
  if (lines.length > 1 && lines[lines.length - 1].length === 0) {
    lines.pop();
  }
  if (lines.length === 1 && lines[0].length === 0) {
    showState('The recording is empty.');
    return;
  }

  viewer.notice.hidden = !terminal.cursorMoved;
  copyText = () => lines.map(line => line.toString()).join('\n');
  await renderLines(lines, line => renderTerminalLine(line), mySession);
}

async function load(hash, mySession) {
  showState('Downloading the build log…', { busy: true });
  try {
    const bytes = await download(getBlossomFileURL(hash), (received, total) => {
      if (mySession !== session) {
        return;
      }
      const progress = total > 0 ? `${formatBytes(received)} of ${formatBytes(total)}` : formatBytes(received);
      viewer.stateText.textContent = `Downloading the build log… ${progress}`;
    });
    if (mySession !== session) {
      return;
    }
    showState('Reading the recording…', { busy: true });
    const digest = hexOf(await window.crypto.subtle.digest('SHA-256', bytes));
    if (mySession !== session) {
      return;
    }
    if (digest !== hash) {
      showState('The downloaded file does not match the hash this verification names, so it is not shown.', { failed: true });
      return;
    }
    await render(new TextDecoder().decode(bytes), mySession);
  } catch (error) {
    if (mySession !== session) {
      return;
    }
    console.warn('build log download failed:', error);
    showState('The build log could not be downloaded.', { failed: true });
  }
}

/** The viewer, emptied and open with this title and subtitle; the caller fills it. */
function openViewer({ title, subtitle = '', subtitleTitle = '' }, openedFrom) {
  const v = ensureViewer();
  opener = openedFrom ?? document.activeElement;
  v.hash = '';
  copyText = null;
  v.title.textContent = title;
  v.subtitle.textContent = subtitle;
  v.subtitle.title = subtitleTitle;
  v.meta.textContent = '';
  v.copy.hidden = true;
  v.notice.hidden = true;
  v.lines.replaceChildren();
  v.body.scrollTop = 0;
  v.root.classList.add('is-open');
  updateJump();
  v.close.focus({ preventScroll: true });
  return v;
}

/**
 * Open the viewer on the recording with this Blossom hash.
 *
 * @param {{ hash: string, subject?: string, fileName?: string }} options
 *   `subject` - wallet and version - goes in the bar; `fileName` under it.
 * @param {Element} [openedFrom] gets the focus back on close
 * @returns {boolean} false when the hash is not one
 */
export function openBuildLogViewer({ hash, subject = '', fileName = '' }, openedFrom = null) {
  if (!isSha256Hex(hash)) {
    return false;
  }
  const v = openViewer({ title: 'Build log', subtitle: subject, subtitleTitle: fileName }, openedFrom);
  v.hash = hash;
  void load(hash, ++session);
  return true;
}

/**
 * Open the viewer on a text file the page already has, such as a script used to
 * reproduce a build.
 *
 * @param {{ text: string, fileName?: string }} options `fileName` is the title in the bar
 * @param {Element} [openedFrom] gets the focus back on close
 */
export function openTextFileViewer({ text, fileName = '' }, openedFrom = null) {
  openViewer({ title: fileName || 'File' }, openedFrom);
  const content = String(text ?? '');
  const lines = content.split(/\r?\n/);
  // A file that ends with a newline leaves an empty last line; it is not content.
  if (lines.length > 1 && lines[lines.length - 1].length === 0) {
    lines.pop();
  }
  if (lines.length === 1 && lines[0].length === 0) {
    showState('The file is empty.');
    return;
  }
  copyText = () => content;
  void renderLines(lines, line => renderTextLine(line), ++session);
}

export function closeBuildLogViewer() {
  if (!viewer || !viewer.root.classList.contains('is-open')) {
    return;
  }
  session++;
  copyText = null;
  viewer.root.classList.remove('is-open');
  viewer.lines.replaceChildren();
  viewer.jump.classList.remove('is-visible');
  if (opener?.isConnected && typeof opener.focus === 'function') {
    opener.focus({ preventScroll: true });
  }
  opener = null;
}

export function isBuildLogViewerOpen() {
  return Boolean(viewer?.root.classList.contains('is-open'));
}
