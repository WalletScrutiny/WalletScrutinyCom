#!/bin/bash
# Runs inside the rebuild containers (rebuildNpm.mjs) as an unprivileged user.
# PHASE=clone runs in a current image and checks the source out into
# /work/src; PHASE=build runs in the publisher's Node image, whose git may be
# too old for today's hosts. /out gets the packed tarball. A monorepo package
# installs at the repository root, where its lockfile is, and packs in its own
# directory. Inputs: REPO, REF, DIR (package directory in the repo), NPMV.
set -eu
if [ "${PHASE:-build}" = clone ]; then
  export HOME=/work/home GIT_TERMINAL_PROMPT=0; mkdir -p "$HOME"
  echo "== source $REPO $REF ${DIR:-.}"
  git clone --quiet --filter=blob:none --no-checkout "$REPO" /work/src
  cd /work/src && git -c advice.detachedHead=false checkout --quiet "$REF"
  git log -1 --format='commit %H %cI'
  exit 0
fi
export HOME=/work/home npm_config_cache=/work/npm-cache npm_config_prefix=/work/npm-global
export npm_config_fund=false npm_config_update_notifier=false npm_config_audit=false CI=true GIT_TERMINAL_PROMPT=0
export PATH="/work/npm-global/bin:$PATH"
mkdir -p "$HOME"
cd /work/src
if [ -n "$NPMV" ] && [ "$NPMV" != "$(npm -v)" ]; then echo "== npm $NPMV"; npm install -g "npm@$NPMV" 2>&1 | tail -n 3 || echo "could not install npm $NPMV, staying on $(npm -v)"; fi
echo "== node $(node -v) npm $(npm -v)"
PKG="/work/src/${DIR:-.}"
needs_build=$(node -e 'const s=require(process.argv[1]+"/package.json").scripts||{};console.log(["prepare","prepack","prepublish","prepublishOnly","build"].some(k=>s[k])?1:0)' "$PKG")
if [ "$needs_build" = 1 ]; then
  # npm ci exists from npm 5.7; older npm installs from the lockfile with install
  if [ -f pnpm-lock.yaml ]; then echo "== pnpm install"; npm install -g pnpm@8 >/dev/null 2>&1; pnpm install --frozen-lockfile
  elif [ -f yarn.lock ]; then echo "== yarn install"; npm install -g yarn@1 >/dev/null 2>&1; yarn install --frozen-lockfile
  elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then echo "== npm ci"; npm ci || npm install
  else echo "== npm install (no lockfile)"; npm install; fi
  cd "$PKG"
  if [ "$PKG" != "/work/src/." ] && [ ! -d node_modules ] && [ -f package-lock.json ]; then npm ci || npm install; fi
  # prepublishOnly often runs tests or pushes tags; a failure there is logged, not fatal
  npm run --if-present prepublishOnly || echo "== prepublishOnly failed, packing anyway"
else
  echo "== no build scripts: packing the source as it is"; cd "$PKG"
fi
# npm before 7 has no --pack-destination: pack here, then move the newest
# tarball. A publisher's npm too old for this Node packs nothing; then the
# image's own npm packs, and the log says so.
touch /work/pack-start
npm pack 2>&1 | tail -n 5
tgz=$(find . -maxdepth 1 -name '*.tgz' -newer /work/pack-start | head -n 1)
if [ -z "$tgz" ] && [ -d /work/npm-global/bin ]; then
  export PATH="${PATH#/work/npm-global/bin:}"
  echo "== npm $NPMV packed nothing, packing with the image's npm $(npm -v)"
  npm pack 2>&1 | tail -n 5
  tgz=$(find . -maxdepth 1 -name '*.tgz' -newer /work/pack-start | head -n 1)
fi
echo "== packed $tgz"
mv "$tgz" /out/
