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
| parallel repositories | 3 (`SOURCE_ANALYSIS_CONCURRENCY`), each in its own container with the [Sandbox](#sandbox) limits, so 18 GB / 6 CPUs for the analysis containers by default, next to the build server (the Semgrep container has no limits); every log line is prefixed with the `[appId]` of its repository |
| package caches | `/var/cache/walletscrutiny-source-analysis/cache` (`SOURCE_ANALYSIS_CACHE_DIR`), npm/yarn/gradle/pip caches shared by the analysis containers, wiped when they pass `SOURCE_ANALYSIS_CACHE_MAX_GB` (20) |
| analysis image | `ANALYSIS_IMAGE` in `config.mjs`, pinned by digest; pulled by the deploy, superseded copies removed |
| GitHub token | `/etc/credstore.encrypted/build-server-gh-token`, handed to the process as `GITHUB_TOKEN_FILE` |
| logs | journal: `journalctl -u walletscrutiny-source-analysis.service` |

The state and cache directories are created by systemd (`StateDirectory`,
`CacheDirectory`). The analysed repositories are untrusted: nothing of them
runs on the host, see [Sandbox](#sandbox). The service user needs to be in the
`docker` group (it is, for the Automated Build Server).

### Server preparation

The build server is already prepared (user, docker group, node): see
`external/build_server/README.md`. The only extra requirement is the GitHub
token credential, which the build server already has. To give the source
analysis its own token instead (separate API rate limit), create a second
credential and point the two `build-server-gh-token` lines of the unit at it:

```bash
echo -n 'ghp_xxx' | sudo systemd-creds encrypt --name=source-analysis-gh-token - /etc/credstore.encrypted/source-analysis-gh-token
```

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

Query the service database with the CLI in this folder:

```bash
cd /opt/source_analysis
sudo -u build-server env SOURCE_ANALYSIS_DB_PATH=/var/lib/walletscrutiny-source-analysis/assets.db \
  node pinning-cli.mjs --ships npm:lodash@4.17.15
```

## Which apps are analysed

The list of wallets and their repositories comes from the site, not from this
folder: `assets/js/json/appRepositories.json` is rendered at site build time
from every wallet record that has a `repository:` line and is not gone
(`meta` removed, defunct, discontinued or deprecated). Each entry is
`{ "appId", "platform", "repository" }` and nothing else on purpose: the
version to analyse is read from the repository itself, the site's version
field lags behind releases.

`index.mjs` fetches the list from `APP_LIST_URL` (config.mjs) on every run and
keeps the last good copy in the `apps` table, so a run still works when the
site is unreachable. Records that share a repository (typically the Android
and iPhone entries of one wallet) become one job, keyed by the first record
(android before iphone before desktop, hardware, bearer); the others are
listed as aliases. URLs are normalised (`.git`, trailing slash, `/releases`,
`/tags`, `/tree/...`, `www.`), and URLs that name no repository (user or
organisation pages) are skipped with a warning.

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

5. **Source analysis**: see below.

## Source analysis

After the binary pass of a repository, `runSourceCodeAnalysis()` (`appAnalysis.mjs`)
analyses it inside a container (see [Sandbox](#sandbox)): shallow clone, dependency
install, then the tests below. When the pass added a new release, the clone is that
release's tag and the resolved dependencies are stored in `assets.db`; when nothing
new was found, it clones the default branch and stores only the analysed commit
(`default_branch_analyses`), so the next pass skips the repository until that
branch moves. A failed analysis stores nothing and is retried on the next pass.
To re-analyse unchanged branches (new checks deployed, say), delete the rows of
`default_branch_analyses`. Docker-only apps get
no source analysis. The ecosystem is detected from the repository root
(`package.json` → npm, `build.gradle(.kts)` → gradle, `pom.xml` → maven,
`requirements.txt`/`setup.py`/`pyproject.toml` → pip); an unknown type (Rust
wallets, for example) skips the install and tests 2–5 and still gets the file-only
tests 7–12. The scratch directory (clone, `node_modules`, result) is deleted
afterwards.

Results go to the log (the journal for the service); only test 10 writes to the
database. Tests 2–5 need the project's dependencies installed and run its own
tooling (`npm`/`yarn install`, `pip install -r requirements.txt`, `./gradlew`,
`mvn`) — inside the container; tests 10–12 only read files and execute nothing.

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
| result | `/work/result.json` (`ok`, `commit`, `appType`, `pinning`, `error`); the log streams through to the journal |

Semgrep (test 9) is its own container, started by the host on the checkout the
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

| Test | What it reports | Ecosystems | File |
|---|---|---|---|
| 2 | Number of direct dependencies | npm, gradle, maven, pip | `appAnalysis.mjs` |
| 3 | Dependencies declared without a fixed version (`^`, `~`, `*`, `latest`, ranges) | npm, gradle, maven, pip | `appAnalysis.mjs` |
| 4 | Known vulnerabilities from `npm audit` / `yarn audit` | npm (gradle, maven, pip: OWASP dependency-check or `safety check` runs when the project has it, but its result is not reported) | `appAnalysis.mjs` |
| 5 | Packages with no release in the last `YEARS_FOR_OUTDATED_CHECK` years, and packages under `MIN_DOWNLOADS_THRESHOLD` monthly downloads (abandoned, or crafted for this app) | npm (gradle, maven, pip: the outdated check runs, but its result is not reported) | `appAnalysis.mjs` |
| 9 | Semgrep CE with `--config=auto`, run in the `SEMGREP_IMAGE` container; skipped without docker | any | `appAnalysis.mjs` |
| 7 | js-x-ray warnings (eval, encoded literals, suspicious imports …) in JS/TS files; test files skipped unless `--include-test-files` | JS/TS | `appAnalysis.mjs` |
| 8 | Obfuscated JS/TS files (obfuscation-detector) | JS/TS | `appAnalysis.mjs` |
| 10 | Supply-chain pinning per dependency: hash-pinned, version-pinned, source-ref-pinned (JitPack at a commit), build-service-tag, unversioned, floating; registries seen and whether resolution is ambiguous (dependency confusion). Every resolved row is stored (`packages`, `app_dependencies`) | npm, yarn, pip, gradle, cargo | `pinningAnalysis.mjs` |
| 11 | Build inputs fetched outside the package manager (curl/wget, Dockerfile `FROM`, cmake downloads, git clones in scripts and CI), graded on hash evidence and on whether the URL is immutable or rolling | any | `oobDownloadAnalysis.mjs` |
| 12 | Compiled artifacts checked into the tree (`.a`, `.so`, `.aar`, `.jar`, `.wasm` …), graded on whether the repository documents how they were built and whether a build file uses them | any | `committedBinaryAnalysis.mjs` |

**For now only tests 4 and 10 run** (known vulnerabilities and the resolved
dependencies); the calls of the others are commented out in
`runChecksOnCheckout()` and, for Semgrep, `runSourceCodeAnalysis()`, until we get
back to code analysis.

The tests run in the order of the table (`runChecksOnCheckout()` in
`appAnalysis.mjs`, inside the container; Semgrep from the host). Test 1 (full
dependency tree) exists but is disabled; there is no test 6. `pinning-cli.mjs` runs tests 10–12 alone on
any repository and ref (see above); with `--follow-deps` it also runs test 12 on
each git-resolvable source dependency (test 12b), which the watcher does not do.

Known blind spots, reported by the tests themselves: prebuilt blobs inside
registry packages (test 10 reads lockfiles, not artifacts), URLs built at build
time (test 11), and whether a documented recipe really reproduces committed bytes
(test 12).

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

