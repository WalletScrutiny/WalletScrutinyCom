# dep-rebuilder

Rebuilds the dependency versions that WalletScrutiny wallets ship, **most shared
first**, and stores whether the rebuilt package matches the one the registry
serves. Every build runs in a sandbox. It has a database of its own and does
not touch `source_analysis`'s.

Today: **npm**. Cargo, PyPI and Maven need their own build recipes.

## Run it

Start it as an **unprivileged user with rootless podman**, on a machine that is
not the build server. It refuses to run as root (`DEP_REBUILDER_ALLOW_ROOT=1`
overrides, for tests).

```
npm install
node index.mjs sync            # read the published dependency export, count wallets per package version, ask Google
node index.mjs list --top 20   # what comes next
node index.mjs run --top 50    # rebuild the next 50; Ctrl-C stops after the current package
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
