#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationDraftKind,
  verificationKind,
} from "../../src/nostr-constants.mjs";

const BLOSSOM_SSH_HOST = process.env.BLOSSOM_SSH_HOST || "files.nostr.info";
const BLOSSOM_BLOBS_PATH = "/root/blossom-server/data/blobs";
// We're only checking for blobs created after this timestamp to avoid checking
// for blobs that were created before the WS Nostr relay was created. Before
// that date, relays are already missing some events.
const MIN_CREATED_AT = 1775900133;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_ROOT = path.resolve(__dirname, "../../backup/nostr-verification-events");
const BACKUP_KIND_DIRS = [
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  verificationDraftKind,
].map((kind) => path.join(BACKUP_ROOT, String(kind)));

function checkSshAccess() {
  try {
    execSync(`ssh -o BatchMode=yes -o ConnectTimeout=5 ${BLOSSOM_SSH_HOST} echo ok`, {
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

function getRemoteBlobFiles() {
  const output = execSync(
    `ssh ${BLOSSOM_SSH_HOST} "find ${BLOSSOM_BLOBS_PATH} -type f -newermt @${MIN_CREATED_AT} -printf '%f\\n'"`,
    { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
  );
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((f) => f.replace(/\.[^.]+$/, ""));
}

function collectHashesFromEventTags(tags) {
  const out = new Set();
  if (!Array.isArray(tags)) {
    return out;
  }
  for (const tag of tags) {
    if (!Array.isArray(tag)) {
      continue;
    }
    if (tag[0] === "x" && tag[1]) {
      out.add(tag[1]);
    }
    if (tag[0] === "output-file" && tag[2]) {
      out.add(tag[2]);
    }
  }
  return out;
}

function getReferencedBlobHashesFromBackup() {
  const hashes = new Set();

  for (const dir of BACKUP_KIND_DIRS) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const event = JSON.parse(raw);
      for (const h of collectHashesFromEventTags(event.tags)) {
        hashes.add(h);
      }
    }
  }

  return hashes;
}

function main() {
  console.log("=== Blossom Spam / Orphaned Files Checker ===\n");

  console.log(`[1/3] Checking SSH access to ${BLOSSOM_SSH_HOST}...`);
  if (!checkSshAccess()) {
    console.error(
      `ERROR: No SSH access to ${BLOSSOM_SSH_HOST}. ` +
      `Make sure your SSH key is authorized on the remote server.`
    );
    process.exit(1);
  }
  console.log("  SSH access OK\n");

  console.log(`[2/3] Listing remote blobs from ${BLOSSOM_BLOBS_PATH}...`);
  const blobFiles = getRemoteBlobFiles();
  console.log(`  Found ${blobFiles.length} files in blobs directory\n`);

  console.log(
    `[3/3] Reading backup events (kinds ${assetRegistrationKind}, ${verificationKind}, ${verificationDraftKind}) from ${BACKUP_ROOT}/...`
  );
  const referencedBlobHashes = getReferencedBlobHashesFromBackup();
  console.log(
    `  Found ${referencedBlobHashes.size} unique blob refs ("x" and "output-file" hashes)\n`
  );

  const orphanedFiles = blobFiles.filter((f) => !referencedBlobHashes.has(f));

  console.log("=".repeat(70));
  if (orphanedFiles.length === 0) {
    console.log(
      "No orphaned files found. All blobs are referenced by Asset Registry, Verification, or VerificationDraft events."
    );
  } else {
    console.log(
      `Found ${orphanedFiles.length} orphaned file(s) in blobs (not referenced by any backed-up event):\n`
    );
    for (const f of orphanedFiles) {
      console.log(`  ${f}`);
    }
    console.log(
      `\nThese files can be safely deleted by an administrator from ${BLOSSOM_BLOBS_PATH}/`
    );
  }
  console.log("=".repeat(70));
}

main();
