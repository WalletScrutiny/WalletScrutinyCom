/**
 * Constants for WalletScrutiny Nostr Verification Search Tool
 * Contains all configuration values, paths, and styling constants
 */

// File paths and directories
export const BACKUP_DIR = './backup/nostr-verification-events/30301';
export const PLATFORM_FOLDERS = ['_android', '_bearer', '_desktop', '_hardware'];

// Display configuration
export const ITEMS_PER_PAGE = 10;

// ANSI color codes for terminal styling
export const COLORS = {
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

// App status types and their priorities
export const STATUS_TYPES = {
  NEEDS_VERIFICATION: 'needs_verification',
  UPDATE_NEEDED: 'update_needed',
  VERSION_MISMATCH: 'version_mismatch'
};

// Priority levels for sorting (lower number = higher priority)
export const PRIORITIES = {
  HIGH: 1,    // No verifications found
  MEDIUM: 2,  // Update needed (markdown newer than Nostr)
  LOW: 3      // Version mismatch (Nostr newer than markdown)
};

// Sort methods
export const SORT_METHODS = {
  PRIORITY: 'priority',
  PLATFORM: 'platform',
  DATE: 'date'
};

// Required markdown frontmatter fields for inclusion
export const REQUIRED_VERDICT = 'sourceavailable';
export const REQUIRED_META_VALUES = ['ok', 'stale'];

// UI text constants
export const UI_TEXT = {
  TOOL_TITLE: '🔍 Verification Search Tool',
  TOOL_SUBTITLE: 'WalletScrutiny.com Backups',
  LOADING_VERIFICATIONS: '📂 Loading verification events...',
  LOADING_MARKDOWN: '📂 Loading markdown files...',
  ANALYZING_STATUS: '🔍 Analyzing verification status...',
  ALL_UP_TO_DATE: '✅ All apps are up to date with verifications!',
  BACKUP_SUCCESS: '✅ Backup completed successfully!',
  DATA_RELOADED: '✅ Data reloaded successfully!',
  BACKUP_STARTING: '🚀 Starting backup process...',
  DATA_RELOADING: '🔄 Reloading verification data...',
  GOODBYE: '👋 Thank you for using Verification Search Tool!'
};

// Menu option constants
export const MENU_OPTIONS = {
  BROWSE_ALL: '📋 Browse All Verifications',
  SEARCH_BY_ID: '🔍 Search by App ID',
  FILTER_BY_VERDICT: '⚡ Filter by Verdict',
  SEARCH_BY_DATE: '📅 Search by Date Range',
  SHOW_STATISTICS: '🏆 Show Statistics',
  NEEDS_VERIFICATION: '🚨 Needs Verification',
  UPDATE_VERIFICATIONS: '🔄 Update Verifications by Backing Up Nostr Verifications from Nodes',
  EXIT: '❌ Exit'
};

// Navigation options
export const NAV_OPTIONS = {
  PREVIOUS_PAGE: '◀ Previous Page',
  NEXT_PAGE: '▶ Next Page',
  BACK_TO_MAIN: '🔙 Back to Main Menu',
  SORT_BY_PLATFORM: '1️⃣ Sort by Platform',
  SORT_BY_DATE: '2️⃣ Sort by Date of Last Verification'
};