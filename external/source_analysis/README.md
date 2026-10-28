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
- Clones the source of each new release and analyses it in a throwaway container (for now only known vulnerabilities and the resolved dependencies run, see [Source analysis](#source-analysis)): dependency counts and pinning, known vulnerabilities, stale or little-used packages, Semgrep and js-x-ray findings, obfuscated JavaScript, out-of-band downloads and committed binaries (see [Source analysis](#source-analysis))
- Stores the full resolved dependency set of each analysed release, so a new advisory can be matched against every release that ships the package
- Looks up the known vulnerabilities of those dependencies on OSV.dev (npm, PyPI, Maven/gradle, crates.io) and stores them per release

## Installation (development)

```bash
cd external/source_analysis
npm install
npm test
node index.mjs --githubToken ghp_xxx --app-id app.zeusln.zeus
```

A dev run keeps its files in this folder: `assets.db`, `backup/`, `temp_repos/`
and `cache/` (all ignored by git). Nothing else is written. Docker (or podman,
`SOURCE_ANALYSIS_CONTAINER_CLI=podman`) is required: every repository is
analysed inside a container, see [Sandbox](#sandbox).

## Install and run as a systemd service

The service runs on the build server in its own tree, `/opt/source_analysis`,
as the same user and with the same GitHub token as the Automated Build Server
(`external/build_server`, deployed separately to `/opt/build-server`). Only this
folder is deployed: the analysis imports nothing from the rest of the repository
and gets the wallet list from the site over HTTPS. It is a oneshot unit fired by
a timer every 6 hours:

| | |
|---|---|
| units | `config/walletscrutiny-source-analysis.service`, `config/walletscrutiny-source-analysis.timer` |
| working directory | `/opt/source_analysis` |
| user | `build-server` |
| database | `/var/lib/walletscrutiny-source-analysis/assets.db` (`SOURCE_ANALYSIS_DB_PATH`), backups next to it in `backup/`, newest 14 kept |
| per-repository scratch | `/var/cache/walletscrutiny-source-analysis/repos` (`SOURCE_ANALYSIS_TEMP_DIR`), deleted after each repository |
| scope | wallets with a reproducible build verification of any version (kind 30301 on the project relays, `reproducible.mjs`), each verified version analysed at its tag, 3 per wallet and pass (`SOURCE_ANALYSIS_VERIFIED_PER_PASS`); `SOURCE_ANALYSIS_SCOPE=all` analyses every wallet with a repository. Needs Node 22 (WebSocket) |
| parallel repositories | 3 (`SOURCE_ANALYSIS_CONCURRENCY`), each in its own container with the [Sandbox](#sandbox) limits, so 18 GB / 6 CPUs for the analysis containers by default, next to the build server (the Semgrep container has no limits); every log line is prefixed with the `[appId]` of its repository |
| package caches | `/var/cache/walletscrutiny-source-analysis/cache` (`SOURCE_ANALYSIS_CACHE_DIR`), npm/yarn/gradle/pip caches shared by the analysis containers, wiped when they pass `SOURCE_ANALYSIS_CACHE_MAX_GB` (20) |
| analysis image | `ANALYSIS_IMAGE` in `config.mjs`, pinned by digest; pulled by the deploy, superseded copies removed |
| GitHub token | `/etc/credstore.encrypted/build-server-gh-token`, handed to the process as `GITHUB_TOKEN_FILE` |
| logs | journal: `journalctl -u walletscrutiny-source-analysis.service` |

The state and cache directories are created by systemd (`StateDirectory`,
`CacheDirectory`). The analysed repositories are untrusted: nothing of them
runs on the host, see [Sandbox](#sandbox). The service user needs to be in the
`docker` group.

### Server preparation

Everything the source analysis needs on the server is listed here; it does
not depend on `external/build_server/README.md`. It shares two names with the
Automated Build Server: the user `build-server` and the GitHub token
credential `build-server-gh-token`. On a machine where the build server is
already installed, `adduser` reports that the user exists and the credential
can be left as it is; every other command is safe to run again.

```bash
# Packages: docker runs every analysed repository in a container, git asks
# the remotes for their default branch, rsync copies the export to the web host
sudo apt install docker.io git rsync openssh-client curl ca-certificates

# Node 22 or newer (the default scope reads the verifications over WebSocket,
# which Node has built in from 22 on). Check with `node --version`; if it is
# older or missing, install it from NodeSource. The unit runs /usr/bin/node.
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install nodejs

# The service user and its group (the unit runs as build-server:build-server),
# allowed to use docker
sudo adduser --disabled-password --gecos '' build-server
sudo usermod -aG docker build-server

# GitHub token, encrypted for systemd (the unit loads it with LoadCredentialEncrypted)
sudo mkdir -p /etc/credstore.encrypted
echo -n 'ghp_xxx' | sudo systemd-creds encrypt --name=build-server-gh-token - /etc/credstore.encrypted/build-server-gh-token
```

The token needs no scopes: it only raises the GitHub API rate limit. To give
the source analysis its own token instead (separate API rate limit), create a
second credential and point the two `build-server-gh-token` lines of the unit
at it:

```bash
echo -n 'ghp_xxx' | sudo systemd-creds encrypt --name=source-analysis-gh-token - /etc/credstore.encrypted/source-analysis-gh-token
```

The directories (`/opt/source_analysis`, `/var/lib/walletscrutiny-source-analysis`,
`/var/cache/walletscrutiny-source-analysis`) need no preparation: the deploy
creates the first, systemd the other two.

### Deploy from your machine

```bash
npm run deploy:source-analysis          # RUN_NOW=1 to start a run right after the deploy
```

Requires SSH to `build.walletscrutiny.com` as root (see `~/.ssh/config`). The
script runs this folder's tests first and a failure aborts the deploy (there is
no switch to skip them). It then rsyncs this folder alone to
`/opt/source_analysis` (dev state such as `assets.db`, `backup/`, `temp_repos/`,
`cache/` and `node_modules/` excluded), installs the npm dependencies there as
`build-server`, pulls the analysis image and removes superseded copies of it,
copies the two units to `/etc/systemd/system/` and enables the timer. It does
not touch the Automated Build Server tree or its images; the two deploys are
independent and can run in any order.

### Install by hand

```bash
sudo rsync -a --exclude node_modules --exclude assets.db --exclude backup --exclude temp_repos \
  external/source_analysis/ /opt/source_analysis/
sudo chown -R build-server:build-server /opt/source_analysis
cd /opt/source_analysis
sudo -u build-server npm ci
sudo cp config/walletscrutiny-source-analysis.service /etc/systemd/system/
sudo cp config/walletscrutiny-source-analysis.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now walletscrutiny-source-analysis.timer
```

### Setting up from scratch

The whole setup on two machines, in order, for when one has to be rebuilt.
The build server (`build.walletscrutiny.com`) runs the analysis, and the web
host (`walletscrutiny.com`) serves its results. Names marked *suggested*
can change, as long as the settings in
`config/walletscrutiny-source-analysis.service` match the web host's in step 2.

What is lost with the build server: the database
(`/var/lib/walletscrutiny-source-analysis/assets.db`) and its backups, which
sit next to it. Nothing else holds the analysis history or the recorded
alerts. A new database gets filled again by the first pass, which takes
hours. Copy `assets.db` off the machine now and then if the history matters.

**1. Build server: packages, user, token.** Run every command of
[Server preparation](#server-preparation).

**2. Web host: directory, user, key, nginx.** Only needed for the wallet
pages' Dependencies panel. Without it the analysis still runs and stores
everything; the panel stays hidden.

```bash
# On the build server: the key the analysis copies its export with (suggested path)
sudo mkdir -p /etc/walletscrutiny-source-analysis
sudo ssh-keygen -t ed25519 -N '' -C source-analysis-publish -f /etc/walletscrutiny-source-analysis/publish_ed25519
sudo chown build-server: /etc/walletscrutiny-source-analysis/publish_ed25519
sudo cat /etc/walletscrutiny-source-analysis/publish_ed25519.pub     # goes into authorized_keys below

# On the web host: a user that can write one directory and nothing else (suggested names)
sudo adduser --disabled-password --gecos '' source-analysis
sudo mkdir -p /srv/source-analysis
sudo chown source-analysis: /srv/source-analysis
sudo -u source-analysis mkdir -p -m 700 ~source-analysis/.ssh
echo 'command="rrsync /srv/source-analysis",restrict ssh-ed25519 AAAA... source-analysis-publish' \
  | sudo -u source-analysis tee ~source-analysis/.ssh/authorized_keys
```

`rrsync` comes with the `rsync` package (`/usr/bin/rrsync`, rsync 3.2.4 or
newer). It limits the key to rsync inside `/srv/source-analysis`, so the
target is that directory's root, `source-analysis@walletscrutiny.com:/`.
The directory must not be inside `/var/www/walletscrutiny.com`, because
`deploy:prod` empties that on every deploy.

The nginx config files in this repository (`prod`, `beta` and `old` in
`external/configs/webserver_nginx/`) already have the `/api/source-analysis/`
section. Check that the files installed on the web host contain it, or add it
manually to each site's `server` block, then reload nginx
(`sudo nginx -t && sudo systemctl reload nginx`):

```nginx
location /api/source-analysis/ {
    alias /srv/source-analysis/;
    add_header Cache-Control "no-cache";
}
```

Back on the build server, two one-time steps.

First, save the web host's SSH host key. The analysis connects with
`StrictHostKeyChecking=yes`: it only copies to a host whose key is already in
its `known_hosts` file, so without this step every publish fails with
`Host key verification failed`.

```bash
ssh-keyscan -t ed25519 walletscrutiny.com | sudo tee /etc/walletscrutiny-source-analysis/known_hosts
sudo ssh-keygen -lf /etc/walletscrutiny-source-analysis/known_hosts   # fingerprint saved
```

To be sure the saved key is the real server's, run
`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on the web host: both
fingerprints must be the same.

Second, test the copy. This connects exactly like the analysis will (same
user, key and `known_hosts`) but only lists the web host's directory:

```bash
sudo -u build-server rsync -e 'ssh -i /etc/walletscrutiny-source-analysis/publish_ed25519 -o UserKnownHostsFile=/etc/walletscrutiny-source-analysis/known_hosts -o StrictHostKeyChecking=yes' \
  --list-only source-analysis@walletscrutiny.com:/
```

A line ending in ` .` means it works. `Permission denied` means the public key
in the web host's `authorized_keys` is wrong; `Host key verification failed`
means the first step is missing or saved another host's key.

**3. Build server: alert key.** The export directory, the web host target
and the SSH key paths from step 2 are already set in
`config/walletscrutiny-source-analysis.service`, which the deploy installs. If
you changed a *suggested* name in step 2, change it there too. Only the alert
key stays out of the unit, because it is a secret and unit files are
world-readable. Put the analyser's Nostr key in
`/etc/walletscrutiny-source-analysis/alerts.env`, readable by root only
(systemd reads it before it drops to `build-server`):

```bash
echo 'ALERT_NOSTR_NSEC=nsec1...' | sudo tee /etc/walletscrutiny-source-analysis/alerts.env
sudo chmod 600 /etc/walletscrutiny-source-analysis/alerts.env
```

Without the file, alerts are still recorded and printed in the journal, but
nobody gets a message.

**4. Deploy and first run.** From your machine, `RUN_NOW=1 npm run
deploy:source-analysis` installs the code, units and image (see "Deploy from
your machine"), then starts a pass. Follow it with
`sudo journalctl -u walletscrutiny-source-analysis.service -f`. When it ends,
`curl -sI https://walletscrutiny.com/api/source-analysis/index.json` answers
200, and a wallet page that has an analysis shows its Dependencies panel.

## Source analysis admin

```bash
sudo systemctl list-timers walletscrutiny-source-analysis.timer    # next and last run
sudo systemctl start walletscrutiny-source-analysis.service        # run now (blocks until the pass ends; add --no-block)
sudo systemctl status walletscrutiny-source-analysis.service
sudo journalctl -u walletscrutiny-source-analysis.service -f
sudo systemctl stop walletscrutiny-source-analysis.service         # abort a running pass
```

A pass walks every repository of the site list, three at a time. A repository
with a new release gets that release analysed; one without gets its default
branch analysed, unless the branch still points at the commit the last
successful analysis looked at (`git ls-remote`, no clone). The first pass on an
empty database therefore analyses every repository and takes hours; later
passes analyse new releases and the default branches that moved. If a pass is
still running when the timer fires again, that firing is skipped.

Every analysis the service runs leaves a row in the `analyses` table: app, kind
(release or default branch), ref, commit, analyser version, status (`ok`,
`failed`, `unsupported`), the plugins that ran, the lockfiles the pinning step
read, dependency and OSV checked/skipped counts. The dependency and
vulnerability tables only hold rows for releases that produced some; this
table is what says "analysed and nothing found", "failed" or "never analysed",
and when. Releases stored before the table existed get a row from what their
dependency rows remember (`analyser = before-analyses-table`, no commit).

### Static export

With `SOURCE_ANALYSIS_EXPORT_DIR` set, each pass ends by writing a static JSON
export of the database (`export.mjs`), built in a temporary directory and
renamed into place so a reader never sees a half-written tree:

| file | content |
|---|---|
| `index.json` | the exported app ids, which `exportApp` keeps current |
| `apps/<aliasId>.json` | `{appId, alias: true}` for the repository's other app ids (the iPhone record of an Android app), one hop to the file above |
| `apps/<appId>.json` | all releases of one app, newest version first: ref, commit, date, status, lockfiles, the OSV skip counts, the dependency and advisory counts (including `byScope`: app / build / tests / unknown), the submodule counts, the lock coverage (`locked`, `unlocked`, `unknown` or `none`, with up to five files a wallet team can fix: manifests without a lockfile, lockfiles nothing reads, downloads without a hash check, committed binaries), the advisories (id, severity, aliases, summary, package, scope, who pulls it in, how many products ship it) and the diff to the previous release |
| `apps/<appId>/<ref>/dependencies.json` | the full resolved dependency list of one release (ecosystem, name, version, lockfile, pinning tier, direct, scope, dependants), each row with how many products ship the package and that exact version |
| `apps/<appId>/<ref>/submodules.json` | the release's git submodules, one row per library with its three claims (`submoduleIdentity.mjs`), when it has any |

The files carry only what a reader uses: the wallet page's Dependencies panel,
`signals.mjs` (advisory ids) and `apk-contents-cli.mjs --deps`. The rest
(integrity hashes, resolved URLs, analyser version, plugins, the full lock
coverage lists, the default branch, cross-wallet package counts) stays in `assets.db`.

Each wallet does not wait for the end of the pass: as soon as an analysis of
it is stored, `exportApp` rewrites its `apps/` files and its `index.json`
entry in the existing export (each file renamed into place), and, with a
publish target, rsyncs just those files (no `--delete`). The rest (upstream hints, signals, other wallets' product counts, releases
removed since) waits for the full export that ends the pass. A failure there
is only logged; the full export writes the wallet again.

`scope` says where a package ends up, as far as the files say: `app` when it
is reachable from the project's own dependencies, `build` when only from its
development dependencies, `tests` when only from test frameworks and test
tooling among those (jest, vitest, mocha, junit-style configurations, …), and
null when nothing says. `package-lock.json` records the dev flag; `yarn.lock`
records the graph but no flag, so `plugins/pinning.mjs` walks it from the
manifest's roots (`yarnScopes`); `Cargo.lock` likewise, with the workspace
crates' `Cargo.toml` sections as roots (`cargoScopes`: `[dependencies]` is
app, `[build-dependencies]` build, `[dev-dependencies]` tests, since cargo
compiles those for tests, examples and benches only; a registry crate's own
build helpers are listed with its normal dependencies in the lock and count as
app, the safe direction); gradle resolution derives it from the configuration
names. Measured 2026-10-16: AirGap Vault yarn.lock 1,338 rows → 330 app /
1,008 build; Liana Cargo.lock 839 → 829 app / 6 build / 4 unplaced; Gem
Wallet core 703 → all app; Passport Prime KeyOS (17 lockfiles) 3,937 → 3,595
app / 135 tests / 24 build / 183 unplaced. The scope is a placement fact, not a verdict: a build
dependency can still hurt the product (a `postinstall` script runs on the
developer's machine), which is why every advisory still needs its own
decision.

Sizes on the 2026-10-16 database, before the export was cut to what readers
use: 59 apps, 81 releases, 31 MB in total, the largest dependency list 1.5 MB
(OneKey). The cut took the `apps/` files of a 2026-10-27 export from 41 MB
(6.5 MB with brotli) to 24 MB (1.3 MB with brotli), mostly by leaving out
`resolved` and `integrity`. Run it by
hand with `node export.mjs --out <dir>` (`SOURCE_ANALYSIS_DB_PATH` selects the
database).

After the export, the pass writes `signals.json` into it (`signals.mjs`: EPSS,
CISA's exploited list, publication dates per advisory; a feed that fails only
leaves its part out, and the previous file stays when all fail;
`SOURCE_ANALYSIS_SIGNALS=off` skips it).

### Publishing the export

The wallet pages fetch the export at page load from `/api/source-analysis/`,
so new data must not wait for a site build. With
`SOURCE_ANALYSIS_PUBLISH_TARGET` set, each pass ends by rsyncing the export
there (`publish.mjs`; `--delay-updates --delete-delay`, so a page sees the
old or the new export). A failed copy counts as a failed pass. Each wallet's
own files are copied as soon as it is analysed (`publishFiles`, see "Static
export").

Before copying, every `.json` gets a brotli copy next to it (`x.json.br`,
quality 11, redone only when the `.json` is newer). The nginx sites have
`brotli_static on`, so a browser that accepts br gets the copy: the
dependency lists shrink to about a sixth (42 MB of export to 6.6 MB). Others
get the plain file.

| variable | value |
|---|---|
| `SOURCE_ANALYSIS_PUBLISH_TARGET` | rsync destination directory, `user@host:/srv/source-analysis` |
| `SOURCE_ANALYSIS_PUBLISH_SSH` | the ssh command rsync uses, for the key: `ssh -i /etc/... -o StrictHostKeyChecking=yes` |

On the web host, the directory must not be inside the site's webroot:
`deploy:prod` empties `/var/www/walletscrutiny.com` on every deploy. nginx
serves it under the site's path:

```nginx
location /api/source-analysis/ {
    alias /srv/source-analysis/;
    add_header Cache-Control "no-cache";
}
```

Its user needs write access to that directory and nothing else. A key
restricted to rsync (`command="rrsync /srv/source-analysis"` in
`authorized_keys`) keeps it that way; rrsync reads paths relative to that
directory, so the target is then `user@host:/`. The commands for both
machines are in [Setting up from scratch](#setting-up-from-scratch); the
variables are set in `config/walletscrutiny-source-analysis.service`.

Query the service database with the CLI in this folder:

```bash
cd /opt/source_analysis
sudo -u build-server env SOURCE_ANALYSIS_DB_PATH=/var/lib/walletscrutiny-source-analysis/assets.db \
  node pinning-cli.mjs --ships npm:lodash@4.17.15
```

## Which apps are analysed

The list of wallets and their repositories comes from the site, not from this
folder: `api/appRepositories.json` is rendered at site build time
from every wallet record that has a `repository:` line. A repository marked
`#deadLink` or `&deadLink` is left out. Each entry is
`{ "appId", "platform", "repository" }`, plus `"gone": true` when the record's
`meta` is removed, defunct, discontinued or deprecated (a gone wallet stays in
scope only while it was reproducible, see `SOURCE_ANALYSIS_SCOPE`), and
nothing else on purpose: the
version to analyse is read from the repository itself, the site's version
field lags behind releases.

`index.mjs` fetches the list from `APP_LIST_URL` (config.mjs) on every run and
keeps the last good copy in the `apps` table, so a run still works when the
site is unreachable. Records that share a repository (typically the Android
and iPhone entries of one wallet) become one job, keyed by the first record
(android before iphone before desktop, hardware, bearer); the others are
listed as aliases. URLs are normalised (`.git`, trailing slash, `/releases`,
`/tags`, `/tree/...`, `www.`), and URLs that name no repository (user or
organisation pages, or a `#deadLink`) are skipped with a warning. A
repository GitHub answers 404 for is logged as not found and does not fail
the pass. Release assets are recorded for the last 3 years
(`RELEASE_MAX_AGE_YEARS`); GitHub lists newest first and the walk stops at
the first older release. A 422 from the result cap keeps whatever was
already fetched. The oneshot exits 1 only when some other
per-app error remains (the summary line counts succeeded, failed and not
found separately).

```bash
node index.mjs --githubToken ghp_xxx                        # whole list (the service: GITHUB_TOKEN_FILE=<file>)
node index.mjs --githubToken ghp_xxx --app-id app.zeusln.zeus  # one job (appId or alias), repeatable
node index.mjs --githubToken ghp_xxx --app-list ./list.json  # a local or alternative list
```

## Configuration

Extra apps that are not on the site list (for example Docker images) go in
the `APPS` array in `config.mjs`:

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
   - Fetches releases from the last 3 years (`RELEASE_MAX_AGE_YEARS` in `config.mjs`). GitHub lists newest first, and the walk stops at the first older release
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

5. **Source analysis**: see below.

## Source analysis

After the binary pass of a repository, `runSourceCodeAnalysis()` (`appAnalysis.mjs`)
analyses it inside a container (see [Sandbox](#sandbox)): shallow clone, then the
[plugins](#plugins) that run on the checkout; the host then runs the plugins'
host steps, such as looking up the known vulnerabilities of the resolved
dependencies on OSV.dev (test 10). When the pass added a new release, the clone is that
release's tag and the resolved dependencies are stored in `assets.db`; when nothing
new was found, it clones the default branch and stores only the analysed commit
(`default_branch_analyses`), so the next pass skips the repository until that
branch moves. A failed analysis stores nothing and is retried on the next pass.
To re-analyse unchanged branches (new checks deployed, say), delete the rows of
`default_branch_analyses`. Docker-only apps get
no source analysis. The ecosystem is detected from the repository root
(`package.json` → npm, `build.gradle(.kts)` → gradle, `pom.xml` → maven,
`requirements.txt`/`setup.py`/`pyproject.toml` → pip); an unknown type (Rust
wallets, for example) skips the install and tests 2–4 and still gets the file-only
tests 5–9. The scratch directory (clone, `node_modules`, result) is deleted
afterwards.

Results go to the log (the journal for the service); only tests 7 and 10 write
to the database (`app_dependencies`, `app_vulnerabilities`), and only for
releases. An OSV.dev lookup that fails counts as a failed analysis, so an
unchanged default branch is retried rather than skipped without a result. Tests 2–4 need the project's dependencies installed and run its own
tooling (`npm`/`yarn install`, `pip install -r requirements.txt`, `./gradlew`,
`mvn`) — inside the container; tests 7–9 only read files and execute nothing,
except test 7b, which runs the project's gradle wrapper inside the container.

### Sandbox

`containerRunner.mjs` starts one container per repository from the image pinned by
digest in `config.mjs` (`mingc/android-build-box`: Android SDK platforms 28–35 and
NDK, JDK 8/11/17/21, Node 22, Python 3, Flutter — a maintained third-party image
with a public Dockerfile, so there is no image of our own to maintain) and runs
`containerEntry.mjs` in it. The host process only drives `docker`, stores the
result and deletes the scratch directory; it never opens a file of the repository.

| | |
|---|---|
| mounts | this folder read-only at `/analysis` (code and `node_modules`; the entry point loads only pure-JS packages), the per-repository scratch dir at `/work`, the shared package caches at `/cache` |
| not in the container | the GitHub token, `assets.db`, the docker socket |
| hardening | runs as the service user (`--user`), `--cap-drop ALL`, `--security-opt no-new-privileges`, read-only root with a tmpfs `/tmp`, `--memory 6g --cpus 2 --pids-limit 2048`, killed after 45 min (`SOURCE_ANALYSIS_CONTAINER_MEMORY`, `_CPUS`, `_PIDS`, `_TIMEOUT_MIN`) |
| inside | `HOME=/work/home`, `npm_config_ignore_scripts=true` (the repositories' npm lifecycle scripts never run), `GIT_TERMINAL_PROMPT=0` (a private or removed repository fails instead of waiting for credentials), `PIP_USER=1` (pip installs under `/work`), JDK 17 as `JAVA_HOME` |
| result | `/work/result.json` (`ok`, `commit`, `appType`, `results` per plugin, `failed` plugins, `error`); the log streams through to the journal |

Semgrep (test 11) is its own container, started by the host on the checkout the
first container leaves in the scratch dir. The image is the one place a hostile
repository can reach: the network (its own installs need it) and the shared
`/cache` (poisoning the npm/gradle cache for the next repository is possible;
the caches are wiped past their size cap and can be set to a small cap for
strict isolation at the price of re-downloads). Gradle projects needing an SDK
platform the image lacks fail their gradle tests (the SDK directory in the image
is not writable for the service user); they still get the lockfile-based tests.
Flutter projects are detected as `unknown` and get the file-only tests.

Dev run against another image or engine: `SOURCE_ANALYSIS_IMAGE=docker.io/library/node:22
SOURCE_ANALYSIS_CONTAINER_CLI=podman node index.mjs --githubToken … --app-id …`
(anything with `bash`, `git` and `node` works for npm repositories).

| Test | What it reports | Ecosystems | Plugin |
|---|---|---|---|
| 2 | Number of direct dependencies | npm, gradle, maven, pip | `plugins/direct-dependencies.mjs` |
| 3 | Dependencies declared without a fixed version (`^`, `~`, `*`, `latest`, ranges) | npm, gradle, maven, pip | `plugins/unfixed-versions.mjs` |
| 4 | Packages with no release in the last `YEARS_FOR_OUTDATED_CHECK` years, and packages under `MIN_DOWNLOADS_THRESHOLD` monthly downloads (abandoned, or crafted for this app) | npm (gradle, maven, pip: the outdated check runs, but its result is not reported) | `plugins/outdated-dependencies.mjs` |
| 5 | js-x-ray warnings (eval, encoded literals, suspicious imports …) in JS/TS files; test files skipped unless `--include-test-files` | JS/TS | `plugins/jsxray.mjs` |
| 6 | Obfuscated JS/TS files (obfuscation-detector) | JS/TS | `plugins/obfuscation.mjs` |
| 7 | Supply-chain pinning per dependency (7b: for gradle, the resolved graph from the project's own gradle, see below): hash-pinned, version-pinned, source-ref-pinned (JitPack at a commit), build-service-tag, unversioned, floating; registries seen and whether resolution is ambiguous (dependency confusion). Every resolved row is stored (`packages`, `app_dependencies`) | npm, yarn, pip, gradle, cargo | `plugins/pinning.mjs`, `plugins/gradle-resolution.mjs` |
| 8 | Build inputs fetched outside the package manager (curl/wget, Dockerfile `FROM`, cmake downloads, git clones in scripts and CI), graded on hash evidence and on whether the URL is immutable or rolling | any | `plugins/oob-downloads.mjs` |
| 9 | Compiled artifacts checked into the tree (`.a`, `.so`, `.aar`, `.jar`, `.wasm` …), graded on whether the repository documents how they were built and whether a build file uses them | any | `plugins/committed-binaries.mjs` |
| 10 | Known vulnerabilities of every dependency test 7 resolved to an exact registry version, from the [OSV.dev](https://osv.dev) batch API, run on the host: advisory id and CVE, severity (GitHub's reviewed label, else the CVSS 3 base score; `malicious` for OSV `MAL-` records), fixed versions, direct/transitive and dev. Floating ranges, BOM-supplied versions and git/path/tarball sources are counted as not checkable. Stored per release (`app_vulnerabilities`). The old `npm audit` / `yarn audit` version is the `npm-audit` plugin, off | npm, yarn, pip, gradle, cargo | `plugins/osv.mjs` |
| 11 | Semgrep CE with `--config=auto`, run in the `SEMGREP_IMAGE` container; skipped without docker | any | `plugins/semgrep.mjs` |

**For now only tests 7 and 10 run** (the resolved dependencies and their known
vulnerabilities); the other plugins are switched off in `config.mjs` until we
get back to code analysis. Neither needs the dependencies installed, so the
`install-dependencies` plugin is off too.

### Plugins

Every check is a plugin: one file in `plugins/`, named after the plugin. The
`PLUGINS` section at the top of `config.mjs` lists all of them in the order
they run, each `true` (runs) or `false` (skipped); move a line to change the
order:

```javascript
export const PLUGINS = {
  'install-dependencies': false,
  …
  'pinning': true,
  'gradle-resolution': true,
  …
  'osv': true,
  'semgrep': false,
};
```

A plugin file default-exports an object with a `container(ctx)` step, a
`host(ctx)` step, or both (see `plugins.mjs`). The container steps of all
enabled plugins run first, inside the analysis container, on the checkout
(`ctx.repoPath`, `ctx.appType`, `ctx.options`); each one's return value lands in
`ctx.results[<name>]` and travels back to the host in `result.json`, so it must
be JSON. Then the host steps run in the same order, with the same `results`
plus `ctx.name`, `ctx.version` and `ctx.db` (set for releases only; import
`ddbbUtils.mjs` lazily, inside `host()`, as the container cannot load it).
`requires: ['pinning']` declares that a plugin reads another one's result;
`needsKnownAppType: true` skips it for repositories with no detected ecosystem.
A step that throws is logged and fails the analysis (an unchanged default
branch is retried next pass); the other plugins still run, except those that
require the failed one.

A plugin file holds its check's whole code, with the plugin object at the
bottom; other code imports its named exports from there (`pinning-cli.mjs`
uses `plugins/pinning.mjs` directly). Code two plugins share lives next to
`config.mjs` (`jsFiles.mjs`); `appAnalysis.mjs` keeps only what every run
needs: clone, ecosystem detection, and running the plugins.

To add a check, add `plugins/<name>.mjs` and a line for it in `PLUGINS`. The
run refuses to start when a plugin file is not listed, a listed plugin has no
file, or a plugin runs before (or without) one it requires.

Test 10 is only as complete as test 7's rows: npm, yarn and cargo lockfiles list
the transitive dependencies, so those are checked in full. pip is checked where
`requirements*.txt` pins `==` versions.

Gradle build files show only what a project declares as literals: no transitive
dependencies, no versions built from variables or supplied by a BOM. So in the
watcher, test 7b (`plugins/gradle-resolution.mjs`) runs the project's own gradle wrapper
in the container with an init script (`gradle/resolve-deps.init.gradle`) that
resolves the graph of every classpath configuration (runtime, compile,
annotation processors, buildscript) and lists the modules gradle selected. Only
POM/module metadata is fetched; no artifact is downloaded and no task of the
project runs (it runs `help`). The JDK follows the wrapper's gradle version
(17 from 7.3, 11 from 5.0, else 8). Git submodules are fetched first (shallow),
since a build that includes their projects does not configure without them. A
module that pins an NDK the image lacks is pointed at the installed one: the
SDK is read-only, and the NDK only matters for native compiles, not the graph. A resolved module replaces the declaration
rows of the same `group:artifact`, keeps the hash of a `verification-metadata.xml`
row at the same version, and is `dev` unless it is in a release runtime
classpath (not test, not debug). A floating declaration stays tier `floating`
but carries the version gradle picked, so test 10 checks it. When gradle fails
to configure the project, the declaration rows stay and the reason is logged and
added to the resolution notes. `pinning-cli.mjs` does not run it (it runs on the
host and executes nothing).

The tests run in the order of `PLUGINS` (container steps inside the container,
then host steps such as OSV.dev and Semgrep on the host). Test 1 (full
dependency tree, `dependency-tree`) exists but is disabled. `pinning-cli.mjs` runs tests 7–9 alone on
any repository and ref (see above); with `--follow-deps` it also runs test 9 on
each git-resolvable source dependency (test 9b), which the watcher does not do.

Known blind spots, reported by the tests themselves: prebuilt blobs inside
registry packages (test 7 reads lockfiles, not artifacts), URLs built at build
time (test 8), and whether a documented recipe really reproduces committed bytes
(test 9).

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
  scope TEXT,                       -- where it ends up: 'app', 'build', 'tests', NULL when the files do not say
  tier TEXT NOT NULL,               -- hash-pinned | version-pinned | source-ref-pinned | build-service-tag | unversioned | floating
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (app_id, version, package_id, lockfile)
);
```

What each ecosystem can say: npm and cargo lockfiles give the full resolved set with `direct` known; yarn.lock knows `direct` (by requested range) but not `dev` for transitive rows; gradle has the full set where `verification-metadata.xml` exists or test 7b could run gradle (`lockfile` = `<build dir> (gradle resolution)`), otherwise the declared coordinates; pip has what `requirements*.txt` lists. Helpers in `ddbbUtils.mjs`: `saveDependencies`, `getDependencies`, `diffDependencies`, `findAppsShipping`.

Known vulnerabilities per release (test 10), as OSV.dev reported them when the release was analysed. A snapshot: an advisory published later is found with `findAppsShipping`, not here.

```sql
CREATE TABLE app_vulnerabilities (
  app_id TEXT NOT NULL,
  version TEXT NOT NULL,            -- the app release
  ecosystem TEXT NOT NULL,          -- npm | pip | gradle | cargo
  name TEXT NOT NULL,
  dep_version TEXT NOT NULL,
  vuln_id TEXT NOT NULL,            -- OSV id (GHSA-…, PYSEC-…, RUSTSEC-…, MAL-…); aliases of one issue are folded into one row
  severity TEXT NOT NULL,           -- malicious | critical | high | moderate | low | unknown
  aliases TEXT NOT NULL DEFAULT '', -- space separated, CVE ids among them
  fixed TEXT NOT NULL DEFAULT '',   -- space separated versions the advisory lists as fixed for this package
  summary TEXT NOT NULL DEFAULT '',
  direct INTEGER,
  dev INTEGER,
  scope TEXT,                       -- widest scope among the package's rows: app > build > tests
  checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (app_id, version, ecosystem, name, dep_version, vuln_id)
);
```

Helpers: `saveVulnerabilities`, `getVulnerabilities`.

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

## Upstream triage files

`upstream-triage-cli.mjs` (`upstreamTriage.mjs`) reads the scanner ignore lists
and VEX documents of every analysed wallet and of its direct users at the
shipped version into `upstream_triage` / `upstream_triage_checked`, prints what
they speak to, and with `--export <dir>` writes the per-wallet hints the panel
shows (`exportAll` writes them too). `GITHUB_TOKEN` switches GitHub reads to
the GraphQL API (five refs per query); without it raw.githubusercontent.com
answers 429 after a few thousand files. Resumable: refs already read are
skipped unless `--all`. See docs/dependency-check.md, "Triage".


## Libraries pinned as git submodules

`submodules-cli.mjs --repo <url> --ref <tag|commit> [--app <appId> --version <v>]`
(`submoduleIdentity.mjs`) walks every submodule a wallet pins, recursively,
and reports three separate claims for each: RB (the product's build
verification, from `--app`), identity (the pinned commit is an upstream
release, an upstream commit, or derived: commits upstream does not have on top
of a release) and advisories (OSV by commit). Advisories apply only when
identity holds. A derived tree gets its base release's advisories as "status
unknown", each with a hint from the advisory's fix commit: in the fork's
history, its patch already in the tree, its patch still applying (likely
missing), or can't tell. Nothing is built: git fetches commits only (and one
commit's trees for the listing) into `$SOURCE_ANALYSIS_CACHE_DIR/submodules`.
`GITHUB_TOKEN_FILE` raises the rate limit of the fork lookups. Not in the
pass or the panel yet.

## Alerts

A lockfile that pins a registry package OSV lists as malicious (MAL-*) raises
an alert (`alerts.mjs`), whether the package ships in the app or only runs in
the build: a build dependency can patch the artifact. Each alert is recorded
once per (app, release, package, advisory) in `alerts` and sent to every
configured channel right after the OSV step; one a channel did not take is
retried after the next analysis.

| variable | channel |
|---|---|
| `ALERT_WEBHOOK_URL` | POST of the alert as JSON (`text` holds the message) |
| `ALERT_NOSTR_NSEC` | NIP-17 private message from the analyser's key to Leo, Danny and Luis (`ALERT_RECIPIENTS` in alerts.mjs), or to the npubs in `ALERT_NOSTR_TO` (comma-separated) |
| `ALERT_NOSTR_RELAYS` | relays for the message (default relay.nostr.info, relay.damus.io, nos.lol) |

`node alerts-cli.mjs` lists open alerts; `--set confirmed|dismissed --app <id>
--advisory <id> --note "…"` records what a person found; `--deliver` resends
the undelivered ones. Without a channel an alert is still recorded and printed
on every run until someone sets it.
