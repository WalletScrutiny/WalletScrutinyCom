/**
 * The build server's report as the site shows it (Luis, 2026-10-07). The event keeps the
 * full report (external/build_server/verifications.mjs buildVerificationContent); only
 * the view changes. WalletScrutinyAndroid does the same in AbsReport.forDisplay and its
 * Markdown views, so keep the two alike.
 */

const OTHER = '<summary>Other information</summary>';
const BASED_ON = /^- Build script from verification (`[0-9a-f]{64}`)(.*)$/;

/**
 * The "Other information" list with the script version first, the build script's origin
 * in plainer words, and no command line, which says nothing to our users. Any other
 * report comes back unchanged.
 */
export function tidyBuildServerReport(markdown) {
  const text = String(markdown ?? '');
  const lines = text.split('\n');
  const start = lines.indexOf(OTHER);
  if (start < 0) {
    return text;
  }
  let end = lines.findIndex((line, i) => i > start && (line === '</details>' || line.startsWith('**')));
  if (end < 0) {
    end = lines.length;
  }
  const items = lines.slice(start + 1, end).filter(line => line.trim() !== '');
  if (items.length === 0 || items.some(line => !line.startsWith('- '))) {
    return text;
  }
  const version = items.filter(line => line.startsWith('- Script version: '));
  const rest = items
    .filter(line => !version.includes(line) && !line.startsWith('- Command: '))
    .map(line => line.replace(BASED_ON, '- Build script taken from verification $1$2'));
  return [...lines.slice(0, start + 1), '', ...version, ...rest, '', ...lines.slice(end)].join('\n');
}

/**
 * Rendered report HTML with the build script's author as a name slot instead of a pubkey,
 * and every SHA-256 in `code` cut to its first 8 characters and "…". A tap copies the full
 * hash (the modal's .js-copy-hash handler). Fill the slots with [fillReportAuthors].
 */
export function shortenReportHashes(html) {
  return String(html ?? '')
    .replace(
      /(Build script taken from verification <code>[0-9a-f]{64}<\/code>) by <code>([0-9a-f]{64})<\/code>/g,
      (_, line, pubkey) => `${line} by <span class="report-author" data-pubkey="${pubkey}">${pubkey.slice(0, 8)}…</span>`,
    )
    .replace(
      /<code>([0-9a-fA-F]{64})<\/code>/g,
      (_, hash) => `<code class="js-copy-hash report-hash" data-hash="${hash}" title="Copy hash" role="button">${hash.slice(0, 8)}…</code>`,
    );
}

/** Puts [nameOf(pubkey)] into each author slot under [root], as text. */
export async function fillReportAuthors(root, nameOf) {
  const slots = [...(root?.querySelectorAll?.('.report-author[data-pubkey]') ?? [])];
  await Promise.all(slots.map(async (slot) => {
    const name = await nameOf(slot.dataset.pubkey);
    if (name) {
      slot.textContent = name;
    }
  }));
}
