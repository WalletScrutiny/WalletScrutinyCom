# Source Analysis

A Node.js application that watches GitHub releases and Docker images of the tracked wallets (SHA256, size, release author stored in SQLite, changes flagged) and analyses the source of each release: dependency pinning, out-of-band downloads, committed binaries, and the full resolved dependency set per release.

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
cd external/source_analysis
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

### Dependency set of one release (no clone of the watcher needed)

`pinning-cli.mjs` runs the lockfile-based tests (10–12) on one repository at one ref. With `--app-id` and `--version` it also stores every resolved dependency of that release in `assets.db`; `--diff` prints what changed against an earlier stored release:

```bash
node pinning-cli.mjs --repo https://github.com/ZeusLN/zeus --ref v0.12.0 \
  --app-id zeus-android --version v0.12.0 --diff v0.11.2
```

Which stored releases ship a package (the question a new advisory asks):

```bash
node pinning-cli.mjs --ships npm:lodash@4.17.15   # version optional
```

Nothing from the analysed repository is executed or installed for any of this: the rows come from `package-lock.json` / `yarn.lock` (classic and berry), `requirements*.txt`, gradle build files plus `gradle/verification-metadata.xml`, and `Cargo.lock`.

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

Resolved dependencies per release, filled by `pinning-cli.mjs --app-id … --version …` and by the watcher after a new release (`runSourceCodeAnalysis` with a `db`). `packages` holds one row per distinct package (consecutive releases share almost all of theirs), `app_dependencies` links a release to them:

```sql
CREATE TABLE packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ecosystem TEXT NOT NULL,          -- npm | pip | gradle | cargo
  name TEXT NOT NULL,               -- npm name, pip project, gradle group:artifact, crate
  version TEXT NOT NULL DEFAULT '', -- resolved version ('' when the file does not pin one, then a range for floating rows)
  resolved TEXT NOT NULL DEFAULT '',-- registry URL / git source / yarn resolution string
  integrity TEXT NOT NULL DEFAULT '',-- sha512-… (npm), sha256:… (pip, gradle, cargo), '' when none recorded
  UNIQUE(ecosystem, name, version, resolved, integrity)
);

CREATE TABLE app_dependencies (
  app_id TEXT NOT NULL,
  version TEXT NOT NULL,            -- the app release
  package_id INTEGER NOT NULL REFERENCES packages(id),
  lockfile TEXT NOT NULL,           -- file the row came from, relative to the repo root
  direct INTEGER,                   -- 1 declared by the project, 0 pulled in by a dependency, NULL unknown
  dev INTEGER,                      -- 1 build-time only (devDependencies), 0 shipped, NULL unknown
  tier TEXT NOT NULL,               -- hash-pinned | version-pinned | source-ref-pinned | build-service-tag | unversioned | floating
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (app_id, version, package_id, lockfile)
);
```

What each ecosystem can say: npm and cargo lockfiles give the full resolved set with `direct` known; yarn.lock knows `direct` (by requested range) but not `dev` for transitive rows; gradle has the full set only where `verification-metadata.xml` exists, otherwise the declared coordinates; pip has what `requirements*.txt` lists. Helpers in `ddbbUtils.mjs`: `saveDependencies`, `getDependencies`, `diffDependencies`, `findAppsShipping`.

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

