// The build-lock.json that ws-buildlock.sh writes (scripts/rb/README.md), as
// the verification form takes it among the output files: recognised by its
// content, saved under one name, and refused when it can't describe this
// verification's build (#1000).

export const BUILD_LOCK_FILE_NAME = 'build-lock.json';

// An asciicast or a build log can be far larger than any build-lock; past this
// size a file is not read as text at all.
const MAX_BUILD_LOCK_BYTES = 64 * 1024 * 1024;

const BUILD_FIELDS = [
  // [field in the file, field in the form, name in the message]
  ['appId', 'appId', 'app'],
  ['appVersion', 'version', 'version'],
  ['platform', 'platform', 'platform'],
];

export const NO_BUILD_NAMED_MESSAGE = "This build-lock.json doesn't say which build it belongs to. Run ws-buildlock.sh 0.3.0 or later with --app-id, --version and --platform, and upload the new file.";
export const SECOND_BUILD_LOCK_MESSAGE = 'Only one build-lock.json can go with a verification. Remove the other one.';
export const MISSING_BUILD_LOCK_MESSAGE = 'The script of this verification runs ws-buildlock.sh, but no build-lock.json is attached. Drop the build-lock.json it printed in the box that starts "For larger files".';

export function anotherBuildMessage(name, fileValue, formValue) {
  return `This build-lock.json belongs to another build: it says ${name} ${fileValue}, this verification says ${formValue || '(none)'}.`;
}

/**
 * The header of a build-lock, or null when the text is not one. Any JSON
 * object with "tool": "ws-buildlock" is a build-lock, whatever its file name.
 */
export function parseBuildLockText(text) {
  if (typeof text !== 'string' || !text.includes('ws-buildlock')) return null;
  let doc;
  try { doc = JSON.parse(text); } catch { return null; }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc) || doc.tool !== 'ws-buildlock') return null;
  return {
    schema: doc.schema ?? null,
    appId: doc.appId ?? null,
    appVersion: doc.appVersion ?? null,
    platform: doc.platform ?? null,
  };
}

export async function readBuildLock(file) {
  if (!file || typeof file.text !== 'function' || file.size > MAX_BUILD_LOCK_BYTES) return null;
  return parseBuildLockText(await file.text());
}

// An output file entry of the form that is a build-lock: read and parsed when
// it was added, or loaded from a draft, where only the name is known.
export function isBuildLockEntry(entry) {
  return Boolean(entry?.buildLock) || entry?.name === BUILD_LOCK_FILE_NAME;
}

/**
 * Why this build-lock can't go with the verification, or null. `form` holds
 * appId, version and platform as the form has them; a field still empty is
 * not compared unless `complete` is set (on submit).
 */
export function buildLockProblem(buildLock, form, { complete = false } = {}) {
  if (buildLock.schema !== 2 || BUILD_FIELDS.some(([field]) => buildLock[field] === null)) {
    return NO_BUILD_NAMED_MESSAGE;
  }
  for (const [field, formField, name] of BUILD_FIELDS) {
    const formValue = String(form?.[formField] ?? '').trim();
    if (!formValue && !complete) continue;
    // compared as the checker's matchBuild does: trimmed form value, any case
    if (String(buildLock[field]).toLowerCase() !== formValue.toLowerCase()) {
      return anotherBuildMessage(name, buildLock[field], formValue);
    }
  }
  return null;
}

// A script calls ws-buildlock.sh when a line other than a comment names it.
export function scriptCallsBuildLock(text) {
  if (typeof text !== 'string') return false;
  return text.split('\n').some((line) => !line.trimStart().startsWith('#') && line.includes('ws-buildlock.sh'));
}

/**
 * The first reason the verification can't be published as it is, or null.
 * `outputFiles` are the form's entries, `scripts` the text of every uploaded
 * or reused script.
 */
export function buildLockSubmitProblem({ outputFiles = [], scripts = [], form = {}, status = '' }) {
  const buildLocks = outputFiles.filter(isBuildLockEntry);
  if (buildLocks.length > 1) return SECOND_BUILD_LOCK_MESSAGE;
  if (buildLocks.length === 1) {
    // a draft's file was checked when it was added; its content isn't here
    return buildLocks[0].buildLock ? buildLockProblem(buildLocks[0].buildLock, form, { complete: true }) : null;
  }
  // a build that failed has no build-lock to give
  if (status !== 'ftbfs' && scripts.some(scriptCallsBuildLock)) return MISSING_BUILD_LOCK_MESSAGE;
  return null;
}

if (typeof window !== 'undefined') {
  window.BUILD_LOCK_FILE_NAME = BUILD_LOCK_FILE_NAME;
  window.readBuildLock = readBuildLock;
  window.isBuildLockEntry = isBuildLockEntry;
  window.buildLockProblem = buildLockProblem;
  window.buildLockSubmitProblem = buildLockSubmitProblem;
  window.SECOND_BUILD_LOCK_MESSAGE = SECOND_BUILD_LOCK_MESSAGE;
}
