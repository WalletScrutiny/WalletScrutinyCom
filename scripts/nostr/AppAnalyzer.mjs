/**
 * AppAnalyzer - Business logic for analyzing verification status and comparing versions
 * Handles version comparison logic and determines which apps need verification
 */

import { 
  STATUS_TYPES, 
  PRIORITIES, 
  SORT_METHODS,
  COLORS,
  UI_TEXT 
} from './Constants.mjs';

export class AppAnalyzer {
  /**
   * Analyze apps to determine which ones need verification
   * @param {Array} markdownApps - Apps loaded from markdown files
   * @param {Array} verifications - Verification events from Nostr
   * @returns {Array} Array of apps that need verification with analysis results
   */
  analyzeAppsNeedingVerification(markdownApps, verifications) {
    console.log(`${COLORS.cyan}${UI_TEXT.ANALYZING_STATUS}${COLORS.reset}\n`);
    
    const needsVerification = [];
    
    for (const app of markdownApps) {
      // Find all verifications for this specific app
      const appVerifications = verifications.filter(v => v.appId === app.appId);
      
      if (appVerifications.length === 0) {
        // No verifications found - highest priority
        needsVerification.push({
          ...app,
          latestVerifiedVersion: 'None',
          statusType: STATUS_TYPES.NEEDS_VERIFICATION,
          statusMessage: 'No verifications found',
          priority: PRIORITIES.HIGH,
          lastVerificationDate: null
        });
      } else {
        // Find the most recent verification by date
        const latestVerification = appVerifications
          .sort((a, b) => b.created_at - a.created_at)[0];
        
        // Compare versions to determine status
        const versionComparison = this.compareVersions(app.version, latestVerification.version);
        
        if (versionComparison !== 0) {
          if (versionComparison > 0) {
            // Markdown version is newer - needs verification (medium priority)
            needsVerification.push({
              ...app,
              latestVerifiedVersion: latestVerification.version,
              statusType: STATUS_TYPES.UPDATE_NEEDED,
              statusMessage: 'Update needed',
              priority: PRIORITIES.MEDIUM,
              lastVerificationDate: latestVerification.created_at
            });
          } else {
            // Nostr version is newer - version mismatch (low priority)
            needsVerification.push({
              ...app,
              latestVerifiedVersion: latestVerification.version,
              statusType: STATUS_TYPES.VERSION_MISMATCH,
              statusMessage: 'Version mismatch',
              priority: PRIORITIES.LOW,
              lastVerificationDate: latestVerification.created_at
            });
          }
        }
        // If versions match exactly, app doesn't need verification (not included)
      }
    }
    
    // Sort by priority, then platform, then app ID for consistent ordering
    return this.sortAppsByPriority(needsVerification);
  }

  /**
   * Compare two version strings
   * @param {string} version1 - First version to compare
   * @param {string} version2 - Second version to compare
   * @returns {number} 1 if version1 > version2, -1 if version1 < version2, 0 if equal
   */
  compareVersions(version1, version2) {
    // Remove quotes and normalize version strings
    const cleanVersion1 = version1.replace(/['"]/g, '');
    const cleanVersion2 = version2.replace(/['"]/g, '');
    
    // Split versions into parts and convert numbers when possible
    const v1Parts = cleanVersion1.split('.').map(part => {
      const num = parseInt(part);
      return isNaN(num) ? part : num;
    });
    
    const v2Parts = cleanVersion2.split('.').map(part => {
      const num = parseInt(part);
      return isNaN(num) ? part : num;
    });
    
    // Compare each part, padding with zeros as needed
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    
    for (let i = 0; i < maxLength; i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      // Compare numerically if both are numbers
      if (typeof v1Part === 'number' && typeof v2Part === 'number') {
        if (v1Part > v2Part) return 1;
        if (v1Part < v2Part) return -1;
      } else {
        // Fall back to string comparison
        const str1 = v1Part.toString();
        const str2 = v2Part.toString();
        if (str1 > str2) return 1;
        if (str1 < str2) return -1;
      }
    }
    
    return 0; // Versions are equal
  }

  /**
   * Sort apps by priority (default sort method)
   * @param {Array} apps - Apps to sort
   * @returns {Array} Sorted apps array
   */
  sortAppsByPriority(apps) {
    return apps.sort((a, b) => {
      // Primary sort: by priority (lower number = higher priority)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // Secondary sort: by platform
      if (a.platform !== b.platform) {
        return a.platform.localeCompare(b.platform);
      }
      // Tertiary sort: by app ID
      return a.appId.localeCompare(b.appId);
    });
  }

  /**
   * Sort apps by platform
   * @param {Array} apps - Apps to sort
   * @returns {Array} Sorted apps array
   */
  sortAppsByPlatform(apps) {
    return apps.sort((a, b) => {
      // Primary sort: by platform
      if (a.platform !== b.platform) {
        return a.platform.localeCompare(b.platform);
      }
      // Secondary sort: by priority within platform
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // Tertiary sort: by app ID
      return a.appId.localeCompare(b.appId);
    });
  }

  /**
   * Sort apps by date of last verification (oldest first)
   * @param {Array} apps - Apps to sort
   * @returns {Array} Sorted apps array
   */
  sortAppsByDate(apps) {
    return apps.sort((a, b) => {
      // Never verified apps come first (highest priority)
      if (a.lastVerificationDate === null && b.lastVerificationDate === null) {
        return a.appId.localeCompare(b.appId);
      }
      if (a.lastVerificationDate === null) return -1;
      if (b.lastVerificationDate === null) return 1;
      
      // Sort by verification date (oldest first)
      if (a.lastVerificationDate !== b.lastVerificationDate) {
        return a.lastVerificationDate - b.lastVerificationDate;
      }
      
      // Secondary sort: by app ID for consistency
      return a.appId.localeCompare(b.appId);
    });
  }

  /**
   * Calculate platform statistics from apps list
   * @param {Array} apps - Apps to analyze
   * @returns {Object} Statistics object with counts per platform
   */
  calculatePlatformStats(apps) {
    const stats = { android: 0, bearer: 0, desktop: 0, hardware: 0 };
    
    apps.forEach(app => {
      if (stats.hasOwnProperty(app.platform)) {
        stats[app.platform]++;
      }
    });
    
    return stats;
  }

  /**
   * Find the app that has been waiting longest for verification
   * @param {Array} apps - Apps to analyze
   * @returns {Object|null} The oldest unverified app or null if none found
   */
  findOldestUnverified(apps) {
    let oldest = null;
    let oldestDate = Infinity;
    
    // First, check for never-verified apps (highest priority)
    const neverVerified = apps.find(app => app.lastVerificationDate === null);
    if (neverVerified) {
      return neverVerified;
    }
    
    // If no never-verified apps, find the one with oldest verification date
    apps.forEach(app => {
      if (app.lastVerificationDate && app.lastVerificationDate < oldestDate) {
        oldestDate = app.lastVerificationDate;
        oldest = app;
      }
    });
    
    return oldest;
  }

  /**
   * Find the app that was most recently verified
   * @param {Array} apps - Apps to analyze
   * @returns {Object|null} The most recently verified app or null if none found
   */
  findMostRecentlyVerified(apps) {
    let mostRecent = null;
    let mostRecentDate = 0;
    
    apps.forEach(app => {
      if (app.lastVerificationDate && app.lastVerificationDate > mostRecentDate) {
        mostRecentDate = app.lastVerificationDate;
        mostRecent = app;
      }
    });
    
    return mostRecent;
  }

  /**
   * Get the display name for a sort method
   * @param {string} method - Sort method constant
   * @returns {string} Human-readable sort method name
   */
  getSortMethodName(method) {
    switch (method) {
      case SORT_METHODS.PLATFORM:
        return 'By Platform';
      case SORT_METHODS.DATE:
        return 'By Date of Last Verification';
      case SORT_METHODS.PRIORITY:
        return 'By Priority (Default)';
      default:
        return 'Unknown';
    }
  }
}