#!/usr/bin/env bash
# ws-depcheck: dependency check step for WalletScrutiny reproducible-build scripts.
#
# Given the source checkout a build script is about to compile, this step
#   1. lists the lockfiles and the manifests that have no lockfile beside them,
#   2. runs a digest-pinned osv-scanner container over the checkout (read-only
#      mount; the scanner only parses lockfiles, nothing of the checkout runs),
#   3. prints a summary into the build recording and appends a `dependencies:`
#      block to COMPARISON_RESULTS.yaml when asked to.
#
# It never changes the build verdict: whatever happens here, the step exits 0
# unless it was invoked wrongly. A failed scan is recorded as `status:
# scanner-failed` so a missing block and a failed check stay distinguishable.
#
# Usage: ws-depcheck.sh --src <checkout> --out <dir> [--yaml <COMPARISON_RESULTS.yaml>]
#   --src   the checkout to inspect (the build script's clone, at the release ref)
#   --out   where the scanner's JSON and the YAML fragment are written
#   --yaml  COMPARISON_RESULTS.yaml to append the `dependencies:` block to (optional)
# Environment:
#   WS_DEPCHECK_CTR      container CLI: docker or podman (default: docker if present, else podman)
#   WS_DEPCHECK_IMAGE    scanner image, pinned by digest (default below)
#   WS_DEPCHECK_TIMEOUT  seconds the scan may take (default 600)
#   WS_DEPCHECK_SCANNER  command run instead of the container, for tests: gets the
#                        checkout path as its only argument and must print osv-scanner JSON
#
# Build scripts are capped at 48 KB, so they do not embed this file; they fetch
# it by commit and check its hash (see scripts/rb/README.md).
set -u

export WS_DEPCHECK_VERSION="0.1.0"
# ghcr.io/google/osv-scanner:v2.7.0 (2026-10-12), manifest list digest from the registry.
WS_DEPCHECK_IMAGE="${WS_DEPCHECK_IMAGE:-ghcr.io/google/osv-scanner@sha256:4f3b7e2c64b9d38a5febc5a7e4a3dfef1d1362f726dea7a2ef4762b46469fcd0}"
WS_DEPCHECK_TIMEOUT="${WS_DEPCHECK_TIMEOUT:-600}"

src=""; out=""; yaml=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --src) src="${2:-}"; shift 2 ;;
    --out) out="${2:-}"; shift 2 ;;
    --yaml) yaml="${2:-}"; shift 2 ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "ws-depcheck: unknown argument $1" >&2; exit 2 ;;
  esac
done
[[ -d "$src" ]] || { echo "ws-depcheck: --src must be an existing directory" >&2; exit 2; }
[[ -n "$out" ]] || { echo "ws-depcheck: --out is required" >&2; exit 2; }
mkdir -p "$out" || exit 2
src="$(cd "$src" && pwd -P)"; out="$(cd "$out" && pwd -P)"

echo
echo "== Dependency check (ws-depcheck ${WS_DEPCHECK_VERSION}) =="
echo "  checkout: ${src}"

# 1. Inventory. Lockfile names and the manifest each one locks; a manifest with
#    no lockfile beside it (or, for gradle and cargo, above it) is "unlocked".
prune=( '(' -name .git -o -name node_modules -o -name Pods -o -name .gradle -o -name build -o -name dist -o -name target ')' -prune )
lockfile_re='(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lock|bun\.lockb|gradle\.lockfile|buildscript-gradle\.lockfile|verification-metadata\.xml|Cargo\.lock|go\.sum|pubspec\.lock|Package\.resolved|Podfile\.lock|Gemfile\.lock|poetry\.lock|Pipfile\.lock|pdm\.lock|uv\.lock|requirements[^/]*\.txt|composer\.lock|mix\.lock|packages\.lock\.json|conan\.lock|renv\.lock|flake\.lock)'
manifest_re='(package\.json|build\.gradle|build\.gradle\.kts|Cargo\.toml|go\.mod|pubspec\.yaml|Podfile|Gemfile|pyproject\.toml|Pipfile|composer\.json)'
all_files() { (cd "$src" && find . "${prune[@]}" -o -type f -print | sed 's#^\./##' | sort); }
mapfile -t lockfiles < <(all_files | grep -E "(^|/)${lockfile_re}\$")
mapfile -t manifests < <(all_files | grep -E "(^|/)${manifest_re}\$")

has_lock() { # dir, lockfile names... : true when one of the names exists in dir
  local d="$1"; shift; local n
  for n in "$@"; do [[ -e "${src}/${d}/${n}" ]] && return 0; done; return 1
}
has_lock_above() { # dir, lockfile names... : true when one of the names exists in dir or any parent up to the checkout root
  local d="$1"; shift
  while :; do
    has_lock "$d" "$@" && return 0
    [[ "$d" == "." ]] && return 1
    d="$(dirname "$d")"
  done
}
unlocked=()
for m in "${manifests[@]}"; do
  d="$(dirname "$m")"; b="$(basename "$m")"
  case "$b" in
    package.json)  has_lock "$d" package-lock.json npm-shrinkwrap.json yarn.lock pnpm-lock.yaml bun.lock bun.lockb || has_lock_above "$d" yarn.lock pnpm-lock.yaml package-lock.json || unlocked+=("$m") ;;
    build.gradle|build.gradle.kts) has_lock "$d" gradle.lockfile || has_lock_above "$d" gradle/verification-metadata.xml || unlocked+=("$m") ;;
    Cargo.toml)    has_lock_above "$d" Cargo.lock || unlocked+=("$m") ;;
    go.mod)        has_lock "$d" go.sum || unlocked+=("$m") ;;
    pubspec.yaml)  has_lock "$d" pubspec.lock || unlocked+=("$m") ;;
    Podfile)       has_lock "$d" Podfile.lock || unlocked+=("$m") ;;
    Gemfile)       has_lock "$d" Gemfile.lock || unlocked+=("$m") ;;
    pyproject.toml) has_lock "$d" poetry.lock pdm.lock uv.lock requirements.txt || unlocked+=("$m") ;;
    Pipfile)       has_lock "$d" Pipfile.lock || unlocked+=("$m") ;;
    composer.json) has_lock "$d" composer.lock || unlocked+=("$m") ;;
  esac
done
echo "  lockfiles (${#lockfiles[@]}): ${lockfiles[*]:-none}"
echo "  manifests without a lockfile (${#unlocked[@]}): ${unlocked[*]:-none}"
printf '%s\n' "${lockfiles[@]}" > "${out}/lockfiles.txt"
printf '%s\n' "${unlocked[@]}" > "${out}/unlocked-manifests.txt"

# 2. Scan. JSON on stdout (so no root-owned file lands in the workspace when
#    the container CLI is docker), scanner log on stderr. osv-scanner exits 1
#    when it found advisories and 128 when it found no packages at all; both
#    are answers, not failures.
scan_json="${out}/osv-scanner.json"; scan_log="${out}/osv-scanner.log"
scanner="${WS_DEPCHECK_IMAGE}"
if [[ -n "${WS_DEPCHECK_SCANNER:-}" ]]; then
  scanner="${WS_DEPCHECK_SCANNER}"
  timeout "$WS_DEPCHECK_TIMEOUT" $WS_DEPCHECK_SCANNER "$src" > "$scan_json" 2> "$scan_log"; scan_rc=$?
else
  ctr="${WS_DEPCHECK_CTR:-}"
  if [[ -z "$ctr" ]]; then command -v docker >/dev/null 2>&1 && ctr=docker || ctr=podman; fi
  if ! command -v "$ctr" >/dev/null 2>&1; then
    echo "ws-depcheck: no container CLI ($ctr) on PATH, scan skipped" | tee "$scan_log"; scan_rc=127; : > "$scan_json"
  else
    echo "  scanner: ${WS_DEPCHECK_IMAGE} via ${ctr}"
    timeout "$WS_DEPCHECK_TIMEOUT" "$ctr" run --rm \
      --cap-drop=ALL --security-opt=no-new-privileges --memory=2g --pids-limit=256 \
      --volume "${src}:/src:ro" "$WS_DEPCHECK_IMAGE" \
      scan source --recursive --all-packages --format json --verbosity warn /src > "$scan_json" 2> "$scan_log"; scan_rc=$?
  fi
fi
case "$scan_rc" in
  0|1) status=ok ;;
  128) status=ok ;;              # nothing to scan
  124) status='scanner-failed'; echo "ws-depcheck: scan timed out after ${WS_DEPCHECK_TIMEOUT}s" ;;
  *)   status='scanner-failed'; echo "ws-depcheck: scan failed (exit ${scan_rc}), see ${scan_log}"; tail -5 "$scan_log" ;;
esac
[[ ${#lockfiles[@]} -eq 0 && "$status" == ok ]] && status='no-lockfiles'

# 3. Summary: table into the recording, YAML fragment next to the JSON.
if ! command -v python3 >/dev/null 2>&1; then
  echo "ws-depcheck: python3 missing, raw scanner JSON kept at ${scan_json}, no summary"
  exit 0
fi
WS_DEPCHECK_STATUS="$status" WS_DEPCHECK_SCANNER_ID="$scanner" python3 - "$scan_json" "$out" "$src" <<'PY'
import json, os, sys
scan_json, out, src = sys.argv[1:4]
status = os.environ['WS_DEPCHECK_STATUS']
scanner = os.environ['WS_DEPCHECK_SCANNER_ID']
lockfiles = [l for l in open(os.path.join(out, 'lockfiles.txt')).read().split('\n') if l]
unlocked = [l for l in open(os.path.join(out, 'unlocked-manifests.txt')).read().split('\n') if l]

try:
    data = json.load(open(scan_json)) if os.path.getsize(scan_json) else {'results': []}
except (ValueError, OSError):
    data, status = {'results': []}, 'scanner-failed'

def bucket(group, ids):
    if any(i.startswith('MAL-') for i in ids): return 'malicious'
    try: score = float(group.get('max_severity') or '')
    except ValueError: return 'unknown'
    if score >= 9: return 'critical'
    if score >= 7: return 'high'
    if score >= 4: return 'moderate'
    if score > 0: return 'low'
    return 'unknown'

per_lock, worst = {}, []
totals = {k: 0 for k in ('malicious', 'critical', 'high', 'moderate', 'low', 'unknown')}
packages = 0
for r in data.get('results', []):
    path = os.path.relpath(r.get('source', {}).get('path', ''), '/src') if r.get('source', {}).get('path', '').startswith('/src') else r.get('source', {}).get('path', '')
    if path.startswith(src + '/'): path = path[len(src) + 1:]
    entry = per_lock.setdefault(path, {'packages': 0, 'vulnerable': 0, 'advisories': 0})
    for p in r.get('packages', []):
        packages += 1; entry['packages'] += 1
        groups = p.get('groups') or []
        if not groups: continue
        entry['vulnerable'] += 1; entry['advisories'] += len(groups)
        pkg = p.get('package', {})
        for g in groups:
            ids = g.get('ids') or []
            b = bucket(g, ids); totals[b] += 1
            worst.append((b, float(g.get('max_severity') or 0), ids[0] if ids else '?', pkg.get('name'), pkg.get('version'), pkg.get('ecosystem'), path))
order = {k: i for i, k in enumerate(totals)}
worst.sort(key=lambda w: (order[w[0]], -w[1]))
seen = set()
worst = [w for w in worst if not (w[2] in seen or seen.add(w[2]))]
unscanned = [l for l in lockfiles if l not in per_lock]

print()
print(f"  {'lockfile':<40} {'packages':>8} {'vulnerable':>10} {'advisories':>10}")
for path in lockfiles:
    e = per_lock.get(path)
    if e: print(f"  {path:<40} {e['packages']:>8} {e['vulnerable']:>10} {e['advisories']:>10}")
    else: print(f"  {path:<40} {'-':>8} {'-':>10} {'-':>10}  not scanned (unsupported lockfile)")
for path, e in per_lock.items():
    if path not in lockfiles: print(f"  {path:<40} {e['packages']:>8} {e['vulnerable']:>10} {e['advisories']:>10}  (found by the scanner only)")
print(f"  advisories by severity: " + ', '.join(f"{k} {v}" for k, v in totals.items()))
if worst:
    print("  worst findings:")
    for b, score, vid, name, ver, eco, path in worst[:10]:
        print(f"    {b:<9} {score:>4}  {vid:<22} {name}@{ver} ({eco}, {path})")
print(f"  status: {status}")

def q(s): return '"' + str(s).replace('\\', '\\\\').replace('"', '\\"') + '"'
lines = ['dependencies:', f'  step: ws-depcheck {os.environ.get("WS_DEPCHECK_VERSION", "")}'.rstrip(), f'  scanner: {q(scanner)}', f'  status: {status}', f'  packages: {packages}']
lines.append('  advisories: {' + ', '.join(f'{k}: {v}' for k, v in totals.items()) + '}')
lines.append('  lockfiles:' if lockfiles or per_lock else '  lockfiles: []')
for path in list(lockfiles) + [p for p in per_lock if p not in lockfiles]:
    e = per_lock.get(path)
    if e: lines.append(f'    - {{path: {q(path)}, packages: {e["packages"]}, vulnerable: {e["vulnerable"]}, advisories: {e["advisories"]}}}')
    else: lines.append(f'    - {{path: {q(path)}, scanned: false}}')
lines.append('  unlocked_manifests: [' + ', '.join(q(u) for u in unlocked) + ']')
if worst:
    lines.append('  worst:')
    for b, score, vid, name, ver, eco, path in worst[:10]:
        lines.append(f'    - {{id: {q(vid)}, severity: {b}, score: {score}, package: {q(f"{name}@{ver}")}, ecosystem: {q(eco)}, lockfile: {q(path)}}}')
lines.append(f'  report: {q(os.path.basename(scan_json))}')
open(os.path.join(out, 'dependency-check.yaml'), 'w').write('\n'.join(lines) + '\n')
json.dump({'step': 'ws-depcheck', 'scanner': scanner, 'status': status, 'packages': packages, 'advisories': totals,
           'lockfiles': [{'path': p, **per_lock[p]} if p in per_lock else {'path': p, 'scanned': False} for p in list(lockfiles) + [p for p in per_lock if p not in lockfiles]],
           'unlocked_manifests': unlocked,
           'worst': [{'id': w[2], 'severity': w[0], 'score': w[1], 'package': f'{w[3]}@{w[4]}', 'ecosystem': w[5], 'lockfile': w[6]} for w in worst[:10]]},
          open(os.path.join(out, 'dependency-check.json'), 'w'), indent=1)
PY

if [[ -n "$yaml" ]]; then
  if [[ -f "$yaml" ]] && grep -q '^dependencies:' "$yaml"; then
    echo "ws-depcheck: ${yaml} already has a dependencies block, not appended"
  elif [[ -f "${out}/dependency-check.yaml" ]]; then
    cat "${out}/dependency-check.yaml" >> "$yaml" && echo "  dependencies block appended to ${yaml}"
  fi
fi
exit 0
