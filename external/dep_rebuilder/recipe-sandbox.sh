#!/bin/bash
# Runs inside the sandbox containers of a recipe (rebuild-recipe.mjs) as an
# unprivileged user. Three phases, each its own container:
#   clone  network; git only, no repository code runs. Source into /work/src,
#          and where each wanted package is (manifest-check.js, locate-all).
#   fetch  network; the recipe's fetch commands, in the repository's root. This
#          is where a recipe differs from the generic build (npm-sandbox.sh):
#          the repository's own package manager and its configuration run with
#          the network open, because the recipe's author says this repository
#          needs that.
#   build  NO network. The recipe's build commands in the repository's root,
#          then its pack command in each package's directory, with OUT naming
#          the file to write.
# Inputs: REPO, REF, WANTED (lines "<n> <name>"), FETCH, BUILD, PACK, DIRS (lines "<n> <directory>").
set -eu
export HOME=/work/home GIT_TERMINAL_PROMPT=0 npm_config_cache=/work/npm-cache
export npm_config_fund=false npm_config_update_notifier=false npm_config_audit=false CI=true
mkdir -p "$HOME"
run() { bash -eu -o pipefail -c "$1" </dev/null; }

case "${PHASE:?}" in
clone)
  echo "== source $REPO $REF"
  git clone --quiet --filter=blob:none --no-checkout "$REPO" /work/src
  cd /work/src && git -c advice.detachedHead=false checkout --quiet "$REF"
  git log -1 --format='commit %H %cI'
  # Said here, before any code of the repository has run: rebuild-recipe.mjs takes these from this step only.
  node -e '__MANIFEST_CHECK__' locate-all /work/src
  ;;
fetch)
  cd /work/src
  echo "== node $(node -v) npm $(npm -v)"
  run "$FETCH"
  ;;
build)
  cd /work/src
  echo "== node $(node -v) npm $(npm -v) (offline)"
  run "$BUILD"
  # one package that does not pack must not cost the others their result (nor read their list: 3<&-)
  while read -r n dir <&3; do
    [ -n "$n" ] || continue
    echo "== pack $n $dir"
    (cd "/work/src/$dir" && OUT="/out/$n.tgz" run "$PACK") 3<&- || echo "== pack $n failed"
  done 3<<LIST
$DIRS
LIST
  ;;
*) echo "unknown phase $PHASE"; exit 2;;
esac
