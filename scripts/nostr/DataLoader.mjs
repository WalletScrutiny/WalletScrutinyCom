/**
 * DataLoader - Handles all file operations for loading verification events and markdown files
 * Responsible for reading JSON verification files and parsing markdown frontmatter
 * Includes security checks for file system operations
 */

import fs from 'fs';
import path from 'path';
import { 
  BACKUP_DIR, 
  PLATFORM_FOLDERS, 
  REQUIRED_VERDICT, 
  REQUIRED_META_VALUES
} from './Constants.mjs';
import { DataLoadError, FileSystemError, ParseError, ValidationError, SecurityError } from './OutputFormatter.mjs';

/**
 * Input validator with security checks
 */
export class Validator {
  // Security constants
  static MAX_INPUT_LENGTH = 1000;
  static MAX_LIMIT = 10000;
  static ALLOWED_SORT_METHODS = ['priority', 'platform', 'date'];
  static ALLOWED_FILE_EXTENSIONS = ['.json', '.md'];
  static DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  static SAFE_PATH_REGEX = /^[a-zA-Z0-9._\-\/]+$/;

  /**
   * Validate and sanitize app ID input
   * @param {string} appId - App ID to validate
   * @returns {string} Sanitized app ID
   * @throws {ValidationError} If app ID is invalid
   * @throws {SecurityError} If app ID contains suspicious patterns
   */
  static validateAppId(appId) {
    if (!appId || typeof appId !== 'string') {
      throw new ValidationError('App ID must be a non-empty string', 'appId');
    }

    if (appId.length > this.MAX_INPUT_LENGTH) {
      throw new ValidationError(`App ID too long (max ${this.MAX_INPUT_LENGTH} characters)`, 'appId');
    }

    // Check for path traversal attempts
    if (appId.includes('..') || appId.includes('/') || appId.includes('\\')) {
      throw new SecurityError('App ID contains invalid path characters', appId);
    }

    // Check for shell injection patterns
    if (appId.includes(';') || appId.includes('|') || appId.includes('&') || 
        appId.includes('`') || appId.includes('$')) {
      throw new SecurityError('App ID contains shell injection patterns', appId);
    }

    return appId.trim();
  }

  /**
   * Validate verdict/status input
   * @param {string} verdict - Verdict to validate
   * @returns {string} Sanitized verdict
   * @throws {ValidationError} If verdict is invalid
   */
  static validateVerdict(verdict) {
    if (!verdict || typeof verdict !== 'string') {
      throw new ValidationError('Verdict must be a non-empty string', 'verdict');
    }

    if (verdict.length > 50) {
      throw new ValidationError('Verdict too long (max 50 characters)', 'verdict');
    }

    // Allow only alphanumeric characters and common status terms
    if (!/^[a-zA-Z0-9_-]+$/.test(verdict)) {
      throw new ValidationError('Verdict contains invalid characters', 'verdict');
    }

    return verdict.trim().toLowerCase();
  }

  /**
   * Validate date string
   * @param {string} dateStr - Date string to validate
   * @returns {string} Validated date string
   * @throws {ValidationError} If date is invalid
   */
  static validateDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') {
      throw new ValidationError('Date must be a non-empty string', 'date');
    }

    if (!this.DATE_REGEX.test(dateStr)) {
      throw new ValidationError('Date must be in YYYY-MM-DD format', 'date');
    }

    // Check if date is valid
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid date', 'date');
    }

    // Check reasonable date range (not too far in past/future)
    const year = date.getFullYear();
    if (year < 2020 || year > 2030) {
      throw new ValidationError('Date must be between 2020 and 2030', 'date');
    }

    return dateStr;
  }

  /**
   * Validate date range
   * @param {string} startDate - Start date string
   * @param {string} endDate - End date string
   * @returns {[string, string]} Validated date range
   * @throws {ValidationError} If date range is invalid
   */
  static validateDateRange(startDate, endDate) {
    const validStart = this.validateDate(startDate);
    const validEnd = this.validateDate(endDate);

    if (new Date(validStart) > new Date(validEnd)) {
      throw new ValidationError('Start date must be before end date', 'dateRange');
    }

    return [validStart, validEnd];
  }

  /**
   * Validate limit parameter
   * @param {number|string} limit - Limit to validate
   * @returns {number} Validated limit
   * @throws {ValidationError} If limit is invalid
   */
  static validateLimit(limit) {
    const numLimit = parseInt(limit);
    
    if (isNaN(numLimit)) {
      throw new ValidationError('Limit must be a valid number', 'limit');
    }

    if (numLimit < 1) {
      throw new ValidationError('Limit must be positive', 'limit');
    }

    if (numLimit > this.MAX_LIMIT) {
      throw new ValidationError(`Limit too large (max ${this.MAX_LIMIT})`, 'limit');
    }

    return numLimit;
  }

  /**
   * Validate sort method
   * @param {string} sortBy - Sort method to validate
   * @returns {string} Validated sort method
   * @throws {ValidationError} If sort method is invalid
   */
  static validateSortMethod(sortBy) {
    if (!sortBy || typeof sortBy !== 'string') {
      throw new ValidationError('Sort method must be a non-empty string', 'sortBy');
    }

    const normalizedSort = sortBy.toLowerCase().trim();
    
    if (!this.ALLOWED_SORT_METHODS.includes(normalizedSort)) {
      throw new ValidationError(
        `Invalid sort method '${sortBy}'. Allowed values: ${this.ALLOWED_SORT_METHODS.join(', ')}`, 
        'sortBy'
      );
    }

    return normalizedSort;
  }

  /**
   * Validate file path for security
   * @param {string} filePath - File path to validate
   * @returns {string} Validated file path
   * @throws {SecurityError} If path is unsafe
   */
  static validateFilePath(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new ValidationError('File path must be a non-empty string', 'filePath');
    }

    // Resolve path to check for traversal attempts
    const resolvedPath = path.resolve(filePath);
    const normalizedPath = path.normalize(filePath);

    // Check for path traversal
    if (normalizedPath.includes('..')) {
      throw new SecurityError('Path traversal detected', filePath);
    }

    // Check for suspicious patterns
    if (!this.SAFE_PATH_REGEX.test(filePath)) {
      throw new SecurityError('File path contains unsafe characters', filePath);
    }

    return resolvedPath;
  }

  /**
   * Validate file extension
   * @param {string} filePath - File path to check
   * @returns {string} File extension
   * @throws {SecurityError} If extension is not allowed
   */
  static validateFileExtension(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (!this.ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      throw new SecurityError(
        `File extension not allowed. Allowed: ${this.ALLOWED_FILE_EXTENSIONS.join(', ')}`, 
        filePath
      );
    }

    return ext;
  }

  /**
   * Validate CLI arguments object
   * @param {Object} args - Parsed CLI arguments
   * @returns {Object} Validated arguments
   * @throws {ValidationError} If arguments are invalid
   */
  static validateCliArgs(args) {
    const validated = {};

    // Validate each argument if present and not null
    if (args.appId !== undefined && args.appId !== null) {
      validated.appId = this.validateAppId(args.appId);
    }

    if (args.verdict !== undefined && args.verdict !== null) {
      validated.verdict = this.validateVerdict(args.verdict);
    }

    if (args.dateRange !== undefined && args.dateRange !== null) {
      if (!Array.isArray(args.dateRange) || args.dateRange.length !== 2) {
        throw new ValidationError('Date range must be an array with 2 elements', 'dateRange');
      }
      validated.dateRange = this.validateDateRange(args.dateRange[0], args.dateRange[1]);
    }

    if (args.limit !== undefined && args.limit !== null) {
      validated.limit = this.validateLimit(args.limit);
    }

    if (args.sortBy !== undefined && args.sortBy !== null) {
      validated.sortBy = this.validateSortMethod(args.sortBy);
    }

    // Copy boolean flags as-is
    validated.help = Boolean(args.help);
    validated.list = Boolean(args.list);
    validated.stats = Boolean(args.stats);
    validated.needsVerification = Boolean(args.needsVerification);
    validated.update = Boolean(args.update);
    validated.json = Boolean(args.json);

    return validated;
  }
}

export class DataLoader {
  // Security limits
  static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static MAX_FILES = 50000;

  /**
   * Load and parse all Nostr verification events from JSON files
   * @returns {Array} Array of verification objects with extracted metadata
   * @throws {FileSystemError} If directory access fails
   * @throws {DataLoadError} If loading fails
   */
  async loadVerifications() {
    try {
      // Validate and secure the backup directory path
      const safeDirPath = this._validateDirectoryPath(BACKUP_DIR);
      
      // Check if backup directory exists
      if (!fs.existsSync(safeDirPath)) {
        throw new FileSystemError(`Backup directory not found: ${BACKUP_DIR}`, safeDirPath);
      }

      // Read directory with security checks
      const files = this._readDirectorySecurely(safeDirPath, '.json');
      
      if (files.length > this.constructor.MAX_FILES) {
        throw new DataLoadError(`Too many files in directory (max ${this.constructor.MAX_FILES})`);
      }

      const verifications = [];

      for (const file of files) {
        try {
          const filePath = path.join(safeDirPath, file);
          const verification = await this._loadVerificationFile(filePath, file);
          if (verification) {
            verifications.push(verification);
          }
        } catch (error) {
          // Log error but continue processing other files
          console.warn(`Warning: Failed to load ${file}: ${error.message}`);
          continue;
        }
      }

      // Sort by date (newest first) and return
      return verifications.sort((a, b) => b.created_at - a.created_at);
      
    } catch (error) {
      if (error instanceof FileSystemError || error instanceof DataLoadError) {
        throw error;
      }
      throw new DataLoadError(`Failed to load verifications: ${error.message}`);
    }
  }

  /**
   * Load and parse markdown files from platform directories
   * Only includes apps with verdict: sourceavailable and meta: ok|stale
   * @returns {Array} Array of app objects with metadata from frontmatter
   * @throws {FileSystemError} If directory access fails
   * @throws {DataLoadError} If loading fails
   */
  async loadMarkdownApps() {
    try {
      const apps = [];
      
      for (const platform of PLATFORM_FOLDERS) {
        try {
          const platformPath = this._validateDirectoryPath(path.join('.', platform));
          
          // Skip if platform directory doesn't exist
          if (!fs.existsSync(platformPath)) {
            continue;
          }
          
          // Read directory with security checks
          const files = this._readDirectorySecurely(platformPath, '.md');
          
          for (const file of files) {
            try {
              const filePath = path.join(platformPath, file);
              const app = await this._loadMarkdownFile(filePath, platform);
              if (app) {
                apps.push(app);
              }
            } catch (error) {
              // Log warning but continue processing
              console.warn(`Warning: Failed to load ${file}: ${error.message}`);
              continue;
            }
          }
        } catch (error) {
          // Log warning for platform directory issues but continue
          console.warn(`Warning: Failed to process platform ${platform}: ${error.message}`);
          continue;
        }
      }
      
      return apps;
      
    } catch (error) {
      throw new DataLoadError(`Failed to load markdown apps: ${error.message}`);
    }
  }

  /**
   * Extract and parse verification data from a Nostr event JSON object
   * @private
   * @param {Object} event - The Nostr event object
   * @param {string} file - The source filename
   * @returns {Object} Parsed verification object
   */
  _parseVerificationEvent(event, file) {
    return {
      id: event.id,
      created_at: event.created_at,
      date: new Date(event.created_at * 1000).toISOString().split('T')[0],
      appId: this._getTagValue(event, 'i') || 'Unknown',
      version: this._getTagValue(event, 'version') || 'Unknown',
      platform: this._getTagValue(event, 'platform') || 'Unknown',
      status: this._getTagValue(event, 'status') || 'Unknown',
      content: event.content,
      pubkey: event.pubkey.substring(0, 8) + '...',
      file: file
    };
  }

  /**
   * Parse markdown file frontmatter and extract app metadata
   * Only returns app data if it meets the filtering criteria
   * @private
   * @param {string} content - Raw markdown file content
   * @param {string} filePath - Path to the markdown file
   * @param {string} platform - Platform folder name
   * @returns {Object|null} App object or null if doesn't meet criteria
   */
  _parseMarkdownFile(content, filePath, platform) {
    // Extract frontmatter using regex
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }
    
    const frontmatter = frontmatterMatch[1];
    
    // Extract required fields
    const appIdMatch = frontmatter.match(/^appId:\s*(.+)$/m);
    const versionMatch = frontmatter.match(/^version:\s*(.+)$/m);
    const verdictMatch = frontmatter.match(/^verdict:\s*(.+)$/m);
    const metaMatch = frontmatter.match(/^meta:\s*(.+)$/m);
    
    // Ensure all required fields are present
    if (!appIdMatch || !versionMatch || !verdictMatch || !metaMatch) {
      return null;
    }
    
    const appId = appIdMatch[1].trim();
    const version = versionMatch[1].trim();
    const verdict = verdictMatch[1].trim();
    const meta = metaMatch[1].trim();
    
    // Apply filtering criteria: verdict must be 'sourceavailable' and meta must be 'ok' or 'stale'
    if (verdict !== REQUIRED_VERDICT || !REQUIRED_META_VALUES.includes(meta)) {
      return null;
    }
    
    // Return parsed app object
    return {
      appId,
      version,
      platform: platform.replace('_', ''), // Remove underscore prefix
      file: filePath,
      verdict,
      meta
    };
  }

  /**
   * Extract a tag value from a Nostr event
   * @private
   * @param {Object} event - The Nostr event object
   * @param {string} tagName - The tag name to extract
   * @returns {string|null} The tag value or null if not found
   */
  _getTagValue(event, tagName) {
    const tag = event.tags?.find(tag => tag[0] === tagName);
    return tag ? tag[1] : null;
  }

  /**
   * Validate directory path for security
   * @private
   * @param {string} dirPath - Directory path to validate
   * @returns {string} Validated path
   * @throws {FileSystemError} If path is unsafe
   */
  _validateDirectoryPath(dirPath) {
    try {
      return Validator.validateFilePath(dirPath);
    } catch (error) {
      throw new FileSystemError(`Invalid directory path: ${error.message}`, dirPath);
    }
  }

  /**
   * Securely read directory contents with file extension filtering
   * @private
   * @param {string} dirPath - Directory to read
   * @param {string} extension - File extension to filter by
   * @returns {Array} Array of filenames
   * @throws {FileSystemError} If directory read fails
   */
  _readDirectorySecurely(dirPath, extension) {
    try {
      const files = fs.readdirSync(dirPath);
      
      return files.filter(file => {
        // Check file extension
        if (!file.endsWith(extension)) {
          return false;
        }
        
        // Validate filename for security
        try {
          Validator.validateFileExtension(file);
          return true;
        } catch (error) {
          console.warn(`Skipping file with invalid extension: ${file}`);
          return false;
        }
      });
      
    } catch (error) {
      throw new FileSystemError(`Failed to read directory: ${error.message}`, dirPath);
    }
  }

  /**
   * Securely load and parse a verification file
   * @private
   * @param {string} filePath - Path to verification file
   * @param {string} fileName - Original filename
   * @returns {Object|null} Parsed verification or null if invalid
   * @throws {DataLoadError} If file loading fails
   */
  async _loadVerificationFile(filePath, fileName) {
    try {
      // Check file size for security
      const stats = fs.statSync(filePath);
      if (stats.size > this.constructor.MAX_FILE_SIZE) {
        throw new DataLoadError(`File too large: ${fileName} (${stats.size} bytes)`);
      }

      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse JSON with error handling
      let event;
      try {
        event = JSON.parse(content);
      } catch (parseError) {
        throw new ParseError(`Invalid JSON in ${fileName}: ${parseError.message}`);
      }

      // Validate event structure
      if (!event || typeof event !== 'object') {
        throw new ParseError(`Invalid event structure in ${fileName}`);
      }

      // Extract and return verification data
      return this._parseVerificationEvent(event, fileName);
      
    } catch (error) {
      if (error instanceof DataLoadError || error instanceof ParseError) {
        throw error;
      }
      throw new DataLoadError(`Failed to load verification file ${fileName}: ${error.message}`);
    }
  }

  /**
   * Securely load and parse a markdown file
   * @private
   * @param {string} filePath - Path to markdown file
   * @param {string} platform - Platform name
   * @returns {Object|null} Parsed app data or null if invalid
   * @throws {DataLoadError} If file loading fails
   */
  async _loadMarkdownFile(filePath, platform) {
    try {
      // Check file size for security
      const stats = fs.statSync(filePath);
      if (stats.size > this.constructor.MAX_FILE_SIZE) {
        throw new DataLoadError(`Markdown file too large: ${filePath} (${stats.size} bytes)`);
      }

      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter and extract app data
      return this._parseMarkdownFile(content, filePath, platform);
      
    } catch (error) {
      if (error instanceof DataLoadError || error instanceof ParseError) {
        throw error;
      }
      throw new DataLoadError(`Failed to load markdown file ${filePath}: ${error.message}`);
    }
  }
}