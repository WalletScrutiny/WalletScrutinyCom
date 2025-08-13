#!/usr/bin/env node

/**
 * WalletScrutiny Nostr Verification Search Tool (Refactored)
 * 
 * A terminal-based tool for searching and analyzing Nostr verification events
 * from WalletScrutiny.com backups. Provides functionality to browse verifications,
 * find apps that need verification, and manage verification data.
 * 
 * Features:
 * - Browse all verification events
 * - Search by app ID, verdict, or date range
 * - Show statistics and analytics
 * - Identify apps needing verification
 * - Update verification data from Nostr nodes
 * 
 * Author: WalletScrutiny.com
 * License: MIT
 */

import { spawn } from 'child_process';
import { DataLoader } from './DataLoader.mjs';
import { AppAnalyzer } from './AppAnalyzer.mjs';
import { DisplayManager } from './DisplayManager.mjs';
import { 
  COLORS, 
  UI_TEXT
} from './Constants.mjs';

/**
 * Main VerificationSearch class - coordinates all components
 * Acts as the main controller for the application
 */
class VerificationSearch {
  constructor() {
    // Initialize component dependencies
    this.dataLoader = new DataLoader();
    this.analyzer = new AppAnalyzer();
    this.display = new DisplayManager();
    
    // Application state
    this.verifications = [];
    this.filteredResults = [];
  }

  /**
   * Load verification events from JSON files
   */
  async loadVerifications() {
    this.verifications = await this.dataLoader.loadVerifications();
    this.filteredResults = [...this.verifications];
  }

  /**
   * Display main menu and handle user selection
   */
  async showMainMenu() {
    const choice = await this.display.showMainMenu(
      this.verifications.length, 
      this.filteredResults.length
    );
    
    // Handle menu selection
    switch(choice) {
      case 0: await this.browseAll(); break;
      case 1: await this.searchByAppId(); break;
      case 2: await this.filterByVerdict(); break;
      case 3: await this.searchByDateRange(); break;
      case 4: await this.showStatistics(); break;
      case 5: await this.showNeedsVerification(); break;
      case 6: await this.updateVerifications(); break;
      case 7: this.display.exit(); break;
    }
  }

  /**
   * Browse all verifications with pagination
   */
  async browseAll() {
    await this.showVerificationList(this.filteredResults, 'All Verifications');
  }

  /**
   * Search verifications by app ID
   */
  async searchByAppId() {
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}🔍 Search by App ID${COLORS.reset}`);
    console.log('─'.repeat(18));
    
    const appId = await this.display.prompt('Enter app ID (e.g., com.example.app): ');
    
    if (appId.trim()) {
      const results = this.verifications.filter(v => 
        v.appId.toLowerCase().includes(appId.toLowerCase())
      );
      await this.showVerificationList(results, `Search Results for "${appId}"`);
    } else {
      await this.showMainMenu();
    }
  }

  /**
   * Filter verifications by verdict
   */
  async filterByVerdict() {
    const verdicts = [...new Set(this.verifications.map(v => v.status))].sort();
    
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}⚡ Available Verdicts:${COLORS.reset}`);
    verdicts.forEach((verdict, i) => {
      const count = this.verifications.filter(v => v.status === verdict).length;
      console.log(`${i + 1}. ${verdict} (${count})`);
    });
    
    const choice = await this.display.showMenu('Select Verdict', verdicts.map(v => v));
    const selectedVerdict = verdicts[choice];
    
    const results = this.verifications.filter(v => v.status === selectedVerdict);
    await this.showVerificationList(results, `Verifications with verdict: ${selectedVerdict}`);
  }

  /**
   * Search verifications by date range
   */
  async searchByDateRange() {
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}📅 Search by Date Range${COLORS.reset}`);
    console.log('─'.repeat(23));
    
    const startDate = await this.display.prompt('Enter start date (YYYY-MM-DD): ');
    const endDate = await this.display.prompt('Enter end date (YYYY-MM-DD): ');
    
    if (startDate.trim() && endDate.trim()) {
      const results = this.verifications.filter(v => 
        v.date >= startDate && v.date <= endDate
      );
      await this.showVerificationList(results, `Verifications from ${startDate} to ${endDate}`);
    } else {
      await this.showMainMenu();
    }
  }

  /**
   * Display verification statistics
   */
  async showStatistics() {
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}📊 Verification Statistics${COLORS.reset}`);
    console.log('═'.repeat(26));
    
    // Calculate statistics by status
    const statusCounts = {};
    this.verifications.forEach(v => {
      statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
    });
    
    console.log(`\n${COLORS.bright}📈 By Verdict:${COLORS.reset}`);
    Object.entries(statusCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / this.verifications.length) * 100).toFixed(1);
        console.log(`   ${status.padEnd(15)}: ${count.toString().padStart(3)} (${percentage}%)`);
      });
    
    // Calculate statistics by platform
    const platformCounts = {};
    this.verifications.forEach(v => {
      platformCounts[v.platform] = (platformCounts[v.platform] || 0) + 1;
    });
    
    console.log(`\n${COLORS.bright}📱 By Platform:${COLORS.reset}`);
    Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([platform, count]) => {
        const percentage = ((count / this.verifications.length) * 100).toFixed(1);
        console.log(`   ${platform.padEnd(15)}: ${count.toString().padStart(3)} (${percentage}%)`);
      });
    
    // Show recent activity
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentCount = this.verifications.filter(v => 
      new Date(v.created_at * 1000) > lastWeek
    ).length;
    
    console.log(`\n${COLORS.bright}🕒 Recent Activity:${COLORS.reset}`);
    console.log(`   Last 7 days: ${recentCount} verifications`);
    
    await this.display.prompt('\nPress Enter to continue...');
    await this.showMainMenu();
  }

  /**
   * Show apps that need verification
   */
  async showNeedsVerification() {
    // Load markdown apps and analyze verification status
    const markdownApps = await this.dataLoader.loadMarkdownApps();
    const needsVerification = this.analyzer.analyzeAppsNeedingVerification(
      markdownApps, 
      this.verifications
    );
    
    if (needsVerification.length === 0) {
      this.display.showSuccess(UI_TEXT.ALL_UP_TO_DATE);
      await this.display.prompt('\nPress Enter to continue...');
      await this.showMainMenu();
      return;
    }
    
    // Use DisplayManager to show the needs verification list
    await this.display.showNeedsVerificationList(needsVerification, this.analyzer);
    await this.showMainMenu();
  }

  /**
   * Update verifications by running backup script
   */
  async updateVerifications() {
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}🔄 Update Verifications${COLORS.reset}`);
    console.log('═'.repeat(23));
    console.log(`${COLORS.yellow}⚠️  This will run the backup script to fetch new verification events from Nostr nodes.${COLORS.reset}`);
    console.log(`${COLORS.gray}Script: scripts/nostr/backupNostrVerificationEvents.mjs${COLORS.reset}\n`);
    
    const confirm = await this.display.prompt('Do you want to proceed? (y/N): ');
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      await this.showMainMenu();
      return;
    }
    
    console.log(`\n${COLORS.cyan}${UI_TEXT.BACKUP_STARTING}${COLORS.reset}`);
    
    try {
      // Temporarily disable raw mode for the child process
      process.stdin.setRawMode(false);
      
      const child = spawn('node', ['scripts/nostr/backupNostrVerificationEvents.mjs'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      await new Promise((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Backup script exited with code ${code}`));
          }
        });
        
        child.on('error', reject);
      });
      
      // Re-enable raw mode
      process.stdin.setRawMode(true);
      
      this.display.showSuccess(UI_TEXT.BACKUP_SUCCESS);
      console.log(`${COLORS.cyan}${UI_TEXT.DATA_RELOADING}${COLORS.reset}`);
      
      // Reload the verifications
      this.verifications = [];
      this.filteredResults = [];
      await this.loadVerifications();
      
      this.display.showSuccess(UI_TEXT.DATA_RELOADED);
      await this.display.prompt('\nPress Enter to continue...');
      
    } catch (error) {
      // Re-enable raw mode in case of error
      process.stdin.setRawMode(true);
      
      this.display.showError(`Error running backup script: ${error.message}`);
      await this.display.prompt('\nPress Enter to continue...');
    }
    
    await this.showMainMenu();
  }

  /**
   * Show paginated list of verifications
   * @param {Array} verifications - Verifications to display
   * @param {string} title - List title
   */
  async showVerificationList(verifications, title) {
    if (verifications.length === 0) {
      this.display.clearScreen();
      this.display.showHeader();
      console.log(`${COLORS.yellow}📭 No verifications found for: ${title}${COLORS.reset}`);
      await this.display.prompt('\nPress Enter to continue...');
      await this.showMainMenu();
      return;
    }

    let currentPage = 0;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(verifications.length / itemsPerPage);

    while (true) {
      this.display.clearScreen();
      this.display.showHeader();
      
      console.log(`${COLORS.bright}📋 ${title}${COLORS.reset}`);
      console.log('═'.repeat(Math.max(title.length, 40)));
      console.log(`Page ${currentPage + 1} of ${totalPages} (${verifications.length} total)\n`);
      
      const startIdx = currentPage * itemsPerPage;
      const endIdx = Math.min(startIdx + itemsPerPage, verifications.length);
      const pageItems = verifications.slice(startIdx, endIdx);
      
      pageItems.forEach((verification, index) => {
        const statusColor = this.getStatusColor(verification.status);
        console.log(`${COLORS.bright}${startIdx + index + 1}.${COLORS.reset} ${verification.appId}`);
        console.log(`   📅 ${verification.date} | ${statusColor}${verification.status}${COLORS.reset} | v${verification.version} | ${verification.platform}`);
        console.log(`   👤 ${verification.pubkey} | 📄 ${verification.file.substring(0, 16)}...`);
        console.log();
      });
      
      const options = [];
      if (currentPage > 0) options.push('◀ Previous Page');
      if (currentPage < totalPages - 1) options.push('▶ Next Page');
      options.push('🔍 View Details', '🔙 Back to Main Menu');
      
      const choice = await this.display.showMenu('Navigation', options);
      
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

  /**
   * Let user select a verification from the current page
   * @param {Array} verifications - Verifications to choose from
   * @returns {Promise<number>} Selected verification index or -1 for back
   */
  async selectVerification(verifications) {
    const options = verifications.map((v, i) => 
      `${i + 1}. ${v.appId} (${v.date}) - ${v.status}`
    );
    options.push('🔙 Back');
    
    this.display.clearScreen();
    this.display.showHeader();
    
    const choice = await this.display.showMenu('Select Verification to View', options);
    return choice === options.length - 1 ? -1 : choice;
  }

  /**
   * Display detailed information about a verification
   * @param {Object} verification - Verification to display
   */
  async showVerificationDetails(verification) {
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}📄 Verification Details${COLORS.reset}`);
    console.log('═'.repeat(24));
    
    const statusColor = this.getStatusColor(verification.status);
    
    console.log(`${COLORS.bright}App ID:${COLORS.reset}      ${verification.appId}`);
    console.log(`${COLORS.bright}Version:${COLORS.reset}     ${verification.version}`);
    console.log(`${COLORS.bright}Platform:${COLORS.reset}    ${verification.platform}`);
    console.log(`${COLORS.bright}Date:${COLORS.reset}        ${verification.date}`);
    console.log(`${COLORS.bright}Status:${COLORS.reset}      ${statusColor}${verification.status}${COLORS.reset}`);
    console.log(`${COLORS.bright}Author:${COLORS.reset}      ${verification.pubkey}`);
    console.log(`${COLORS.bright}Event ID:${COLORS.reset}    ${verification.id}`);
    console.log(`${COLORS.bright}File:${COLORS.reset}        ${verification.file}`);
    
    if (verification.content) {
      console.log(`\n${COLORS.bright}📝 Content Preview:${COLORS.reset}`);
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
        console.log(`${COLORS.gray}... (truncated, ${content.length - 500} more characters)${COLORS.reset}`);
      }
    }
    
    const options = ['📋 Show Full Content', '📄 Open File', '🔙 Back'];
    const choice = await this.display.showMenu('Actions', options);
    
    switch(choice) {
      case 0:
        await this.showFullContent(verification);
        break;
      case 1:
        console.log(`\n${COLORS.cyan}File location: ${verification.file}${COLORS.reset}`);
        await this.display.prompt('Press Enter to continue...');
        await this.showVerificationDetails(verification);
        break;
      case 2:
        return;
    }
  }

  /**
   * Show full content of a verification
   * @param {Object} verification - Verification to display content for
   */
  async showFullContent(verification) {
    this.display.clearScreen();
    this.display.showHeader();
    
    console.log(`${COLORS.bright}📄 Full Content - ${verification.appId}${COLORS.reset}`);
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
    
    await this.display.prompt('\nPress Enter to continue...');
    await this.showVerificationDetails(verification);
  }

  /**
   * Get color for verification status
   * @param {string} status - Verification status
   * @returns {string} ANSI color codes
   */
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'reproducible': return COLORS.green;
      case 'ftbfs': return COLORS.red;
      case 'nonverifiable': return COLORS.yellow;
      case 'wip': return COLORS.blue;
      default: return COLORS.gray;
    }
  }
}

/**
 * Main execution function
 * Initializes the application and handles graceful shutdown
 */
async function main() {
  const search = new VerificationSearch();
  
  // Handle process termination gracefully
  process.on('SIGINT', () => search.display.exit());
  process.on('SIGTERM', () => search.display.exit());
  
  try {
    await search.loadVerifications();
    await search.showMainMenu();
  } catch (error) {
    search.display.showError(`Error: ${error.message}`);
    search.display.exit();
  }
}

// Start the application
main();