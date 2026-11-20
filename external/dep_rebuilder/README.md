# dep-rebuilder

Rebuilds the dependency versions that WalletScrutiny wallets ship, **most shared
first**, and stores whether the rebuilt package matches the one the registry
serves. Every build runs in a sandbox. It has a database of its own and does
not touch `source_analysis`'s.

Today: **npm**. Cargo, PyPI and Maven need their own build recipes.

## Run it

Start it as an **unprivileged user with rootless podman** (on the build server:
its own user, not `build-server`). It refuses to run as root (`DEP_REBUILDER_ALLOW_ROOT=1`
overrides, for tests).

```
npm install
node index.mjs sync            # read the published dependency export, count wallets per package version, ask Google
node index.mjs list --top 20   # what comes next
node index.mjs run --top 50    # rebuild the next 50; Ctrl-C stops after the current package
node index.mjs serve           # unattended: the same, forever (what the service runs)
node index.mjs status
node index.mjs export --out claims.json
```

`run` options: `--scope app|any` (default `app`: only versions that end up in a wallet's app, not build
tooling), `--min-wallets N`, `--retry` (rebuild failures again), `--package name@version` (explicit, repeatable).

Order: wallets shipping that exact version, descending, then name and version.
Versions Google's OSS Rebuild already attests are never rebuilt (`sync` lists
Google's bucket per package). A version already tried is skipped unless `--retry`.

Environment: `DEP_REBUILDER_EXPORT` (export URL or directory, default the live
`api/source-analysis`), `DEP_REBUILDER_DATA` (database, logs, scratch; default
`./data`), `DEP_REBUILDER_MEMORY`, `_CPUS`, `_PIDS`, `_DISK_GB` (default 8),
`_PHASE_MIN` (default 20), `DEP_REBUILDER_CLI` (`podman`).

## Run it as a service

`node index.mjs serve` is the unattended mode: it syncs the dependency lists
and Google's coverage when the last sync is more than 24 hours old (a failed
sync is retried after 30 minutes), rebuilds the next version, most shared
first, one at a time, and sleeps an hour when nothing is left. Each result is
saved as soon as it exists, so a restart loses only the build in progress. A
version whose build could not be attempted (registry or network down) is set
aside until the next sync or restart instead of being retried in a loop.
`SIGTERM` finishes the current package first; containers left by a killed
earlier run are removed at start.

### Where it runs

On the build server, as its own unprivileged user `dep-rebuilder` (not
`build-server`, which holds the bot keys and tokens), with rootless podman.

### Deploy

```
npm run deploy:dep-rebuilder      # from the repository root; BUILD_SERVER_HOST overrides the host
```

The script runs the tests, copies `external/dep_rebuilder` and
`external/source_analysis` (whose comparison code is reused) to
`/opt/dep-rebuilder`, creates the unprivileged user `dep-rebuilder` (home
`/var/lib/dep-rebuilder`: database, logs, container storage; subuid/subgid
ranges; lingering, which rootless podman needs), runs `npm ci`, installs and
enables `walletscrutiny-dep-rebuilder.service` (`Restart=always`, starts on
boot) and restarts it. `RESTART=0` leaves a running service alone.

```
journalctl -u walletscrutiny-dep-rebuilder -f
sudo -u dep-rebuilder env DEP_REBUILDER_DATA=/var/lib/dep-rebuilder/data node /opt/dep-rebuilder/external/dep_rebuilder/index.mjs status
```

Tuning: edit the `Environment=` lines of the unit (limits, export URL). The
unit has no `NoNewPrivileges`: rootless podman needs the setuid
`newuidmap`/`newgidmap`.

## The sandbox

One throwaway container per phase (`npm-sandbox.sh`, `sandbox.mjs`):

| Phase | Network | What runs |
|---|---|---|
| clone | yes | `git clone` and checkout; no repository code |
| install | yes | the lockfile's dependencies with `--ignore-scripts`: no package's lifecycle script runs while the network is open |
| build | **none** | the package's own `prepare` / `prepublishOnly` / build scripts, then `npm pack --offline` |

All phases: unprivileged user, all capabilities dropped, `no-new-privileges`,
read-only root file system, only the work and output directories mounted,
memory, process, CPU, disk (polled) and time limits; the container is removed
by name on timeout. Source: the git tag the identity check matches, else the
commit the registry names. Toolchain: the publisher's Node major and npm
version.

What this does not give: a build that needs its dependencies' install scripts
(native add-ons compiled at install, binaries downloaded by a postinstall)
fails, and is recorded as failed, not retried with a network. The
container boundary is rootless podman's; for a hard boundary run the whole
utility inside a VM.

## Result

`reproduced` when every file of the registry tarball is byte-identical to the
rebuilt one (tar metadata and gzip ignored, as OSS Rebuild does); otherwise
`failed` with the reason (differing files, and whether they differ in line
endings, docs or dev-only package.json fields only; or the step that failed).
The comparison and wording are `source_analysis/rebuildNpm.mjs`'s, which this
reuses. Nothing is published; `export` writes the claims and the unsigned
event for each.

## Tests

`npm test`
