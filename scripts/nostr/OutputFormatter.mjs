/**
 * Output formatting and error handling module for WalletScrutiny Nostr Verification Tool
 * Handles safe formatting of output in both text and JSON formats, plus custom error types
 */

/**
 * Base error class for all verification tool errors
 */
export class VerificationError extends Error {
  constructor(message, code = 'VERIFICATION_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when data loading operations fail
 */
export class DataLoadError extends VerificationError {
  constructor(message, filePath = null) {
    super(message, 'DATA_LOAD_ERROR');
    this.filePath = filePath;
  }
}

/**
 * Error thrown when CLI arguments are invalid
 */
export class ValidationError extends VerificationError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

/**
 * Error thrown when file system operations fail
 */
export class FileSystemError extends VerificationError {
  constructor(message, path = null) {
    super(message, 'FILESYSTEM_ERROR');
    this.path = path;
  }
}

/**
 * Error thrown when child process operations fail
 */
export class ProcessError extends VerificationError {
  constructor(message, command = null, exitCode = null) {
    super(message, 'PROCESS_ERROR');
    this.command = command;
    this.exitCode = exitCode;
  }
}

/**
 * Error thrown when parsing operations fail
 */
export class ParseError extends VerificationError {
  constructor(message, data = null) {
    super(message, 'PARSE_ERROR');
    this.data = data;
  }
}

/**
 * Error thrown when security validation fails
 */
export class SecurityError extends VerificationError {
  constructor(message, input = null) {
    super(message, 'SECURITY_ERROR');
    this.input = input;
  }
}

/**
 * Output formatter with security and limits
 */
export class OutputFormatter {
  // Output limits for security
  static MAX_OUTPUT_ITEMS = 10000;
  static MAX_TEXT_LENGTH = 100000;

  /**
   * Sanitize string for shell output
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeForShell(str) {
    if (typeof str !== 'string') {
      return String(str);
    }
    // Escape shell special characters
    return str.replace(/[;&|`$(){}[\]\\]/g, '\\$&');
  }

  /**
   * Sanitize object for JSON output
   * @param {any} obj - Object to sanitize
   * @returns {any} Sanitized object
   */
  static sanitizeForJson(obj) {
    const MAX_INPUT_LENGTH = 1000;
    
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      // Remove potential XSS patterns and limit length
      return obj.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .substring(0, MAX_INPUT_LENGTH);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeForJson(item));
    }

    if (typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize keys and values
        const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
        sanitized[safeKey] = this.sanitizeForJson(value);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Format verification list output
   * @param {Array} verifications - Verification objects to format
   * @param {boolean} json - Whether to output JSON
   * @param {number|null} limit - Optional limit on results
   * @returns {string} Formatted output
   */
  static formatVerificationList(verifications, json = false, limit = null) {
    // Apply limit for security
    let results = [...verifications];
    const actualLimit = limit || this.MAX_OUTPUT_ITEMS;
    if (results.length > actualLimit) {
      results = results.slice(0, actualLimit);
    }

    if (json) {
      const sanitized = this.sanitizeForJson(results);
      return JSON.stringify(sanitized, null, 2);
    }

    if (results.length === 0) {
      return 'No verifications found.';
    }

    let output = '';
    results.forEach((v, i) => {
      const safeAppId = this.sanitizeForShell(v.appId || 'Unknown');
      const safeStatus = this.sanitizeForShell(v.status || 'Unknown');
      const safeVersion = this.sanitizeForShell(v.version || 'Unknown');
      const safePlatform = this.sanitizeForShell(v.platform || 'Unknown');
      const safeDate = this.sanitizeForShell(v.date || 'Unknown');
      const safePubkey = this.sanitizeForShell(v.pubkey || 'Unknown');
      const safeFile = this.sanitizeForShell(v.file || 'Unknown');

      output += `${i + 1}. ${safeAppId}\n`;
      output += `   Date: ${safeDate} | Status: ${safeStatus} | Version: ${safeVersion} | Platform: ${safePlatform}\n`;
      output += `   Author: ${safePubkey} | File: ${safeFile}\n\n`;
    });

    output += `Total: ${results.length} verifications`;
    if (limit && verifications.length > limit) {
      output += ` (showing first ${limit} of ${verifications.length})`;
    }

    return this._limitTextLength(output);
  }

  /**
   * Format search results output
   * @param {Array} results - Search results
   * @param {string} searchTerm - What was searched for
   * @param {string} searchType - Type of search (app-id, verdict, date-range)
   * @param {boolean} json - Whether to output JSON
   * @returns {string} Formatted output
   */
  static formatSearchResults(results, searchTerm, searchType, json = false) {
    if (json) {
      const sanitized = this.sanitizeForJson(results);
      return JSON.stringify(sanitized, null, 2);
    }

    if (results.length === 0) {
      const safeTerm = this.sanitizeForShell(searchTerm);
      return `No verifications found for ${searchType}: ${safeTerm}`;
    }

    const safeTerm = this.sanitizeForShell(searchTerm);
    let output = `Found ${results.length} verification(s) for ${searchType} "${safeTerm}":\n\n`;

    results.forEach((v, i) => {
      const safeAppId = this.sanitizeForShell(v.appId || 'Unknown');
      const safeStatus = this.sanitizeForShell(v.status || 'Unknown');
      const safeVersion = this.sanitizeForShell(v.version || 'Unknown');
      const safePlatform = this.sanitizeForShell(v.platform || 'Unknown');
      const safeDate = this.sanitizeForShell(v.date || 'Unknown');
      const safePubkey = this.sanitizeForShell(v.pubkey || 'Unknown');
      const safeFile = this.sanitizeForShell(v.file || 'Unknown');

      output += `${i + 1}. ${safeAppId}\n`;
      output += `   Date: ${safeDate} | Status: ${safeStatus} | Version: ${safeVersion} | Platform: ${safePlatform}\n`;
      output += `   Author: ${safePubkey} | File: ${safeFile}\n\n`;
    });

    return this._limitTextLength(output);
  }

  /**
   * Format statistics output
   * @param {Object} stats - Statistics object
   * @param {boolean} json - Whether to output JSON
   * @returns {string} Formatted output
   */
  static formatStatistics(stats, json = false) {
    if (json) {
      const sanitized = this.sanitizeForJson(stats);
      return JSON.stringify(sanitized, null, 2);
    }

    let output = 'Verification Statistics\n';
    output += '='.repeat(24) + '\n\n';
    
    output += `Total Verifications: ${stats.total}\n\n`;
    
    output += 'By Status:\n';
    Object.entries(stats.byStatus)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        const safeStatus = this.sanitizeForShell(status);
        output += `  ${safeStatus.padEnd(15)}: ${count.toString().padStart(3)} (${percentage}%)\n`;
      });
    
    output += '\nBy Platform:\n';
    Object.entries(stats.byPlatform)
      .sort(([,a], [,b]) => b - a)
      .forEach(([platform, count]) => {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        const safePlatform = this.sanitizeForShell(platform);
        output += `  ${safePlatform.padEnd(15)}: ${count.toString().padStart(3)} (${percentage}%)\n`;
      });
    
    output += '\nRecent Activity:\n';
    output += `  Last 7 days: ${stats.recentActivity.lastWeekCount} verifications\n`;

    return this._limitTextLength(output);
  }

  /**
   * Format apps needing verification output
   * @param {Array} apps - Apps needing verification
   * @param {Object} platformStats - Platform statistics
   * @param {string} sortMethod - Sort method used
   * @param {boolean} json - Whether to output JSON
   * @returns {string} Formatted output
   */
  static formatNeedsVerification(apps, platformStats, sortMethod, json = false) {
    if (json) {
      const sanitized = this.sanitizeForJson(apps);
      return JSON.stringify(sanitized, null, 2);
    }

    if (apps.length === 0) {
      return 'All apps are up to date with verifications!';
    }

    // Apply limit for security
    const limitedApps = apps.length > this.MAX_OUTPUT_ITEMS ? 
      apps.slice(0, this.MAX_OUTPUT_ITEMS) : apps;

    let output = `Apps Needing Verification (${apps.length} total)\n`;
    if (apps.length > this.MAX_OUTPUT_ITEMS) {
      output += `Showing first ${this.MAX_OUTPUT_ITEMS} results\n`;
    }
    output += '\n';
    
    // Show summary stats
    output += 'Summary:\n';
    output += `  Android: ${platformStats.android}, Bearer: ${platformStats.bearer}, `;
    output += `Desktop: ${platformStats.desktop}, Hardware: ${platformStats.hardware}\n`;
    output += `  Sorted by: ${this.sanitizeForShell(sortMethod)}\n\n`;
    
    limitedApps.forEach((app, i) => {
      const safeAppId = this.sanitizeForShell(app.appId || 'Unknown');
      const safePlatform = this.sanitizeForShell(app.platform || 'Unknown');
      const safeVersion = this.sanitizeForShell(app.version || 'Unknown');
      const safeVerifiedVersion = this.sanitizeForShell(app.latestVerifiedVersion || 'None');
      const safeStatus = this.sanitizeForShell(app.statusMessage || 'Unknown');

      output += `${i + 1}. ${safeAppId}\n`;
      output += `   Platform: ${safePlatform}\n`;
      output += `   Latest version available: ${safeVersion}\n`;
      output += `   Latest version verified: ${safeVerifiedVersion}\n`;
      output += `   Status: ${safeStatus}\n\n`;
    });

    return this._limitTextLength(output);
  }

  /**
   * Format error output
   * @param {Error} error - Error to format
   * @param {boolean} verbose - Whether to include stack trace
   * @returns {string} Formatted error
   */
  static formatError(error, verbose = false) {
    let output = `Error: ${this.sanitizeForShell(error.message)}`;
    
    if (error.code) {
      output += ` (${error.code})`;
    }
    
    if (error.field) {
      output += ` - Field: ${this.sanitizeForShell(error.field)}`;
    }
    
    if (verbose && error.stack) {
      output += `\n\nStack trace:\n${error.stack}`;
    }
    
    return this._limitTextLength(output);
  }

  /**
   * Format success message
   * @param {string} message - Success message
   * @returns {string} Formatted message
   */
  static formatSuccess(message) {
    return this.sanitizeForShell(message);
  }

  /**
   * Limit text output length for security
   * @private
   * @param {string} text - Text to limit
   * @returns {string} Limited text
   */
  static _limitTextLength(text) {
    if (text.length > this.MAX_TEXT_LENGTH) {
      return text.substring(0, this.MAX_TEXT_LENGTH) + 
        `\n\n[Output truncated - exceeded ${this.MAX_TEXT_LENGTH} character limit]`;
    }
    return text;
  }

  /**
   * Format date range search description
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {string} Formatted description
   */
  static formatDateRangeDescription(startDate, endDate) {
    const safeStart = this.sanitizeForShell(startDate);
    const safeEnd = this.sanitizeForShell(endDate);
    return `between ${safeStart} and ${safeEnd}`;
  }
}