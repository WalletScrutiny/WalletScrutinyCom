/**
 * Readers for the local Nostr event backup written by
 * backupNostrVerificationEvents.mjs (backup/, gitignored):
 *   backup/nostr-verification-events/<kind>/<id>.json
 *   backup/nostr-opinion-events/30023/<id>.json
 * Shared by checkBackupEventsOnRelays.mjs and republishBackupEvents.mjs.
 */

import fs from "fs";
import path from "path";
import {
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  endorsementKind,
  opinionKind,
} from "../../src/nostr-constants.mjs";

export const BACKUP_BASE_DIR = path.join(process.cwd(), "backup");

export const BACKUP_VERIFICATION_KINDS = [
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  endorsementKind,
];

export const BACKUP_KINDS = [...BACKUP_VERIFICATION_KINDS, opinionKind];

export function backupKindDir(kind) {
  const typeDir = kind === opinionKind ? "nostr-opinion-events" : "nostr-verification-events";
  return path.join(BACKUP_BASE_DIR, typeDir, String(kind));
}

/** Events of one kind directory; each carries backupFileSizeBytes. */
export function loadBackupEventsOfKind(kind) {
  const kindDir = backupKindDir(kind);
  if (!fs.existsSync(kindDir)) {
    return [];
  }

  const events = [];
  for (const file of fs.readdirSync(kindDir)) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const filePath = path.join(kindDir, file);
    const fileBytes = fs.statSync(filePath).size;
    const event = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (event?.id) {
      events.push({ ...event, backupFileSizeBytes: fileBytes });
    }
  }
  return events;
}

export function loadAllBackupEvents(kinds = BACKUP_KINDS) {
  return kinds.flatMap(kind => loadBackupEventsOfKind(kind));
}
