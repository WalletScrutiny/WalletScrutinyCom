# ws-rb-core 1.0.0 - shared steps for WalletScrutiny reproducible-build scripts
# Organization: WalletScrutiny.com
# Loaded by a build script through the standard loader, pinned by sha256 (GitLab #1023).
# Never run on its own; it only defines functions and variables.
# Disclaimer: for reproducible-build verification and research only. No warranty.
#
# What it provides (all names start with ws_ or WS_):
#   logging          ws_info ws_warn ws_error ws_ok ws_section
#   exits            ws_no_verdict ws_invalid ws_refuse_root ws_install_traps
#   engine           ws_engine ws_ctr  (podman if it works, else docker if it works)
#   workspace        ws_workspace ws_sanitize ws_track_image ws_track_container
#   results          ws_results_init ws_write_yaml ws_install_yaml ws_results_block ws_diff_preview
#   arguments        ws_require_value ws_unknown_arg
#   files            ws_sha256 ws_fetch ws_git_checkout
# Exit codes: 0 reproducible; 1 not reproducible, ftbfs or a failure with no verdict;
# 2 invalid parameters; 130 stopped. A YAML is written only for a real verdict.

WS_LIB_LOADED_VERSION="1.0.0"
WS_LIB_NAME="ws-rb-core"

WS_EXIT_OK=0
WS_EXIT_FAIL=1
WS_EXIT_INVALID=2

# Set by the calling script before or after loading; defaults keep set -u happy.
: "${SCRIPT_VERSION:=N/A}" "${SCRIPT_SHA256:=N/A}"
: "${WS_LIB_VERSION:=$WS_LIB_LOADED_VERSION}" "${WS_LIB_SHA256:=N/A}"
WS_SCRIPT_DIR="${WS_SCRIPT_DIR:-$(dirname "$(readlink -f "$0")")}"
WS_CALLER_DIR="${WS_CALLER_DIR:-$(pwd -P)}"
WS_RESULTS_FILE="${WS_RESULTS_FILE:-${WS_SCRIPT_DIR}/COMPARISON_RESULTS.yaml}"
WS_RUN_ID="${WS_RUN_ID:-$(date +%s)-$$}"
WS_ENGINE="${WS_ENGINE:-}"
WS_WORKDIR=""
WS_RESULTS_WRITTEN=0
WS_KEEP="${WS_KEEP:-0}"          # 1 keeps this run's containers and images
WS_CHOWN_IMAGE="${WS_CHOWN_IMAGE:-}"
WS_COMMIT=""
WS_TAG_TYPE=""
WS_IMAGES=()
WS_CONTAINERS=()
WS_NO_VERDICT=0
WS_LOCK_DIR=""

# ---- Logging (plain text; the results block never uses these) ---------------
if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
  WS_C_Y=$'\033[1;33m' WS_C_G=$'\033[1;32m' WS_C_R=$'\033[1;31m' WS_C_0=$'\033[0m'
else
  WS_C_Y="" WS_C_G="" WS_C_R="" WS_C_0=""
fi
ws_info()    { echo "[INFO] $*"; }
ws_warn()    { echo "${WS_C_Y}[WARN] $*${WS_C_0}"; }
ws_error()   { echo "${WS_C_R}[ERROR] $*${WS_C_0}" >&2; }
ws_ok()      { echo "${WS_C_G}[OK] $*${WS_C_0}"; }
ws_section() { echo; echo "=== $* ==="; }

# ---- Exits ------------------------------------------------------------------
# A failure that says nothing about the source (runtime, network, host tools,
# a wrong official file). Writes no YAML, so ABS publishes nothing.
ws_no_verdict() {
  WS_NO_VERDICT=1
  ws_error "$1"
  echo "${WS_C_R}No verdict written (this is not a build failure of the source).${WS_C_0}" >&2
  exit "$WS_EXIT_FAIL"
}

# Invalid parameters: exit 2, no YAML.
ws_invalid() {
  ws_error "$1"
  exit "$WS_EXIT_INVALID"
}

# WS rule: runs as a normal user. (Do not write the privilege tool's name here:
# ABS refuses any script or library whose text contains it.)
ws_refuse_root() {
  [[ "$(id -u)" -ne 0 ]] || ws_invalid "do not run this script as root"
}

# Any unguarded command failure is a script or host problem, never a verdict.
ws_on_err() {
  local rc=$?
  trap - ERR
  ws_no_verdict "unexpected error (exit ${rc}) during verification"
}

# EXIT trap, in this order: the script's own hook; this run's containers
# (so nothing still writes into the workspace); ownership hand-back (the
# images are still there for docker's chown); this run's images; the lock.
# A run stopped (130) or ended with no verdict after it wrote a YAML takes
# that YAML back, so ABS never publishes it. Never changes the exit code.
ws_on_exit() {
  local rc=$? x
  trap - ERR
  trap '' INT TERM
  if declare -F ws_cleanup_hook >/dev/null; then ws_cleanup_hook || true; fi
  if [[ -n "$WS_ENGINE" && "$WS_KEEP" != 1 ]]; then
    for x in "${WS_CONTAINERS[@]}"; do ws_ctr rm -f "$x" &>/dev/null || true; done
  fi
  ws_hand_back
  if [[ -n "$WS_ENGINE" && "$WS_KEEP" != 1 ]]; then
    for x in "${WS_IMAGES[@]}"; do ws_ctr rmi -f "$x" &>/dev/null || true; done
  fi
  if [[ "$WS_RESULTS_WRITTEN" == 1 && ( "$rc" == 130 || "$WS_NO_VERDICT" == 1 ) ]]; then
    rm -f -- "$WS_RESULTS_FILE"
    WS_RESULTS_WRITTEN=0
    ws_warn "Run stopped or failed after the verdict was written: COMPARISON_RESULTS.yaml removed."
  fi
  [[ -z "$WS_LOCK_DIR" ]] || rm -rf -- "$WS_LOCK_DIR"
  [[ "$WS_RESULTS_WRITTEN" == 1 ]] || ws_warn "No COMPARISON_RESULTS.yaml written for this run."
  echo "Exit code: ${rc}"
  exit "$rc"
}

ws_install_traps() {
  set -E
  trap ws_on_err ERR
  trap ws_on_exit EXIT
  trap 'exit 130' INT TERM
}

# ---- Container engine ---------------------------------------------------------
# ws_ctr ARGS...: run the picked engine. Scripts call this, never docker or
# podman directly. Podman always gets cgroupfs: with systemd cgroups a rootless
# run can ask polkit for a systemd scope, which pops up password dialogs on a
# desktop and fails on a server.
ws_ctr() {
  case "$WS_ENGINE" in
    podman) podman --cgroup-manager=cgroupfs "$@" ;;
    docker) docker "$@" ;;
    *) ws_no_verdict "ws_ctr called before ws_engine" ;;
  esac
}

# ws_works ENGINE: installed, and `ENGINE info` answers within 60 s.
ws_works() {
  command -v "$1" >/dev/null 2>&1 || return 1
  local -a c=("$1")
  [[ "$1" != podman ]] || c+=(--cgroup-manager=cgroupfs)
  if command -v timeout >/dev/null 2>&1; then
    timeout 60 "${c[@]}" info >/dev/null 2>&1
  else
    "${c[@]}" info >/dev/null 2>&1
  fi
}

# Podman if it works for this user; otherwise docker, if its daemon answers.
# Podman first: on the build server wallet builds run on podman, while docker
# also serves other services. An installed binary is not enough: each is
# used only if `info` answers. A script that needs docker sets WS_ENGINE=docker.
ws_engine() {
  case "$WS_ENGINE" in
    docker|podman)
      ws_works "$WS_ENGINE" || ws_no_verdict "WS_ENGINE=$WS_ENGINE, but $WS_ENGINE is not installed or not usable by $(id -un)"
      ;;
    "")
      if ws_works podman; then
        WS_ENGINE=podman
      elif ws_works docker; then
        WS_ENGINE=docker
      elif command -v docker >/dev/null 2>&1 || command -v podman >/dev/null 2>&1; then
        ws_no_verdict "docker or podman is installed, but neither is usable by $(id -un) (\`docker info\` and \`podman info\` both fail)"
      else
        ws_no_verdict "neither docker nor podman found; install one of them"
      fi
      ;;
    *) ws_invalid "WS_ENGINE must be docker or podman, not '$WS_ENGINE'" ;;
  esac
  export WS_ENGINE
  echo "Container engine: $WS_ENGINE"
}

# Flags that make a container write files as the caller, not as root.
ws_user_flags() {
  if [[ "$WS_ENGINE" == podman ]]; then
    echo "--userns=keep-id"
  else
    echo "--user $(id -u):$(id -g)"
  fi
}

# ---- Workspace ----------------------------------------------------------------
# Lowercase, [a-z0-9.-] only, never empty.
ws_sanitize() {
  local s="${1,,}"
  s="$(printf '%s' "$s" | sed -E 's/[^a-z0-9.]+/-/g; s/^-+//; s/-+$//')"
  printf '%s' "${s:-na}"
}

# ws_workspace APP VERSION [EXTRA]: new per-run workspace in the caller's
# directory. Exclusive mkdir: never reuses or deletes another run's directory.
ws_workspace() {
  local name
  name="$(ws_sanitize "$1")_verification_$(ws_sanitize "$2")"
  [[ -z "${3:-}" ]] || name="${name}_$(ws_sanitize "$3")"
  name="${WS_CALLER_DIR}/${name}_${WS_RUN_ID}"
  # Set WS_WORKDIR only once the directory is ours: cleanup must never touch
  # a directory that already existed.
  mkdir "$name" 2>/dev/null || ws_no_verdict "cannot create a new workspace at $name"
  WS_WORKDIR="$name"
  echo "Workspace: $WS_WORKDIR"
}

ws_track_image()     { WS_IMAGES+=("$1"); [[ -n "$WS_CHOWN_IMAGE" ]] || WS_CHOWN_IMAGE="$1"; }
ws_track_container() { WS_CONTAINERS+=("$1"); }

# Hand every file under the workspace back to the caller (ABS has no way to
# delete files it does not own). Podman: map back from subuids. Docker: chown
# from inside a container, using an image this run already has.
ws_hand_back() {
  [[ -n "$WS_WORKDIR" && -d "$WS_WORKDIR" && -n "$WS_ENGINE" ]] || return 0
  local uid; uid="$(id -u)"
  [[ -n "$(find "$WS_WORKDIR" ! -uid "$uid" -print -quit 2>/dev/null)" ]] || return 0
  if [[ "$WS_ENGINE" == podman ]]; then
    ws_ctr unshare chown -R 0:0 "$WS_WORKDIR" &>/dev/null || true
  elif [[ -n "$WS_CHOWN_IMAGE" ]]; then
    ws_ctr run --rm --user 0:0 -v "$WS_WORKDIR:/w" --entrypoint chown "$WS_CHOWN_IMAGE" \
      -R "${uid}:$(id -g)" /w &>/dev/null || true
  fi
  if [[ -n "$(find "$WS_WORKDIR" ! -uid "$uid" -print -quit 2>/dev/null)" ]]; then
    ws_warn "Some files under $WS_WORKDIR are not owned by $(id -un)."
  fi
}

# ---- Results ------------------------------------------------------------------
# Call once, early: one run per script folder (all runs share the YAML path),
# and remove a stale YAML so ABS can never read an earlier run's verdict.
ws_results_init() {
  [[ -w "$WS_SCRIPT_DIR" ]] || ws_no_verdict "cannot write in ${WS_SCRIPT_DIR}, where COMPARISON_RESULTS.yaml goes"
  if command -v flock >/dev/null 2>&1; then
    { exec 9>"${WS_SCRIPT_DIR}/.comparison_results.lock"; } 2>/dev/null \
      || ws_no_verdict "cannot create the lock file in ${WS_SCRIPT_DIR}"
    flock -n 9 || ws_no_verdict "another verification is already running from ${WS_SCRIPT_DIR}; run this one after it, or from a copy of the script in another folder"
  else
    # No flock (e.g. macOS): an atomic mkdir lock holding our PID. A lock
    # whose PID is gone is stale and taken over once.
    local d="${WS_SCRIPT_DIR}/.comparison_results.lock.d" pid
    if ! mkdir "$d" 2>/dev/null; then
      pid="$(cat "$d/pid" 2>/dev/null || true)"
      if [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
        ws_no_verdict "another verification (PID $pid) is already running from ${WS_SCRIPT_DIR}; run this one after it, or from a copy of the script in another folder"
      fi
      rm -rf -- "$d"
      mkdir "$d" 2>/dev/null || ws_no_verdict "cannot take the lock in ${WS_SCRIPT_DIR}"
    fi
    echo "$$" > "$d/pid"
    WS_LOCK_DIR="$d"
  fi
  rm -f -- "$WS_RESULTS_FILE"
}

# ws_install_yaml SRC: make SRC this run's COMPARISON_RESULTS.yaml, atomically.
# SRC must hold a script_version line and one allowed verdict, or it is not a
# verdict: no YAML is installed and the run ends with no verdict.
ws_install_yaml() {
  local src="$1" tmp="${WS_RESULTS_FILE}.tmp.$$" v
  v="$(grep -c '^verdict: \(reproducible\|not_reproducible\|ftbfs\)$' "$src" 2>/dev/null || true)"
  if [[ "$v" != 1 ]] || ! grep -q '^script_version: ' "$src" 2>/dev/null; then
    ws_no_verdict "results file $src has no single valid verdict and script_version; not installed"
  fi
  cp "$src" "$tmp" 2>/dev/null && mv -f "$tmp" "$WS_RESULTS_FILE" \
    || { rm -f -- "$tmp"; ws_no_verdict "could not install $WS_RESULTS_FILE"; }
  WS_RESULTS_WRITTEN=1
  echo "Results written to: $WS_RESULTS_FILE"
  # Per-run copy, deliberately not named COMPARISON_RESULTS.yaml: ABS searches
  # its build directory recursively for that name.
  [[ -z "$WS_WORKDIR" || ! -d "$WS_WORKDIR" ]] || cp -p "$WS_RESULTS_FILE" "$WS_WORKDIR/results_${WS_RUN_ID}.yaml" 2>/dev/null || true
}

# ws_write_yaml VERDICT NOTES [SHA256 ...]
# The YAML keeps its 3 fields (script_version, verdict, notes) plus the optional
# hashes list for --version runs. Notes may span lines; one line each on the site.
ws_write_yaml() {
  local verdict="$1" notes="${2:-}" h line
  shift 2 || shift $#
  case "$verdict" in
    reproducible|not_reproducible|ftbfs) ;;
    *) ws_no_verdict "refusing to write verdict '$verdict' (allowed: reproducible, not_reproducible, ftbfs)" ;;
  esac
  for h in "$@"; do
    [[ "$h" =~ ^[0-9a-f]{64}$ ]] || ws_no_verdict "not a sha256 for hashes: '$h'"
  done
  {
    echo "script_version: ${SCRIPT_VERSION}"
    echo "verdict: ${verdict}"
    if [[ -n "$notes" ]]; then
      echo "notes: |"
      while IFS= read -r line; do echo "  ${line//$'\r'/}"; done <<< "$notes"
    fi
    if [[ $# -gt 0 ]]; then
      echo "hashes:"
      for h in "$@"; do echo "  - $h"; done
    fi
  } > "${WS_RESULTS_FILE}.new.$$" || { rm -f -- "${WS_RESULTS_FILE}.new.$$"; ws_no_verdict "could not write the results"; }
  ws_install_yaml "${WS_RESULTS_FILE}.new.$$"
  rm -f -- "${WS_RESULTS_FILE}.new.$$"
}

# ws_results_block APPID SIGNER VERSIONNAME VERSIONCODE VERDICT APPHASH COMMIT [DIFF]
# DIFF is the text under "Diff:" (may span lines; never read from stdin, so an
# open pipe can't hang the run). Fields are plain "key: value", no colour.
# libVersion/libHash sit after scriptHash (#1023 section 5; Luis to confirm).
ws_results_block() {
  echo "===== Begin Results ====="
  printf '%-15s %s\n' "appId:" "${1:-N/A}" "signer:" "${2:-N/A}" \
    "apkVersionName:" "${3:-N/A}" "apkVersionCode:" "${4:-N/A}" \
    "verdict:" "${5:-N/A}" "appHash:" "${6:-N/A}" "commit:" "${7:-N/A}" \
    "scriptVersion:" "${SCRIPT_VERSION}" "scriptHash:" "${SCRIPT_SHA256}" \
    "libVersion:" "${WS_LIB_NAME}-${WS_LIB_LOADED_VERSION}" "libHash:" "${WS_LIB_SHA256}"
  echo
  echo "Diff:"
  [[ -z "${8:-}" ]] || printf '%s\n' "$8"
  echo "===== End Results ====="
}

# ws_diff_preview FILE: at most 5 lines in the terminal, the count, the path.
ws_diff_preview() {
  local f="$1" n
  [[ -s "$f" ]] || return 0
  n="$(wc -l < "$f")"
  echo "First differences, ${n// /} lines in total:"
  head -n 5 "$f"
  echo "Full diff: $f"
}

# ---- Arguments ----------------------------------------------------------------
# ws_require_value FLAG VALUE: a flag needs a value that is not another flag.
ws_require_value() {
  [[ -n "${2:-}" && "${2:-}" != --* ]] || ws_invalid "missing value for $1"
}

# Unknown parameters are never fatal (Luis, 2026-03-11). Returns how many
# arguments to shift: 2 if the next one is its value, else 1.
ws_unknown_arg() {
  ws_warn "Ignoring unknown parameter: $1"
  if [[ -n "${2:-}" && "${2:-}" != --* ]]; then WS_SHIFT=2; else WS_SHIFT=1; fi
}

# ---- Files --------------------------------------------------------------------
ws_sha256() {
  [[ -f "${1:-}" ]] || { echo "N/A"; return 0; }
  sha256sum "$1" | cut -d' ' -f1
}

# ws_fetch URL OUT [SHA256]: download; GITHUB_TOKEN is sent to GitHub only and
# never required. The token goes to curl on stdin, never on its command line,
# where other users of the host could read it with ps. With SHA256, a
# mismatch is no verdict and the file is removed.
ws_fetch() {
  local url="$1" out="$2" want="${3:-}" got rc=0
  local -a c=(curl -fsSL --retry 3 --max-time 1800 -o "$out.part.$$")
  if [[ -n "${GITHUB_TOKEN:-}" && "$url" =~ ^https://(api\.)?github\.com/ ]]; then
    "${c[@]}" -H @- "$url" <<< "Authorization: Bearer ${GITHUB_TOKEN}" || rc=$?
  else
    "${c[@]}" "$url" < /dev/null || rc=$?
  fi
  [[ "$rc" == 0 ]] || { rm -f "$out.part.$$"; ws_no_verdict "download failed (curl exit $rc): $url"; }
  mv -f "$out.part.$$" "$out"
  if [[ -n "$want" ]]; then
    got="$(ws_sha256 "$out")"
    if [[ "$got" != "$want" ]]; then
      rm -f "$out"
      ws_no_verdict "sha256 mismatch for $url: expected $want, got $got"
    fi
  fi
}

# ws_git_checkout IMAGE REPO REF DEST
# Clone inside a container (the host needs no git), check out REF, files owned
# by the caller. Sets WS_COMMIT (40 hex) and WS_TAG_TYPE (annotated,
# lightweight or not-a-tag). A missing REF is invalid input (exit 2).
ws_git_checkout() {
  local image="$1" repo="$2" ref="$3" dest="$4" out rc
  local parent base
  parent="$(dirname "$dest")"; base="$(basename "$dest")"
  [[ -d "$parent" ]] || ws_no_verdict "no such directory for the checkout: $parent"
  [[ ! -e "$dest" ]] || ws_no_verdict "checkout target already exists: $dest"
  # shellcheck disable=SC2046
  out="$(ws_ctr run --rm $(ws_user_flags) -e HOME=/tmp -v "$parent:/w" -w /w \
    --entrypoint sh "$image" -c '
      git clone --quiet "$1" "$2" || exit 10
      cd "$2" || exit 13
      git rev-parse --verify --quiet "$3^{commit}" >/dev/null || exit 11
      git -c advice.detachedHead=false checkout --quiet "$3" || exit 13
      git submodule update --quiet --init --recursive || exit 12
      printf "%s " "$(git rev-parse HEAD)"
      git cat-file -t "refs/tags/$3" 2>/dev/null || echo none
    ' sh "$repo" "$base" "$ref")" && rc=0 || rc=$?
  case "$rc" in
    0) ;;
    10) ws_no_verdict "git clone failed: $repo" ;;
    11) ws_invalid "ref '$ref' not found in $repo" ;;
    12) ws_no_verdict "submodule update failed for $repo at $ref" ;;
    13) ws_no_verdict "checkout of $ref failed in $repo" ;;
    *) ws_no_verdict "checkout container failed (exit $rc) for $repo" ;;
  esac
  WS_COMMIT="${out%% *}"
  case "${out##* }" in
    tag) WS_TAG_TYPE=annotated ;;
    commit) WS_TAG_TYPE=lightweight ;;
    *) WS_TAG_TYPE=not-a-tag ;;
  esac
  [[ "$WS_COMMIT" =~ ^[0-9a-f]{40}$ ]] || ws_no_verdict "could not read the commit of $ref"
  echo "Checked out $ref at $WS_COMMIT ($WS_TAG_TYPE)"
}
