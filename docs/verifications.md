# Binary Verifications via Nostr

## Core Concepts

### Verifications
A verification is a signed statement about a binary with a specific hash, declaring whether it could be reproduced from source code or not. The verification includes:
- The binary's hash
- Reproducibility status (reproducible/not_reproducible)
- Detailed explanation of the reproduction attempt
- Build instructions or documentation used
- The reproducer will be able to publish a verification directly or as a draft. In the latter case, it will not be displayed directly (only if users opt to view them), and it can be definitively published later.
- The reproducer can upload scripts or other files that help with the reproduction process. These files will be displayed in the verification details.

### Trust Model
Trust in verifications is built through:
- Cross-verification: Other users verify verifications by following the same process
- Network Trust: Using an anchor account (e.g., WalletScrutiny's nostr account) to filter relevant verifications through n-th degree follows
- Track Record: Reproducers build reputation through consistently accurate verifications that others can verify

*Note: Traditional trust metrics like account age or follower count are not reliable in nostr.*

## Implementation

### Storage (Blossom)
- Binary storage implemented via Blossom protocol
- Multiple Blossom servers can participate
- Each binary submission must be referenced by nostr events
- Binary providers and verifiers can be different entities
- Binaries not referenced by relevant nostr events may get deleted after a certain period
- Binaries might be referenced by more than one [nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) Asset Registration event. The client has to consolidate these

### Conflicting Verifications
- Multiple verifications for the same binary are allowed and expected
- Conflicting results (reproducible vs non-reproducible) are not hidden
- For the perspective of an anchor account, a consolidated score is presented
- Users can evaluate verifiers credibility and documentation quality
- UI should display all verifications with their verification status

### Event Types

#### Asset Registration ([nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) / kind 1063)
```json
{
  "id":      "<asset-event-id>",
  "kind":    1063,
  "tags":    [
    ["i",        "<product-id>"],         // app.zeusln.zeus
    ["version",  "<version>"],            // 1.2.3
    ["x",        "<asset-hash>"],         // deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe
    ["ox",       "<asset-hash>"],         // deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe
    ["m",        "<mime-type>"],          // application/vnd.android.package-archive
    ["platform", "<asset-platform>"]      // Linux (Intel/AMD) (Ubuntu/Debian)
  ],
  "content": "Asset description"
}
```

#### Verification
```json
{
  "id":      "<verification-event-id>",
  "kind":    30301,
  "tags":    [
    ["i",        "<product-id>"],           // app.zeusln.zeus
    ["version",  "<version>"],              // 1.2.3
    ["x",        "<hash-binary-1>"],        // deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe
    ["x",        "<hash-binary-2>"],        // deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe
    ["platform", "<asset-platform>"],       // Linux (Intel/AMD) (Ubuntu/Debian)
    ["status",   "<status>"],               // reproducible | not_reproducible | ftbfs | spam | notag | nosource | warning | obfuscated
    ["file-attachment", "<file-attachment-event-id-1>"],        // file-attachment-event-id 1
    ["file-attachment", "<file-attachment-event-id-2>"],        // file-attachment-event-id 2 ...
    ["output-file", "filename-file-1", "<hash-output-file-1>"], // filename-file-1, hash-output-file-1
    ["output-file", "filename-file-2", "<hash-output-file-2>"]  // filename-file-2, hash-output-file-2 ...
  ],
  "content": {
    "description": "<Description of the assets the user is trying to reproduce>",
    "content": "<Detailed reproduction process and results. Markdown permitted>"
  }
}
```

* file-attachment - event_id of the event containing the file used to reproduce the binary (see below)
* output-file - hash of the output logs of the reproduction process, or asciicast file, or diffoscope file, etc.

#### Verification Draft

Has the same structure as the Verification event, with the following differences:
- `kind`: 30801
- `tags`: includes a `d` tag with the draft key: ${appId}:${version}:${platform}

```json
{
  "id":      "<verification-event-id>",
  "kind":    30801,
  "tags":    [
    [...],                                // same tags as the Verification event
    ["d",    "<draft-key>"]               // draft-key
  ],
  "content": {
    [...],                                // same content as the Verification event
  }
}
```

#### File Attachment
```json
{
  "id":      "<file-attachment-event-id>",
  "kind":    1063,
  "tags":    [
    ["filename", "<file-name>"],
    ["content-type", "<mime-type>"],
    ["size", "<file-size>"]
  ],
  "content": "<Base64 encoded file content>"
}
```

Max length of fields (chars):
* Asset description - `content`: 120
* Verification - content.`description`: 120
* Verification - content.`content`: 60,000
* Tag `i`: 50
* Tag `version`: 30
* Tag `x/ox`: 64
* Tag `platform`: 10
* Tag `status`: 16
* Tag `output-file`: 64
* Tag `file-attachment`: 64

## Functionality presented to users
1. Assets Registry page: by default will show the latest assets reported by users, with search functionality that let users search
for a specific asset by hash or download url. The list will show the verifications each binary has, or lack of. It
will also have a way to upload binaries and create "Asset Registration" events. 
2. Current wallet pages in WS: show binaries with their verification result (if any), and buttons that go to pages
with instructions describing how to do a proper verification.
3. Current wallet pages in WS: ability to upload a binary and send the "Asset Registration" event to Nostr.
4. Leaderboard - Top Build Verifiers
5. Leaderboard - Top Binary providers.

## Other functionality
1. A script needs to be created to backup all events related with Verifications and Opinions to disk.
2. If WS wants to amend an event (probably the Asset Registration one), we can create a new one that will have
the correct information. We'll make both discoverable by users, but the WS one will take precedence.

## Documentation needed
### For Reproducers
1. Standard verification template
2. Guide for proper build environment setup
3. Common issues and solutions
4. Best practices for documentation

### For Wallet Providers
1. Requirements for build instructions
2. Recommended build environment specifications
3. Guidelines for deterministic builds
