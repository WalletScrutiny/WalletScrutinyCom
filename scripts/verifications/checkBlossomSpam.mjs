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
const BLOSSOM_SQLITE_PATH = "/root/blossom-server/data/sqlite.db";
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

function parseArgs(argv) {
  const deleteOrphans = argv.includes("--delete");
  const unknown = argv.filter((arg) => arg.startsWith("-") && arg !== "--delete");
  if (unknown.length > 0) {
    console.error(`Unknown argument(s): ${unknown.join(", ")}`);
    console.error("Usage: node checkBlossomSpam.mjs [--delete]");
    process.exit(1);
  }
  return { deleteOrphans };
}

function isSha256Hex(value) {
  return /^[0-9a-f]{64}$/.test(value);
}

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

function formatIso(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function monthKey(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 7);
}

function printMonthSummary(blobs) {
  const counts = new Map();
  for (const blob of blobs) {
    const key = monthKey(blob.uploaded);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  for (const key of [...counts.keys()].sort()) {
    console.log(`  ${key}  ${counts.get(key)}`);
  }
}

function printBlobLines(blobs) {
  for (const blob of blobs) {
    const size = formatSize(blob.size).padStart(10);
    const type = (blob.type || "-").padEnd(45);
    console.log(`  ${formatIso(blob.uploaded)}  ${size}  ${type}  ${blob.sha256}`);
  }
}

function getRemoteBlobs() {
  const sql = `SELECT sha256, uploaded, IFNULL(type,''), size FROM blobs WHERE uploaded >= ${MIN_CREATED_AT};`;
  const remote = `sqlite3 -separator '|' ${BLOSSOM_SQLITE_PATH} ${JSON.stringify(sql)}`;
  const output = execSync(`ssh ${BLOSSOM_SSH_HOST} ${JSON.stringify(remote)}`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });

  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha256, uploaded, type, size] = line.split("|");
      return {
        sha256,
        uploaded: Number(uploaded),
        type,
        size: Number(size),
      };
    })
    .filter((blob) => blob.sha256 && Number.isFinite(blob.uploaded));
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
  let oldestCreatedAt = null;
  let newestCreatedAt = null;
  let eventCount = 0;

  for (const dir of BACKUP_KIND_DIRS) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const event = JSON.parse(raw);
      eventCount += 1;
      const createdAt = event.created_at;
      if (Number.isFinite(createdAt)) {
        if (oldestCreatedAt === null || createdAt < oldestCreatedAt) {
          oldestCreatedAt = createdAt;
        }
        if (newestCreatedAt === null || createdAt > newestCreatedAt) {
          newestCreatedAt = createdAt;
        }
      }
      for (const h of collectHashesFromEventTags(event.tags)) {
        hashes.add(h);
      }
    }
  }

  return { hashes, oldestCreatedAt, newestCreatedAt, eventCount };
}

function deleteRemoteBlobs(blobs) {
  const hashes = blobs.map((blob) => blob.sha256).filter(isSha256Hex);
  if (hashes.length !== blobs.length) {
    throw new Error("Refusing to delete: one or more hashes are not 64-char hex");
  }

  const remotePy = `
import glob
import os
import sqlite3

blobs_dir = ${JSON.stringify(BLOSSOM_BLOBS_PATH)}
db_path = ${JSON.stringify(BLOSSOM_SQLITE_PATH)}
hashes = ${JSON.stringify(hashes)}
conn = sqlite3.connect(db_path)
deleted = 0
failed = 0
for h in hashes:
    if len(h) != 64 or any(c not in "0123456789abcdef" for c in h):
        print("FAIL " + h + " invalid hash")
        failed += 1
        continue
    paths = glob.glob(os.path.join(blobs_dir, h)) + glob.glob(os.path.join(blobs_dir, h + ".*"))
    try:
        for path in paths:
            os.remove(path)
        conn.execute("DELETE FROM owners WHERE blob = ?", (h,))
        conn.execute("DELETE FROM accessed WHERE blob = ?", (h,))
        conn.execute("DELETE FROM blobs WHERE sha256 = ?", (h,))
        conn.commit()
        print("DELETED " + h)
        deleted += 1
    except Exception as error:
        conn.rollback()
        print("FAIL " + h + " " + str(error))
        failed += 1
conn.close()
print("SUMMARY deleted=" + str(deleted) + " failed=" + str(failed))
`;

  const output = execSync(`ssh ${BLOSSOM_SSH_HOST} python3 -`, {
    encoding: "utf-8",
    input: remotePy,
    stdio: ["pipe", "pipe", "pipe"],
  });
  return output.trim();
}

function main() {
  const { deleteOrphans } = parseArgs(process.argv.slice(2));

  console.log(`[1/3] Checking SSH access to ${BLOSSOM_SSH_HOST}...`);
  if (!checkSshAccess()) {
    console.error(
      `ERROR: No SSH access to ${BLOSSOM_SSH_HOST}. ` +
      `Make sure your SSH key is authorized on the remote server.`
    );
    process.exit(1);
  }
  console.log("  SSH access OK\n");

  console.log(`[2/3] Listing remote blobs uploaded since ${formatIso(MIN_CREATED_AT)}...`);
  const blobs = getRemoteBlobs();
  console.log(`  Found ${blobs.length} blobs in sqlite (${BLOSSOM_SQLITE_PATH})\n`);

  console.log(
    `[3/3] Reading backup events (kinds ${assetRegistrationKind}, ${assetBundleRegistrationKind}, ${verificationKind}, ${verificationDraftKind}) from ${BACKUP_ROOT}/...`
  );
  const { hashes: referencedBlobHashes, oldestCreatedAt, newestCreatedAt, eventCount } =
    getReferencedBlobHashesFromBackup();
  console.log(`  Backup events: ${eventCount}`);
  if (oldestCreatedAt !== null) {
    console.log(`  Backup created_at range: ${formatIso(oldestCreatedAt)} .. ${formatIso(newestCreatedAt)}`);
  }
  console.log(
    `  Found ${referencedBlobHashes.size} unique blob refs ("x" and "output-file" hashes)\n`
  );

  const orphanedBlobs = blobs
    .filter((blob) => !referencedBlobHashes.has(blob.sha256))
    .sort((a, b) => b.uploaded - a.uploaded);

  if (orphanedBlobs.length === 0) {
    console.log(
      "No orphaned files found. All blobs are referenced by Asset Registry, Verification, or VerificationDraft events."
    );
    return;
  }

  const backupCoverageStart = oldestCreatedAt ?? MIN_CREATED_AT;
  const unverifiable = orphanedBlobs.filter((blob) => blob.uploaded < backupCoverageStart);
  const likelyOrphans = orphanedBlobs.filter((blob) => blob.uploaded >= backupCoverageStart);

  console.log(
    `Found ${orphanedBlobs.length} blob(s) not referenced by any backed-up event.\n`
  );
  console.log("By upload month:");
  printMonthSummary(orphanedBlobs);
  console.log("");

  if (oldestCreatedAt !== null && oldestCreatedAt > MIN_CREATED_AT && unverifiable.length > 0) {
    console.log(
      `WARNING: local backup only goes back to ${formatIso(oldestCreatedAt)}, ` +
      `but this check includes blobs since ${formatIso(MIN_CREATED_AT)}.`
    );
    console.log(
      `${unverifiable.length} unreferenced blob(s) are older than the backup and cannot be classified as true orphans.`
    );
    console.log(
      "Copy older backup JSON files into backup/nostr-verification-events/ (or re-fetch with a longer window), then re-run this script.\n"
    );
  }

  if (likelyOrphans.length > 0) {
    console.log(
      `Likely orphans (uploaded on or after backup coverage ${formatIso(backupCoverageStart)}): ${likelyOrphans.length}\n`
    );
    printBlobLines(likelyOrphans);
    console.log(
      `\nThese files can be reviewed for deletion by an administrator from ${BLOSSOM_BLOBS_PATH}/`
    );
    if (!deleteOrphans) {
      console.log("Re-run with --delete to remove them from Blossom (files + sqlite rows).\n");
    } else {
      console.log("");
    }
  }

  if (unverifiable.length > 0) {
    console.log(
      `Outside backup window (do not delete until events are backed up): ${unverifiable.length}\n`
    );
    printBlobLines(unverifiable);
    if (deleteOrphans) {
      console.log("\n--delete does not remove blobs outside the backup coverage window.");
    }
  }

  if (!deleteOrphans) {
    return;
  }

  if (likelyOrphans.length === 0) {
    console.log("\n--delete: nothing to delete.");
    return;
  }

  console.log(`\n[delete] Removing ${likelyOrphans.length} likely orphan(s) on ${BLOSSOM_SSH_HOST}...`);
  const deleteOutput = deleteRemoteBlobs(likelyOrphans);
  console.log(deleteOutput);
  const summaryLine = deleteOutput.split("\n").find((line) => line.startsWith("SUMMARY "));
  if (!summaryLine || !/failed=0$/.test(summaryLine)) {
    process.exit(1);
  }
}

main();
