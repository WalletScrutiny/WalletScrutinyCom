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
```

You'll get a list of orphaned files that can be safely deleted by an administrator from the Blossom blobs directory. You'll need SSH access to the Blossom server to run this script.