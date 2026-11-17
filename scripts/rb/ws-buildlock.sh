#!/usr/bin/env bash
# ws-buildlock: the exact dependency versions a reproducible build used.
#
# ws-depcheck.sh reads the lockfiles the checkout declares, before the build.
# This step runs after the build and records what the build actually fetched:
# for a verified build that is the most relevant list to check (Leo,
# 2026-10-26), and for a project without lockfiles the only one there is.
#
#   gradle  every artifact in the Gradle module cache the build filled
#           (caches/modules-2/files-2.1/<group>/<artifact>/<version>/<sha1>/<file>),
#           with its sha256
#   npm     node_modules/.package-lock.json, the tree npm really installed
#   pub     pubspec.lock files as `pub get` left them
#   cargo   Cargo.lock files as the build left them
#   committed  every compiled file checked into the checkout (.so, .a, .jar,
#           .aar, .dll, ...), with its sha256: no lockfile lists those, and
#           leaving something out of the lockfile must not hide it (Leo,
#           2026-10-26)
#
# The cache must belong to this build alone: a cache shared with other builds
# lists their artifacts too. Mount a fresh directory as the container's
# GRADLE_USER_HOME (see scripts/rb/README.md).
#
# The file says which build it belongs to (schema 2): the app, version and
# platform from the flags, and the commit from --commit (or else --src). The dependency checker
# and the verification form use a file only when all three flags were given.
#
# It reads files only and never changes the verdict; it exits 0 unless invoked wrongly.
#
# Usage: ws-buildlock.sh --out <dir> [--gradle-home <dir>]... [--src <checkout>]
#                        [--app-id <id>] [--version <version>] [--platform <platform>] [--commit <sha>]
#                        [--yaml <COMPARISON_RESULTS.yaml>]
#   --out          where build-lock.json and the copied lockfiles are written; an
#                  old build-lock.json there is removed first
#   --gradle-home  a GRADLE_USER_HOME the build used (repeatable)
#   --src          the checkout after the build, for the npm, pub and cargo lockfiles
#                  and the committed binaries (needs its .git)
#   --app-id       the app ID, as in the verification's `i` tag
#   --version      the version, as in the verification's `version` tag
#   --platform     the platform, as in the verification's `platform` tag (android)
#   --commit       the full 40-hex commit the build was made from, for builds that
#                  clone inside the container; without it, the HEAD of --src
#   --yaml         COMPARISON_RESULTS.yaml to append a `build_lock:` block to (optional)
set -u

export WS_BUILDLOCK_VERSION="0.3.0"

OUT="" SRC="" YAML="" APP_ID="" APP_VERSION="" PLATFORM="" COMMIT_FLAG=""
GRADLE_HOMES=()
while [ $# -gt 0 ]; do
  case "$1" in
    --out) OUT="${2:-}"; shift 2 ;;
    --src) SRC="${2:-}"; shift 2 ;;
    --yaml) YAML="${2:-}"; shift 2 ;;
    --app-id) APP_ID="${2:-}"; shift 2 ;;
    --version) APP_VERSION="${2:-}"; shift 2 ;;
    --platform) PLATFORM="${2:-}"; shift 2 ;;
    --commit) COMMIT_FLAG="${2:-}"; shift 2 ;;
    --gradle-home) GRADLE_HOMES+=("${2:-}"); shift 2 ;;
    *) echo "ws-buildlock: unknown argument $1" >&2; exit 2 ;;
  esac
done
if [ -z "$OUT" ] || { [ ${#GRADLE_HOMES[@]} -eq 0 ] && [ -z "$SRC" ]; }; then
  echo "Usage: ws-buildlock.sh --out <dir> [--gradle-home <dir>]... [--src <checkout>] [--app-id <id>] [--version <version>] [--platform <platform>] [--commit <sha>] [--yaml <file>]" >&2
  exit 2
fi
# A previous run's file must not survive this one: uploaded by mistake, it
# would describe another build.
rm -f "$OUT/build-lock.json"
mkdir -p "$OUT/lockfiles" || exit 2

json_str() { printf '"%s"' "$(printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g')"; }
# a string, or null when empty
json_opt() { if [ -n "$1" ]; then json_str "$1"; else printf 'null'; fi; }

MISSING=()
[ -n "$APP_ID" ] || MISSING+=(--app-id)
[ -n "$APP_VERSION" ] || MISSING+=(--version)
[ -n "$PLATFORM" ] || MISSING+=(--platform)
SRC_COMMIT=""
if [ -n "$SRC" ]; then
  SRC_COMMIT=$(git -C "$SRC" rev-parse HEAD 2>/dev/null) || SRC_COMMIT=""
fi
# --commit names the build when the checkout it came from is gone (a clone
# inside the container); a tag or a short sha would not tie the file to it.
COMMIT="$SRC_COMMIT"
if [ -n "$COMMIT_FLAG" ]; then
  if [[ "$COMMIT_FLAG" =~ ^[0-9a-fA-F]{40}$ ]]; then
    COMMIT=$(printf '%s' "$COMMIT_FLAG" | tr 'A-F' 'a-f')
    if [ -n "$SRC_COMMIT" ] && [ "$SRC_COMMIT" != "$COMMIT" ]; then
      echo "[WARN] ws-buildlock: --commit $COMMIT differs from the HEAD of --src ($SRC_COMMIT); the file names --commit"
    fi
  else
    COMMIT=""
    echo "[WARN] ws-buildlock: --commit $COMMIT_FLAG is not a full 40-hex commit; the file names no commit"
  fi
fi

ENTRIES="$OUT/.entries"
: > "$ENTRIES"
gradle_count=0
for home in "${GRADLE_HOMES[@]}"; do
  cache="$home/caches/modules-2/files-2.1"
  [ -d "$cache" ] || { echo "[WARN] ws-buildlock: no Gradle module cache in $home"; continue; }
  # <group>/<artifact>/<version>/<sha1>/<file>, relative to the cache
  while IFS= read -r rel; do
    IFS=/ read -r group artifact version sha1 file <<< "$rel"
    sha256=$(sha256sum "$cache/$rel" | cut -d' ' -f1)
    printf '{"ecosystem":"gradle","name":%s,"version":%s,"file":%s,"sha1":%s,"sha256":"%s"}\n' \
      "$(json_str "$group:$artifact")" "$(json_str "$version")" "$(json_str "$file")" "$(json_str "$sha1")" "$sha256" >> "$ENTRIES"
    gradle_count=$((gradle_count + 1))
  done < <(cd "$cache" && find . -mindepth 5 -maxdepth 5 -type f | sed 's|^\./||' | LC_ALL=C sort)
done

# Lockfiles the build itself wrote or kept, copied under their checkout path.
LOCKS=()
if [ -n "$SRC" ]; then
  while IFS= read -r rel; do
    mkdir -p "$OUT/lockfiles/$(dirname "$rel")"
    cp "$SRC/$rel" "$OUT/lockfiles/$rel"
    LOCKS+=("$rel")
  done < <(cd "$SRC" && find . \( -name .git -o -name build -o -name Pods \) -prune -o -type f \
             \( -path '*/node_modules/.package-lock.json' -o -name pubspec.lock -o -name Cargo.lock \) -print \
           | sed 's|^\./||' | grep -v 'node_modules/.*/node_modules/' | LC_ALL=C sort)
fi

# Compiled files the repository itself carries (git's index, so build output
# is not mistaken for them). Same extensions as the source analyser's
# committed-binaries check; the gradle wrapper jar is the one expected entry.
committed_count=0
if [ -n "$SRC" ] && git -C "$SRC" rev-parse --git-dir >/dev/null 2>&1; then
  while IFS= read -r rel; do
    [ -f "$SRC/$rel" ] || continue
    sha256=$(sha256sum "$SRC/$rel" | cut -d' ' -f1)
    printf '{"ecosystem":"committed","name":%s,"sha256":"%s"}\n' "$(json_str "$rel")" "$sha256" >> "$ENTRIES"
    committed_count=$((committed_count + 1))
  done < <(git -C "$SRC" ls-files -z | tr '\0' '\n' \
             | grep -iE '\.(a|so|dylib|dll|lib|o|obj|aar|jar|apk|aab|ipa|wasm|exe|node|pyd|dex|class|jnilib)$|\.so\.[0-9]' \
             | LC_ALL=C sort)
elif [ -n "$SRC" ]; then
  echo "[WARN] ws-buildlock: $SRC is not a git checkout; committed binaries not listed"
fi

{
  printf '{"schema":2,"tool":"ws-buildlock","version":"%s",\n' "$WS_BUILDLOCK_VERSION"
  printf '"appId":%s,"appVersion":%s,"platform":%s,"commit":%s,\n' \
    "$(json_opt "$APP_ID")" "$(json_opt "$APP_VERSION")" "$(json_opt "$PLATFORM")" "$(json_opt "$COMMIT")"
  printf '"generatedAt":"%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '"lockfiles":['
  sep=""
  for l in "${LOCKS[@]}"; do printf '%s%s' "$sep" "$(json_str "$l")"; sep=","; done
  printf '],\n"artifacts":[\n'
  sed '$!s/$/,/' "$ENTRIES"
  printf ']}\n'
} > "$OUT/build-lock.json"
rm -f "$ENTRIES"

echo "=== ws-buildlock ${WS_BUILDLOCK_VERSION} ==="
echo "Gradle artifacts the build fetched: ${gradle_count}"
echo "Binaries committed in the checkout: ${committed_count}"
for l in "${LOCKS[@]}"; do echo "Lockfile after the build: $l"; done
if [ "$gradle_count" -eq 0 ] && [ ${#LOCKS[@]} -eq 0 ]; then
  echo "[WARN] ws-buildlock: nothing recorded; the build's exact dependency versions are unknown"
fi
if [ ${#MISSING[@]} -gt 0 ]; then
  echo "[WARN] ws-buildlock: no ${MISSING[*]} given; the dependency checker will not use this build-lock.json, and the verification form will refuse it"
fi
LOCK_SHA256=$(sha256sum "$OUT/build-lock.json" | cut -d' ' -f1)
echo "=== Upload this file with the verification ==="
echo "  file:     $(cd "$OUT" && pwd)/build-lock.json"
echo "  sha256:   $LOCK_SHA256"
echo "  app:      ${APP_ID:-(none)}"
echo "  version:  ${APP_VERSION:-(none)}"
echo "  platform: ${PLATFORM:-(none)}"
echo "  commit:   ${COMMIT:-(none)}"
echo "Keep the name build-lock.json when uploading it."

if [ -n "$YAML" ]; then
  {
    echo "build_lock:"
    echo "  tool_version: ${WS_BUILDLOCK_VERSION}"
    echo "  status: $([ "$gradle_count" -gt 0 ] || [ ${#LOCKS[@]} -gt 0 ] && echo ok || echo empty)"
    echo "  gradle_artifacts: ${gradle_count}"
    echo "  committed_binaries: ${committed_count}"
    echo "  lockfiles: [$(IFS=,; echo "${LOCKS[*]:-}")]"
    echo "  sha256: ${LOCK_SHA256}"
  } >> "$YAML"
fi
exit 0
