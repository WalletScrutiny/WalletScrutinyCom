#!/bin/bash
# Runs inside the sandbox containers (rebuild.mjs) as an unprivileged user.
# Three phases, each its own container:
#   clone    network; git only, no repository code runs. Source into /work/src.
#   install  network; dependencies from the repository's lockfile with
#            --ignore-scripts, so no package's lifecycle script runs while the
#            network is open.
#   build    NO network. The package's own scripts (prepare, prepublishOnly,
#            build) run here, then npm pack into /out. Whatever a library does
#            at this point, it cannot reach out or fetch a second stage.
# Inputs: REPO, REF, DIR (package directory in the repo), NPMV (publisher's npm).
set -eu
export HOME=/work/home GIT_TERMINAL_PROMPT=0 npm_config_cache=/work/npm-cache npm_config_prefix=/work/npm-global
export npm_config_fund=false npm_config_update_notifier=false npm_config_audit=false CI=true
export PATH="/work/npm-global/bin:$PATH"
mkdir -p "$HOME"
PKG="/work/src/${DIR:-.}"
has_build_scripts() {
  node -e 'const s=require(process.argv[1]+"/package.json").scripts||{};console.log(["prepare","prepack","prepublish","prepublishOnly","build"].some(k=>s[k])?1:0)' "$PKG"
}

case "${PHASE:?}" in
clone)
  echo "== source $REPO $REF ${DIR:-.}"
  git clone --quiet --filter=blob:none --no-checkout "$REPO" /work/src
  cd /work/src && git -c advice.detachedHead=false checkout --quiet "$REF"
  git log -1 --format='commit %H %cI'
  ;;
install)
  cd /work/src
  if [ -n "$NPMV" ] && [ "$NPMV" != "$(npm -v)" ]; then echo "== npm $NPMV"; npm install -g --ignore-scripts "npm@$NPMV" 2>&1 | tail -n 3 || echo "could not install npm $NPMV, staying on $(npm -v)"; fi
  echo "== node $(node -v) npm $(npm -v)"
  if [ "$(has_build_scripts)" = 1 ]; then
    if [ -f pnpm-lock.yaml ]; then echo "== pnpm install --ignore-scripts"; npm install -g --ignore-scripts pnpm@8 >/dev/null 2>&1; pnpm install --frozen-lockfile --ignore-scripts
    elif [ -f yarn.lock ]; then echo "== yarn install --ignore-scripts"; npm install -g --ignore-scripts yarn@1 >/dev/null 2>&1; yarn install --frozen-lockfile --ignore-scripts
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
  # npm before 7 has no --pack-destination: pack here, then move the newest
  # tarball. A publisher's npm too old for this Node packs nothing; then the
  # image's own npm packs, and the log says so.
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
  mv "$tgz" /out/
  ;;
*) echo "unknown phase $PHASE"; exit 2;;
esac
