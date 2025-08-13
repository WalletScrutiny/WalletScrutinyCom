/**
 * DataLoader - Handles all file operations for loading verification events and markdown files
 * Responsible for reading JSON verification files and parsing markdown frontmatter
 */

import fs from 'fs';
import path from 'path';
import { 
  BACKUP_DIR, 
  PLATFORM_FOLDERS, 
  REQUIRED_VERDICT, 
  REQUIRED_META_VALUES,
  COLORS,
  UI_TEXT 
} from './Constants.mjs';

export class DataLoader {
  /**
   * Load and parse all Nostr verification events from JSON files
   * @returns {Array} Array of verification objects with extracted metadata
   */
  async loadVerifications() {
    console.log(`${COLORS.cyan}${UI_TEXT.LOADING_VERIFICATIONS}${COLORS.reset}`);
    
    // Check if backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log(`${COLORS.red}❌ Backup directory not found: ${BACKUP_DIR}${COLORS.reset}`);
      process.exit(1);
    }

    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
    console.log(`${COLORS.green}✅ Found ${files.length} verification files${COLORS.reset}\n`);

    const verifications = [];

    for (const file of files) {
      try {
        const filePath = path.join(BACKUP_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const event = JSON.parse(content);
        
        // Extract useful data from the Nostr event
        const verification = this._parseVerificationEvent(event, file);
        verifications.push(verification);
        
      } catch (error) {
        console.log(`${COLORS.yellow}⚠️  Error reading ${file}: ${error.message}${COLORS.reset}`);
      }
    }

    // Sort by date (newest first) and return
    return verifications.sort((a, b) => b.created_at - a.created_at);
  }

  /**
   * Load and parse markdown files from platform directories
   * Only includes apps with verdict: sourceavailable and meta: ok|stale
   * @returns {Array} Array of app objects with metadata from frontmatter
   */
  async loadMarkdownApps() {
    console.log(`${COLORS.cyan}${UI_TEXT.LOADING_MARKDOWN}${COLORS.reset}`);
    
    const apps = [];
    
    for (const platform of PLATFORM_FOLDERS) {
      const platformPath = path.join('.', platform);
      
      // Skip if platform directory doesn't exist
      if (!fs.existsSync(platformPath)) {
        continue;
      }
      
      const files = fs.readdirSync(platformPath).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        try {
          const filePath = path.join(platformPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Parse frontmatter and extract app data
          const app = this._parseMarkdownFile(content, filePath, platform);
          if (app) {
            apps.push(app);
          }
          
        } catch (error) {
          console.log(`${COLORS.yellow}⚠️  Error reading ${file}: ${error.message}${COLORS.reset}`);
        }
      }
    }
    
    return apps;
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
}