import fs from 'fs';
import { GITHUB_TOKEN_APP_IDS } from './config/config.mjs';

const DEFAULT_PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';

const NIX_PATH_ENTRIES = [
  '/nix/var/nix/profiles/default/bin',
  '/run/current-system/sw/bin',
];

/**
 * The public-only GitHub token from GITHUB_PUBLIC_TOKEN_FILE (the
 * build-server-gh-public-token credential), or undefined when it is not set up.
 * It is a fine-grained token on a separate account with read-only access to
 * public repositories and no permissions: it only lifts the rate limit.
 */
export function readPublicGithubToken() {
  const filePath = process.env.GITHUB_PUBLIC_TOKEN_FILE;
  if (!filePath || !fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath, 'utf8').trim() || undefined;
}

/**
 * Build the environment passed to verification scripts executed via asciinema.
 * Includes Nix profile paths so scripts using `nix develop` or `nix build` can
 * find the `nix` binary when it is installed on the build server host.
 * GITHUB_TOKEN is the real token for apps in githubTokenAppIds and the
 * public-only token for every other app.
 */
export function buildScriptExecutionEnv({
  githubToken,
  publicGithubToken = readPublicGithubToken(),
  appId = null,
  githubTokenAppIds = GITHUB_TOKEN_APP_IDS,
} = {}) {
  const home = process.env.HOME || '/tmp';
  const nixUserProfileBin = `${home}/.nix-profile/bin`;

  const pathParts = [
    ...NIX_PATH_ENTRIES,
    nixUserProfileBin,
    process.env.PATH,
    DEFAULT_PATH,
  ];

  const path = [...new Set(
    pathParts
      .filter(Boolean)
      .join(':')
      .split(':')
      .filter(Boolean)
  )].join(':');

  const env = {
    PATH: path,
    HOME: home,
    XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || '/tmp/.config',
    ASCIINEMA_CONFIG_HOME: process.env.ASCIINEMA_CONFIG_HOME || '/tmp/.config',
  };

  // Other apps get the public-only token under the same name, so scripts that
  // call the GitHub API get 5,000 requests an hour instead of the shared 60
  // (Dan's review of !2072). Without it they get no token, never the real one.
  // Omit the key rather than set it to null: spawn() would pass the string
  // "null", and scripts would send it to GitHub as a token.
  const token = githubTokenAppIds.includes(appId)
    ? githubToken || process.env.GITHUB_TOKEN
    : publicGithubToken;
  if (token) {
    env.GITHUB_TOKEN = token;
  }

  if (process.env.NIX_SSL_CERT_FILE) {
    env.NIX_SSL_CERT_FILE = process.env.NIX_SSL_CERT_FILE;
  }

  return env;
}
