/**
 * Shared terminal styling for the refresh pipeline.
 *
 *   printRefreshSection(title)     — main step (refresh.sh, before each script)
 *   printRefreshSubsection(title)  — sub-step inside a script (less prominent)
 *   printRefreshNote(message)      — indented detail line under a subsection
 *
 * Bash equivalent: scripts/refresh-ui.sh
 */

/** Width of main section bars (═). */
export const REFRESH_UI_WIDTH = 108;

/** Width of subsection bars (─); shorter and lighter than main sections. */
export const REFRESH_UI_SUBSECTION_WIDTH = 72;

function truncate(str, maxLen) {
  const s = String(str).trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, Math.max(0, maxLen - 1)) + '\u2026';
}

function bar(char, width = REFRESH_UI_WIDTH) {
  return char.repeat(width);
}

/** Main pipeline step — print immediately before running a script. */
export function printRefreshSection(title) {
  const text = truncate(title, REFRESH_UI_WIDTH - 4);
  console.log('');
  console.log(bar('\u2550'));
  console.log(`  ${text}`);
  console.log(bar('\u2550'));
}

/**
 * Sub-step inside a script — visible compact box (─), clearly below main sections (═).
 */
export function printRefreshSubsection(title) {
  const w = REFRESH_UI_SUBSECTION_WIDTH;
  const barLine = '\u2500'.repeat(w);
  const titleIndent = '    ';
  const text = truncate(title, w - titleIndent.length);
  console.log('');
  console.log(`  ${barLine}`);
  console.log(`${titleIndent}${text}`);
  console.log(`  ${barLine}`);
}

/** Indented note (skip reasons, hints). */
export function printRefreshNote(message) {
  console.log(`    ${message}`);
}
