# Nostr Verification Tools

Interactive TUI for checking whether Nostr relays are storing WalletScrutiny verification events.

## Run

```
# From repo root
node scripts/verifications/tools/verification-tool.mjs
```

Requires Node.js 18.6+ and `npm install` from the repo root. Backup data expected at `backup/nostr-verification-events/`.

## Menu options

1. Count kind 30301 events in local backup by pubkey.
2. Cross-reference backup events against all configured relays (matrix, missing report, author view).
3. Run the Nostr backup script (`scripts/nostr/backupNostrVerificationEvents.mjs`).
4. Quick count of WalletScrutiny events on `relay.nostr.info`.
5. Re-publish all backup events to `relay.nostr.info` (inverse backup).

## Files

- `verification-tool.mjs` — entry point, menu loop, and action handlers.
- `menu-handler.mjs` — menu state and keyboard navigation logic.
- `ui-renderer.mjs` — terminal rendering, ANSI output, and key input.
- `analysis-engine.mjs` — loads and caches backup/relay data, coverage analysis.
- `nostr-data.mjs` — fetches events from relays using NDK.
- `report-generator.mjs` — builds the relay matrix and missing-events report text.
- `publishToRelay.mjs` — re-publishes signed backup events to a relay (inverse backup).
- `checkRelay.mjs` — standalone script to query any relay URL from the command line.

## Notes

- Run from repo root; paths are resolved via `process.cwd()`.
- Relay URLs are read from `src/nostr-constants.mjs`.
- Only events tagged `client=WalletScrutiny.com` are included.
