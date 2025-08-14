#!/usr/bin/env node

/**
 * WalletScrutiny Nostr Verification CLI Tool (Refactored & Secured)
 * 
 * A secure command-line tool for searching and analyzing Nostr verification events
 * from WalletScrutiny.com backups. Includes comprehensive input validation,
 * output sanitization, and security controls.
 * 
 * Author: WalletScrutiny.com
 * License: MIT
 */

import { DataLoader, Validator } from './DataLoader.mjs';
import { AppAnalyzer } from './AppAnalyzer.mjs';
import { 
  OutputFormatter, 
  VerificationError, 
  ValidationError, 
  DataLoadError, 
  FileSystemError, 
  ProcessError 
} from './OutputFormatter.mjs';
import { ProcessExecutor } from './ProcessExecutor.mjs';

/**
 * Command-line interface parser
 */
class CLIParser {
  /**
   * Create a CLI parser instance
   * @param {string[]} args - Command line arguments
   */
  constructor(args) {
    this.args = args;
    this.flags = this._parseFlags();
  }

  /**
   * Parse command line flags and arguments
   * @private
   * @returns {Object} Parsed flags object
   * @throws {ValidationError} If arguments are invalid
   */
  _parseFlags() {
    const flags = {
      help: false,
      list: false,
      appId: null,
      verdict: null,
      dateRange: null,
      stats: false,
      needsVerification: false,
      update: false,
      json: false,
      limit: null,
      sortBy: 'priority'
    };

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];
      
      switch (arg) {
        case '--help':
        case '-h':
          flags.help = true;
          break;
          
        case '--list':
        case '--browse':
          flags.list = true;
          break;
          
        case '--app-id':
          if (i + 1 >= this.args.length) {
            throw new ValidationError('--app-id requires a value', 'appId');
          }
          flags.appId = this.args[++i];
          break;
          
        case '--verdict':
          if (i + 1 >= this.args.length) {
            throw new ValidationError('--verdict requires a value', 'verdict');
          }
          flags.verdict = this.args[++i];
          break;
          
        case '--date-range':
          if (i + 2 >= this.args.length) {
            throw new ValidationError('--date-range requires start and end dates', 'dateRange');
          }
          flags.dateRange = [this.args[++i], this.args[++i]];
          break;
          
        case '--stats':
          flags.stats = true;
          break;
          
        case '--needs-verification':
          flags.needsVerification = true;
          break;
          
        case '--update':
        case '--backup':
          flags.update = true;
          break;
          
        case '--json':
          flags.json = true;
          break;
          
        case '--limit':
          if (i + 1 >= this.args.length) {
            throw new ValidationError('--limit requires a value', 'limit');
          }
          flags.limit = this.args[++i];
          break;
          
        case '--sort-by':
          if (i + 1 >= this.args.length) {
            throw new ValidationError('--sort-by requires a value', 'sortBy');
          }
          flags.sortBy = this.args[++i];
          break;
          
        default:
          if (arg.startsWith('-')) {
            throw new ValidationError(`Unknown option: ${arg}`, 'unknown');
          }
          // Ignore non-flag arguments
          break;
      }
    }

    return flags;
  }

  /**
   * Get parsed and validated flags
   * @returns {Object} Validated flags object
   * @throws {ValidationError} If validation fails
   */
  getFlags() {
    return Validator.validateCliArgs(this.flags);
  }

  /**
   * Check if help was requested or no arguments provided
   * @returns {boolean} True if help should be shown
   */
  shouldShowHelp() {
    return this.flags.help || this.args.length === 0;
  }

  /**
   * Validate that at least one action is specified
   * @throws {ValidationError} If no valid action is specified
   */
  validateAction() {
    const actions = [
      'help', 'list', 'appId', 'verdict', 'dateRange', 
      'stats', 'needsVerification', 'update'
    ];
    
    const hasAction = actions.some(action => {
      const value = this.flags[action];
      return value === true || (value !== null && value !== undefined);
    });

    if (!hasAction) {
      throw new ValidationError('No valid action specified. Use --help for usage information.', 'action');
    }
  }

  /**
   * Get help text
   * @returns {string} Help documentation
   */
  static getHelpText() {
    return `
WalletScrutiny Nostr Verification CLI Tool

USAGE:
  node wsVerify.mjs [OPTIONS]

OPTIONS:
  --help, -h                    Show this help message
  --list, --browse              List all verifications
  --app-id <id>                 Search by app ID
  --verdict <status>            Filter by verdict/status
  --date-range <start> <end>    Search by date range (YYYY-MM-DD)
  --stats                       Show verification statistics
  --needs-verification          Show apps that need verification
  --update, --backup            Update verifications from Nostr nodes
  --json                        Output in JSON format
  --limit <N>                   Limit number of results (1-10000)
  --sort-by <method>            Sort method: priority|platform|date (for --needs-verification)

EXAMPLES:
  node wsVerify.mjs --list --limit 10
  node wsVerify.mjs --app-id com.example.wallet --json
  node wsVerify.mjs --verdict reproducible
  node wsVerify.mjs --date-range 2024-01-01 2024-12-31
  node wsVerify.mjs --stats --json
  node wsVerify.mjs --needs-verification --sort-by platform
  node wsVerify.mjs --update

SECURITY NOTES:
  - All inputs are validated and sanitized
  - File paths are checked for traversal attempts
  - Output is limited to prevent DoS attacks
  - Child processes run with restricted permissions
`;
  }
}

/**
 * Main VerificationCLI class with security controls
 */
class VerificationCLI {
  /**
   * Create CLI instance
   */
  constructor() {
    this.dataLoader = new DataLoader();
    this.analyzer = new AppAnalyzer();
    this.verifications = [];
  }

  /**
   * Load verification events from JSON files
   * @throws {DataLoadError} If loading fails
   */
  async loadVerifications() {
    this.verifications = await this.dataLoader.loadVerifications();
  }

  /**
   * List all verifications with optional limit
   * @param {number|null} limit - Optional limit on results
   * @param {boolean} json - Whether to output JSON
   */
  async listVerifications(limit = null, json = false) {
    const output = OutputFormatter.formatVerificationList(
      this.verifications, 
      json, 
      limit
    );
    console.log(output);
  }

  /**
   * Search verifications by app ID
   * @param {string} appId - App ID to search for
   * @param {boolean} json - Whether to output JSON
   */
  async searchByAppId(appId, json = false) {
    const results = this.verifications.filter(v => 
      v.appId.toLowerCase().includes(appId.toLowerCase())
    );

    const output = OutputFormatter.formatSearchResults(
      results, 
      appId, 
      'app-id', 
      json
    );
    console.log(output);
  }

  /**
   * Filter verifications by verdict
   * @param {string} verdict - Verdict to filter by
   * @param {boolean} json - Whether to output JSON
   */
  async filterByVerdict(verdict, json = false) {
    const results = this.verifications.filter(v => v.status === verdict);

    const output = OutputFormatter.formatSearchResults(
      results, 
      verdict, 
      'verdict', 
      json
    );
    console.log(output);
  }

  /**
   * Search verifications by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {boolean} json - Whether to output JSON
   */
  async searchByDateRange(startDate, endDate, json = false) {
    const results = this.verifications.filter(v => 
      v.date >= startDate && v.date <= endDate
    );

    const dateRangeDesc = OutputFormatter.formatDateRangeDescription(startDate, endDate);
    const output = OutputFormatter.formatSearchResults(
      results, 
      dateRangeDesc, 
      'date range', 
      json
    );
    console.log(output);
  }

  /**
   * Show verification statistics
   * @param {boolean} json - Whether to output JSON
   */
  async showStatistics(json = false) {
    // Calculate statistics by status
    const statusCounts = {};
    this.verifications.forEach(v => {
      statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
    });

    // Calculate statistics by platform
    const platformCounts = {};
    this.verifications.forEach(v => {
      platformCounts[v.platform] = (platformCounts[v.platform] || 0) + 1;
    });

    // Show recent activity
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentCount = this.verifications.filter(v => 
      new Date(v.created_at * 1000) > lastWeek
    ).length;

    const stats = {
      total: this.verifications.length,
      byStatus: statusCounts,
      byPlatform: platformCounts,
      recentActivity: {
        lastWeekCount: recentCount
      }
    };

    const output = OutputFormatter.formatStatistics(stats, json);
    console.log(output);
  }

  /**
   * Show apps that need verification
   * @param {string} sortBy - Sort method (priority, platform, date)
   * @param {boolean} json - Whether to output JSON
   */
  async showNeedsVerification(sortBy = 'priority', json = false) {
    // Load markdown apps and analyze verification status
    const markdownApps = await this.dataLoader.loadMarkdownApps();
    let needsVerification = this.analyzer.analyzeAppsNeedingVerification(
      markdownApps, 
      this.verifications
    );

    if (needsVerification.length === 0) {
      const output = OutputFormatter.formatNeedsVerification(
        [], 
        { android: 0, bearer: 0, desktop: 0, hardware: 0 }, 
        sortBy, 
        json
      );
      console.log(output);
      return;
    }

    // Apply sorting
    switch (sortBy) {
      case 'platform':
        needsVerification = this.analyzer.sortAppsByPlatform(needsVerification);
        break;
      case 'date':
        needsVerification = this.analyzer.sortAppsByDate(needsVerification);
        break;
      default:
        needsVerification = this.analyzer.sortAppsByPriority(needsVerification);
    }

    // Calculate platform stats
    const platformStats = this.analyzer.calculatePlatformStats(needsVerification);

    const output = OutputFormatter.formatNeedsVerification(
      needsVerification, 
      platformStats, 
      sortBy, 
      json
    );
    console.log(output);
  }

  /**
   * Update verifications by running backup script securely
   * @throws {ProcessError} If backup fails
   */
  async updateVerifications() {
    try {
      // Check if backup script is available
      if (!ProcessExecutor.isBackupScriptAvailable()) {
        throw new ProcessError(
          'Backup script not found: scripts/nostr/backupNostrVerificationEvents.mjs',
          'node',
          null
        );
      }

      console.log(OutputFormatter.formatSuccess('Starting backup process...'));
      
      // Execute backup script securely
      await ProcessExecutor.executeBackupScript();
      
      console.log(OutputFormatter.formatSuccess('Backup completed successfully!'));
      console.log(OutputFormatter.formatSuccess('Reloading verification data...'));
      
      // Reload the verifications
      this.verifications = [];
      await this.loadVerifications();
      
      console.log(OutputFormatter.formatSuccess('Data reloaded successfully!'));
      
    } catch (error) {
      if (error instanceof ProcessError) {
        throw error;
      }
      throw new ProcessError(`Backup operation failed: ${error.message}`, 'node', null);
    }
  }
}

/**
 * Main execution function with comprehensive error handling
 */
async function main() {
  const cli = new VerificationCLI();
  
  try {
    // Parse and validate CLI arguments
    const parser = new CLIParser(process.argv.slice(2));
    
    // Show help if requested or no arguments provided
    if (parser.shouldShowHelp()) {
      console.log(CLIParser.getHelpText());
      return;
    }

    // Validate that an action is specified
    parser.validateAction();
    
    // Get validated flags
    const flags = parser.getFlags();

    // Handle update first (doesn't need data loading)
    if (flags.update) {
      await cli.updateVerifications();
      return;
    }

    // Load verification data for other operations
    console.log('Loading verification data...');
    await cli.loadVerifications();
    console.log(`Loaded ${cli.verifications.length} verifications.\n`);

    // Execute the requested operation
    if (flags.list) {
      await cli.listVerifications(flags.limit, flags.json);
    } else if (flags.appId) {
      await cli.searchByAppId(flags.appId, flags.json);
    } else if (flags.verdict) {
      await cli.filterByVerdict(flags.verdict, flags.json);
    } else if (flags.dateRange) {
      await cli.searchByDateRange(flags.dateRange[0], flags.dateRange[1], flags.json);
    } else if (flags.stats) {
      await cli.showStatistics(flags.json);
    } else if (flags.needsVerification) {
      await cli.showNeedsVerification(flags.sortBy, flags.json);
    }

  } catch (error) {
    // Handle different error types appropriately
    if (error instanceof ValidationError) {
      console.error(OutputFormatter.formatError(error));
      console.error('\nUse --help for usage information.');
      process.exit(1);
    } else if (error instanceof DataLoadError || error instanceof FileSystemError) {
      console.error(OutputFormatter.formatError(error));
      console.error('\nCheck file permissions and paths.');
      process.exit(2);
    } else if (error instanceof ProcessError) {
      console.error(OutputFormatter.formatError(error));
      console.error('\nCheck backup script and permissions.');
      process.exit(3);
    } else if (error instanceof VerificationError) {
      console.error(OutputFormatter.formatError(error));
      process.exit(4);
    } else {
      // Unexpected error
      console.error('Unexpected error occurred:');
      console.error(OutputFormatter.formatError(error, true));
      process.exit(5);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nOperation cancelled by user.');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\nOperation terminated.');
  process.exit(143);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(6);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(7);
});

// Start the application
main();