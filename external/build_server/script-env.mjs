import { GITHUB_TOKEN_APP_IDS } from './config/config.mjs';

const DEFAULT_PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';

const NIX_PATH_ENTRIES = [
  '/nix/var/nix/profiles/default/bin',
  '/run/current-system/sw/bin',
];

/**
 * Build the environment passed to verification scripts executed via asciinema.
 * Includes Nix profile paths so scripts using `nix develop` or `nix build` can
 * find the `nix` binary when it is installed on the build server host.
 * GITHUB_TOKEN is set only for apps in githubTokenAppIds.
 */
export function buildScriptExecutionEnv({ githubToken, appId = null, githubTokenAppIds = GITHUB_TOKEN_APP_IDS } = {}) {
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

  // Omit the key rather than set it to null: spawn() would pass the string
  // "null", and scripts would send it to GitHub as a token.
  const token = githubToken || process.env.GITHUB_TOKEN;
  if (token && githubTokenAppIds.includes(appId)) {
    env.GITHUB_TOKEN = token;
  }

  if (process.env.NIX_SSL_CERT_FILE) {
    env.NIX_SSL_CERT_FILE = process.env.NIX_SSL_CERT_FILE;
  }

  return env;
}
