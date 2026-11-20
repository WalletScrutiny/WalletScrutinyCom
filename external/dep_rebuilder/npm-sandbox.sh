#!/bin/bash
# Runs inside the sandbox containers (rebuild.mjs) as an unprivileged user.
# Three phases, each its own container, and a fourth when the result is not the published package:
#   clone    network; git only, no repository code runs. Source into /work/src.
#   install  network; dependencies from the repository's lockfile with
#            --ignore-scripts, so no package's lifecycle script runs while the
#            network is open. The repository's own configuration files can
#            also name code for the package manager to run (see "no_repo_code"
#            below); the known ways are switched off.
#   build    NO network. The package's own scripts (prepare, prepublishOnly,
#            build) run here, then npm pack into /out. Whatever a library does
#            at this point, it cannot reach out or fetch a second stage.
#   after-build  NO network. `npm run build` when no publish hook calls it, then
#            npm pack again.
# Inputs: REPO, REF, NAME (the package), DIR (its directory in the repo), NPMV (publisher's npm).
set -eu
export HOME=/work/home GIT_TERMINAL_PROMPT=0 npm_config_cache=/work/npm-cache npm_config_prefix=/work/npm-global
export npm_config_fund=false npm_config_update_notifier=false npm_config_audit=false CI=true
export PATH="/work/npm-global/bin:$PATH"
# no_repo_code: files a repository can commit that make the package manager run
# the repository's code, which must not happen while the network is open.
#   .yarnrc / .yarnrc.yml  yarn-path: yarn hands over to that script   -> YARN_IGNORE_PATH
#   .npmrc git=            the program npm calls for git dependencies -> npm_config_git
#   .npmrc onload-script=  a module npm 6 and older load at start     -> npm_config_onload_script
#   .pnpmfile.cjs          hooks pnpm loads on install                 -> --ignore-pnpmfile
#   a git dependency       npm clones it and runs its prepare script,
#                          whatever --ignore-scripts says                -> not installed (manifest-check.js)
# The environment outranks the repository's .npmrc. npm itself is asked for its
# version and updated from /work, where there is no .npmrc of the repository.
export YARN_IGNORE_PATH=1 npm_config_git=git
npm_version() { (cd /work && npm -v); }
# npm 6 or older: the publisher's, or the image's up to Node 14 (newer ones warn about the unknown setting)
case "${NPMV:-}:$(node -p 'process.versions.node')" in [0-6].*|*:[0-9].*|*:1[0-4].*) export npm_config_onload_script=false;; esac
mkdir -p "$HOME"
PKG="/work/src/${DIR:-.}"
# The repository's manifests are read by manifest-check.js (sandbox.mjs puts its text here).
manifest() { node -e '__MANIFEST_CHECK__' "$@"; }
has_build_scripts() { manifest scripts "$PKG"; }

# npm before 7 has no --pack-destination: pack here, then move the newest
# tarball. A publisher's npm too old for this Node packs nothing; then the
# image's own npm packs, and the log says so.
pack_to() {
  touch /work/pack-start
  npm pack --offline 2>&1 | tail -n 5
  tgz=$(find . -maxdepth 1 -name '*.tgz' -newer /work/pack-start | head -n 1)
  if [ -z "$tgz" ] && [ -d /work/npm-global/bin ]; then
    export PATH="${PATH#/work/npm-global/bin:}"
    echo "== npm $NPMV packed nothing, packing with the image's npm $(npm -v)"
    npm pack --offline 2>&1 | tail -n 5
    tgz=$(find . -maxdepth 1 -name '*.tgz' -newer /work/pack-start | head -n 1)
  fi
  echo "== packed $tgz"
  mv "$tgz" "$1"
}

case "${PHASE:?}" in
clone)
  echo "== source $REPO $REF ${DIR:-.}"
  git clone --quiet --filter=blob:none --no-checkout "$REPO" /work/src
  cd /work/src && git -c advice.detachedHead=false checkout --quiet "$REF"
  git log -1 --format='commit %H %cI'
  # Said here, before any code of the repository has run: rebuild.mjs takes these from this step only.
  # The package is looked up by name when it is not where the registry says: the registry's
  # directory is optional, and without it the root of a monorepo, another package, would be packed.
  at=$(manifest locate /work/src "$PKG" "$NAME")
  if [ -n "$at" ]; then echo "== package directory: $at"; [ "$at" = "?" ] || PKG="/work/src/$at"; fi
  if [ "$(manifest workspace /work/src "$PKG")" = 1 ]; then echo "== workspace member: the repository's root build is not run"; fi
  ;;
install)
  cd /work
  if [ -n "$NPMV" ] && [ "$NPMV" != "$(npm_version)" ]; then echo "== npm $NPMV"; npm install -g --ignore-scripts "npm@$NPMV" 2>&1 | tail -n 3 || echo "could not install npm $NPMV, staying on $(npm_version)"; fi
  echo "== node $(node -v) npm $(npm_version)"
  cd /work/src
  if [ "$(has_build_scripts)" = 1 ]; then
    other=$(manifest sources /work/src "$PKG")
    if [ -n "$other" ]; then echo "Error: a dependency that is not from a registry, which npm may build with the network open ($other)"; exit 3; fi
    if [ -f pnpm-lock.yaml ]; then echo "== pnpm install --ignore-scripts"; (cd /work && npm install -g --ignore-scripts pnpm@8 >/dev/null 2>&1); pnpm install --frozen-lockfile --ignore-scripts --ignore-pnpmfile
    elif [ -f yarn.lock ]; then echo "== yarn install --ignore-scripts"; (cd /work && npm install -g --ignore-scripts yarn@1 >/dev/null 2>&1); yarn install --frozen-lockfile --ignore-scripts
    elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then echo "== npm ci --ignore-scripts"; npm ci --ignore-scripts || npm install --ignore-scripts
    else echo "== npm install --ignore-scripts (no lockfile)"; npm install --ignore-scripts; fi
    cd "$PKG"
    if [ "$PKG" != "/work/src/." ] && [ ! -d node_modules ] && [ -f package-lock.json ]; then npm ci --ignore-scripts || npm install --ignore-scripts; fi
  else
    echo "== no build scripts: nothing to install"
  fi
  ;;
build)
  cd "$PKG"
  echo "== node $(node -v) npm $(npm -v) (offline)"
  if [ "$(has_build_scripts)" = 1 ]; then
    # prepublishOnly often runs tests or pushes tags; a failure there is logged, not fatal
    npm run --if-present prepublishOnly || echo "== prepublishOnly failed, packing anyway"
  else
    echo "== no build scripts: packing the source as it is"
  fi
  pack_to /out/
  ;;
after-build)
  # Only when what the build step packed is not the published package (rebuild.mjs).
  # A "build" script that no publish hook calls: npm never runs it by itself, the
  # publisher does, by hand or in CI before `npm publish`.
  cd "$PKG"
  if [ "$(manifest unhooked-build "$PKG")" != 1 ]; then echo "== no build script that the publish hooks leave out"; exit 0; fi
  echo "== npm run build (no publish hook calls it)"
  npm run build
  pack_to /out/after-build.tgz
  ;;
*) echo "unknown phase $PHASE"; exit 2;;
esac
