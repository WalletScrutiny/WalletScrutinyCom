#!/bin/bash
# resetAndRun.sh - Full reset and feature verification pipeline
# Usage: ./scripts/resetAndRun.sh

set -e

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
echo "Root: $ROOT"

# Check API key
if [ -z "$PPQ_API_KEY" ]; then
    echo "ERROR: PPQ_API_KEY environment variable not set"
    echo "Set it with: export PPQ_API_KEY=sk-..."
    exit 1
fi
echo "✓ PPQ_API_KEY is set"

# Step 1: Reset all review files to master state (removes previous feature additions)
echo ""
echo "=== Step 1: Resetting all files to master ==="
git checkout master -- _android/ _iphone/ _desktop/ _hardware/ 2>/dev/null || true

# Step 2: Remove any featureEvidence includes and features frontmatter from all reviews
echo ""
echo "=== Step 2: Cleaning features from all reviews ==="
node scripts/resetFeatures.mjs --apply

# Step 3: Clear cache directories
echo ""
echo "=== Step 3: Clearing cache ==="
rm -rf scripts/cache/feature-text/
rm -rf scripts/cache/feature-proposals/
mkdir -p scripts/cache/feature-text
mkdir -p scripts/cache/feature-proposals
echo "✓ Cache cleared"

echo ""
echo "=== COMMIT 1: Logic changes ==="
git add scripts/featureVerifier.mjs scripts/resetFeatures.mjs 2>/dev/null || true
git add scripts/resetAndRun.sh 2>/dev/null || true
git commit -m "feat: text fragment anchors (5 words, 2nd-6th), Sonnet 4.6, extended verdicts

- Update injectTextFragment to use words 2-6 (5 words) for safer anchors
- Skip first word to avoid stripped content issues
- Change PPQ_MODEL from claude-haiku-4.5 to claude-sonnet-4.6
- Extend TARGET_VERDICTS to include noita, sealed-noita, ecash, diy
- Add resetAndRun.sh automation script
- Add resetFeatures.mjs utility for clearing features" || echo "Nothing to commit (logic already committed)"

echo ""
echo "=== Step 4: Fetch phase (parallel source downloads) ==="
node scripts/featureVerifier.mjs --fetch

echo ""
echo "=== Step 5: Verify phase (LLM analysis with Sonnet 4.6) ==="
node scripts/featureVerifier.mjs --verify

echo ""
echo "=== Step 6: Apply phase (add features to reviews) ==="
node scripts/featureVerifier.mjs --apply

echo ""
echo "=== COMMIT 2: Complete run results ==="
git add _android/ _iphone/ _desktop/ _hardware/ scripts/cache/
git commit -m "feat: complete feature verification run with Sonnet 4.6

- Ran full pipeline: fetch → verify → apply
- Model: claude-sonnet-4.6
- Verdicts: sourceavailable, obfuscated, nosource, custodial, noita, sealed-noita, ecash, diy
- Text fragment anchors: 5 words (2nd-6th) for browser scroll-to-quote
- All products with meta:ok analyzed" || echo "No changes to commit"

echo ""
echo "=== DONE ==="
echo "Check git log for commits and review the changes"
