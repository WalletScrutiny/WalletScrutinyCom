#!/bin/bash

# Bitcoin Wallet Discovery Runner
# This script runs the wallet discovery tool and organizes output

echo "🚀 Starting Bitcoin Wallet Discovery..."
echo "Timestamp: $(date)"
echo ""

# Run the discovery
node discoverBitcoinWallets.mjs

# Check if reports directory exists, create if not
if [ ! -d "reports" ]; then
    mkdir reports
    echo "📁 Created reports directory"
fi

# Move timestamped reports to reports directory
TIMESTAMP=$(date +%Y-%m-%d)
if [ -f "bitcoin-wallet-discovery-${TIMESTAMP}.json" ]; then
    mv "bitcoin-wallet-discovery-${TIMESTAMP}.json" reports/
    echo "📁 Moved JSON report to reports/ directory"
fi

if [ -f "bitcoin-wallet-discovery-${TIMESTAMP}.md" ]; then
    mv "bitcoin-wallet-discovery-${TIMESTAMP}.md" reports/
    echo "📁 Moved Markdown report to reports/ directory"
fi

echo "📝 Persistent log: bitcoin-wallet-discovery.yaml"
echo "✅ Discovery complete!"

# Show latest report summary
echo ""
echo "📊 Latest Report Summary:"
if [ -f "reports/bitcoin-wallet-discovery-${TIMESTAMP}.md" ]; then
    head -20 "reports/bitcoin-wallet-discovery-${TIMESTAMP}.md" | grep -E "^- \*\*|^## Summary"
fi

echo ""
echo "📈 Total apps discovered across all runs: checking bitcoin-wallet-discovery.yaml"
if [ -f "bitcoin-wallet-discovery.yaml" ]; then
    ANDROID_COUNT=$(grep -A1 "platform: android" bitcoin-wallet-discovery.yaml | grep -c "appId:")
    IPHONE_COUNT=$(grep -A1 "platform: iphone" bitcoin-wallet-discovery.yaml | grep -c "appId:")
    TOTAL_COUNT=$(grep -c "platform:" bitcoin-wallet-discovery.yaml)
    echo "Android apps: $ANDROID_COUNT"
    echo "iPhone apps: $IPHONE_COUNT"
    echo "Total entries in discovery log: $TOTAL_COUNT"
fi
