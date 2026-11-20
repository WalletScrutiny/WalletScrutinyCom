#!/bin/bash
# Runs inside the sandbox containers (rebuild.mjs) as an unprivileged user.
# Three phases, each its own container:
#   clone    network; git only, no repository code runs. Source into /work/src.
#   install  network; dependencies from the repository's lockfile with
#            --ignore-scripts, so no package's lifecycle script runs while the
#            network is open. The repository's own configuration files can
#            also name code for the package manager to run (see "no_repo_code"
#            below); the known ways are switched off.
#   build    NO network. The package's own scripts (prepare, prepublishOnly,
#            build) run here, then npm pack into /out. Whatever a library does
#            at this point, it cannot reach out or fetch a second stage.
# Inputs: REPO, REF, DIR (package directory in the repo), NPMV (publisher's npm).
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
#                          whatever --ignore-scripts says                -> not installed (git_dependency)
# The environment outranks the repository's .npmrc. npm itself is asked for its
# version and updated from /work, where there is no .npmrc of the repository.
export YARN_IGNORE_PATH=1 npm_config_git=git
npm_version() { (cd /work && npm -v); }
# npm 6 or older: the publisher's, or the image's up to Node 14 (newer ones warn about the unknown setting)
case "${NPMV:-}:$(node -p 'process.versions.node')" in [0-6].*|*:[0-9].*|*:1[0-4].*) export npm_config_onload_script=false;; esac
mkdir -p "$HOME"
PKG="/work/src/${DIR:-.}"
has_build_scripts() {
  node -e 'const s=require(process.argv[1]+"/package.json").scripts||{};console.log(["prepare","prepack","prepublish","prepublishOnly","build"].some(k=>s[k])?1:0)' "$PKG"
}
# Prints the first dependency on a git repository that package.json or a lockfile
# names (written for the oldest Node image). One that only an unlocked dependency
# of a dependency brings in is not seen.
git_dependency() {
  node -e '
var fs = require("fs"), path = require("path");
var SPEC = /^(git\+|git:\/\/|ssh:\/\/|github:|gitlab:|bitbucket:)|^[\w.-]+\/[\w.-]+(#.*)?$/;
var LOCKS = {
  "package-lock.json": /"(?:version|resolved|from)":\s*"[^"]*(?:git\+|git:\/\/|github:|gitlab:|bitbucket:)[^"]*"/,
  "npm-shrinkwrap.json": /"(?:version|resolved|from)":\s*"[^"]*(?:git\+|git:\/\/|github:|gitlab:|bitbucket:)[^"]*"/,
  "yarn.lock": /^\s+resolved "(?:git\+|git:\/\/|ssh:\/\/)\S+/m,
  "pnpm-lock.yaml": /^.*\btype: git\b.*$/m
};
var dirs = ["/work/src", path.resolve(process.argv[1])], hit = null;
dirs.forEach(function (dir) {
  try {
    var p = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    ["dependencies", "devDependencies", "optionalDependencies"].forEach(function (k) {
      Object.keys(p[k] || {}).forEach(function (n) { if (!hit && typeof p[k][n] === "string" && SPEC.test(p[k][n])) hit = n + "@" + p[k][n]; });
    });
  } catch (e) { /* no package.json here: the install will say so */ }
  Object.keys(LOCKS).forEach(function (f) {
    var m = null;
    try { m = LOCKS[f].exec(fs.readFileSync(path.join(dir, f), "utf8")); } catch (e) { /* no such lockfile */ }
    if (!hit && m) hit = f + ": " + m[0].trim();
  });
});
if (hit) console.log(hit.slice(0, 200));
' "$PKG"
}

case "${PHASE:?}" in
clone)
  echo "== source $REPO $REF ${DIR:-.}"
  git clone --quiet --filter=blob:none --no-checkout "$REPO" /work/src
  cd /work/src && git -c advice.detachedHead=false checkout --quiet "$REF"
  git log -1 --format='commit %H %cI'
  ;;
install)
  cd /work
  if [ -n "$NPMV" ] && [ "$NPMV" != "$(npm_version)" ]; then echo "== npm $NPMV"; npm install -g --ignore-scripts "npm@$NPMV" 2>&1 | tail -n 3 || echo "could not install npm $NPMV, staying on $(npm_version)"; fi
  echo "== node $(node -v) npm $(npm_version)"
  cd /work/src
  if [ "$(has_build_scripts)" = 1 ]; then
    gitdep=$(git_dependency)
    if [ -n "$gitdep" ]; then echo "Error: depends on a git repository, which npm would build with the network open ($gitdep)"; exit 3; fi
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
