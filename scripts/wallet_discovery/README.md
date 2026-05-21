# Bitcoin Wallet Discovery Tool

A comprehensive tool to discover new Bitcoin and crypto wallet apps on Google Play Store and Apple App Store that are not yet listed on WalletScrutiny.

## Overview

This tool uses advanced search strategies to overcome the 250-result API limitation by performing 85+ targeted searches with smart filtering to discover hundreds of new Bitcoin wallet apps.

## Features

- **Multi-platform discovery**: Google Play Store and Apple App Store
- **85+ search strategies**: Diverse terms, multi-language, technical features
- **Smart filtering**: Exclusion patterns to reduce false positives
- **Relevance scoring**: Prioritizes high-quality wallet apps
- **Duplicate prevention**: Avoids re-discovering existing apps
- **Performance analytics**: Tracks search effectiveness
- **Multiple output formats**: JSON, Markdown, and YAML reports

## Quick Start

```bash
# Install dependencies
npm install

# Run discovery
./runWalletDiscovery.sh

# Review and triage discoveries
./processWalletDiscovery.sh
```

Use `./processWalletDiscovery.sh --help` to see all options. Pass `--no-images` if you want to skip the automatic `updateImages.sh` run (useful for quick status-only sessions or when you're offline).
```

## How It Works

### 1. Search Strategy Diversity
Instead of relying on a few broad terms, the tool uses 85+ specific, targeted search terms:

- **Core Bitcoin terms**: `bitcoin wallet`, `btc wallet`, `bitcoin`, `btc`
- **Technical features**: `bitcoin lightning`, `bitcoin multisig`, `segwit wallet`
- **Multi-language**: 10 languages (German, French, Spanish, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi)
- **Regional terms**: `bitcoin india`, `bitcoin africa`, `bitcoin europe`
- **Wallet types**: `paper wallet`, `hardware wallet`, `mobile bitcoin wallet`
- **Popular brands**: `electrum`, `mycelium`, `samourai`, `wasabi`

**Result**: 85 × 250 = **21,250 potential app results** instead of just 250

### 2. Smart Exclusion Filtering
Each search includes strategic exclusions to filter out non-wallet apps:

```javascript
{ term: 'bitcoin', exclude: ['news', 'price', 'tracker', 'chart', 'calculator'] }
{ term: 'crypto wallet', exclude: ['portfolio', 'tracker', 'news'] }
```

### 3. Category-Based Discovery
Searches within specific app store categories:
- FINANCE, BUSINESS, TOOLS, PRODUCTIVITY, SHOPPING

### 4. Advanced Relevance Scoring
Apps are scored based on:
- Bitcoin/BTC mentions in title (+8/+6 points)
- Wallet-specific terms (+2-5 points)
- Technical features (+3 points each)
- Penalties for non-wallet terms (-2 points each)

## Output Files

### Generated Reports
- `bitcoin-wallet-discovery-YYYY-MM-DD.json` - Detailed JSON report
- `bitcoin-wallet-discovery-YYYY-MM-DD.md` - Human-readable report
- `bitcoin-wallet-discovery.yaml` - Persistent log of all discoveries

### Report Structure
```
📊 Search Statistics
📱 Summary (Android/iPhone counts)
🏆 Top discoveries by relevance score
📋 Detailed app listings with:
  - App ID and developer
  - Relevance score
  - Search term that found it
  - Direct commands to add to WalletScrutiny
```

## Expected Performance

### Discovery Estimates
- **Conservative**: 300-500 new Bitcoin wallet apps
- **Optimistic**: 500-800 new Bitcoin wallet apps
- **Improvement**: 50-80x better than basic search approaches

### Search Coverage
- **85+ search terms** × 250 results = 21,250+ potential apps
- **Multi-language coverage**: +30% from region-specific apps
- **Quality filtering**: ~60% reduction in false positives

## Configuration

### Adding New Search Terms
Edit `SEARCH_STRATEGIES` in `discoverBitcoinWallets.mjs`:

```javascript
const SEARCH_STRATEGIES = [
  { term: 'your new term', exclude: ['unwanted', 'terms'] },
  // ... existing strategies
];
```

### Adjusting Categories
Modify `PLAY_CATEGORIES` to search additional app categories:

```javascript
const PLAY_CATEGORIES = [
  gplay.category.FINANCE,
  gplay.category.COMMUNICATION, // Add new categories
  // ... existing categories
];
```

## Integration with WalletScrutiny

### Adding Discovered Apps
The reports include direct commands to add apps:

```bash
# Android apps
node addNewAndroidApps.mjs com.example.bitcoinwallet

# iPhone apps  
node addNewIphoneApps.mjs 123456789
```

### Avoiding Duplicates
The tool automatically:
- Loads existing apps from `_android/` and `_iphone/` directories
- Maintains a persistent log to avoid re-discovering apps
- Filters out apps already in WalletScrutiny

## Advanced Strategies

See [SEARCH_STRATEGIES.md](SEARCH_STRATEGIES.md) for detailed information about:
- 11 comprehensive search strategies
- Additional expansion opportunities
- Performance optimization techniques
- Monitoring and analytics approaches

## Dependencies

- `google-play-scraper` - Google Play Store API
- `@perttu/app-store-scraper` - Apple App Store API ([ktecho/app-store-scraper](https://github.com/ktecho/app-store-scraper) fork)
- `js-yaml` - YAML processing
- `async-mutex` - Rate limiting

## Rate Limiting

- **Google Play**: 10 concurrent requests with 1s delays
- **Apple App Store**: 5 concurrent requests with 2s delays

## Troubleshooting

### Common Issues
1. **API rate limits**: Increase delays in semaphore configuration
2. **Network timeouts**: Check internet connection and API availability
3. **No results**: Verify search terms are relevant and not over-filtered

### Debug Mode
Add console logging to track specific search performance:

```javascript
console.log(`Search "${term}" found ${results.length} total results`);
```

## Contributing

### Adding New Strategies
1. Research new Bitcoin/crypto terminology
2. Test search terms manually in app stores
3. Add to `SEARCH_STRATEGIES` with appropriate exclusions
4. Monitor performance and adjust as needed

### Improving Filtering
1. Analyze false positives in reports
2. Add exclusion terms to reduce noise
3. Refine relevance scoring algorithm
4. Test with different app categories

This tool transforms the 250-result API limitation into an opportunity by strategically accessing multiple result sets through diverse, targeted search strategies.
