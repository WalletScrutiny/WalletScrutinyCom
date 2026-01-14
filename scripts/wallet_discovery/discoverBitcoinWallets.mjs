import gplay from 'google-play-scraper';
import apple from 'app-store-scraper';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { Semaphore } from 'async-mutex';

const discoveredWalletsLogFile = 'bitcoin-wallet-discovery.yaml';

// Rate limiting
const playSem = new Semaphore(10);
const appleSem = new Semaphore(5);
const appStoreUrlPattern = /apps\.apple\.com\/([a-zA-Z]{2})\/app\/.*\/id(\d+)/;

function getIphoneAddParam(app) {
  if (!app) {
    return null;
  }

  if (app.url) {
    const match = app.url.match(appStoreUrlPattern);
    if (match) {
      return `${match[1]}/${match[2]}`;
    }
  }

  if (app.id) {
    const country = app.appCountry || app.country || 'us';
    return `${country}/${app.id}`;
  }

  return null;
}

// Advanced search strategy with exclusion patterns
const SEARCH_STRATEGIES = [
  // Core Bitcoin terms
  { term: 'bitcoin wallet', exclude: [] },
  { term: 'btc wallet', exclude: [] },
  { term: 'bitcoin', exclude: ['news', 'price', 'tracker', 'chart', 'calculator'] },
  { term: 'btc', exclude: ['news', 'price', 'tracker', 'chart', 'calculator'] },
  
  // Crypto wallet variations
  { term: 'crypto wallet', exclude: ['portfolio', 'tracker', 'news'] },
  { term: 'cryptocurrency wallet', exclude: [] },
  { term: 'digital wallet', exclude: ['paypal', 'venmo', 'cashapp'] },
  { term: 'blockchain wallet', exclude: [] },
  
  // Bitcoin-specific features
  { term: 'bitcoin send receive', exclude: [] },
  { term: 'bitcoin private key', exclude: [] },
  { term: 'bitcoin seed phrase', exclude: [] },
  { term: 'bitcoin lightning', exclude: [] },
  { term: 'bitcoin cold storage', exclude: [] },
  { term: 'bitcoin hardware wallet', exclude: [] },
  { term: 'bitcoin multisig', exclude: [] },
  { term: 'bitcoin hd wallet', exclude: [] },
  
  // Alternative Bitcoin terms
  { term: 'satoshi wallet', exclude: [] },
  { term: 'sats wallet', exclude: [] },
  { term: 'bitcoin cash', exclude: ['news', 'price'] },
  { term: 'bitcoin sv', exclude: ['news', 'price'] },
  { term: 'lightning network', exclude: [] },
  { term: 'taproot wallet', exclude: [] },
  
  // Multi-language Bitcoin terms
  { term: 'bitcoin portemonnaie', exclude: [] }, // German
  { term: 'bitcoin geldbörse', exclude: [] }, // German
  { term: 'bitcoin portefeuille', exclude: [] }, // French
  { term: 'bitcoin cartera', exclude: [] }, // Spanish
  { term: 'bitcoin monedero', exclude: [] }, // Spanish
  { term: 'bitcoin carteira', exclude: [] }, // Portuguese
  { term: 'bitcoin кошелек', exclude: [] }, // Russian
  { term: 'bitcoin 钱包', exclude: [] }, // Chinese
  { term: 'bitcoin ウォレット', exclude: [] }, // Japanese
  { term: '비트코인 지갑', exclude: [] }, // Korean
  { term: 'bitcoin محفظة', exclude: [] }, // Arabic
  { term: 'bitcoin वॉलेट', exclude: [] }, // Hindi
  
  // Crypto exchange terms (often have wallets)
  { term: 'bitcoin exchange', exclude: ['news'] },
  { term: 'crypto exchange', exclude: ['news', 'tracker'] },
  { term: 'buy bitcoin', exclude: ['guide', 'how to', 'tutorial'] },
  { term: 'bitcoin trading', exclude: ['bot', 'signals', 'education'] },
  { term: 'bitcoin broker', exclude: [] },
  { term: 'bitcoin atm', exclude: [] },
  
  // DeFi and Web3 terms
  { term: 'defi wallet', exclude: [] },
  { term: 'web3 wallet', exclude: [] },
  { term: 'dapp wallet', exclude: [] },
  { term: 'ethereum bitcoin wallet', exclude: [] },
  { term: 'multi coin wallet', exclude: [] },
  { term: 'cross chain wallet', exclude: [] },
  
  // Privacy coins (Bitcoin-adjacent)
  { term: 'privacy wallet', exclude: [] },
  { term: 'anonymous wallet', exclude: [] },
  { term: 'secure wallet', exclude: [] },
  { term: 'non custodial wallet', exclude: [] },
  { term: 'self custody wallet', exclude: [] },
  
  // Mining-related (often have wallets)
  { term: 'bitcoin mining', exclude: ['calculator', 'simulator', 'game'] },
  { term: 'crypto mining', exclude: ['calculator', 'simulator', 'game'] },
  { term: 'mining pool', exclude: [] },
  { term: 'bitcoin miner wallet', exclude: [] },
  
  // Payment-focused
  { term: 'bitcoin payment', exclude: [] },
  { term: 'crypto payment', exclude: [] },
  { term: 'bitcoin pos', exclude: [] },
  { term: 'bitcoin merchant', exclude: [] },
  { term: 'bitcoin invoice', exclude: [] },
  { term: 'bitcoin checkout', exclude: [] },
  
  // Specific wallet types
  { term: 'mobile bitcoin wallet', exclude: [] },
  { term: 'offline wallet', exclude: [] },
  
  // Popular wallet names variations
  { term: 'electrum', exclude: [] },
  { term: 'mycelium', exclude: [] },
  { term: 'breadwallet', exclude: [] },
  { term: 'copay', exclude: [] },
  { term: 'greenaddress', exclude: [] },
  { term: 'samourai', exclude: [] },
  { term: 'wasabi', exclude: [] },
  { term: 'sparrow', exclude: [] },
  { term: 'coinbase', exclude: [] },
  { term: 'binance', exclude: [] },
  { term: 'blockchain', exclude: [] },
  
  // Regional/Local terms
  { term: 'bitcoin india', exclude: ['news', 'price'] },
  { term: 'bitcoin africa', exclude: ['news', 'price'] },
  { term: 'bitcoin latin america', exclude: ['news', 'price'] },
  { term: 'bitcoin europe', exclude: ['news', 'price'] },
  { term: 'bitcoin asia', exclude: ['news', 'price'] },
  
  // Technical terms
  { term: 'bip39 wallet', exclude: [] },
  { term: 'bip44 wallet', exclude: [] },
  { term: 'segwit wallet', exclude: [] },
  { term: 'bech32 wallet', exclude: [] },
  { term: 'schnorr wallet', exclude: [] }
];

// Categories to search in
const PLAY_CATEGORIES = [
  gplay.category.FINANCE,
  gplay.category.BUSINESS,
  gplay.category.TOOLS,
  gplay.category.PRODUCTIVITY,
  gplay.category.SHOPPING
];

class BitcoinWalletDiscovery {
  constructor() {
    this.existingAndroidApps = new Set();
    this.existingIphoneApps = new Set();
    this.previouslyDiscovered = new Set();
    this.discoveredApps = {
      android: [],
      iphone: []
    };
    this.allDiscoveredApps = {
      android: [],
      iphone: []
    };
    this.searchStats = {
      totalSearches: 0,
      successfulSearches: 0,
      appsFound: 0,
      duplicatesFiltered: 0
    };
  }

  async initialize() {
    console.log('Loading existing apps...');
    await this.loadExistingApps();
    await this.loadPreviouslyDiscovered();
    console.log(`Loaded ${this.existingAndroidApps.size} Android apps and ${this.existingIphoneApps.size} iPhone apps`);
    console.log(`Loaded ${this.previouslyDiscovered.size} previously discovered apps`);
  }

  async loadExistingApps() {
    try {
      // Load Android apps
      const androidFiles = await fs.readdir('../../_android');
      for (const file of androidFiles) {
        if (file.endsWith('.md')) {
          const appId = file.replace('.md', '');
          this.existingAndroidApps.add(appId);
        }
      }

      // Load iPhone apps
      const iphoneFiles = await fs.readdir('../../_iphone');
      for (const file of iphoneFiles) {
        if (file.endsWith('.md')) {
          const appId = file.replace('.md', '');
          this.existingIphoneApps.add(appId);
        }
      }
    } catch (error) {
      console.error('Error loading existing apps:', error);
    }
  }

  async loadPreviouslyDiscovered() {
    try {
      const discoveryLogContent = await fs.readFile(discoveredWalletsLogFile, 'utf8');
      const discoveryLog = yaml.load(discoveryLogContent);
      
      if (discoveryLog) {
        this.allDiscoveredApps = discoveryLog;
        
        // Add all previously discovered apps to blacklist
        if (discoveryLog.android) {
          discoveryLog.android.forEach(app => this.previouslyDiscovered.add(app.appId));
        }
        if (discoveryLog.iphone) {
          discoveryLog.iphone.forEach(app => this.previouslyDiscovered.add(app.appId));
        }
      }
    } catch (error) {
      console.log('No previous discovery log found, starting fresh');
    }
  }

  isBitcoinRelevant(app, excludeTerms = []) {
    const text = `${app.title} ${app.summary || app.description || ''}`.toLowerCase();
    
    // Must contain bitcoin or btc or crypto
    const hasBitcoin = text.includes('bitcoin') || text.includes('btc') || 
                      (text.includes('crypto') && (text.includes('wallet') || text.includes('currency')));
    
    if (!hasBitcoin) return false;
    
    // Check exclusion terms
    for (const excludeTerm of excludeTerms) {
      if (text.includes(excludeTerm.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  }

  async searchPlayStore() {
    console.log('\n🤖 Searching Google Play Store...');
    const allApps = new Map(); // Use Map to avoid duplicates

    for (const strategy of SEARCH_STRATEGIES) {
      console.log(`Searching for: "${strategy.term}" ${strategy.exclude.length > 0 ? `(excluding: ${strategy.exclude.join(', ')})` : ''}`);
      this.searchStats.totalSearches++;
      
      try {
        const [, release] = await playSem.acquire();
        
        try {
          // Search in general results
          const searchResults = await gplay.search({
            term: strategy.term,
            num: 250,
            lang: 'en',
            country: 'us'
          });

          let foundInThisSearch = 0;
          for (const app of searchResults) {
            if (this.isBitcoinRelevant(app, strategy.exclude) && 
                !this.existingAndroidApps.has(app.appId) &&
                !this.previouslyDiscovered.has(app.appId)) {
              
              if (!allApps.has(app.appId)) {
                allApps.set(app.appId, {
                  appId: app.appId,
                  title: app.title,
                  developer: app.developer,
                  summary: app.summary,
                  installs: app.installs,
                  score: app.score,
                  url: app.url,
                  searchTerm: strategy.term,
                  excludeTerms: strategy.exclude,
                  platform: 'android'
                });
                foundInThisSearch++;
              } else {
                this.searchStats.duplicatesFiltered++;
              }
            }
          }
          
          if (foundInThisSearch > 0) {
            console.log(`  → Found ${foundInThisSearch} new apps`);
            this.searchStats.successfulSearches++;
            this.searchStats.appsFound += foundInThisSearch;
          }
          
        } finally {
          release();
        }
        
        // Add delay between searches
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error searching for "${strategy.term}":`, error.message);
      }
    }

    // Search by categories with Bitcoin filtering
    for (const category of PLAY_CATEGORIES) {
      console.log(`Searching category: ${category}`);
      this.searchStats.totalSearches++;
      
      try {
        const [, release] = await playSem.acquire();
        
        try {
          const categoryResults = await gplay.list({
            category: category,
            collection: gplay.collection.TOP_FREE,
            num: 100,
            lang: 'en',
            country: 'us'
          });

          let foundInThisSearch = 0;
          for (const app of categoryResults) {
            if (this.isBitcoinRelevant(app) && 
                !this.existingAndroidApps.has(app.appId) &&
                !this.previouslyDiscovered.has(app.appId)) {
              
              if (!allApps.has(app.appId)) {
                allApps.set(app.appId, {
                  appId: app.appId,
                  title: app.title,
                  developer: app.developer,
                  summary: app.summary,
                  installs: app.installs,
                  score: app.score,
                  url: app.url,
                  searchTerm: `category:${category}`,
                  excludeTerms: [],
                  platform: 'android'
                });
                foundInThisSearch++;
              } else {
                this.searchStats.duplicatesFiltered++;
              }
            }
          }
          
          if (foundInThisSearch > 0) {
            console.log(`  → Found ${foundInThisSearch} new apps`);
            this.searchStats.successfulSearches++;
            this.searchStats.appsFound += foundInThisSearch;
          }
          
        } finally {
          release();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error searching category ${category}:`, error.message);
      }
    }

    this.discoveredApps.android = Array.from(allApps.values());
    console.log(`\n📱 Android Summary: Found ${this.discoveredApps.android.length} unique new Bitcoin apps`);
  }

  async searchAppStore() {
    console.log('\n🍎 Searching Apple App Store...');
    const allApps = new Map(); // Use Map to avoid duplicates

    for (const strategy of SEARCH_STRATEGIES) {
      console.log(`Searching for: "${strategy.term}" ${strategy.exclude.length > 0 ? `(excluding: ${strategy.exclude.join(', ')})` : ''}`);
      
      try {
        const [, release] = await appleSem.acquire();
        
        try {
          const searchResults = await apple.search({
            term: strategy.term,
            num: 50,
            lang: 'en',
            country: 'us'
          });

          let foundInThisSearch = 0;
          for (const app of searchResults) {
            if (this.isBitcoinRelevant(app, strategy.exclude) && 
                !this.existingIphoneApps.has(app.appId) &&
                !this.previouslyDiscovered.has(app.appId)) {
              
              if (!allApps.has(app.appId)) {
                allApps.set(app.appId, {
                  appId: app.appId,
                  id: app.id,
                  title: app.title,
                  developer: app.developer,
                  description: app.description,
                  score: app.score,
                  url: app.url,
                  searchTerm: strategy.term,
                  excludeTerms: strategy.exclude,
                  platform: 'iphone'
                });
                foundInThisSearch++;
              }
            }
          }
          
          if (foundInThisSearch > 0) {
            console.log(`  → Found ${foundInThisSearch} new apps`);
          }
          
        } finally {
          release();
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay for App Store
        
      } catch (error) {
        console.error(`Error searching for "${strategy.term}":`, error.message);
      }
    }

    this.discoveredApps.iphone = Array.from(allApps.values());
    console.log(`\n🍎 iPhone Summary: Found ${this.discoveredApps.iphone.length} unique new Bitcoin apps`);
  }

  calculateRelevanceScore(app) {
    const text = `${app.title} ${app.summary || app.description || ''}`.toLowerCase();
    let score = 0;

    // Bitcoin mentions
    const bitcoinCount = (text.match(/bitcoin/g) || []).length;
    const btcCount = (text.match(/\bbtc\b/g) || []).length;
    score += bitcoinCount * 3 + btcCount * 2;

    // Wallet indicators
    const walletTerms = ['wallet', 'send', 'receive', 'private key', 'seed', 'custody', 'multisig', 'cold storage'];
    walletTerms.forEach(term => {
      if (text.includes(term)) score += 2;
    });

    // Title relevance (higher weight)
    if (app.title.toLowerCase().includes('bitcoin')) score += 8;
    if (app.title.toLowerCase().includes('btc')) score += 6;
    if (app.title.toLowerCase().includes('wallet')) score += 5;
    if (app.title.toLowerCase().includes('crypto')) score += 3;

    // Penalty for excluded terms that might have slipped through
    const penaltyTerms = ['news', 'price', 'tracker', 'chart', 'calculator', 'game', 'simulator'];
    penaltyTerms.forEach(term => {
      if (text.includes(term)) score -= 2;
    });

    // Bonus for specific wallet features
    const bonusTerms = ['lightning', 'segwit', 'multisig', 'hd wallet', 'bip39', 'cold storage', 'hardware'];
    bonusTerms.forEach(term => {
      if (text.includes(term)) score += 3;
    });

    return Math.max(0, score); // Ensure non-negative score
  }

  async enrichWithFullDetails(apps, platform) {
    console.log(`\nEnriching ${apps.length} ${platform} apps with full details...`);
    const enriched = [];
    
    for (let i = 0; i < apps.length; i++) {
      const app = apps[i];
      try {
        if (platform === 'android') {
          const [, release] = await playSem.acquire();
          try {
            const details = await gplay.app({ appId: app.appId });
            enriched.push({
              ...app,
              fullDescription: details.description || app.summary || app.description || '',
              installs: details.installs || app.installs || 'N/A',
              minInstalls: details.minInstalls || 0,
              maxInstalls: details.maxInstalls || 0,
              userCount: details.minInstalls || 0,
              ratings: details.ratings || 0,
              reviews: details.reviews || 0,
              score: details.score || app.score || 0
            });
            console.log(`  [${i + 1}/${apps.length}] ✓ ${app.title}`);
          } catch (innerError) {
            console.log(`  [${i + 1}/${apps.length}] ✗ ${app.title} - ${innerError.message}`);
            // Add with fallback data
            enriched.push({
              ...app,
              fullDescription: app.summary || app.description || 'Description not available',
              userCount: 0,
              ratings: 0,
              reviews: 0
            });
          } finally {
            release();
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          const [, release] = await appleSem.acquire();
          try {
            const details = await apple.app({ id: app.id });
            enriched.push({
              ...app,
              fullDescription: details.description || app.description || '',
              ratingsCount: details.ratings || 0,
              ratings: details.ratings || 0,
              reviews: details.reviews || 0,
              score: details.score || app.score || 0
            });
            console.log(`  [${i + 1}/${apps.length}] ✓ ${app.title}`);
          } catch (innerError) {
            console.log(`  [${i + 1}/${apps.length}] ✗ ${app.title} - ${innerError.message}`);
            // Add with fallback data
            enriched.push({
              ...app,
              fullDescription: app.description || 'Description not available',
              ratingsCount: 0,
              ratings: 0,
              reviews: 0
            });
          } finally {
            release();
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log(`  [${i + 1}/${apps.length}] ✗ ${app.title} - ${error.message}`);
        // Add with minimal data to avoid losing the app
        enriched.push({
          ...app,
          fullDescription: app.summary || app.description || 'Description not available',
          userCount: 0,
          ratingsCount: 0,
          ratings: 0,
          reviews: 0
        });
      }
    }
    
    return enriched;
  }

  async generateReport() {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Enrich apps with full details
    const enrichedAndroid = await this.enrichWithFullDetails(
      this.discoveredApps.android.map(app => ({
        ...app,
        relevanceScore: this.calculateRelevanceScore(app)
      })),
      'android'
    );
    
    const enrichedIphone = await this.enrichWithFullDetails(
      this.discoveredApps.iphone.map(app => ({
        ...app,
        relevanceScore: this.calculateRelevanceScore(app)
      })),
      'iphone'
    );
    
    const reportData = {
      timestamp: new Date().toISOString(),
      searchStats: this.searchStats,
      summary: {
        android: enrichedAndroid.length,
        iphone: enrichedIphone.length,
        total: enrichedAndroid.length + enrichedIphone.length
      },
      android: enrichedAndroid.sort((a, b) => b.relevanceScore - a.relevanceScore),
      iphone: enrichedIphone.sort((a, b) => b.relevanceScore - a.relevanceScore)
    };

    // Flatten structure - combine all apps into single array
    const allApps = [
      ...(this.allDiscoveredApps.android || []),
      ...(this.allDiscoveredApps.iphone || []),
      ...reportData.android,
      ...reportData.iphone
    ];
    
    // Write persistent YAML log (flattened)
    const yamlContent = yaml.dump(allApps, { 
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    await fs.writeFile(discoveredWalletsLogFile, yamlContent);

    // Write JSON report
    const reportPath = `bitcoin-wallet-discovery-${timestamp}.json`;
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

    // Write human-readable report
    const readablePath = `bitcoin-wallet-discovery-${timestamp}.md`;
    await fs.writeFile(readablePath, this.generateReadableReport(reportData));

    console.log(`\n📊 Reports generated:`);
    console.log(`- YAML log: ${discoveredWalletsLogFile} (persistent)`);
    console.log(`- JSON: ${reportPath}`);
    console.log(`- Markdown: ${readablePath}`);

    return reportData;
  }

  generateReadableReport(data) {
    let report = `# Bitcoin Wallet Discovery Report\n\n`;
    report += `**Generated:** ${data.timestamp}\n\n`;
    
    report += `## Search Statistics\n\n`;
    report += `- **Total searches performed:** ${data.searchStats.totalSearches}\n`;
    report += `- **Successful searches:** ${data.searchStats.successfulSearches}\n`;
    report += `- **Apps found:** ${data.searchStats.appsFound}\n`;
    report += `- **Duplicates filtered:** ${data.searchStats.duplicatesFiltered}\n`;
    report += `- **Success rate:** ${((data.searchStats.successfulSearches / data.searchStats.totalSearches) * 100).toFixed(1)}%\n\n`;
    
    report += `## Summary\n\n`;
    report += `- **Android apps found:** ${data.summary.android}\n`;
    report += `- **iPhone apps found:** ${data.summary.iphone}\n`;
    report += `- **Total new apps:** ${data.summary.total}\n\n`;

    if (data.android.length > 0) {
      report += `## Android Apps (sorted by relevance)\n\n`;
      data.android.forEach((app, index) => {
        report += `### ${index + 1}. ${app.title} (Score: ${app.relevanceScore})\n`;
        report += `- **App ID:** ${app.appId}\n`;
        report += `- **Developer:** ${app.developer}\n`;
        report += `- **Installs:** ${app.installs || 'N/A'}\n`;
        report += `- **Rating:** ${app.score || 'N/A'}\n`;
        report += `- **Found via:** ${app.searchTerm}\n`;
        if (app.excludeTerms && app.excludeTerms.length > 0) {
          report += `- **Excluded terms:** ${app.excludeTerms.join(', ')}\n`;
        }
        report += `- **URL:** ${app.url}\n`;
        if (app.summary) {
          report += `- **Summary:** ${app.summary}\n`;
        }
        report += `\n**Add command:** \`node addNewAndroidApps.mjs ${app.appId}\`\n\n`;
      });
    }

    if (data.iphone.length > 0) {
      report += `## iPhone Apps (sorted by relevance)\n\n`;
      data.iphone.forEach((app, index) => {
        report += `### ${index + 1}. ${app.title} (Score: ${app.relevanceScore})\n`;
        report += `- **App ID:** ${app.appId}\n`;
        report += `- **iTunes ID:** ${app.id}\n`;
        report += `- **Developer:** ${app.developer}\n`;
        report += `- **Rating:** ${app.score || 'N/A'}\n`;
        report += `- **Found via:** ${app.searchTerm}\n`;
        if (app.excludeTerms && app.excludeTerms.length > 0) {
          report += `- **Excluded terms:** ${app.excludeTerms.join(', ')}\n`;
        }
        report += `- **URL:** ${app.url}\n`;
        if (app.description) {
          report += `- **Description:** ${app.description.substring(0, 200)}...\n`;
        }
        const addParam = getIphoneAddParam(app);
        report += `\n**Add command:** \`node addNewIphoneApps.mjs ${addParam || app.id}\`\n\n`;
      });
    }

    return report;
  }

  async run() {
    console.log('🚀 Starting Bitcoin Wallet Discovery...\n');
    console.log(`📊 Will perform ${SEARCH_STRATEGIES.length} search strategies + ${PLAY_CATEGORIES.length} category searches`);
    
    await this.initialize();
    
    // Search both platforms
    await this.searchPlayStore();
    await this.searchAppStore();
    
    // Generate reports
    const reportData = await this.generateReport();
    
    console.log('\n✅ Discovery complete!');
    console.log(`📊 Search Statistics:`);
    console.log(`   - Total searches: ${reportData.searchStats.totalSearches}`);
    console.log(`   - Successful searches: ${reportData.searchStats.successfulSearches}`);
    console.log(`   - Success rate: ${((reportData.searchStats.successfulSearches / reportData.searchStats.totalSearches) * 100).toFixed(1)}%`);
    console.log(`   - Duplicates filtered: ${reportData.searchStats.duplicatesFiltered}`);
    console.log(`🎯 Found ${reportData.summary.total} new Bitcoin wallet apps`);
    
    if (reportData.summary.total > 0) {
      console.log('\n🏆 Top discoveries by relevance:');
      
      // Show top Android apps
      if (reportData.android.length > 0) {
        console.log('\nAndroid:');
        reportData.android.slice(0, 5).forEach((app, i) => {
          console.log(`  ${i + 1}. ${app.title} (${app.appId}) - Score: ${app.relevanceScore}`);
        });
      }
      
      // Show top iPhone apps
      if (reportData.iphone.length > 0) {
        console.log('\niPhone:');
        reportData.iphone.slice(0, 5).forEach((app, i) => {
          console.log(`  ${i + 1}. ${app.title} (${app.appId}) - Score: ${app.relevanceScore}`);
        });
      }
    }
  }
}

// Run the discovery
const discovery = new BitcoinWalletDiscovery();
discovery.run().catch(console.error);
