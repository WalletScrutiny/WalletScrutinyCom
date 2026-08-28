# Verification Utils

## Requirements

- Node.js 12.0.0 or higher
- npm (Node Package Manager)

## Installation

Install dependencies:

```bash
npm install
```

## Nostr Events Backup

This simple Node.js script gets all the Nostr events related with the Verifications feature.

### Usage

```bash
node backupNostrVerificationEvents.mjs
```

You'll get one file for each event in `backup/nostr-verification-events/{event_kind}`, so Asset Registrations will be at `backup/nostr-verification-events/1063`, Verifications at `backup/nostr-verification-events/30301`, and so on.


## Blossom Spam / Orphaned Files Checker

This script checks for orphaned files in the Blossom blobs directory.

### Usage

```bash
node checkBlossomSpam.mjs
node checkBlossomSpam.mjs --delete
```

You'll get a list of unreferenced blobs with their upload timestamps. Files older than the local Nostr event backup cannot be classified as true orphans; only blobs inside the backup coverage window are candidates for deletion. `--delete` removes those likely orphans from the Blossom blobs directory and sqlite database. You'll need SSH access to the Blossom server to run this script.