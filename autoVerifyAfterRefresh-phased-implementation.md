# Auto-Verification After Refresh - Phased Implementation Plan

**Document Version**: 1.1  
**Date**: 2025-10-21  
**Last Updated**: 2025-10-21 14:58  
**Status**: Planning - Ready for Phase 1  
**GitLab MR**: #1258

## Critical Design Decision (v1.1 Update)

**Scripts are downloaded from Nostr, NOT local files**

- Verification scripts are already uploaded to Nostr as kind 1337 events
- Each verification event links to its script via `file-attachment` tags
- Automation downloads the script from the latest verification for that app
- No local script management or YAML config needed
- Always uses the same script version that produced the last verification

---

## Executive Summary

This document outlines a **phased, incremental approach** to implementing automated verification after `refresh.sh` detects new app versions. Based on feasibility analysis, we've identified critical blockers and redesigned the workflow to be **production-safe, testable, and maintainable**.

**Key Decision**: Run verification as **separate process** (not integrated into refresh.sh) to avoid breaking existing refresh workflow.

---

## Architecture Overview

### High-Level Flow

```
┌─────────────┐
│ refresh.sh  │ (unchanged - runs normally)
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────┐
│ Phase 1: Version Detection      │
│ - Compare app versions          │
│ - Compare Nostr verifications   │
│ - Write to queue file           │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│ Phase 2: Queue Processing       │
│ - Read queue (separate cron)    │
│ - Download scripts from Nostr   │
│ - Run ONE verification at a time│
│ - Capture structured output     │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│ Phase 3: Nostr Publishing       │
│ - Upload scripts to Nostr       │
│ - Publish verification events   │
│ - Update queue status           │
└─────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns**: Detection ≠ Execution ≠ Publishing
2. **Fail-Safe**: Verification failures don't break refresh.sh
3. **Observable**: Clear logging, queue status tracking
4. **Testable**: Each phase can be tested independently
5. **Incremental**: Deploy one phase at a time

---

## Phase 1: Version Detection & Queue Management

**Goal**: Detect apps needing verification and queue them for processing

**Duration**: 1-2 days  
**Risk**: Low  
**Dependencies**: None

### Implementation

**File**: `scripts/detectNewVersions.mjs`

**Purpose**: Compare app store versions with latest Nostr verifications

**Logic**:
```javascript
for each app in collections:
  appVersion = readFromMarkdown(app)
  nostrEvents = loadCachedNostrEvents(app.appId, app.platform)
  latestVerifiedVersion = getLatestVerifiedVersion(nostrEvents)
  
  if (compareVersions(appVersion, latestVerifiedVersion) > 0):
    addToQueue({ appId, version, platform, status: 'pending' })
```

**Queue File**: `data/verification-queue.json`

```json
{
  "queue": [
    {
      "id": "desktop:bitcoinknots.org:29.2.knots20251010",
      "appId": "bitcoinknots.org",
      "version": "29.2.knots20251010",
      "platform": "desktop",
      "detectedAt": "2025-10-21T04:00:00Z",
      "status": "pending",
      "priority": "high",
      "attempts": 0
    }
  ]
}
```

**Integration with refresh.sh**: Add ONE line at end (after line 116)

```bash
echo " * Detecting apps needing verification..."
node ./scripts/detectNewVersions.mjs || echo "⚠️ Version detection failed"
```

**Testing**:
```bash
node scripts/detectNewVersions.mjs
cat data/verification-queue.json | jq .
```

**Deliverables**:
- [ ] `scripts/detectNewVersions.mjs`
- [ ] `scripts/lib/queueManager.mjs`
- [ ] `data/verification-queue.json` (gitignored)
- [ ] Unit tests

---

## Phase 2: Queue Processing & Script Execution

**Goal**: Process queue and run verification scripts

**Duration**: 3-5 days  
**Risk**: Medium  
**Dependencies**: Phase 1 complete

### Implementation

**File**: `scripts/processVerificationQueue.mjs`

**Execution**: Separate cron job (NOT part of refresh.sh)

```bash
# Cron: Every 6 hours
30 */6 * * * cd /path/to/walletScrutinyCom && node scripts/processVerificationQueue.mjs
```

**Logic**:
```javascript
async function processQueue() {
  const pending = loadQueue().filter(item => item.status === 'pending');
  
  if (pending.length === 0) return;
  
  // Process ONE at a time
  const item = pending[0];
  updateQueueStatus(item.id, 'processing');
  
  try {
    // Download script from Nostr
    const script = await getLatestVerificationScript(item.appId, item.platform);
    
    if (!script) {
      updateQueueStatus(item.id, 'skipped', { reason: 'no_script_available' });
      return;
    }
    
    // Run verification with downloaded script
    const result = await runVerificationWithNostrScript(
      script, 
      item.appId, 
      item.version, 
      item.platform
    );
    
    if (result.exitCode === 0 || result.exitCode === 1) {
      updateQueueStatus(item.id, 'completed', result);
    } else {
      updateQueueStatus(item.id, 'failed', result);
    }
  } catch (error) {
    updateQueueStatus(item.id, 'failed', { error: error.message });
  }
}

async function getLatestVerificationScript(appId, platform) {
  // 1. Load cached Nostr events for this app
  const events = loadCachedNostrEvents(appId, platform);
  
  // 2. Find most recent verification event (kind 30301)
  const latestVerification = events
    .filter(e => e.kind === 30301)
    .sort((a, b) => b.created_at - a.created_at)[0];
  
  // 3. Get script event IDs from file-attachment tags
  const scriptEventIds = latestVerification.tags
    .filter(tag => tag[0] === 'file-attachment')
    .map(tag => tag[1]);
  
  // 4. Download script events from Nostr (kind 1337)
  const scriptEvents = await ndk.fetchEvents({ ids: scriptEventIds });
  
  // 5. Find the .sh file
  const scriptEvent = scriptEvents.find(e => 
    e.tags.find(t => t[0] === 'extension' && t[1] === 'sh')
  );
  
  // 6. Decode base64 content
  const scriptContent = Buffer.from(scriptEvent.content, 'base64').toString('utf8');
  
  return {
    content: scriptContent,
    version: extractVersion(scriptContent),
    eventId: scriptEvent.id
  };
}

// ... rest of the code remains the same ...
# At end of verify_bitcoinknots.sh
cat > "${WORK_DIR}/verification-result.json" <<EOF
{
  "status": "reproducible",
  "exitCode": 0,
  "hashes": ["090146ea..."],
  "summary": "Binary identical"
}
EOF

echo "VERIFICATION_RESULT_FILE=${WORK_DIR}/verification-result.json"
```

**Testing**:
```bash
node scripts/processVerificationQueue.mjs --dry-run
node scripts/processVerificationQueue.mjs --limit=1
```

**Deliverables**:
- [ ] `scripts/processVerificationQueue.mjs`
- [ ] `scripts/lib/nostrScriptDownloader.mjs` - Download scripts from Nostr
- [ ] `scripts/lib/tempScriptRunner.mjs` - Execute downloaded scripts
- [ ] `scripts/lib/outputParser.mjs`
- [ ] `scripts/lib/scriptCache.mjs` - Optional caching
- [ ] Modified verification scripts with JSON output
- [ ] Cron job configuration

**Edge Cases to Handle**:
- [ ] App has no previous verification (skip with reason)
- [ ] Script needs arguments (read from verification tags)
- [ ] Multiple files attached (Dockerfile, configs)
- [ ] Script download fails (retry with backoff)

---

## Phase 3: Nostr Publishing

**Goal**: Upload scripts and publish verification results to Nostr

**Duration**: 3-4 days  
**Risk**: High (authentication required)  
**Dependencies**: Phase 2 complete

### Prerequisites

**Authentication**: Backend needs private key

```bash
# Environment variable
export WS_BOT_NOSTR_KEY="nsec1..."
```

```javascript
// scripts/lib/nostrAuth.mjs
function getNostrPrivateKey() {
  const nsec = process.env.WS_BOT_NOSTR_KEY;
  if (!nsec) throw new Error("WS_BOT_NOSTR_KEY not set");
  return nsec;
}
```

### Implementation

**File**: `scripts/publishVerificationToNostr.mjs`

**Logic**:
```javascript
async function publishVerification(queueItem, verificationResult) {
  await initializeNostrForAutomation();
  
  // 1. Upload script (if < 60KB)
  const scriptEventId = await uploadScriptToNostr(scriptPath);
  
  // 2. Upload Dockerfile if exists
  const dockerfileEventId = await uploadScriptToNostr(dockerfilePath);
  
  // 3. Publish verification event
  const verificationEvent = await createVerification({
    hashes: verificationResult.hashes,
    description: generateDescription(queueItem, verificationResult),
    content: generateFullReport(queueItem, verificationResult),
    status: mapExitCodeToStatus(verificationResult.exitCode),
    appId: queueItem.appId,
    version: queueItem.version,
    platform: queueItem.platform,
    reusedFileIds: [scriptEventId, dockerfileEventId].filter(Boolean)
  });
  
  return verificationEvent;
}
```

**Script Size Handling**: Check all scripts

```bash
find ~/work/scripts/test -name "*.sh" -exec wc -c {} \;
```

If > 60KB: minify, split, or host externally

**Testing**:
```bash
node scripts/lib/nostrAuth.mjs --test
node scripts/lib/scriptUploader.mjs /path/to/verify_bitcoinknots.sh
node scripts/publishVerificationToNostr.mjs --queue-item-id="desktop:bitcoinknots.org:29.2"
```

**Deliverables**:
- [ ] `scripts/publishVerificationToNostr.mjs`
- [ ] `scripts/lib/nostrAuth.mjs`
- [ ] `scripts/lib/scriptUploader.mjs`
- [ ] `scripts/lib/reportGenerator.mjs`
- [ ] Environment variable setup docs
- [ ] Script size audit

---

## Phase 4: Monitoring & Maintenance

**Goal**: Observability and operational tooling

**Duration**: 2-3 days  
**Risk**: Low  
**Dependencies**: Phases 1-3 complete

### Queue Management CLI

**File**: `scripts/cli/queueManager.mjs`

```bash
node scripts/cli/queueManager.mjs status
node scripts/cli/queueManager.mjs show desktop:bitcoinknots.org:29.2
node scripts/cli/queueManager.mjs retry desktop:bitcoinknots.org:29.2
node scripts/cli/queueManager.mjs clear-completed
```

### Logging

```
/var/log/walletscrutiny/
├── verification-queue.log
├── version-detection.log
├── nostr-publishing.log
└── verifications/
    └── bitcoinknots.org-29.2-timestamp.log
```

### Error Handling

**Retry Strategy**: Exponential backoff (60, 120, 240 minutes)

**Error Classification**:
- `missing_script` - Don't retry
- `timeout` - Retry
- `resource` - Retry
- `nostr` - Retry

**Deliverables**:
- [ ] `scripts/cli/queueManager.mjs`
- [ ] `scripts/monitoring/checkQueueHealth.mjs`
- [ ] `scripts/lib/notifier.mjs`
- [ ] Log rotation configuration
- [ ] Optional: Simple HTML dashboard

---

## Deployment Timeline

### Week 1: Phase 1
- Days 1-2: Implement version detection
- Day 3: Testing and integration
- Day 4: Deploy to production

### Week 2: Phase 2
- Days 1-3: Implement queue processing
- Day 4: Modify verification scripts
- Day 5: Testing

### Week 3: Phase 3
- Days 1-2: Implement Nostr publishing
- Day 3: Authentication setup
- Day 4: Testing
- Day 5: Deploy to production

### Week 4: Phase 4
- Days 1-2: Monitoring tools
- Day 3: Documentation
- Day 4: Final testing
- Day 5: Production deployment

---

## Success Metrics

**Phase 1**:
- ✅ Correctly identifies new versions
- ✅ Queue file is valid JSON
- ✅ Runs in < 10 seconds
- ✅ Doesn't break refresh.sh

**Phase 2**:
- ✅ Successfully runs verification scripts
- ✅ Captures exit codes correctly
- ✅ Parses structured output
- ✅ Cleans up after each verification

**Phase 3**:
- ✅ Successfully authenticates
- ✅ Uploads NEW scripts < 60KB (if script was updated)
- ✅ Reuses existing script event IDs (if script unchanged)
- ✅ Publishes verification events
- ✅ Links scripts to verifications

**Phase 4**:
- ✅ Queue status visible
- ✅ Failed items retry automatically
- ✅ Logs are accessible
- ✅ Alerts for critical failures

---

## Risk Mitigation

**Risk**: Verification failures break refresh.sh  
**Mitigation**: Run as separate cron job

**Risk**: Resource exhaustion  
**Mitigation**: Process one at a time, cleanup after each

**Risk**: Authentication compromise  
**Mitigation**: Use environment variables, restrict permissions

**Risk**: Script size > 60KB  
**Mitigation**: Audit sizes, implement fallback (external hosting)

**Risk**: Queue grows unbounded  
**Mitigation**: Automatic cleanup of completed items, max queue size

---

## Future Enhancements

- Parallel verification (with resource limits)
- Web dashboard for queue monitoring
- Email/Slack notifications
- Automatic retry with exponential backoff
- Priority queue based on app popularity
- Verification result caching
- Integration with CI/CD for script updates

---

*Document created*: 2025-10-21  
*Author*: WalletScrutiny Team  
*Status*: Ready for Phase 1 implementation
