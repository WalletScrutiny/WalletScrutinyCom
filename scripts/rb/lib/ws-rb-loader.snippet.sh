# ---- WalletScrutiny library (GitLab #1023), pinned by sha256 ------------------
# Goes in each build script right after its self-hash line, before anything else.
# Sources, in order: WS_LIB_FILE (offline, must match), cache, GitLab by commit,
# Blossom by hash. A wrong hash is rejected whichever source sent it.
# No matching copy, or a different version inside: no verdict, no YAML, exit 2.
# First, before anything can fail: no earlier verdict may survive this run.
rm -f -- "$(dirname "$(readlink -f "$0")")/COMPARISON_RESULTS.yaml"
WS_LIB=ws-rb-core WS_LIB_VERSION=1.0.0
WS_LIB_REV=__COMMIT__ WS_LIB_SHA256=__SHA256__
ws_lib_load() {
  local c="${XDG_CACHE_HOME:-$HOME/.cache}/ws-rb-lib" f u
  f="${WS_LIB_FILE:-$c/$WS_LIB_SHA256.sh}"
  ws_lib_ok() { [ "$(sha256sum "$1" 2>/dev/null | cut -d' ' -f1)" = "$WS_LIB_SHA256" ]; }
  if ! ws_lib_ok "$f"; then
    [ -z "${WS_LIB_FILE:-}" ] || { echo "[FAIL] WS_LIB_FILE $f is not sha256 $WS_LIB_SHA256: no verdict" >&2; exit 2; }
    mkdir -p "$c" 2>/dev/null || true
    for u in "https://gitlab.com/walletscrutiny/walletScrutinyCom/-/raw/$WS_LIB_REV/scripts/rb/lib/$WS_LIB-$WS_LIB_VERSION.sh" \
             "https://files.nostr.info/$WS_LIB_SHA256"; do
      curl -fsSL --max-time 60 -o "$f.$$" "$u" 2>/dev/null && ws_lib_ok "$f.$$" && mv -f "$f.$$" "$f" && break
      rm -f "$f.$$"
    done
  fi
  ws_lib_ok "$f" || { echo "[FAIL] $WS_LIB $WS_LIB_VERSION ($WS_LIB_SHA256) unavailable or altered: no verdict" >&2; exit 2; }
  . "$f"
  [ "${WS_LIB_LOADED_VERSION:-}" = "$WS_LIB_VERSION" ] || { echo "[FAIL] $f holds ${WS_LIB_LOADED_VERSION:-no version}, not $WS_LIB_VERSION: no verdict" >&2; exit 2; }
  echo "Library: $WS_LIB $WS_LIB_VERSION sha256: $WS_LIB_SHA256"
}
ws_lib_load
