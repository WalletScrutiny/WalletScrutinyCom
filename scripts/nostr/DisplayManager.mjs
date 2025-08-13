/**
 * DisplayManager - Handles all UI rendering, menus, and terminal interactions
 * Responsible for displaying content, managing navigation, and user input
 */

import readline from 'readline';
import { 
  COLORS, 
  UI_TEXT, 
  MENU_OPTIONS, 
  NAV_OPTIONS,
  STATUS_TYPES,
  ITEMS_PER_PAGE 
} from './Constants.mjs';

export class DisplayManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Enable raw mode for arrow key detection
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
  }

  /**
   * Clear the terminal screen
   */
  clearScreen() {
    process.stdout.write('\x1b[2J\x1b[0f'); // Clear screen and move cursor to top
  }

  /**
   * Display the application header
   */
  showHeader() {
    console.log(`${COLORS.bright}${COLORS.blue}
╔════════════════════════════════════════════════════════════════╗
║                    ${UI_TEXT.TOOL_TITLE}                 ║
║                     ${UI_TEXT.TOOL_SUBTITLE}                 ║
╚════════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);
  }

  /**
   * Display the main menu and get user selection
   * @param {number} totalVerifications - Total number of verifications loaded
   * @param {number} filteredResults - Number of filtered results
   * @returns {Promise<number>} Selected menu option index
   */
  async showMainMenu(totalVerifications, filteredResults) {
    const options = [
      MENU_OPTIONS.BROWSE_ALL,
      MENU_OPTIONS.SEARCH_BY_ID,
      MENU_OPTIONS.FILTER_BY_VERDICT,
      MENU_OPTIONS.SEARCH_BY_DATE,
      MENU_OPTIONS.SHOW_STATISTICS,
      MENU_OPTIONS.NEEDS_VERIFICATION,
      MENU_OPTIONS.UPDATE_VERIFICATIONS,
      MENU_OPTIONS.EXIT
    ];

    this.clearScreen();
    this.showHeader();
    
    console.log(`${COLORS.bright}📊 Total Verifications: ${totalVerifications}${COLORS.reset}`);
    console.log(`${COLORS.bright}🔍 Filtered Results: ${filteredResults}${COLORS.reset}\n`);
    
    return await this.showMenu('Main Menu', options);
  }

  /**
   * Display a generic menu with arrow key navigation
   * @param {string} title - Menu title
   * @param {Array} options - Array of menu options
   * @returns {Promise<number>} Selected option index
   */
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
        
        console.log(`${COLORS.bright}${title}:${COLORS.reset}`);
        console.log('─'.repeat(title.length + 1));
        
        options.forEach((option, index) => {
          if (index === selectedIndex) {
            console.log(`${COLORS.bright}${COLORS.blue}► ${option}${COLORS.reset}`);
          } else {
            console.log(`  ${option}`);
          }
        });
        
        console.log(`\n${COLORS.gray}Use ↑↓ arrows to navigate, Enter to select${COLORS.reset}`);
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

  /**
   * Display apps needing verification with pagination and sorting options
   * @param {Array} apps - Apps that need verification
   * @param {Object} analyzer - AppAnalyzer instance for sorting operations
   * @returns {Promise<void>}
   */
  async showNeedsVerificationList(apps, analyzer) {
    let currentPage = 0;
    let sortedApps = [...apps]; // Create a copy for sorting
    let currentSortMethod = 'priority'; // Default sort
    
    // Calculate summary statistics
    const platformStats = analyzer.calculatePlatformStats(apps);
    const oldestApp = analyzer.findOldestUnverified(apps);
    const mostRecentApp = analyzer.findMostRecentlyVerified(apps);

    while (true) {
      const totalPages = Math.ceil(sortedApps.length / ITEMS_PER_PAGE);
      
      this.clearScreen();
      this.showHeader();
      
      console.log(`${COLORS.bright}🚨 Apps Needing Verification${COLORS.reset}`);
      console.log('═'.repeat(30));
      console.log(`Page ${currentPage + 1} of ${totalPages} (${sortedApps.length} total)\n`);
      
      // Show summary statistics
      this._displaySummaryStats(platformStats, oldestApp, mostRecentApp);
      
      // Show sorting options
      this._displaySortingOptions(currentSortMethod, analyzer);
      
      // Display current page of apps
      const startIdx = currentPage * ITEMS_PER_PAGE;
      const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, sortedApps.length);
      const pageItems = sortedApps.slice(startIdx, endIdx);
      
      this._displayAppsList(pageItems, startIdx);
      
      // Show navigation options
      const options = [];
      options.push(NAV_OPTIONS.SORT_BY_PLATFORM);
      options.push(NAV_OPTIONS.SORT_BY_DATE);
      if (currentPage > 0) options.push(NAV_OPTIONS.PREVIOUS_PAGE);
      if (currentPage < totalPages - 1) options.push(NAV_OPTIONS.NEXT_PAGE);
      options.push(NAV_OPTIONS.BACK_TO_MAIN);
      
      const choice = await this.showMenu('Options', options);
      
      let optionIndex = 0;
      
      // Handle sort by platform
      if (choice === optionIndex++) {
        sortedApps = analyzer.sortAppsByPlatform([...apps]);
        currentSortMethod = 'platform';
        currentPage = 0;
        continue;
      }
      
      // Handle sort by date
      if (choice === optionIndex++) {
        sortedApps = analyzer.sortAppsByDate([...apps]);
        currentSortMethod = 'date';
        currentPage = 0;
        continue;
      }
      
      // Handle previous page
      if (currentPage > 0) {
        if (choice === optionIndex++) {
          currentPage--;
          continue;
        }
      }
      
      // Handle next page
      if (currentPage < totalPages - 1) {
        if (choice === optionIndex++) {
          currentPage++;
          continue;
        }
      }
      
      // Handle back to main menu
      if (choice === optionIndex++) {
        return; // Exit to caller
      }
    }
  }

  /**
   * Display summary statistics
   * @private
   */
  _displaySummaryStats(platformStats, oldestApp, mostRecentApp) {
    console.log(`${COLORS.bright}📊 Summary:${COLORS.reset}`);
    console.log(`   ${platformStats.android} apps need verification in android, ${platformStats.bearer} in bearer, ${platformStats.desktop} in desktop, ${platformStats.hardware} in hardware`);
    if (oldestApp) {
      console.log(`   ${COLORS.bright}Oldest needs verification:${COLORS.reset} ${oldestApp.appId}`);
    }
    if (mostRecentApp) {
      console.log(`   ${COLORS.bright}Most recently verified:${COLORS.reset} ${mostRecentApp.appId}`);
    }
    console.log();
  }

  /**
   * Display sorting options
   * @private
   */
  _displaySortingOptions(currentSortMethod, analyzer) {
    console.log(`${COLORS.bright}🔄 Sorting Options:${COLORS.reset}`);
    console.log(`   Current sort: ${COLORS.cyan}${analyzer.getSortMethodName(currentSortMethod)}${COLORS.reset}`);
    console.log(`   1. By platform  2. By date of last verification\n`);
  }

  /**
   * Display the list of apps for current page
   * @private
   */
  _displayAppsList(pageItems, startIdx) {
    pageItems.forEach((app, index) => {
      const statusColor = this._getStatusColor(app.statusType);
      console.log(`${COLORS.bright}${startIdx + index + 1}.${COLORS.reset} ${app.appId}`);
      console.log(`   ${COLORS.bright}Platform:${COLORS.reset} ${app.platform}`);
      console.log(`   ${COLORS.bright}Latest version available:${COLORS.reset} ${app.version}`);
      console.log(`   ${COLORS.bright}Latest version verified in nostr:${COLORS.reset} ${app.latestVerifiedVersion}`);
      console.log(`   ${COLORS.bright}Status:${COLORS.reset} ${statusColor}${app.statusMessage}${COLORS.reset}`);
      console.log();
    });
  }

  /**
   * Get color formatting for different status types
   * @private
   * @param {string} statusType - The status type constant
   * @returns {string} ANSI color codes
   */
  _getStatusColor(statusType) {
    switch (statusType) {
      case STATUS_TYPES.NEEDS_VERIFICATION:
        return `${COLORS.bright}${COLORS.green}`;
      case STATUS_TYPES.UPDATE_NEEDED:
        return `${COLORS.bright}${COLORS.yellow}`;
      case STATUS_TYPES.VERSION_MISMATCH:
        return `${COLORS.bright}${COLORS.red}`;
      default:
        return COLORS.gray;
    }
  }

  /**
   * Prompt user for text input
   * @param {string} question - Question to display
   * @returns {Promise<string>} User's input
   */
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

  /**
   * Display success message
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    console.log(`${COLORS.green}✅ ${message}${COLORS.reset}`);
  }

  /**
   * Display error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    console.log(`${COLORS.red}❌ ${message}${COLORS.reset}`);
  }

  /**
   * Display warning message
   * @param {string} message - Warning message to display
   */
  showWarning(message) {
    console.log(`${COLORS.yellow}⚠️  ${message}${COLORS.reset}`);
  }

  /**
   * Display info message
   * @param {string} message - Info message to display
   */
  showInfo(message) {
    console.log(`${COLORS.cyan}ℹ️  ${message}${COLORS.reset}`);
  }

  /**
   * Clean up and exit the application
   */
  exit() {
    this.clearScreen();
    console.log(`\n${COLORS.cyan}${UI_TEXT.GOODBYE}${COLORS.reset}`);
    this.rl.close();
    process.stdin.setRawMode(false);
    process.stdin.resume();
    process.exit(0);
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }
}