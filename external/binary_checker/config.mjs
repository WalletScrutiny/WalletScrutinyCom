import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API Configuration
export const GITHUB_API_BASE = 'https://api.github.com';
export const DOCKER_HUB_API_BASE = 'https://hub.docker.com/v2';

// Database Configuration
export const DB_PATH = join(__dirname, 'assets.db');
export const BACKUP_DIR = join(__dirname, 'backup');

// Apps Configuration
// Add your apps here with appId, GitHub repository URL, and optionally Docker image name
// dockerImage can be:
//   - Simple name: 'user/image' (defaults to Docker Hub)
//   - Full registry URL: 'docker.io/user/image', 'ghcr.io/user/image', 'registry.example.com/user/image'
export const APPS = [
  // Example:
  // { appId: 'WalletScrutiny', repoUrl: 'https://gitlab.com/walletscrutiny/walletScrutinyCom' },
  { appId: 'zeus-android', repoUrl: 'https://github.com/ZeusLN/zeus' },
  // { appId: 'specter-desktop', dockerImage: 'ghcr.io/cryptoadvance/specter-desktop' },
];

// Source Code Analysis Configuration
export const DEFAULT_TEMP_DIR = join(__dirname, 'temp_repos');
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
