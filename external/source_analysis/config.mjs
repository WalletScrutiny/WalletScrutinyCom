import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API Configuration
export const GITHUB_API_BASE = 'https://api.github.com';
export const DOCKER_HUB_API_BASE = 'https://hub.docker.com/v2';

// Database Configuration.
// Dev runs keep everything inside this folder; the systemd unit points the
// service at its StateDirectory / CacheDirectory through these variables
// (config/walletscrutiny-source-analysis.service).
export const DB_PATH = process.env.SOURCE_ANALYSIS_DB_PATH || join(__dirname, 'assets.db');
export const BACKUP_DIR = join(dirname(DB_PATH), 'backup');
export const BACKUPS_TO_KEEP = 14; // one copy per run, older ones are deleted

// App list: which wallets exist and where their source lives, rendered by the
// site from the wallet records (assets/js/json/appRepositories.json).
// index.mjs fetches it on every run and keeps the last good copy in the database.
export const APP_LIST_URL = 'https://walletscrutiny.com/assets/js/json/appRepositories.json';

// Extra apps not covered by the site list, e.g. Docker images.
// Add your apps here with appId, GitHub repository URL, and optionally Docker image name
// dockerImage can be:
//   - Simple name: 'user/image' (defaults to Docker Hub)
//   - Full registry URL: 'docker.io/user/image', 'ghcr.io/user/image', 'registry.example.com/user/image'
export const APPS = [
  // Example:
  // { appId: 'WalletScrutiny', repoUrl: 'https://gitlab.com/walletscrutiny/walletScrutinyCom' },
  // { appId: 'zeus-android', repoUrl: 'https://github.com/ZeusLN/zeus' },
  // { appId: 'specter-desktop', dockerImage: 'ghcr.io/cryptoadvance/specter-desktop' },
];

// Source Code Analysis Configuration
export const DEFAULT_TEMP_DIR = process.env.SOURCE_ANALYSIS_TEMP_DIR || join(__dirname, 'temp_repos');
// Fully qualified so it resolves the same under docker and podman
export const SEMGREP_IMAGE = 'docker.io/semgrep/semgrep';
export const YEARS_FOR_OUTDATED_CHECK = 5; // Report dependencies not updated in last X years
export const MIN_DOWNLOADS_THRESHOLD = 10000; // Minimum downloads per month to avoid alert

// Asset Size Change Detection Configuration
export const SIZE_CHANGE_THRESHOLD_PERCENT = 30; // Alert if size difference exceeds this percentage

export const SHOW_ONLY_FIRST_X_ALERTS = 100;

// App Types
export const APP_TYPES = {
  NPM: 'npm',
  GRADLE: 'gradle',
  MAVEN: 'maven',
  PIP: 'pip',
  UNKNOWN: 'unknown'
};
