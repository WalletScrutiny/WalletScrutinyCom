/**
 * Constants for WalletScrutiny Nostr Verification Search Tool
 * Contains all configuration values, paths, and styling constants
 */

// File paths and directories
export const BACKUP_DIR = './backup/nostr-verification-events/30301';
export const PLATFORM_FOLDERS = ['_android', '_bearer', '_desktop', '_hardware'];


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