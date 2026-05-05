import fs from 'fs/promises';
import yaml from 'js-yaml';
import readline from 'readline';
import gplay from 'google-play-scraper';
import { app } from '@perttu/app-store-scraper';
import { Semaphore } from 'async-mutex';
import path from 'path';
import { fileURLToPath } from 'url';

const playSem = new Semaphore(5);
const appleSem = new Semaphore(3);

class WalletDiscoveryProcessor {
  constructor() {
    this.products = [];
    this.allSearchTerms = new Set();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async loadAndFlattenYaml() {
    console.log('Loading bitcoin-wallet-discovery.yaml...');
    const content = await fs.readFile('bitcoin-wallet-discovery.yaml', 'utf8');
    const data = yaml.load(content);
    
    // Handle both old (nested) and new (flat) structure
    this.products = [];
    
    if (Array.isArray(data)) {
      // New flat structure
      this.products = data.map(app => this.prepareProduct(app));
    } else {
      // Old nested structure
      if (data.android) {
        for (const app of data.android) {
          this.products.push(this.prepareProduct(app, 'android'));
        }
      }
      
      if (data.iphone) {
        for (const app of data.iphone) {
          this.products.push(this.prepareProduct(app, 'iphone'));
        }
      }
    }
    
    // Collect all unique search terms
    this.products.forEach(p => {
      if (p.searchTerm) {
        p.searchTerm.split(',').forEach(term => {
          this.allSearchTerms.add(term.trim().toLowerCase());
        });
      }
    });
    
    console.log(`Loaded ${this.products.length} products`);
    console.log(`Found ${this.allSearchTerms.size} unique search terms`);
  }

  prepareProduct(app, platformOverride) {
    const allowedStatuses = new Set(['pending', 'add', 'disregard', 'skipped']);
    const product = {
      ...app,
      platform: platformOverride || app.platform || 'android',
      disregard: app.disregard || false
    };
    product.status = product.status || (product.disregard ? 'disregard' : 'pending');
    if (!allowedStatuses.has(product.status)) {
      product.status = 'pending';
    }
    if (product.status === 'disregard') {
      product.disregard = true;
    }
    product.lastReviewedAt = product.lastReviewedAt || null;
    return product;
  }

  calculateRelevanceScore(product) {
    const text = `${product.title} ${product.summary || ''} ${product.fullDescription || product.description || ''}`.toLowerCase();
    const title = product.title.toLowerCase();
    let score = 0;

    // HEAVY penalties for games and mining (apply first)
    const gameTerms = ['game', 'play', 'tap', 'clicker', 'idle', 'simulator', 'tycoon', 'adventure', 'puzzle', 'arcade', 'solitaire', 'blast', 'spin', 'wheel'];
    const miningTerms = ['mining', 'miner', 'mine', 'cloud mining', 'hash rate', 'hashrate', 'mining pool'];
    const earnTerms = ['earn bitcoin', 'earn btc', 'get btc', 'win bitcoin', 'free bitcoin', 'free btc'];
    
    // Check title first (most reliable indicator)
    gameTerms.forEach(term => {
      if (title.includes(term)) score -= 50;
    });
    miningTerms.forEach(term => {
      if (title.includes(term)) score -= 40;
    });
    
    // Check full text
    gameTerms.forEach(term => {
      if (text.includes(term)) score -= 20;
    });
    miningTerms.forEach(term => {
      if (text.includes(term)) score -= 15;
    });
    earnTerms.forEach(term => {
      if (text.includes(term)) score -= 25;
    });
    
    // Check category if available
    if (product.genre) {
      const genre = product.genre.toLowerCase();
      if (genre.includes('game') || genre.includes('casino') || genre.includes('arcade')) {
        score -= 100; // Instant disqualification
      }
    }

    // Bitcoin mentions
    const bitcoinCount = (text.match(/bitcoin/g) || []).length;
    const btcCount = (text.match(/\bbtc\b/g) || []).length;
    score += bitcoinCount * 3 + btcCount * 2;

    // Wallet indicators (strong positive signals)
    const walletTerms = ['wallet', 'send', 'receive', 'private key', 'seed phrase', 'custody', 'multisig', 'cold storage', 'hot wallet'];
    walletTerms.forEach(term => {
      if (text.includes(term)) score += 3;
    });

    // Title relevance (higher weight)
    if (title.includes('bitcoin')) score += 8;
    if (title.includes('btc')) score += 6;
    if (title.includes('wallet')) score += 10; // Increased from 5
    if (title.includes('crypto')) score += 3;

    // Additional penalties for non-wallet apps
    const penaltyTerms = ['news', 'price', 'tracker', 'chart', 'calculator', 'portfolio', 'alert', 'notification', 'widget'];
    penaltyTerms.forEach(term => {
      if (text.includes(term)) score -= 3;
    });

    // Bonus for specific wallet features
    const bonusTerms = ['lightning', 'segwit', 'multisig', 'hd wallet', 'bip39', 'bip44', 'hardware wallet', 'cold storage', 'air gap'];
    bonusTerms.forEach(term => {
      if (text.includes(term)) score += 4;
    });
    
    // Bonus for exchange/trading (they often have wallets)
    if (text.includes('exchange') || text.includes('trading')) {
      score += 2;
    }

    return score; // Return actual score (can be negative to filter out bad matches)
  }

  async enrichWithDetails() {
    console.log('\nEnriching products with full details...');
    
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      
      // Always recalculate relevance score if we have description
      if (product.fullDescription || product.description) {
        product.relevanceScore = this.calculateRelevanceScore(product);
      }
      
      // Skip enrichment if already has full description or is disregarded
      if (product.fullDescription || product.disregard) {
        continue;
      }
      
      if (product.platform === 'android') {
        const [, release] = await playSem.acquire();
        try {
          const details = await gplay.app({ appId: product.appId });
          
          // Safely assign properties with fallbacks
          product.fullDescription = (details && details.description) || product.summary || product.description || 'Description not available';
          product.installs = (details && details.installs) || product.installs || 'N/A';
          product.minInstalls = (details && details.minInstalls) || 0;
          product.maxInstalls = (details && details.maxInstalls) || 0;
          product.score = (details && details.score) || product.score || 0;
          product.reviews = (details && details.reviews) || 0;
          product.genre = (details && details.genre) || product.genre || 'Unknown';
          product.genreId = (details && details.genreId) || product.genreId || 'Unknown';
          
          // Calculate user count heuristic (use minInstalls as base)
          product.userCount = product.minInstalls || 0;
          
          console.log(`  [${i + 1}/${this.products.length}] ✓ ${product.title} [${product.genre}]`);
        } catch (error) {
          // App might not be available anymore or API issue
          console.log(`  [${i + 1}/${this.products.length}] ✗ ${product.title} - ${error.message}`);
          // Mark as unavailable to avoid retrying
          product.fullDescription = 'Full description not available';
          product.userCount = 0;
          product.minInstalls = 0;
          product.maxInstalls = 0;
          product.reviews = 0;
          product.installs = product.installs || 'N/A';
        } finally {
          release();
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (product.platform === 'iphone') {
        const [, release] = await appleSem.acquire();
        try {
          const details = await app({ id: product.id });
          
          // Safely assign properties with fallbacks
          product.fullDescription = (details && details.description) || product.description || 'Description not available';
          product.score = (details && details.score) || product.score || 0;
          product.reviews = (details && details.reviews) || 0;
          product.genre = (details && details.genres && details.genres[0]) || product.genre || 'Unknown';
          product.primaryGenre = (details && details.primaryGenre) || product.primaryGenre || 'Unknown';
          
          console.log(`  [${i + 1}/${this.products.length}] ✓ ${product.title} [${product.primaryGenre}]`);
        } catch (error) {
          // App might not be available anymore or API issue
          console.log(`  [${i + 1}/${this.products.length}] ✗ ${product.title} - ${error.message}`);
          // Mark as unavailable to avoid retrying
          product.fullDescription = 'Full description not available';
          product.reviews = 0;
        } finally {
          release();
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Recalculate relevance score with full description
      product.relevanceScore = this.calculateRelevanceScore(product);
    }
  }

  compareByRelevance(a, b) {
    const aScore = (a.userCount || 0) / 20;
    const bScore = (b.userCount || 0) / 20;
    return bScore - aScore;
  }

  getStatusPriority(status = 'pending') {
    const priorities = {
      pending: 0,
      skipped: 1,
      add: 2,
      disregard: 2
    };
    return priorities[status] ?? 0;
  }

  getReviewQueue() {
    const reviewable = this.products.filter(
      product => product.status !== 'add' && product.status !== 'disregard'
    );
    return reviewable.sort((a, b) => {
      const priorityDiff = this.getStatusPriority(a.status) - this.getStatusPriority(b.status);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return this.compareByRelevance(a, b);
    });
  }

  getStatusCounts() {
    const counts = {
      addCount: 0,
      disregardCount: 0,
      skipCount: 0
    };
    this.products.forEach(product => {
      if (product.status === 'add') {
        counts.addCount++;
      } else if (product.status === 'disregard') {
        counts.disregardCount++;
      } else if (product.status === 'skipped') {
        counts.skipCount++;
      }
    });
    return counts;
  }

  async saveYaml(options = {}) {
    const { silent = false } = options;
    const yamlContent = yaml.dump(this.products, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    await fs.writeFile('bitcoin-wallet-discovery.yaml', yamlContent);
    if (!silent) {
      console.log('\n✓ Saved bitcoin-wallet-discovery.yaml');
    }
  }

  updateProductStatus(product, status) {
    product.status = status;
    product.lastReviewedAt = new Date().toISOString();
    if (status === 'disregard') {
      product.disregard = true;
    } else if (product.disregard && status !== 'disregard') {
      product.disregard = false;
    }
  }

  decodeHtmlEntities(text) {
    if (!text) return text;
    
    // Convert <br> and <br/> to newlines
    text = text.replace(/<br\s*\/?>/gi, '\n');
    
    // Decode common HTML entities
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&euro;': '€',
      '&pound;': '£',
      '&yen;': '¥',
      '&cent;': '¢',
      '&sect;': '§',
      '&para;': '¶',
      '&middot;': '·',
      '&bull;': '•',
      '&hellip;': '…',
      '&ndash;': '–',
      '&mdash;': '—',
      '&lsquo;': '\u2018',
      '&rsquo;': '\u2019',
      '&ldquo;': '\u201C',
      '&rdquo;': '\u201D',
      '&laquo;': '«',
      '&raquo;': '»'
    };
    
    // Replace all known entities
    for (const [entity, char] of Object.entries(entities)) {
      text = text.replace(new RegExp(entity, 'g'), char);
    }
    
    // Decode numeric entities (&#123; and &#xAB;)
    text = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    text = text.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    
    return text;
  }

  highlightAllSearchTerms(text) {
    if (!text) return text;
    
    // Decode HTML entities first
    text = this.decodeHtmlEntities(text);
    
    // ANSI color codes
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';
    
    // Highlight ALL search terms from the entire dataset
    let highlighted = text;
    this.allSearchTerms.forEach(term => {
      // Escape special regex characters
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedTerm})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `${yellow}$1${reset}`);
    });
    
    return highlighted;
  }

  displayProduct(product) {
    // ANSI codes
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    // 5 newlines before the separator
    console.log('\n\n\n\n');
    console.log('='.repeat(80));
    console.log(`${bold}${product.title}${reset}`);
    console.log('-'.repeat(80));
    console.log(product.url);
    
    // Compact key-value pairs on same line
    console.log(`${bold}Score:${reset}  ${product.score || 'N/A'}`);
    console.log(`${bold}Search Term:${reset}  ${product.searchTerm}`);
    if (product.excludeTerms && product.excludeTerms.length > 0) {
      console.log(`${bold}Exclude Terms:${reset}  ${product.excludeTerms.join(', ')}`);
    }
    console.log(`${bold}Relevance Score:${reset}  ${product.relevanceScore}`);
    
    if (product.platform === 'android') {
      console.log(`${bold}Genre:${reset}  ${product.genre || 'Unknown'}`);
      console.log(`${bold}User Count:${reset}  ${product.userCount || 'N/A'}`);
      
      if (product.summary) {
        const summary = this.highlightAllSearchTerms(product.summary);
        console.log(`\n${bold}Summary:${reset}  ${summary}`);
      }
    } else {
      console.log(`${bold}Genre:${reset}  ${product.primaryGenre || product.genre || 'Unknown'}`);
    }
    
    // Description
    const desc = product.fullDescription || product.description;
    if (desc) {
      const highlighted = this.highlightAllSearchTerms(desc);
      console.log(`${bold}Description:${reset}  ${highlighted}`);
    }
        
    console.log('\n' + '='.repeat(80));
  }

  async promptUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.toLowerCase().trim());
      });
    });
  }

  async processProducts() {
    const reviewQueue = this.getReviewQueue();
    const initialDisregarded = this.products.filter(p => p.status === 'disregard').length;
    
    console.log(`
Starting interactive review...

Commands:
- (a)dd:       add the product to our catalogue with a verdict wip for
               detailed review
- (s)kip:      don't decide right now. The product will re-appear later
- (d)isregard: this product is not suited for our project. It will get marked
               accordingly. To re-visit those, edit
               bitcoin-wallet-discovery.yaml manually
- (q)uit:      end the current session. Decisions made so far stay saved

Total products: ${this.products.length}
Already disregarded: ${initialDisregarded}
Pending review in this session: ${reviewQueue.length}
`);
    
    if (reviewQueue.length === 0) {
      console.log('Nothing left to review.');
      await this.showSummaryAndConfirm();
      return;
    }
    
    let processedCount = 0;
    
    for (let i = 0; i < reviewQueue.length; i++) {
      const product = reviewQueue[i];
      this.displayProduct(product);
      
      const { addCount, disregardCount, skipCount } = this.getStatusCounts();
      const pendingUnclassified = reviewQueue.length - processedCount;
      
      console.log(`Progress: ${processedCount}/${reviewQueue.length} shown     Decisions so far → Add: ${addCount}, Disregard: ${disregardCount}, Skip: ${skipCount}. Pending this pass: ${pendingUnclassified}`);
      
      processedCount++;
      
      const answer = await this.promptUser('\nAction [(a)dd/(s)kip/(d)isregard/(q)uit]: ');
      
      if (answer === 'a' || answer === 'add') {
        this.updateProductStatus(product, 'add');
        console.log(`✓ Marked for addition: ${product.platform}/${product.appId}`);
        await this.saveYaml({ silent: true });
        
      } else if (answer === 'd' || answer === 'disregard') {
        this.updateProductStatus(product, 'disregard');
        console.log('✓ Marked as disregarded');
        await this.saveYaml({ silent: true });
        
      } else if (answer === 's' || answer === 'skip') {
        this.updateProductStatus(product, 'skipped');
        console.log('→ Marked as skipped (will appear after pending items)');
        await this.saveYaml({ silent: true });
        
      } else if (answer === 'q' || answer === 'quit') {
        console.log('\nQuitting...');
        break;
      } else {
        console.log('Invalid option. Skipping...');
      }
    }
    
    await this.showSummaryAndConfirm();
  }

  async showSummaryAndConfirm() {
    console.log('\n\n' + '='.repeat(80));
    console.log('SUMMARY OF CHANGES');
    console.log('='.repeat(80));
    
    const toAdd = this.products.filter(p => p.status === 'add');
    const disregarded = this.products.filter(p => p.status === 'disregard');
    const skipped = this.products.filter(p => p.status === 'skipped');
    
    console.log(`\n✓ Products marked for addition: ${toAdd.length}`);
    toAdd.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} (${p.platform}/${p.appId})`);
    });
    
    console.log(`\n✗ Products disregarded (persisted immediately): ${disregarded.length}`);
    
    console.log(`\n→ Products skipped for later review: ${skipped.length}`);
    
    if (toAdd.length === 0) {
      console.log('\nNo pending additions. Disregarded/Skipped decisions are already saved.');
      this.rl.close();
      return;
    }
    
    console.log('\n' + '='.repeat(80));
    const confirm = await this.promptUser('\nRun add scripts for the pending apps? (y/n): ');
    
    if (confirm === 'y' || confirm === 'yes') {
      await this.executeChanges(toAdd);
    } else {
      console.log('\nAdditions left pending. You can run this script later to process them.');
    }
    
    this.rl.close();
  }

  async executeChanges(productsToAdd) {
    console.log('\n\nExecuting changes...\n');
    
    if (productsToAdd.length === 0) {
      console.log('No pending additions to execute.');
      return;
    }
    
    const { spawn } = await import('child_process');
    const androidApps = [...new Set(
      productsToAdd
        .filter(p => p.platform === 'android')
        .map(p => p.appId)
    )];
    const iphoneApps = [...new Set(
      productsToAdd
        .filter(p => p.platform === 'iphone')
        .map(p => p.appId)
    )];
    
    if (androidApps.length > 0) {
      console.log(`\nAdding ${androidApps.length} Android apps...\n`);
      console.log(`Command: node addNewAndroidApps.mjs ${androidApps.join(' ')}\n`);
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const rootDir = path.resolve(__dirname, '../../');
      
      const androidChild = spawn('node', ['addNewAndroidApps.mjs', ...androidApps], {
        cwd: rootDir,
        stdio: 'inherit'
      });
      
      await new Promise((resolve, reject) => {
        androidChild.on('close', (code) => {
          if (code === 0) {
            console.log('\n✓ Android apps added successfully');
            resolve();
          } else {
            console.log(`\n✗ Android script exited with code ${code}`);
            reject(new Error(`Process exited with code ${code}`));
          }
        });
        androidChild.on('error', reject);
      });
    }
    
    if (iphoneApps.length > 0) {
      console.log(`\nAdding ${iphoneApps.length} iPhone apps...\n`);
      console.log(`Command: node addNewIphoneApps.mjs ${iphoneApps.join(' ')}\n`);
      
      const iphoneChild = spawn('node', ['../../addNewIphoneApps.mjs', ...iphoneApps], {
        stdio: 'inherit'
      });
      
      await new Promise((resolve, reject) => {
        iphoneChild.on('close', (code) => {
          if (code === 0) {
            console.log('\n✓ iPhone apps added successfully');
            resolve();
          } else {
            console.log(`\n✗ iPhone script exited with code ${code}`);
            reject(new Error(`Process exited with code ${code}`));
          }
        });
        iphoneChild.on('error', reject);
      });
    }
    
    console.log('\nRemoving added products from discovery list...');
    const addedKeys = new Set(
      productsToAdd.map(p => `${p.platform}:${p.appId}`)
    );
    this.products = this.products.filter(
      p => !(p.status === 'add' && addedKeys.has(`${p.platform}:${p.appId}`))
    );
    
    console.log(`✓ Removed ${productsToAdd.length} products from list`);
    
    console.log('\nSaving updated bitcoin-wallet-discovery.yaml...');
    await this.saveYaml();
    
    console.log('\n✓ All changes executed successfully!');
  }

  async run() {
    try {
      await this.loadAndFlattenYaml();
      await this.enrichWithDetails();
      
      // Save enriched data immediately so failed apps won't be retried
      console.log('\nSaving enriched data...');
      await this.saveYaml();
      
      await this.processProducts();
    } catch (error) {
      console.error('Error:', error);
      this.rl.close();
      process.exit(1);
    }
  }
}

// Run the processor
const processor = new WalletDiscoveryProcessor();
processor.run().catch(console.error);
