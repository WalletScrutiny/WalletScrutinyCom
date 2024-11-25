# Binary Attestations via Nostr

## Core Concepts

### Attestations
An attestation is a signed statement about a binary with a specific hash, declaring whether it could be reproduced from source code or not. The attestation includes:
- The binary's hash
- Reproducibility status (reproducible/not-reproducible)
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
- Binary providers and attestators can be different entities
- Binaries not referenced by relevant nostr events may get deleted after a certain period
- Binaries might be referenced by more than one kind 1063 event. The client has to consolidate these

### Conflicting Attestations
- Multiple attestations for the same binary are allowed and expected
- Conflicting results (reproducible vs non-reproducible) are not hidden
- For the perspective of an anchor account, a consolidated score is presented
- Users can evaluate attestator credibility and documentation quality
- UI should display all attestations with their verification status

### Event Types

#### Asset Registration ([nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) / kind 1063)
```json
{
  "id":      "<asset-event-id>",
  "kind":    1063,
  "tags":    [
    ["url",      "https://example.com/wallet-1.2.3.deb"],
    ["version",  "1.2.3"],
    ["m",        "application/vnd.android.package-archive"],
    ["x",        "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["ox",       "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["platform", "Linux (Intel/AMD) (Ubuntu/Debian)"],
    ["size",     "<size of file in bytes>"]    // optional
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
    ["d",            "<asset-event-id>"],
    ["status",       "reproducible"],
    ["instructions", "<url-to-build-instructions>"]
  ],
  "content": "Detailed reproduction process and results"
}
```

#### Endorsement
```json
{
  "kind":    30302,
  "tags":    [
    ["d",      "<attestation-event-id>"],
    ["result", false]
  ],
  "content": "I don't get the same result as the attester. Got differences in file xx and yy"
}
```

*Note: Replacing the Attestation event invalidates the Endorsement. Clients should find where this happens and ask for re-endorsement.*

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

## Future Considerations
1. Gamification with a Leaderboard for both Reproducers and Binary providers
2. Website to find binaries that await reproduction
3. Search by hash or download url
