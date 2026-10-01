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

// Container the per-repository work runs in (containerRunner.mjs). Pinned by
// digest: a third-party image that runs untrusted code in isolation, bumped
// deliberately. mingc/android-build-box ships Android SDK platforms 28-35 +
// NDK, JDK 8/11/17/21, Node 22, Python 3 and Flutter, which covers every
// ecosystem the checks know (gradle, npm/yarn, pip; maven is not in it and no
// tracked wallet uses it).
export const ANALYSIS_IMAGE = process.env.SOURCE_ANALYSIS_IMAGE ||
  'docker.io/mingc/android-build-box:1.29.0@sha256:f7d2376b3fe17c7cff946f4da41d2254dc40c4f7bacbe0dca7a3910b06bc2d21';
export const CONTAINER_CLI = process.env.SOURCE_ANALYSIS_CONTAINER_CLI || 'docker'; // docker or podman
export const CONTAINER_MEMORY = process.env.SOURCE_ANALYSIS_CONTAINER_MEMORY || '6g';
export const CONTAINER_CPUS = Number(process.env.SOURCE_ANALYSIS_CONTAINER_CPUS || 2);
export const CONTAINER_PIDS = Number(process.env.SOURCE_ANALYSIS_CONTAINER_PIDS || 2048); // counts threads too
export const CONTAINER_TIMEOUT_MS = Number(process.env.SOURCE_ANALYSIS_CONTAINER_TIMEOUT_MIN || 45) * 60 * 1000; // per repository
// Shared npm/yarn/gradle/pip caches mounted into every container; wiped when
// they grow past the cap (index.mjs calls pruneCache after each pass).
export const CACHE_DIR = process.env.SOURCE_ANALYSIS_CACHE_DIR || join(__dirname, 'cache');
export const CACHE_MAX_BYTES = Number(process.env.SOURCE_ANALYSIS_CACHE_MAX_GB || 20) * 1e9;
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
