/**
 * The build server's verification reports: how the server writes them
 * ([buildVerificationContent], used by external/build_server/verifications.mjs), how the
 * old one-paragraph ones read in that layout ([rewriteLegacyReport]), and how the site
 * shows them (Luis, 2026-10-07). WalletScrutinyAndroid's AbsReport and Markdown views do
 * the same, so keep the two alike.
 */

const VERDICT_HEADLINES = {
  reproducible: (subject) => `**Reproducible.** We built ${subject} from its public source code and got the same app users download.`,
  not_reproducible: (subject) => `**Not reproducible.** We built ${subject} from its public source code, and the result does not match the official app.`,
  ftbfs: (subject) => `**Failed to build.** We could not build ${subject} from its public source code.`
};

/**
 * Script output is plain text written for a terminal. Keep its line breaks and stop
 * markdown from reading it as emphasis, headings, quotes or HTML (the site would drop
 * "<binary>"). "- item" lines still render as lists.
 */
function plainTextToMarkdown(text) {
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim() !== '' && line.trim() !== '.')
    .map(line => line
      .replace(/[\\`*_]/g, '\\$&')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/^(\s*)([#>=+]|-(?! ))/, '$1\\$2'))
    .join('  \n');
}

/**
 * Markdown body of an automatic verification: the verdict in plain words and the official
 * hashes first, then everything technical (command, script notes, ...) in a collapsed
 * "Other information" block. Build-dir paths are made relative, since nobody outside the
 * build server can open them.
 */
export function buildVerificationContent({
  verdict,
  version,
  architecture,
  type,
  hashes = [],
  basedOnId,
  basedOnPubkey,
  scriptVersion,
  notes,
  command,
  buildDir,
  versionOverrideNote
}) {
  const stripBuildDir = (text) => {
    if (!buildDir) {
      return text;
    }
    const prefix = buildDir.endsWith('/') ? buildDir : buildDir + '/';
    return text.split(prefix).join('').split(buildDir).join('.');
  };

  const variant = [architecture, type].filter(Boolean).join(' / ');
  const subject = `version ${version}${variant ? ` (${variant})` : ''}`;
  // Unknown verdicts (one old "warning") get no sentence rather than a wrong one.
  const sections = [VERDICT_HEADLINES[verdict]?.(subject)].filter(Boolean);

  const officialHashes = (hashes ?? []).filter(Boolean);
  if (officialHashes.length === 1) {
    sections.push(`**Official app (SHA-256):** \`${officialHashes[0]}\``);
  } else if (officialHashes.length > 1) {
    sections.push(['**Official files (SHA-256):**', ...officialHashes.map(hash => `- \`${hash}\``)].join('\n'));
  }

  const details = [];
  if (basedOnId) {
    details.push(`- Build script from verification \`${basedOnId}\`${basedOnPubkey ? ` by \`${basedOnPubkey}\`` : ''}`);
  }
  if (scriptVersion) {
    details.push(`- Script version: ${scriptVersion}`);
  }
  if (command) {
    details.push(`- Command: \`${stripBuildDir(command).replace(/`/g, "'")}\``);
  }
  if (versionOverrideNote) {
    details.push(`- ${versionOverrideNote}`);
  }

  const notesText = notes != null ? plainTextToMarkdown(stripBuildDir(String(notes))) : '';
  const otherInformation = [
    '<details>',
    '<summary>Other information</summary>',
    '',
    details.join('\n'),
    ...(notesText ? ['', '**Notes from the script**', '', notesText] : []),
    '',
    '</details>'
  ];
  sections.push(otherInformation.join('\n'));

  return sections.join('\n\n') + '\n';
}

const LEGACY = new RegExp(
  '^Automatic verification by WalletScrutiny Build Server for wallet version (.+?)\\s*' +
  '(?:with architecture: (\\S+))?\\s*(?:type: (\\S+))?\\s*, ' +
  'based on verification ([0-9a-f]{64}) by ([0-9a-f]{64})\\. ' +
  'The script was executed with these parameters: ([\\s\\S]*)$'
);
const LEGACY_NOTES = ' - Notes from the developer of the script: ';
const LEGACY_SCRIPT_VERSION = / - Script version: (\S+?)\.$/;
const LEGACY_VERSION_OVERRIDE = / (The asset registration listed version .+?; the APK versionName is .+?\.)$/;
const SHA256 = /^[0-9a-f]{64}$/;

/**
 * [report] in today's layout when it is a build-server report from before
 * walletscrutinycom MR 1696, else null. Those were one paragraph: boilerplate, the command
 * with its build-dir paths, and the script's notes pasted mid-sentence. The verdict and the
 * official hashes are the event's `status` and `x` tags.
 */
export function rewriteLegacyReport(report, tags = []) {
  const m = LEGACY.exec(String(report ?? ''));
  if (!m) {
    return null;
  }
  let rest = m[6];
  let notes = null;
  const at = rest.indexOf(LEGACY_NOTES);
  if (at >= 0) {
    // The server put a "." after the notes, mostly on a line of its own.
    notes = rest.substring(at + LEGACY_NOTES.length).replace(/\.$/, '');
    rest = rest.substring(0, at);
  }
  let scriptVersion = null;
  const sv = LEGACY_SCRIPT_VERSION.exec(rest);
  if (sv) {
    scriptVersion = sv[1];
    rest = rest.substring(0, sv.index);
  }
  let versionOverrideNote = null;
  const vo = LEGACY_VERSION_OVERRIDE.exec(rest);
  if (vo) {
    versionOverrideNote = vo[1];
    rest = rest.substring(0, vo.index);
  }
  const command = rest.trim();
  // The script lies in the build dir, so the command's first word gives it away.
  const script = command.split(' ')[0];
  const buildDir = script.startsWith('/') && script.slice(1).includes('/') ? script.substring(0, script.lastIndexOf('/')) : null;
  const first = name => tags.find(t => t.length > 1 && t[0] === name)?.[1];
  return buildVerificationContent({
    verdict: first('status'),
    version: m[1],
    architecture: m[2] || null,
    type: m[3] || null,
    hashes: tags.filter(t => t.length > 1 && t[0] === 'x' && SHA256.test(t[1])).map(t => t[1]),
    basedOnId: m[4],
    basedOnPubkey: m[5],
    scriptVersion,
    notes,
    command: command || null,
    buildDir,
    versionOverrideNote,
  });
}

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
