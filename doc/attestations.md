# Binary Attestations via Nostr

## Core Concepts

### Attestations
An attestation is a signed statement about a binary with a specific hash, declaring whether it could be reproduced from source code or not. The attestation includes:
- The binary's hash
- Reproducibility status (reproducible/not_reproducible)
- Detailed explanation of the reproduction attempt
- Build instructions or documentation used
- The reproducer can update their replaceable attestations

### Trust Model
Trust in attestations is built through:
- Cross-verification: Other users verify attestations by following the same process
- Network Trust: Using an anchor account (e.g., WalletScrutiny's nostr account) to filter relevant attestations through n-th degree follows
- Track Record: Reproducers build reputation through consistently accurate attestations that others can verify

*Note: Traditional trust metrics like account age or follower count are not reliable in nostr.*

## Implementation

### Storage (Blossom)
- Binary storage implemented via Blossom protocol
- Multiple Blossom servers can participate
- Each binary submission must be referenced by nostr events
- Binary providers and verifiers can be different entities
- Binaries not referenced by relevant nostr events may get deleted after a certain period
- Binaries might be referenced by more than one [nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) Asset Registration event. The client has to consolidate these

### Conflicting Attestations
- Multiple attestations for the same binary are allowed and expected
- Conflicting results (reproducible vs non-reproducible) are not hidden
- For the perspective of an anchor account, a consolidated score is presented
- Users can evaluate verifiers credibility and documentation quality
- UI should display all attestations with their verification status

### Event Types

#### Asset Registration ([nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) / kind 1063)
```json
{
  "id":      "<asset-event-id>",
  "kind":    1063,
  "tags":    [
    ["i",        "app.zeusln.zeus"],
    ["url",      "https://example.com/wallet-1.2.3.deb"],
    ["version",  "1.2.3"],
    ["m",        "application/vnd.android.package-archive"],
    ["x",        "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["ox",       "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["platform", "Linux (Intel/AMD) (Ubuntu/Debian)"]
  ],
  "content": "Additional metadata"
}
```

#### Attestation
```json
{
  "id":      "<attestation-event-id>",
  "kind":    30301,
  "tags":    [
    ["d",       "<asset-event-id>"],
    ["x",       "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["status",  "reproducible"]
  ],
  "content": "Detailed reproduction process and results. Markdown permitted"
}
```

#### Endorsement
```json
{
  "kind":    30302,
  "tags":    [
    ["d",       "<attestation-event-id>"],
    ["x",       "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["status",  "reproducible"]
  ],
  "content": "Brief summary of what happened when you tried to reproduce a specific attestation. No markdown permitted"
}
```

*Note: Replacing the Attestation event invalidates the Endorsement. Clients should find where this happens and ask for re-endorsement.*

## Functionality presented to users
1. Assets page: by default will show the latest assets found, with search functionality that let users search
for a specific asset by hash or download url. The list will show the attestations each binary has, or lack of. It
will also have a way to upload binaries and create "Asset Registration" events. 
2. Current wallet pages in WS: show binaries with their attestation result (if any), and buttons that go to pages
with instructions describing how to do a proper attestation.
3. Current wallet pages in WS: ability to upload a binary and send the "Asset Registration" event to Nostr.
4. Leaderboard - Top Verifiers
5. Leaderboard - Top Binary providers.

## Other functionality
1. A script needs to be created to backup all events related with Attestations and Opinions to disk.
2. If WS wants to amend an event (probably the Asset Registration one), we can create a new one that will have
the correct information. We'll make both discoverable by users, but the WS one will take precedence.

## Documentation needed
### For Reproducers
1. Standard attestation template
2. Guide for proper build environment setup
3. Common issues and solutions
4. Best practices for documentation

### For Wallet Providers
1. Requirements for build instructions
2. Recommended build environment specifications
3. Guidelines for deterministic builds
