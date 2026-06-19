#!/bin/bash
# Benchmark build times for master vs feature branch
# Run from repo root: ./scripts/benchmark-builds.sh

set -e

BRANCH_FEATURE="feature/node-wallet-generator"
BRANCH_MASTER="master"
RESULTS_DIR="/tmp/ws-benchmark-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$RESULTS_DIR"

echo "=== WalletScrutiny Build Benchmark ==="
echo "Results will be saved to: $RESULTS_DIR"
echo ""

# Function to run dev build and capture timing
run_dev_build() {
    local branch=$1
    local output_file=$2
    
    echo "--- Dev build on $branch ---"
    git checkout "$branch" --quiet
    
    # Clean everything
    rm -rf _site .jekyll-cache .jekyll-metadata dist/ _data/precomputed.json 2>/dev/null || true
    rm -f assets/js/json/wallets-precomputed.json _includes/allProducts-precomputed.json 2>/dev/null || true
    
    # Time the full dev build (stop after Jekyll finishes)
    {
        echo "Start: $(date)"
        time timeout 600 bash -c '
            npm run precompute 2>/dev/null || true
            npm run clean_assets 2>&1
            webpack --mode development 2>&1 &
            WEBPACK_PID=$!
            
            # Wait for Jekyll "done in" message
            while true; do
                if grep -q "done in" /tmp/jekyll-output.txt 2>/dev/null; then
                    break
                fi
                sleep 1
            done
            
            kill $WEBPACK_PID 2>/dev/null || true
        ' 2>&1 | tee /tmp/jekyll-output.txt
        echo "End: $(date)"
    } > "$output_file" 2>&1
    
    # Extract Jekyll timing
    grep "done in" /tmp/jekyll-output.txt >> "$output_file" 2>/dev/null || true
    grep -A10 "Build Process Summary" /tmp/jekyll-output.txt >> "$output_file" 2>/dev/null || true
}

# Function to run production build and capture timing
run_prod_build() {
    local branch=$1
    local output_file=$2
    local site_backup=$3
    
    echo "--- Production build on $branch ---"
    git checkout "$branch" --quiet
    
    # Clean everything
    rm -rf _site .jekyll-cache .jekyll-metadata dist/ _data/precomputed.json 2>/dev/null || true
    rm -f assets/js/json/wallets-precomputed.json _includes/allProducts-precomputed.json 2>/dev/null || true
    
    # Run precompute if available
    npm run precompute 2>/dev/null || true
    
    # Create scripts.html stub (webpack normally does this)
    mkdir -p _includes
    cat > _includes/scripts.html << 'EOF'
<script src="/dist/jquery.bundle.min.js"></script>
<script src="/dist/verifications_data.bundle.min.js"></script>
<script src="/dist/verifications_ui.bundle.min.js"></script>
<script src="/dist/font_awesome.bundle.min.js"></script>
EOF
    
    # Time Jekyll build only (skip webpack for fair comparison)
    {
        echo "Branch: $branch"
        echo "Start: $(date)"
        time bundle exec jekyll build --profile 2>&1
        echo "End: $(date)"
    } > "$output_file" 2>&1
    
    # Copy site for diff
    if [ -n "$site_backup" ]; then
        cp -r _site "$site_backup"
    fi
}

# Save current branch
ORIGINAL_BRANCH=$(git branch --show-current)

echo ""
echo "========================================="
echo "1. Production build - MASTER"
echo "========================================="
run_prod_build "$BRANCH_MASTER" "$RESULTS_DIR/prod-master.log" "$RESULTS_DIR/site-master"

echo ""
echo "========================================="
echo "2. Production build - FEATURE"
echo "========================================="
run_prod_build "$BRANCH_FEATURE" "$RESULTS_DIR/prod-feature.log" "$RESULTS_DIR/site-feature"

echo ""
echo "========================================="
echo "3. Comparing production outputs"
echo "========================================="
diff -rq "$RESULTS_DIR/site-master" "$RESULTS_DIR/site-feature" \
    --exclude='*.br' --exclude='*.map' > "$RESULTS_DIR/diff-report.txt" 2>&1 || true

DIFF_COUNT=$(wc -l < "$RESULTS_DIR/diff-report.txt")
echo "Files differing: $DIFF_COUNT"
echo "Diff report: $RESULTS_DIR/diff-report.txt"

# Show sample diffs if any
if [ "$DIFF_COUNT" -gt 0 ]; then
    echo ""
    echo "Sample differences (first 20 lines):"
    head -20 "$RESULTS_DIR/diff-report.txt"
fi

echo ""
echo "========================================="
echo "4. Summary"
echo "========================================="

# Extract timings
MASTER_TIME=$(grep "done in" "$RESULTS_DIR/prod-master.log" | grep -oE '[0-9]+\.[0-9]+' | head -1)
FEATURE_TIME=$(grep "done in" "$RESULTS_DIR/prod-feature.log" | grep -oE '[0-9]+\.[0-9]+' | head -1)

MASTER_RENDER=$(grep "RENDER" "$RESULTS_DIR/prod-master.log" | grep -oE '[0-9]+\.[0-9]+' | head -1)
FEATURE_RENDER=$(grep "RENDER" "$RESULTS_DIR/prod-feature.log" | grep -oE '[0-9]+\.[0-9]+' | head -1)

echo ""
echo "PRODUCTION BUILD TIMES:"
echo "  Master:  ${MASTER_TIME}s total, ${MASTER_RENDER}s render"
echo "  Feature: ${FEATURE_TIME}s total, ${FEATURE_RENDER}s render"

if [ -n "$MASTER_TIME" ] && [ -n "$FEATURE_TIME" ]; then
    IMPROVEMENT=$(echo "scale=1; (1 - $FEATURE_TIME / $MASTER_TIME) * 100" | bc)
    echo "  Improvement: ${IMPROVEMENT}%"
fi

echo ""
echo "FILES DIFFERING: $DIFF_COUNT"
echo ""
echo "Full logs saved to: $RESULTS_DIR/"
echo "  - prod-master.log"
echo "  - prod-feature.log"  
echo "  - diff-report.txt"
echo "  - site-master/"
echo "  - site-feature/"

# Return to original branch
git checkout "$ORIGINAL_BRANCH" --quiet 2>/dev/null || true

echo ""
echo "Done! Review $RESULTS_DIR/diff-report.txt for any regressions."
