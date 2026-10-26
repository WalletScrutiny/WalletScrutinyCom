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
# It reads files only and never changes the verdict; it exits 0 unless invoked wrongly.
#
# Usage: ws-buildlock.sh --out <dir> [--gradle-home <dir>]... [--src <checkout>] [--yaml <COMPARISON_RESULTS.yaml>]
#   --out          where build-lock.json and the copied lockfiles are written
#   --gradle-home  a GRADLE_USER_HOME the build used (repeatable)
#   --src          the checkout after the build, for the npm, pub and cargo lockfiles
#                  and the committed binaries (needs its .git)
#   --yaml         COMPARISON_RESULTS.yaml to append a `build_lock:` block to (optional)
set -u

export WS_BUILDLOCK_VERSION="0.2.0"

OUT="" SRC="" YAML=""
GRADLE_HOMES=()
while [ $# -gt 0 ]; do
  case "$1" in
    --out) OUT="${2:-}"; shift 2 ;;
    --src) SRC="${2:-}"; shift 2 ;;
    --yaml) YAML="${2:-}"; shift 2 ;;
    --gradle-home) GRADLE_HOMES+=("${2:-}"); shift 2 ;;
    *) echo "ws-buildlock: unknown argument $1" >&2; exit 2 ;;
  esac
done
if [ -z "$OUT" ] || { [ ${#GRADLE_HOMES[@]} -eq 0 ] && [ -z "$SRC" ]; }; then
  echo "Usage: ws-buildlock.sh --out <dir> [--gradle-home <dir>]... [--src <checkout>] [--yaml <file>]" >&2
  exit 2
fi
mkdir -p "$OUT/lockfiles" || exit 2

json_str() { printf '"%s"' "$(printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g')"; }

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
  printf '{"schema":1,"tool":"ws-buildlock","version":"%s","generatedAt":"%s",\n' "$WS_BUILDLOCK_VERSION" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
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
echo "Written: $OUT/build-lock.json"

if [ -n "$YAML" ]; then
  {
    echo "build_lock:"
    echo "  tool_version: ${WS_BUILDLOCK_VERSION}"
    echo "  status: $([ "$gradle_count" -gt 0 ] || [ ${#LOCKS[@]} -gt 0 ] && echo ok || echo empty)"
    echo "  gradle_artifacts: ${gradle_count}"
    echo "  committed_binaries: ${committed_count}"
    echo "  lockfiles: [$(IFS=,; echo "${LOCKS[*]:-}")]"
    echo "  sha256: $(sha256sum "$OUT/build-lock.json" | cut -d' ' -f1)"
  } >> "$YAML"
fi
exit 0
