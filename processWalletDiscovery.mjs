import fs from 'fs/promises';
import yaml from 'js-yaml';
import readline from 'readline';
import gplay from 'google-play-scraper';
import apple from 'app-store-scraper';
import { Semaphore } from 'async-mutex';

const playSem = new Semaphore(5);
const appleSem = new Semaphore(3);

class WalletDiscoveryProcessor {
  constructor() {
    this.products = [];
    this.toAdd = [];
    this.changes = {
      added: [],
      disregarded: []
    };
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
      this.products = data.map(app => ({
        ...app,
        disregard: app.disregard || false
      }));
    } else {
      // Old nested structure
      if (data.android) {
        for (const app of data.android) {
          this.products.push({
            ...app,
            platform: 'android',
            disregard: app.disregard || false
          });
        }
      }
      
      if (data.iphone) {
        for (const app of data.iphone) {
          this.products.push({
            ...app,
            platform: 'iphone',
            disregard: app.disregard || false
          });
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

  async enrichWithDetails() {
    console.log('\nEnriching products with full details...');
    
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      
      // Skip if already has full description or is disregarded
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
          product.ratings = (details && details.ratings) || 0;
          product.reviews = (details && details.reviews) || 0;
          
          // Calculate user count heuristic (use minInstalls as base)
          product.userCount = product.minInstalls || 0;
          
          console.log(`  [${i + 1}/${this.products.length}] ✓ ${product.title}`);
        } catch (error) {
          // App might not be available anymore or API issue
          console.log(`  [${i + 1}/${this.products.length}] ✗ ${product.title} - ${error.message}`);
          // Mark as enriched with existing data to avoid retrying
          product.fullDescription = product.summary || product.description || 'Description not available';
          product.userCount = 0;
          product.minInstalls = 0;
          product.maxInstalls = 0;
          product.ratings = 0;
          product.reviews = 0;
          product.installs = product.installs || 'N/A';
        } finally {
          release();
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (product.platform === 'iphone') {
        const [, release] = await appleSem.acquire();
        try {
          const details = await apple.app({ id: product.id });
          
          // Safely assign properties with fallbacks
          product.fullDescription = (details && details.description) || product.description || 'Description not available';
          product.score = (details && details.score) || product.score || 0;
          product.ratings = (details && details.ratings) || 0;
          product.reviews = (details && details.reviews) || 0;
          
          // Calculate ratings count heuristic
          product.ratingsCount = product.ratings || 0;
          
          console.log(`  [${i + 1}/${this.products.length}] ✓ ${product.title}`);
        } catch (error) {
          // App might not be available anymore or API issue
          console.log(`  [${i + 1}/${this.products.length}] ✗ ${product.title} - ${error.message}`);
          // Mark as enriched with existing data to avoid retrying
          product.fullDescription = product.description || 'Description not available';
          product.ratingsCount = 0;
          product.ratings = 0;
          product.reviews = 0;
        } finally {
          release();
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  sortByRelevance() {
    // Sort by user count (Android) or ratings count (iPhone)
    // Assume 20 users = 1 rating for comparison
    this.products.sort((a, b) => {
      const aScore = a.platform === 'android' 
        ? (a.userCount || 0) / 20 
        : (a.ratingsCount || 0);
      const bScore = b.platform === 'android' 
        ? (b.userCount || 0) / 20 
        : (b.ratingsCount || 0);
      return bScore - aScore;
    });
  }

  async saveYaml() {
    const yamlContent = yaml.dump(this.products, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    await fs.writeFile('bitcoin-wallet-discovery.yaml', yamlContent);
    console.log('\n✓ Saved bitcoin-wallet-discovery.yaml');
  }

  highlightAllSearchTerms(text) {
    if (!text) return text;
    
    // Convert <br> and <br/> to newlines
    text = text.replace(/<br\s*\/?>/gi, '\n');
    
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
    console.log(`${bold}Relevance Score:${reset}  ${product.relevanceScore}`);
    
    if (product.platform === 'android') {
      console.log(`${bold}Installs:${reset}  ${product.installs || 'N/A'}`);
      console.log(`${bold}User Count:${reset}  ${product.userCount || 'N/A'}`);
      console.log(`${bold}Ratings:${reset}  ${product.ratings || 'N/A'}`);
      
      if (product.summary) {
        console.log(`\n${bold}Summary:${reset}`);
        const summary = this.highlightAllSearchTerms(product.summary);
        summary.split('\n').forEach(line => console.log(`  ${line}`));
      }
    } else {
      console.log(`${bold}Ratings Count:${reset}  ${product.ratingsCount || 'N/A'}`);
    }
    
    // Description
    const desc = product.fullDescription || product.description;
    if (desc) {
      console.log(`\n${bold}Description:${reset}`);
      const highlighted = this.highlightAllSearchTerms(desc);
      highlighted.split('\n').forEach(line => console.log(`  ${line}`));
    }
    
    if (product.excludeTerms && product.excludeTerms.length > 0) {
      console.log(`\n${bold}Exclude Terms:${reset}  ${product.excludeTerms.join(', ')}`);
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
    console.log('\n\nStarting interactive review...');
    console.log('Commands: (a)dd, (s)kip, (d)isregard, (q)uit\n');
    
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      
      // Skip already disregarded
      if (product.disregard) {
        continue;
      }
      
      this.displayProduct(product);
      
      console.log(`\nProgress: ${i + 1}/${this.products.length}`);
      const answer = await this.promptUser('\nAction [(a)dd/(s)kip/(d)isregard/(q)uit]: ');
      
      if (answer === 'a' || answer === 'add') {
        const identifier = product.platform === 'android' 
          ? `android/${product.appId}`
          : `iphone/${product.appId}`;
        this.toAdd.push(identifier);
        this.changes.added.push(product);
        console.log(`✓ Marked for addition: ${identifier}`);
        
      } else if (answer === 'd' || answer === 'disregard') {
        product.disregard = true;
        this.changes.disregarded.push(product);
        console.log(`✓ Marked as disregarded`);
        
      } else if (answer === 's' || answer === 'skip') {
        console.log(`→ Skipped`);
        
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
    
    console.log(`\n✓ Products to add: ${this.changes.added.length}`);
    if (this.changes.added.length > 0) {
      this.changes.added.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.title} (${p.platform}/${p.appId})`);
      });
    }
    
    console.log(`\n✗ Products disregarded: ${this.changes.disregarded.length}`);
    if (this.changes.disregarded.length > 0) {
      this.changes.disregarded.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.title} (${p.platform}/${p.appId})`);
      });
    }
    
    if (this.changes.added.length === 0 && this.changes.disregarded.length === 0) {
      console.log('\nNo changes to apply.');
      this.rl.close();
      return;
    }
    
    console.log('\n' + '='.repeat(80));
    const confirm = await this.promptUser('\nExecute changes? (y/n): ');
    
    if (confirm === 'y' || confirm === 'yes') {
      await this.executeChanges();
    } else {
      console.log('\nChanges discarded.');
    }
    
    this.rl.close();
  }

  async executeChanges() {
    console.log('\n\nExecuting changes...\n');
    
    // Add new apps using the appropriate scripts
    if (this.toAdd.length > 0) {
      const { spawn } = await import('child_process');
      
      // Separate Android and iPhone apps
      const androidApps = this.toAdd
        .filter(id => id.startsWith('android/'))
        .map(id => id.replace('android/', ''));
      
      const iphoneApps = this.toAdd
        .filter(id => id.startsWith('iphone/'))
        .map(id => id.replace('iphone/', ''));
      
      // Add Android apps
      if (androidApps.length > 0) {
        console.log(`\nAdding ${androidApps.length} Android apps...\n`);
        console.log(`Command: node addNewAndroidApps.mjs ${androidApps.join(' ')}\n`);
        
        const androidChild = spawn('node', ['addNewAndroidApps.mjs', ...androidApps], {
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
      
      // Add iPhone apps
      if (iphoneApps.length > 0) {
        console.log(`\nAdding ${iphoneApps.length} iPhone apps...\n`);
        console.log(`Command: node addNewIphoneApps.mjs ${iphoneApps.join(' ')}\n`);
        
        const iphoneChild = spawn('node', ['addNewIphoneApps.mjs', ...iphoneApps], {
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
      
      // Remove successfully added products from the list
      console.log('\nRemoving added products from discovery list...');
      const addedAppIds = new Set(this.changes.added.map(p => p.appId));
      this.products = this.products.filter(p => !addedAppIds.has(p.appId));
      console.log(`✓ Removed ${this.changes.added.length} products from list`);
    }
    
    // Save updated YAML (with disregard flags and removed added products)
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
      
      this.sortByRelevance();
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
