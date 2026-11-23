# dep-rebuilder

Rebuilds the dependency versions that WalletScrutiny wallets ship, **most shared
first**, and stores whether the rebuilt package matches the one the registry
serves. Every build runs in a sandbox. It has a database of its own and does
not touch `source_analysis`'s.

Today: **npm**, with a generic build for packages that build in their own
directory and [recipes](#recipes) for repositories that build many packages at
once. Cargo, PyPI and Maven are not built yet.

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
node index.mjs site --publish   # write rebuilds.json for the website and copy it (the service does this by itself)
```

`run --recipe babel` builds the next commits that recipe covers (`--top N`
commits, `--retry` also what failed with the recipe as it is). `try` is for
writing a recipe, see [Recipes](#recipes).

`run` options: `--scope app|any` (default `app`: only versions that end up in a wallet's app, not build
tooling), `--min-wallets N`, `--retry` (rebuild failures again), `--package name@version` (explicit, repeatable).

Order: wallets shipping that exact version, descending, then name and version.
Versions Google's OSS Rebuild already attests are never rebuilt (`sync` lists
Google's bucket per package). A version already tried is skipped unless `--retry`.

Environment: `DEP_REBUILDER_EXPORT` (export URL or directory, default the live
`api/source-analysis`), `DEP_REBUILDER_DATA` (database, logs, scratch; default
`./data`), `DEP_REBUILDER_MEMORY`, `_CPUS`, `_PIDS`, `_DISK_GB` (default 8),
`_PHASE_MIN` (default 20), `DEP_REBUILDER_CLI` (`podman`),
`DEP_REBUILDER_RECIPE_RELAYS` and `DEP_REBUILDER_RECIPE_AUTHORS` (the list's
file), see [Recipes over Nostr](#recipes-over-nostr).

## Run it as a service

`node index.mjs serve` is the unattended mode: it syncs the dependency lists
and Google's coverage when the last sync is more than 24 hours old (a failed
sync is retried after 30 minutes), rebuilds the next version, most shared
first, one at a time, and sleeps an hour when nothing is left. Each result is
saved as soon as it exists, so a restart loses only the build in progress. A
version whose build could not be attempted (registry or network down) is set
aside until the next sync or restart instead of being retried in a loop.
`SIGTERM` finishes the current package first; containers left by a killed
earlier run are removed at start. A build that did not reproduce while the
service was being stopped is not recorded (a shutdown kills the container, which
is not the package failing); it is built again after the start.

A failure in a step that needs the network (the repository could not be listed,
clone, install) may be the network's and not the package's, so it gets one more
try, a day later at the earliest. A second failure stands, and so does any
failure of the build or the comparison; `run --retry` rebuilds those by hand.

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

### Publishing the results

The results reach the website as one file, `rebuilds.json`: the versions that
were reproduced, each with a one-line note, date, source commit, toolchain and
the number of wallets that ship it; no logs and no paths. A version that was
not reproduced is not in it (see [Result](#result)). It is copied the way the
source analysis publishes its export. With
`DEP_REBUILDER_PUBLISH_TARGET` set, `serve` copies it (`site-export.mjs`, the
rsync and brotli code of `source_analysis/publish.mjs`) at most every 30
minutes while there are new results, again when it runs out of work, and once at
start. A failed copy is logged and retried; it never stops the rebuilding.

The **source analysis** fetches that file from
`https://walletscrutiny.com/api/dep-rebuilder/rebuilds.json`
(`SOURCE_ANALYSIS_REBUILD_FEED`) in its regular pass and turns each row for a
package version that some analysed release ships into a "by us" claim; the
Dependencies panel and its export need no change. So a result is on the wallet
pages after the next pass of the source analysis (every 6 hours), not at once.

| variable | value |
|---|---|
| `DEP_REBUILDER_PUBLISH_TARGET` | rsync destination, `dep-rebuilder@walletscrutiny.com:/` |
| `DEP_REBUILDER_PUBLISH_SSH` | the ssh command rsync uses, for the key and `known_hosts` |

Setting it up, once (the same recipe as the source analysis, own user, key and
directory):

```bash
# On the build server: the key (the service user runs untrusted package builds,
# in containers that cannot see this file, so the key is restricted on the web host)
sudo mkdir -p /etc/walletscrutiny-dep-rebuilder
sudo ssh-keygen -t ed25519 -N '' -C dep-rebuilder-publish -f /etc/walletscrutiny-dep-rebuilder/publish_ed25519
# the directory too: the service user writes known_hosts into it below
sudo chown dep-rebuilder: /etc/walletscrutiny-dep-rebuilder /etc/walletscrutiny-dep-rebuilder/publish_ed25519
sudo cat /etc/walletscrutiny-dep-rebuilder/publish_ed25519.pub     # goes into authorized_keys below
sudo -u dep-rebuilder sh -c 'ssh-keyscan -t ed25519 walletscrutiny.com > /etc/walletscrutiny-dep-rebuilder/known_hosts'   # then check the fingerprint

# On the web host: a user that can write one directory and nothing else
sudo adduser --disabled-password --gecos '' dep-rebuilder
sudo mkdir -p /srv/dep-rebuilder && sudo chown dep-rebuilder: /srv/dep-rebuilder
sudo -u dep-rebuilder mkdir -p -m 700 ~dep-rebuilder/.ssh
echo 'command="rrsync /srv/dep-rebuilder",restrict ssh-ed25519 AAAA... dep-rebuilder-publish' \
  | sudo -u dep-rebuilder tee ~dep-rebuilder/.ssh/authorized_keys

# Back on the build server, the test: lists the (empty) directory without asking anything
sudo -u dep-rebuilder rsync --list-only -e 'ssh -i /etc/walletscrutiny-dep-rebuilder/publish_ed25519 -o UserKnownHostsFile=/etc/walletscrutiny-dep-rebuilder/known_hosts -o StrictHostKeyChecking=yes' dep-rebuilder@walletscrutiny.com:/
```

nginx serves `/srv/dep-rebuilder/` under `/api/dep-rebuilder/` (the `prod`,
`beta` and `old` files in `external/configs/webserver_nginx/` have the section;
reload nginx after installing them). The directory must not be inside the
site's webroot, which `deploy:prod` empties.

## The sandbox

One throwaway container per phase (`npm-sandbox.sh`, `sandbox.mjs`):

| Phase | Network | What runs |
|---|---|---|
| clone | yes | `git clone` and checkout; no repository code |
| install | yes | the lockfile's dependencies with `--ignore-scripts`: no package's lifecycle script runs while the network is open |
| build | **none** | the package's own `prepare` / `prepublishOnly` / build scripts, then `npm pack --offline` |
| after-build | **none** | only when that is not the published package and no publish hook calls `build`: `npm run build`, then `npm pack --offline` again |

`--ignore-scripts` alone does not keep a repository's code from running during
install. These ways are closed (`npm-sandbox.sh`, "no_repo_code"), each found by
running it against the sandbox:

| What the repository commits | What it made the package manager do | Closed by |
|---|---|---|
| `.yarnrc` / `.yarnrc.yml` with `yarn-path` | yarn hands over to that script | `YARN_IGNORE_PATH=1` |
| `.pnpmfile.cjs` | pnpm loads its hooks | `--ignore-pnpmfile` |
| `.npmrc` with `git=` | npm calls that program for git dependencies | `npm_config_git` in the environment, which outranks `.npmrc` |
| `.npmrc` with `onload-script=` | npm 6 and older load that module at start | `npm_config_onload_script=false` |
| a dependency on a git repository | npm clones it and runs its `prepare` script, with or without `--ignore-scripts` (npm 6 and 10 both) | the package is not installed and fails (`manifest-check.js`) |
| a directory named `package.json` | Node loads its `index.js` when the manifest is `require`d | the manifest is read as data |

What the registry says is the publisher's word and is checked before it is used:
the npm version must be a plain version (it goes into `npm install -g npm@…`),
the package directory a plain path, a commit a full commit id.

`manifest-check.js` reads the manifests (the package's, the repository's, every
member's in a workspace: dependencies, peer and optional ones, overrides and
resolutions) and the lockfiles before the install. A dependency passes only in a
form known to be a registry version or a path in the repository; a git URL in
any spelling, `user/repo`, a remote tarball or a form the check does not know is
named in the log and the package fails.

This list is what was found, not a proof that there is no other way. One gap is
known: without a lockfile, a registry package that itself depends on a git
repository is only discovered by npm during the install. So the rule for the
host stays the container's: nothing in it is worth stealing, and it cannot write
outside its work directory.

On the host, what a build leaves behind is treated as hostile too: only a regular
file is read as the tarball (not a link, pipe or device), up to 256 MB and 1 GB
unpacked, and of the log only the first and last 100 kB are ever read or kept.
Files a build made unreadable are still counted against the disk limit and
removed.

All phases: unprivileged user, all capabilities dropped, `no-new-privileges`,
read-only root file system, only the work and output directories mounted,
memory, process, CPU, disk (polled) and time limits; the container is removed
by name on timeout. Source: the git tag the identity check matches, else the
commit the registry names. The package's directory in the repository is the one
the registry names; that field is optional, so when the package of that name is
not there (in a monorepo the root is another package) the clone step looks it
up by name among the repository's `package.json` files, and the version fails
when there is none or more than one. Toolchain: the publisher's Node major and
npm version.

What this does not give: a build that needs its dependencies' install scripts
(native add-ons compiled at install, binaries downloaded by a postinstall) or a
git dependency fails, and is recorded as failed, not retried with a network. The
container boundary is rootless podman's; for a hard boundary run the whole
utility inside a VM.

## Recipes

The generic build packs one package in its own directory. Many of the most
shared packages are not built that way: Babel builds 150 packages with one
`make` at the repository's root. A **recipe** writes down, once per source
repository, what its release build runs. One build of one commit then gives
every package the repository publishes from it, and each is compared with the
registry's file on its own.

A recipe is one JSON document in `recipes/` (`recipes/babel.json` is the first; `recipes/babel-node25.json` is the same build for the releases made on a newer Node):

| field | |
|---|---|
| `schema` | `1` |
| `id` | a short name; results are filed under it |
| `ecosystem` | `npm` |
| `repo` | the repository, a plain `https` URL |
| `packages` | the names it builds, `*` (at most two in a name) for any part of a name: `["@babel/*"]` |
| `versions` | optional `min` and `below` (`{"min": "7.22.5", "below": "7.28.5"}`): the releases this build is right for. Another range of the same repository is another recipe. |
| `ref` | optional: the tag of a version, `{version}` and `{name}` filled in (`v{version}`). Without it, the tag the identity check finds. |
| `image` | optional: an official Node image (`node:20-bookworm`). Without it, the major of the Node the publisher used. |
| `fetch` | commands that get the dependencies, run at the repository's root **with the network** |
| `build` | commands that build, run at the root **without a network** |
| `pack` | the command that packs one package, run in its directory without a network; writes the tarball to `$OUT`. Without it, `npm pack`. |
| `notes` | for readers: where the release process runs these commands, what does not reproduce and why |

A field that is not in this list is an error. The first recipe (by file name)
that covers a package version takes it.

What a recipe cannot do: say where a package is (the clone step finds it by
name, before any code of the repository runs), say what the result is (the
comparison is the host's, with the rules under [Result](#result)), or reach
the network while it builds or packs.

| Phase | Network | What runs |
|---|---|---|
| clone | yes | `git clone` and checkout of the commit the tag points at; no repository code |
| fetch | yes | the recipe's `fetch` commands |
| build | **none** | the recipe's `build` commands, then `pack` once per package |

The fetch step is where a recipe is trusted with more than the generic build:
the repository's own package manager, its plugins and its configuration run
with the network open (Babel's `yarn install` runs the Yarn release the
repository commits). That is the recipe author's statement that this repository
needs it, so who may add a recipe decides what runs there. The container is the
same as for every other phase.

A fetch step could also download the very package the build is supposed to
make. After the steps with a network, the host looks for the published
tarballs in the work directory and fails the build when one is there, or when
something there cannot be read. That finds the plain case only. The other half of the answer is that recipes are public: the feed names
the recipe of every result (`recipe`, the id and a hash of what it runs), and
anyone can read what it fetched.

Versions the recipe covers are grouped by the commit their tag points at, and
the build that settles the most wallets runs first. In `serve`, recipe builds
come before single versions. A version stays with its result until someone
reproduces it or the recipe changes: a changed recipe is filed under another
hash, so what failed with the old one is built again. A failed clone or fetch
gets one more try a day later, as in the generic build. Results of the generic
build (`failed`, `unsupported`) never keep a recipe from trying. The other way
round, a recipe's failure keeps the generic build away only while that recipe is
in use: once it is changed, removed or its author off the list, a version no
recipe takes again goes back to the generic build.

A recipe covers versions by name, and some of those it cannot build: its
repository has no tag for the version, or no package of that name at the tag
(`@babel/*` also matches packages that live in other repositories). Those get
no result from the recipe. They are remembered (table `recipe_skips`), so they
are not planned again, and stay with the generic build.

### Recipes over Nostr

A recipe does not have to be a file here. Whoever is in
`config/recipe-authors.json` (a name and a public key in hex each) can publish
one as a signed event, and the rebuilder runs it without a merge request:

```
DEP_RECIPE_NSEC=nsec1... node index.mjs publish my-recipe.json
node index.mjs recipes          # what is in use, and where each came from
```

The event is a code snippet (kind 1337, NIP-C0) with the tags `t=ws-dep-recipe`
and `c=walletscrutiny`; its content is the recipe. The rebuilder asks the relays
(`DEP_REBUILDER_RECIPE_RELAYS`, default `wss://relay.nostr.info/`) for such
events of the listed keys at start and then hourly, and takes one when its
signature verifies, its author is listed and its content is a valid recipe. The
relay is not trusted: it cannot make an event, and withholding one changes
nothing once it was seen. The newest event per recipe is kept in the database
(table `recipe_events`), so a relay that is down, has lost the event or serves
an older one leaves the recipe as it is. This needs Node 22 or later (its
`WebSocket`); on an older Node only the files of `recipes/` are used.

- The newest event per recipe `id` is the recipe. To change one, publish it
  again under the same `id`. A recipe cannot be deleted, only replaced: a
  deleted one is one a relay could bring back. One dated more than ten minutes
  ahead is not taken.
- A file in `recipes/` wins over an event with the same `id`, and files come
  first when two recipes cover a package.
- The feed names the event of every result (`recipeEvent`), so a reader can
  fetch exactly what was run and by whose key.

**What the list grants.** A listed key can make the build server run commands
of its choosing in the sandbox, in the fetch step with the network open. That
is the same as merging a recipe file, without the review. So the list is short,
it is changed only by a merge request, and removing a key stops its recipes at
the next start (results already recorded stay; `DELETE FROM rebuilds WHERE
recipe_event = ...` takes them back). The events seen from a key are kept, so
if it returns to the list, nothing older than those is taken from it. A key that leaks is a key to remove. An
empty or missing list runs no signed recipe.

### Writing a recipe

```
node index.mjs sync                                        # once: which versions wallets ship
node index.mjs try my-recipe.json --version 7.27.1         # every package the recipe covers that wallets ship at this version
node index.mjs try my-recipe.json --package @babel/core@7.27.1 --package @babel/parser@7.27.1
```

`try` saves nothing. It prints every package's result, the log, and the
directory with the rebuilt tarballs (`<n>.tgz`, numbered as the log's
`== pack <n> <directory>` lines), to compare with the registry's by hand; the
checkout is not kept. The
skill `.agents/skills/dependency-recipe` is the procedure for an agent.

## Result

`reproduced` when every file of the registry tarball is byte-identical to the
rebuilt one (tar metadata and gzip ignored, as OSS Rebuild does), or when the
files differ only in their line endings (the same content packed from a Windows
checkout; the note says "identical apart from line endings"); otherwise
`failed` with the reason (differing files, and whether they differ in line
endings, docs or dev-only package.json fields only; or the step that failed).

Only `reproduced` is published. `failed` says that the build this utility ran
did not give the published file, not that the package cannot be reproduced:
the publisher may have used another command, tool version or a build of the
whole repository. So failures stay in the database with their reason, as the
list of what needs a recipe, and show nowhere on the website; the source
analysis takes no other row from the feed and shows no failed rebuild of ours.

What a result says about the package (`node index.mjs status` counts them,
`node index.mjs verdicts [--verdict V]` lists them, most wallets first). None of
it is published:

| verdict | when |
|---|---|
| `reproduced` | as above |
| `almost` | it differs, but only in docs or dev-only `package.json` fields (with or without line endings) |
| `not-reproducible` | a recipe, the publisher's release build written down, finished and what it packed differs |
| `unknown-command` | the generic build finished and differs: the command was a guess, the publisher may build another way |
| `unknown-no-output` | a step failed (no source or tag, clone, install, build), so there was nothing to compare |
| `unknown-unsupported` | `unsupported` below: waits for a recipe |

So a version is called not reproducible only once someone wrote down how its
publisher builds it. Until then, a failure is something we don't know how to
build yet.

A `build` script is no lifecycle script: npm never runs it by itself, and many
publishers run it by hand or in CI before `npm publish` (`@noble/hashes`:
`tsc`). When no publish hook (`prepare`, `prepack`, `prepublish`,
`prepublishOnly`) calls it and the package as packed is not the published one,
a further step runs `npm run build` and packs again. That package is judged
then, and the note says "after `npm run build`". A step that fails changes
nothing.

`unsupported` when the package is a member of a workspace (a directory below a
root with `workspaces`, `pnpm-workspace.yaml` or `lerna.json`) and what its own
directory gives is not the published package. Such packages are built by the
repository's root: Babel's `make prepublish-build` builds 150 packages at once,
writes each `LICENSE` and rewrites each `package.json`. That build is not run
here, so the comparison would be between the published package and bare source,
and says nothing about the package. These rows stay in the database (the log
line starts with `–`) and are not built again.
A member that needs no build still comes out `reproduced`.
The comparison and wording are `source_analysis/rebuildNpm.mjs`'s, which this
reuses. The results leave the machine only as `rebuilds.json` (above).

## Tests

`npm test`
