#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const BACKUP_DIR = './backup/nostr-verification-events/30301';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

class VerificationSearch {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.verifications = [];
    this.currentIndex = 0;
    this.filteredResults = [];
    
    // Enable raw mode for arrow key detection
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
  }

  async loadVerifications() {
    console.log(`${colors.cyan}📂 Loading verification events...${colors.reset}`);
    
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log(`${colors.red}❌ Backup directory not found: ${BACKUP_DIR}${colors.reset}`);
      process.exit(1);
    }

    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
    console.log(`${colors.green}✅ Found ${files.length} verification files${colors.reset}\n`);

    for (const file of files) {
      try {
        const filePath = path.join(BACKUP_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const event = JSON.parse(content);
        
        // Extract useful data
        const verification = {
          id: event.id,
          created_at: event.created_at,
          date: new Date(event.created_at * 1000).toISOString().split('T')[0],
          appId: this.getTagValue(event, 'i') || 'Unknown',
          version: this.getTagValue(event, 'version') || 'Unknown',
          platform: this.getTagValue(event, 'platform') || 'Unknown',
          status: this.getTagValue(event, 'status') || 'Unknown',
          content: event.content,
          pubkey: event.pubkey.substring(0, 8) + '...',
          file: file
        };
        
        this.verifications.push(verification);
      } catch (error) {
        console.log(`${colors.yellow}⚠️  Error reading ${file}: ${error.message}${colors.reset}`);
      }
    }

    // Sort by date (newest first)
    this.verifications.sort((a, b) => b.created_at - a.created_at);
    this.filteredResults = [...this.verifications];
  }

  getTagValue(event, tagName) {
    const tag = event.tags?.find(tag => tag[0] === tagName);
    return tag ? tag[1] : null;
  }

  clearScreen() {
    process.stdout.write('\x1b[2J\x1b[0f'); // Clear screen and move cursor to top
  }

  showHeader() {
    console.log(`${colors.bright}${colors.blue}
╔════════════════════════════════════════════════════════════════╗
║                    🔍 Verification Search Tool                 ║
║                     WalletScrutiny.com Backups                 ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  }

  async showMainMenu() {
    const options = [
      '📋 Browse All Verifications',
      '🔍 Search by App ID',
      '⚡ Filter by Verdict',
      '📅 Search by Date Range',
      '🏆 Show Statistics',
      '❌ Exit'
    ];

    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}📊 Total Verifications: ${this.verifications.length}${colors.reset}`);
    console.log(`${colors.bright}🔍 Filtered Results: ${this.filteredResults.length}${colors.reset}\n`);
    
    const choice = await this.showMenu('Main Menu', options);
    
    switch(choice) {
      case 0: await this.browseAll(); break;
      case 1: await this.searchByAppId(); break;
      case 2: await this.filterByVerdict(); break;
      case 3: await this.searchByDateRange(); break;
      case 4: await this.showStatistics(); break;
      case 5: this.exit(); break;
    }
  }

  async showMenu(title, options) {
    return new Promise((resolve) => {
      let selectedIndex = 0;
      let firstRender = true;
      
      const renderMenu = () => {
        if (!firstRender) {
          // Clear the menu area by moving cursor up and clearing lines
          process.stdout.write(`\x1b[${options.length + 4}A`); // Move up
          process.stdout.write('\x1b[0J'); // Clear from cursor to end of screen
        }
        firstRender = false;
        
        console.log(`${colors.bright}${title}:${colors.reset}`);
        console.log('─'.repeat(title.length + 1));
        
        options.forEach((option, index) => {
          if (index === selectedIndex) {
            console.log(`${colors.bright}${colors.blue}► ${option}${colors.reset}`);
          } else {
            console.log(`  ${option}`);
          }
        });
        
        console.log(`\n${colors.gray}Use ↑↓ arrows to navigate, Enter to select${colors.reset}`);
      };

      renderMenu();

      const keyHandler = (key) => {
        if (key === '\u0003') { // Ctrl+C
          this.exit();
        } else if (key === '\r') { // Enter
          process.stdin.removeListener('data', keyHandler);
          console.log(); // Add newline after selection
          resolve(selectedIndex);
        } else if (key === '\u001b[A') { // Up arrow
          selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
          renderMenu();
        } else if (key === '\u001b[B') { // Down arrow
          selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
          renderMenu();
        }
      };

      process.stdin.on('data', keyHandler);
    });
  }

  async browseAll() {
    await this.showVerificationList(this.filteredResults, 'All Verifications');
  }

  async searchByAppId() {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}🔍 Search by App ID${colors.reset}`);
    console.log('─'.repeat(18));
    
    const appId = await this.prompt('Enter app ID (e.g., com.example.app): ');
    
    if (appId.trim()) {
      const results = this.verifications.filter(v => 
        v.appId.toLowerCase().includes(appId.toLowerCase())
      );
      await this.showVerificationList(results, `Search Results for "${appId}"`);
    } else {
      await this.showMainMenu();
    }
  }

  async filterByVerdict() {
    const verdicts = [...new Set(this.verifications.map(v => v.status))].sort();
    
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}⚡ Available Verdicts:${colors.reset}`);
    verdicts.forEach((verdict, i) => {
      const count = this.verifications.filter(v => v.status === verdict).length;
      console.log(`${i + 1}. ${verdict} (${count})`);
    });
    
    const choice = await this.showMenu('Select Verdict', verdicts.map(v => v));
    const selectedVerdict = verdicts[choice];
    
    const results = this.verifications.filter(v => v.status === selectedVerdict);
    await this.showVerificationList(results, `Verifications with verdict: ${selectedVerdict}`);
  }

  async searchByDateRange() {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}📅 Search by Date Range${colors.reset}`);
    console.log('─'.repeat(23));
    
    const startDate = await this.prompt('Enter start date (YYYY-MM-DD): ');
    const endDate = await this.prompt('Enter end date (YYYY-MM-DD): ');
    
    if (startDate.trim() && endDate.trim()) {
      const results = this.verifications.filter(v => 
        v.date >= startDate && v.date <= endDate
      );
      await this.showVerificationList(results, `Verifications from ${startDate} to ${endDate}`);
    } else {
      await this.showMainMenu();
    }
  }

  async showStatistics() {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}📊 Verification Statistics${colors.reset}`);
    console.log('═'.repeat(26));
    
    // By status
    const statusCounts = {};
    this.verifications.forEach(v => {
      statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
    });
    
    console.log(`\n${colors.bright}📈 By Verdict:${colors.reset}`);
    Object.entries(statusCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / this.verifications.length) * 100).toFixed(1);
        console.log(`   ${status.padEnd(15)}: ${count.toString().padStart(3)} (${percentage}%)`);
      });
    
    // By platform
    const platformCounts = {};
    this.verifications.forEach(v => {
      platformCounts[v.platform] = (platformCounts[v.platform] || 0) + 1;
    });
    
    console.log(`\n${colors.bright}📱 By Platform:${colors.reset}`);
    Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([platform, count]) => {
        const percentage = ((count / this.verifications.length) * 100).toFixed(1);
        console.log(`   ${platform.padEnd(15)}: ${count.toString().padStart(3)} (${percentage}%)`);
      });
    
    // Recent activity
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentCount = this.verifications.filter(v => 
      new Date(v.created_at * 1000) > lastWeek
    ).length;
    
    console.log(`\n${colors.bright}🕒 Recent Activity:${colors.reset}`);
    console.log(`   Last 7 days: ${recentCount} verifications`);
    
    await this.prompt('\nPress Enter to continue...');
    await this.showMainMenu();
  }

  async showVerificationList(verifications, title) {
    if (verifications.length === 0) {
      this.clearScreen();
      this.showHeader();
      console.log(`${colors.yellow}📭 No verifications found for: ${title}${colors.reset}`);
      await this.prompt('\nPress Enter to continue...');
      await this.showMainMenu();
      return;
    }

    let currentPage = 0;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(verifications.length / itemsPerPage);

    while (true) {
      this.clearScreen();
      this.showHeader();
      
      console.log(`${colors.bright}📋 ${title}${colors.reset}`);
      console.log('═'.repeat(Math.max(title.length, 40)));
      console.log(`Page ${currentPage + 1} of ${totalPages} (${verifications.length} total)\n`);
      
      const startIdx = currentPage * itemsPerPage;
      const endIdx = Math.min(startIdx + itemsPerPage, verifications.length);
      const pageItems = verifications.slice(startIdx, endIdx);
      
      pageItems.forEach((verification, index) => {
        const statusColor = this.getStatusColor(verification.status);
        console.log(`${colors.bright}${startIdx + index + 1}.${colors.reset} ${verification.appId}`);
        console.log(`   📅 ${verification.date} | ${statusColor}${verification.status}${colors.reset} | v${verification.version} | ${verification.platform}`);
        console.log(`   👤 ${verification.pubkey} | 📄 ${verification.file.substring(0, 16)}...`);
        console.log();
      });
      
      const options = [];
      if (currentPage > 0) options.push('◀ Previous Page');
      if (currentPage < totalPages - 1) options.push('▶ Next Page');
      options.push('🔍 View Details', '🔙 Back to Main Menu');
      
      const choice = await this.showMenu('Navigation', options);
      
      let optionIndex = 0;
      if (currentPage > 0) {
        if (choice === optionIndex++) {
          currentPage--;
          continue;
        }
      }
      if (currentPage < totalPages - 1) {
        if (choice === optionIndex++) {
          currentPage++;
          continue;
        }
      }
      if (choice === optionIndex++) {
        const itemChoice = await this.selectVerification(pageItems);
        if (itemChoice !== -1) {
          await this.showVerificationDetails(pageItems[itemChoice]);
        }
        continue;
      }
      if (choice === optionIndex++) {
        await this.showMainMenu();
        return;
      }
    }
  }

  async selectVerification(verifications) {
    const options = verifications.map((v, i) => 
      `${i + 1}. ${v.appId} (${v.date}) - ${v.status}`
    );
    options.push('🔙 Back');
    
    this.clearScreen();
    this.showHeader();
    
    const choice = await this.showMenu('Select Verification to View', options);
    return choice === options.length - 1 ? -1 : choice;
  }

  async showVerificationDetails(verification) {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}📄 Verification Details${colors.reset}`);
    console.log('═'.repeat(24));
    
    const statusColor = this.getStatusColor(verification.status);
    
    console.log(`${colors.bright}App ID:${colors.reset}      ${verification.appId}`);
    console.log(`${colors.bright}Version:${colors.reset}     ${verification.version}`);
    console.log(`${colors.bright}Platform:${colors.reset}    ${verification.platform}`);
    console.log(`${colors.bright}Date:${colors.reset}        ${verification.date}`);
    console.log(`${colors.bright}Status:${colors.reset}      ${statusColor}${verification.status}${colors.reset}`);
    console.log(`${colors.bright}Author:${colors.reset}      ${verification.pubkey}`);
    console.log(`${colors.bright}Event ID:${colors.reset}    ${verification.id}`);
    console.log(`${colors.bright}File:${colors.reset}        ${verification.file}`);
    
    if (verification.content) {
      console.log(`\n${colors.bright}📝 Content Preview:${colors.reset}`);
      console.log('─'.repeat(20));
      
      let content = verification.content;
      if (content.startsWith('{')) {
        try {
          const parsed = JSON.parse(content);
          content = parsed.content || parsed.description || content;
        } catch (e) {
          // Keep original content if JSON parsing fails
        }
      }
      
      // Show first 500 characters
      const preview = content.substring(0, 500);
      console.log(preview);
      if (content.length > 500) {
        console.log(`${colors.gray}... (truncated, ${content.length - 500} more characters)${colors.reset}`);
      }
    }
    
    const options = ['📋 Show Full Content', '📄 Open File', '🔙 Back'];
    const choice = await this.showMenu('Actions', options);
    
    switch(choice) {
      case 0:
        await this.showFullContent(verification);
        break;
      case 1:
        console.log(`\n${colors.cyan}File location: ${path.join(BACKUP_DIR, verification.file)}${colors.reset}`);
        await this.prompt('Press Enter to continue...');
        await this.showVerificationDetails(verification);
        break;
      case 2:
        return;
    }
  }

  async showFullContent(verification) {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}📄 Full Content - ${verification.appId}${colors.reset}`);
    console.log('═'.repeat(40));
    
    let content = verification.content;
    if (content.startsWith('{')) {
      try {
        const parsed = JSON.parse(content);
        content = parsed.content || parsed.description || content;
      } catch (e) {
        // Keep original content if JSON parsing fails
      }
    }
    
    // Replace common markdown/HTML with readable text
    content = content
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\\\\/g, '\\');
    
    console.log(content);
    
    await this.prompt('\nPress Enter to continue...');
    await this.showVerificationDetails(verification);
  }

  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'reproducible': return colors.green;
      case 'ftbfs': return colors.red;
      case 'nonverifiable': return colors.yellow;
      case 'wip': return colors.blue;
      default: return colors.gray;
    }
  }

  async prompt(question) {
    return new Promise((resolve) => {
      // Temporarily disable raw mode for text input
      process.stdin.setRawMode(false);
      
      this.rl.question(question, (answer) => {
        // Re-enable raw mode
        process.stdin.setRawMode(true);
        resolve(answer);
      });
    });
  }

  exit() {
    this.clearScreen();
    console.log(`\n${colors.cyan}👋 Thank you for using Verification Search Tool!${colors.reset}`);
    this.rl.close();
    process.stdin.setRawMode(false);
    process.stdin.resume();
    process.exit(0);
  }
}

// Main execution
async function main() {
  const search = new VerificationSearch();
  
  // Handle process termination gracefully
  process.on('SIGINT', () => search.exit());
  process.on('SIGTERM', () => search.exit());
  
  try {
    await search.loadVerifications();
    await search.showMainMenu();
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    search.exit();
  }
}

main();
