#!/bin/bash
# Runs inside the rebuild container (rebuildNpm.mjs) as an unprivileged user.
# /work is the scratch dir, /out gets the packed tarball. A monorepo package
# installs at the repository root, where its lockfile is, and packs in its own
# directory. Inputs: REPO, REF, DIR (package directory in the repo), NPMV.
set -eu
export HOME=/work/home npm_config_cache=/work/npm-cache npm_config_prefix=/work/npm-global
export npm_config_fund=false npm_config_update_notifier=false npm_config_audit=false CI=true GIT_TERMINAL_PROMPT=0
export PATH="/work/npm-global/bin:$PATH"
mkdir -p "$HOME"
echo "== source $REPO $REF ${DIR:-.}"
git clone --quiet --filter=blob:none --no-checkout "$REPO" /work/src
cd /work/src && git -c advice.detachedHead=false checkout --quiet "$REF"
git log -1 --format='commit %H %cI'
if [ -n "$NPMV" ] && [ "$NPMV" != "$(npm -v)" ]; then echo "== npm $NPMV"; npm install -g "npm@$NPMV" 2>&1 | tail -n 3 || echo "could not install npm $NPMV, staying on $(npm -v)"; fi
echo "== node $(node -v) npm $(npm -v)"
PKG="/work/src/${DIR:-.}"
needs_build=$(node -e 'const s=require(process.argv[1]+"/package.json").scripts||{};console.log(["prepare","prepack","prepublish","prepublishOnly","build"].some(k=>s[k])?1:0)' "$PKG")
if [ "$needs_build" = 1 ]; then
  if [ -f pnpm-lock.yaml ]; then echo "== pnpm install"; npx --yes pnpm@8 install --frozen-lockfile
  elif [ -f yarn.lock ]; then echo "== yarn install"; npx --yes yarn@1 install --frozen-lockfile
  elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then echo "== npm ci"; npm ci
  else echo "== npm install (no lockfile)"; npm install; fi
  cd "$PKG"
  if [ "$PKG" != "/work/src/." ] && [ ! -d node_modules ] && [ -f package-lock.json ]; then npm ci; fi
  npm run --if-present prepublishOnly
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
