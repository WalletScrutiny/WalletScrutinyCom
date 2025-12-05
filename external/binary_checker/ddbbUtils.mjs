import Database from 'better-sqlite3';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { notifySha256Changed } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'assets.db');
const BACKUP_DIR = join(__dirname, 'backup');

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
export function saveAsset(db, appId, asset) {
  const stmt = db.prepare(`
    SELECT sha256, architecture, os, published_at FROM assets 
    WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
      AND COALESCE(architecture, '') = COALESCE(?, '')
      AND COALESCE(os, '') = COALESCE(?, '')
  `);

  const existing = stmt.get(appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);

  if (existing) {
    // Asset exists, check if sha256 changed
    const oldSha256 = existing.sha256;
    const newSha256 = asset.sha256;

    // Skip comparison if new sha256 is unknown or pending
    if (newSha256 === 'unknown' || newSha256 === 'pending_download') {
      return 'unknown';
    }

    // If old sha256 was unknown and we now have a real value, update it
    if (oldSha256 === 'unknown' || oldSha256 === 'pending_download') {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET sha256 = ?, architecture = ?, os = ?, published_at = ?, author_id = ?, author_login = ?
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(newSha256, asset.architecture || null, asset.os || null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      return 'added';
    }

    // Check if sha256 actually changed
    // Note: We already filtered by source, architecture, and os in the SELECT query, 
    // so this comparison is only for assets from the same source and platform
    if (oldSha256 !== newSha256) {
      notifySha256Changed(appId, asset.version, asset.assetName, asset.source, oldSha256, newSha256);

      // Update the asset
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET sha256 = ?, architecture = ?, os = ?, published_at = ?, author_id = ?, author_login = ?
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(newSha256, asset.architecture || null, asset.os || null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      return 'changed';
    } else {
      // Update published_at and author info if it's missing or if we have a new value
      // Note: architecture and os are already matched, so no need to update them
      if ((!existing.published_at && asset.publishedAt) || asset.publishedAt || asset.authorId || asset.authorLogin) {
        const updateStmt = db.prepare(`
          UPDATE assets 
          SET published_at = COALESCE(?, published_at), author_id = COALESCE(?, author_id), author_login = COALESCE(?, author_login)
          WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
            AND COALESCE(architecture, '') = COALESCE(?, '')
            AND COALESCE(os, '') = COALESCE(?, '')
        `);
        updateStmt.run(asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      }
      return 'unchanged';
    }
  } else {
    // New asset, insert it
    const insertStmt = db.prepare(`
      INSERT INTO assets (app_id, version, asset_name, sha256, source, architecture, os, published_at, author_id, author_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(appId, asset.version, asset.assetName, asset.sha256, asset.source, asset.architecture || null, asset.os || null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null);
    return 'added';
  }
}

