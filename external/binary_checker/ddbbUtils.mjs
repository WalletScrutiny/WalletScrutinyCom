import Database from 'better-sqlite3';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { DB_PATH, BACKUP_DIR } from './config.mjs';
import { join } from 'path';

// Backup database before processing
export function backupDatabase() {
  // Ensure backup directory exists
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Check if database file exists
  if (!existsSync(DB_PATH)) {
    console.log('Database file does not exist yet, skipping backup');
    return;
  }

  // Generate timestamp for backup filename
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');

  const backupFilename = `assets_${timestamp}.db`;
  const backupPath = join(BACKUP_DIR, backupFilename);

  try {
    copyFileSync(DB_PATH, backupPath);
  } catch (error) {
    console.error(`Failed to create database backup: ${error.message}`);
    throw error;
  }
}

// Initialize database
export function initDatabase() {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_id TEXT NOT NULL,
      source TEXT NOT NULL,
      version TEXT NOT NULL,
      architecture TEXT,
      os TEXT,
      asset_name TEXT NOT NULL,
      size INTEGER,
      sha256 TEXT NOT NULL,
      published_at DATETIME,
      author_id TEXT,
      author_login TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create new unique index with architecture and os
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_asset ON assets(
      app_id, version, asset_name, source, architecture, os
    );
    
    CREATE INDEX IF NOT EXISTS idx_app_version ON assets(app_id, version);
    CREATE INDEX IF NOT EXISTS idx_app_asset ON assets(app_id, asset_name);
    CREATE INDEX IF NOT EXISTS idx_architecture ON assets(architecture);
    CREATE INDEX IF NOT EXISTS idx_os ON assets(os);
  `);

  return db;
}

// Save or update asset in database
// Returns: 'unchanged', 'added', 'unknown', or 'changed'
// shaChangeResult: result from evaluateAssetShaChange function
export function saveAsset(db, appId, asset, shaChangeResult) {
  const { status, existing, oldSha256, newSha256, metadataNeedsUpdate } = shaChangeResult;

  if (existing) {
    if (status === 'unknown') {
      return 'unknown';
    }

    if (status === 'upgrade_from_unknown') {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET sha256 = ?, architecture = ?, os = ?, size = COALESCE(?, size), published_at = ?, author_id = ?, author_login = ?
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(newSha256, asset.architecture || null, asset.os || null, asset.size ?? null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      return 'added';
    }

    if (status === 'changed') {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET sha256 = ?, architecture = ?, os = ?, size = COALESCE(?, size), published_at = ?, author_id = ?, author_login = ?
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(newSha256, asset.architecture || null, asset.os || null, asset.size ?? null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      return 'changed';
    }

    if (metadataNeedsUpdate) {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET published_at = COALESCE(?, published_at), author_id = COALESCE(?, author_id), author_login = COALESCE(?, author_login), size = COALESCE(?, size)
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, asset.size ?? null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
    }

    return 'unchanged';
  } else {
    // New asset, insert it
    const insertStmt = db.prepare(`
      INSERT INTO assets (app_id, version, asset_name, sha256, source, architecture, os, size, published_at, author_id, author_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(appId, asset.version, asset.assetName, asset.sha256, asset.source, asset.architecture || null, asset.os || null, asset.size ?? null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null);
    return 'added';
  }
}

// Get previous releases with their authorIds for an app
// Returns array of objects with version, authorId, authorLogin, publishedAt
// Excludes the current version if provided
// Groups by version to get one authorId per version (takes the most common one if there are multiple)
export function getPreviousReleases(db, appId, currentVersion = null, limit = 5) {
  let query = `
    SELECT 
      version,
      author_id,
      MAX(author_login) as author_login,
      MAX(COALESCE(published_at, created_at)) as published_at
    FROM assets
    WHERE app_id = ? AND source = 'github' AND author_id IS NOT NULL
  `;
  
  const params = [appId];
  
  if (currentVersion) {
    query += ` AND version != ?`;
    params.push(currentVersion);
  }
  
  query += `
    GROUP BY version, author_id
    ORDER BY published_at DESC, created_at DESC
    LIMIT ?
  `;
  params.push(limit);
  
  const stmt = db.prepare(query);
  const results = stmt.all(...params);
  
  // If a version appears multiple times with different authorIds, take the first one
  // (This shouldn't happen for GitHub releases, but handle it just in case)
  const versionMap = new Map();
  for (const row of results) {
    if (!versionMap.has(row.version)) {
      versionMap.set(row.version, row);
    }
  }
  
  return Array.from(versionMap.values());
}

// Create a pattern from asset name by replacing version with wildcard for LIKE query
// This allows matching assets with the same base name but different versions
// Example: "zeus-v0.12.0-alpha4-arm64-v8a.apk" with version "v0.12.0-alpha4" 
//          becomes "zeus-%-arm64-v8a.apk"
function createAssetNamePattern(assetName, version) {
  if (!version || !assetName) {
    return assetName;
  }

  // Escape special regex characters in the version to use it in a regex
  const escapedVersionForRegex = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Replace the version with % wildcard (case-insensitive)
  let pattern = assetName.replace(new RegExp(escapedVersionForRegex, 'gi'), '%');
  
  // Escape special LIKE characters (% and _) in the pattern, but preserve the % we just added
  // Split by the % we added, escape each part, then join back
  const parts = pattern.split('%');
  const escapedParts = parts.map(part => part.replace(/[%_]/g, '\\$&'));
  pattern = escapedParts.join('%');
  
  return pattern;
}

// Get previous versions of the same asset (same asset_name pattern, source, architecture, os)
// The asset_name pattern is created by replacing the version with a wildcard
// This allows matching assets like "zeus-v0.12.0-alpha4-arm64-v8a.apk" and "zeus-v0.12.0-alpha3-arm64-v8a.apk"
// Returns array of objects with version, size, published_at
export function getPreviousAssetVersions(db, appId, assetName, source, architecture, os, currentVersion, limit = 10) {
  // Create pattern by replacing version with wildcard
  const assetNamePattern = createAssetNamePattern(assetName, currentVersion);
  
  const selectStmt = db.prepare(`
    SELECT version, asset_name, size, published_at, created_at
    FROM assets 
    WHERE app_id = ? AND asset_name LIKE ? ESCAPE '\\' AND source = ?
      AND COALESCE(architecture, '') = COALESCE(?, '')
      AND COALESCE(os, '') = COALESCE(?, '')
      AND version != ?
      AND size IS NOT NULL
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ?
  `);

  return selectStmt.all(
    appId, 
    assetNamePattern, 
    source, 
    architecture || null, 
    os || null, 
    currentVersion,
    limit
  );
}

