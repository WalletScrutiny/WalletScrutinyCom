# Binary Checker

A Node.js application that tracks binary assets from GitHub releases and Docker containers, storing their SHA256 hashes in a SQLite database and detecting changes.

## Features

- Fetches binary assets from GitHub releases
- Fetches Docker container images and their digests
- Stores asset information (app ID, version, asset name, SHA256) in SQLite database
- Detects SHA256 changes and triggers notifications
- Supports GitHub API token for higher rate limits
- Supports Docker Hub API token for private repositories
- Automatically uses GitHub token for ghcr.io (GitHub Container Registry) when Docker token is not provided

## Installation

```bash
cd external/binary_checker
npm install
```

## Configuration

Edit the `APPS` array in `index.mjs` to configure the apps you want to track:

```javascript
const APPS = [
  { appId: 'myapp', repoUrl: 'https://github.com/user/repo' },
  { appId: 'myapp2', repoUrl: 'https://github.com/user/repo2', dockerImage: 'user/image' },
  { appId: 'myapp3', repoUrl: 'https://github.com/user/repo3', dockerImage: 'user/image', githubToken: 'ghp_xxx' },
];
```

Each app can have:
- `appId` (required): Unique identifier for the app
- `repoUrl` (required): GitHub repository URL
- `dockerImage` (optional): Docker Hub image name (e.g., `user/image`)
- `githubToken` (optional): GitHub API token for this specific app (overrides global token)
- `dockerToken` (optional): Docker Hub API token for this specific app (overrides global token)

## Usage

### Basic usage

Simply run the script - it will process all apps configured in the `APPS` array:

```bash
node index.mjs
```

### With global tokens (optional)

You can provide tokens via command line that will be used for all apps (unless overridden per-app):

```bash
node index.mjs --githubToken ghp_xxxxxxxxxxxx --dockerToken dckr_xxxxxxxxxxxx
```

The script will:
1. Process all apps in the `APPS` array
2. Use per-app tokens if specified, otherwise use command-line tokens
3. Show a summary at the end with success/failure counts
4. Continue processing remaining apps even if one fails

## How it works

1. **GitHub Assets**: 
   - Fetches all releases from the GitHub repository using the GitHub API
   - For each release, processes all binary assets
   - **Uses the `digest` field directly from the GitHub API** - GitHub provides SHA256 checksums automatically since 2025
   - Extracts SHA256 from the digest field (handles formats like `sha256:hash` or direct hash)
   - If digest is not available (older releases from before 2025), marks the asset as `unknown`
   - No file downloads or checksum file parsing required - everything comes from the API

2. **Docker Assets**:
   - Fetches all tags for the Docker image from Docker Hub API
   - Extracts SHA256 digests from the image manifests
   - Stores each tag as an asset with its digest

3. **Database Storage**:
   - Creates a SQLite database (`assets.db`) in the same directory
   - Stores: app_id, version, asset_name, sha256, source
   - Uses unique constraint on (app_id, version, asset_name, source)

4. **Change Detection**:
   - When processing an app again, checks if assets already exist
   - Compares SHA256 values
   - If SHA256 changed, calls the notification procedure
   - Updates the database with the new SHA256

## Database Schema

```sql
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id TEXT NOT NULL,
  version TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(app_id, version, asset_name, source)
);
```

## Notification Procedure

The `notifySha256Changed()` function is called when a SHA256 change is detected. Currently, it only logs to console. You can implement your own notification logic (email, webhook, etc.) in this function.

## Notes

- **GitHub API**: 
  - Without a token, rate limit is 60 requests/hour. With a token, it's 5000 requests/hour.
  - GitHub provides SHA256 digests directly in the API response for release assets (since 2025)
  - The `digest` field contains the SHA256 hash - no need to download files or parse checksum files
  - Older releases (before 2025) may not have the `digest` field and will be marked as `unknown`
- **Docker Hub API**: 
  - Public images don't require authentication, but private images need a token
  - SHA256 digests are provided directly in the API response
- **GitHub Container Registry (ghcr.io)**:
  - Requires a GitHub Personal Access Token (PAT) with `read:packages` scope
  - The same GitHub token can be used for both GitHub API and ghcr.io
  - If you provide `--githubToken` but not `--dockerToken`, the script will automatically use the GitHub token for ghcr.io registries
- **Database**: 
  - The database file (`assets.db`) is created automatically in the same directory as the script
  - All operations are efficient - no file downloads required, everything comes from API responses

