import Database from 'better-sqlite3';
import { existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';
import { DB_PATH, BACKUP_DIR, BACKUPS_TO_KEEP } from './config.mjs';
import { join, dirname } from 'path';

// Backup database before processing. Keeps the newest `keep` copies.
export function backupDatabase(dbPath = DB_PATH, backupDir = BACKUP_DIR, keep = BACKUPS_TO_KEEP) {
  // Ensure backup directory exists
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  // Check if database file exists
  if (!existsSync(dbPath)) {
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
  const backupPath = join(backupDir, backupFilename);

  try {
    copyFileSync(dbPath, backupPath);
  } catch (error) {
    console.error(`Failed to create database backup: ${error.message}`);
    throw error;
  }

  // The timestamp sorts lexically, so the oldest copies come first
  const old = readdirSync(backupDir)
    .filter(f => /^assets_.*\.db$/.test(f))
    .sort()
    .slice(0, -keep);
  for (const f of old) {
    unlinkSync(join(backupDir, f));
  }
}

// Initialize database
export function initDatabase(dbPath = DB_PATH) {
  if (dbPath !== ':memory:') {
    mkdirSync(dirname(dbPath), { recursive: true });
  }
  const db = new Database(dbPath);

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

  // Resolved dependencies per (app_id, version), from lockfiles only.
  // `packages` holds one row per unique (ecosystem, name, version, resolved,
  // integrity) so consecutive releases, which share almost all of their
  // packages, add join rows rather than package rows.
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      version TEXT NOT NULL DEFAULT '',
      resolved TEXT NOT NULL DEFAULT '',
      integrity TEXT NOT NULL DEFAULT ''
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_package ON packages(ecosystem, name, version, resolved, integrity);
    CREATE INDEX IF NOT EXISTS idx_package_name ON packages(ecosystem, name);

    CREATE TABLE IF NOT EXISTS app_dependencies (
      app_id TEXT NOT NULL,
      version TEXT NOT NULL,
      package_id INTEGER NOT NULL REFERENCES packages(id),
      lockfile TEXT NOT NULL,
      direct INTEGER,
      dev INTEGER,
      tier TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, version, package_id, lockfile)
    );
    CREATE INDEX IF NOT EXISTS idx_app_dependencies_package ON app_dependencies(package_id);
  `);

  // Last good copy of the site's app list (see appList.mjs), one row per
  // wallet record with a repository.
  db.exec(`
    CREATE TABLE IF NOT EXISTS apps (
      app_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      repository TEXT NOT NULL,
      fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, platform)
    );
  `);

  return db;
}

// Replace the cached app list with the given entries ({appId, platform, repository}).
export function saveAppList(db, entries) {
  const insert = db.prepare('INSERT INTO apps (app_id, platform, repository) VALUES (?, ?, ?)');
  db.transaction(() => {
    db.prepare('DELETE FROM apps').run();
    for (const e of entries) insert.run(e.appId, e.platform, e.repository);
  })();
  return entries.length;
}

export function getAppList(db) {
  return db.prepare('SELECT app_id, platform, repository FROM apps ORDER BY platform, app_id').all()
    .map(r => ({ appId: r.app_id, platform: r.platform, repository: r.repository }));
}

const boolOrNull = (v) => (v === null || v === undefined ? null : (v ? 1 : 0));

// Replace the stored dependency set of (appId, version) with the entries of
// the given pinning analyses (see pinningAnalysis.mjs makeEntry).
// Returns the number of rows stored.
export function saveDependencies(db, appId, version, analyses) {
  const insertPackage = db.prepare(`
    INSERT OR IGNORE INTO packages (ecosystem, name, version, resolved, integrity) VALUES (?, ?, ?, ?, ?)
  `);
  const selectPackage = db.prepare(`
    SELECT id FROM packages WHERE ecosystem = ? AND name = ? AND version = ? AND resolved = ? AND integrity = ?
  `);
  const insertDependency = db.prepare(`
    INSERT OR REPLACE INTO app_dependencies (app_id, version, package_id, lockfile, direct, dev, tier)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const clear = db.prepare('DELETE FROM app_dependencies WHERE app_id = ? AND version = ?');

  const run = db.transaction(() => {
    clear.run(appId, version);
    let count = 0;
    for (const analysis of analyses) {
      for (const e of analysis.entries || []) {
        insertPackage.run(e.ecosystem, e.name, e.version, e.resolved, e.integrity);
        const { id } = selectPackage.get(e.ecosystem, e.name, e.version, e.resolved, e.integrity);
        insertDependency.run(appId, version, id, e.lockfile, boolOrNull(e.direct), boolOrNull(e.dev), e.tier);
        count++;
      }
    }
    return count;
  });
  return run();
}

// Stored dependency rows of (appId, version), package fields joined in.
export function getDependencies(db, appId, version) {
  return db.prepare(`
    SELECT p.ecosystem, p.name, p.version AS dep_version, p.resolved, p.integrity,
           d.lockfile, d.direct, d.dev, d.tier
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    WHERE d.app_id = ? AND d.version = ?
    ORDER BY p.ecosystem, d.lockfile, p.name, p.version
  `).all(appId, version);
}

// Set difference between two stored versions, keyed by (ecosystem, lockfile,
// name); a name resolved to several versions in one release is compared as
// the set of its versions. Returns { added, removed, changed }; changed rows
// carry from/to version lists and, for a version present on both sides, an
// integrity or resolved change — the case worth an alert.
export function diffDependencies(db, appId, fromVersion, toVersion) {
  const group = (rows) => {
    const map = new Map();
    for (const r of rows) {
      const k = `${r.ecosystem}\u0000${r.lockfile}\u0000${r.name}`;
      if (!map.has(k)) map.set(k, { ecosystem: r.ecosystem, lockfile: r.lockfile, name: r.name, direct: r.direct, dev: r.dev, versions: new Map() });
      const g = map.get(k);
      g.direct = g.direct || r.direct;
      g.versions.set(r.dep_version, r);
    }
    return map;
  };
  const before = group(getDependencies(db, appId, fromVersion));
  const after = group(getDependencies(db, appId, toVersion));
  const added = [], removed = [], changed = [];
  const summary = (g) => ({ ecosystem: g.ecosystem, lockfile: g.lockfile, name: g.name, direct: g.direct, dev: g.dev, versions: [...g.versions.keys()] });
  for (const [k, g] of after) {
    const prev = before.get(k);
    if (!prev) { added.push(summary(g)); continue; }
    const from = [...prev.versions.keys()], to = [...g.versions.keys()];
    const sameBytes = [...g.versions].filter(([v, r]) => prev.versions.has(v) &&
      (prev.versions.get(v).integrity !== r.integrity || prev.versions.get(v).resolved !== r.resolved)).map(([v]) => v);
    if (from.join() !== to.join() || sameBytes.length) {
      changed.push({ ...summary(g), from, to, integrityChangedAtSameVersion: sameBytes });
    }
  }
  for (const [k, g] of before) if (!after.has(k)) removed.push(summary(g));
  return { added, removed, changed };
}

// Every (app_id, version) that ships a package: the retroactive lookup for a
// new advisory. `version` null matches all versions of the package.
export function findAppsShipping(db, ecosystem, name, version = null) {
  return db.prepare(`
    SELECT d.app_id, d.version, p.version AS dep_version, d.lockfile, d.direct, d.dev
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    WHERE p.ecosystem = ? AND p.name = ? AND (? IS NULL OR p.version = ?)
    ORDER BY d.app_id, d.version
  `).all(ecosystem, name, version, version);
}

// Returns true if the app already has at least one stored asset (not a baseline run)
export function hasExistingAssets(db, appId) {
  const row = db.prepare('SELECT 1 FROM assets WHERE app_id = ? LIMIT 1').get(appId);
  return row !== undefined;
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

