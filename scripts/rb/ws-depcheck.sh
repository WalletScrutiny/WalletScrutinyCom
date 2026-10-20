#!/usr/bin/env bash
# ws-depcheck: dependency check step for WalletScrutiny reproducible-build scripts.
#
# Given the source checkout a build script is about to compile, this step
#   1. lists the lockfiles and the manifests that have no lockfile beside them,
#   2. runs a digest-pinned osv-scanner container over the checkout (read-only
#      mount; the scanner only parses lockfiles, nothing of the checkout runs),
#   3. checks the identity of every package the scanner found: does the
#      registry name a source repository, and does that repository hold a tag
#      (or, on npm, a named commit) for the shipped version
#      (external/source_analysis/identity-scan-cli.mjs, run with the host's
#      Node, fetched at WS_DEPCHECK_REV and hash-checked when not run from a
#      checkout of this repository),
#   4. with --apk, compares the Maven packages the scanner found with the APK
#      (external/source_analysis/apk-scan-cli.mjs, fetched and hash-checked
#      like the identity check): which are in it, whether each native library
#      is the same code as the published package's, and what in the APK no
#      package declares,
#   5. prints a summary into the build recording and appends a `dependencies:`
#      block to COMPARISON_RESULTS.yaml when asked to.
#
# It never changes the build verdict: whatever happens here, the step exits 0
# unless it was invoked wrongly. A failed scan is recorded as `status:
# scanner-failed` so a missing block and a failed check stay distinguishable.
#
# Usage: ws-depcheck.sh --src <checkout> --out <dir> [--yaml <COMPARISON_RESULTS.yaml>] [--apk <app.apk>]
#   --src   the checkout to inspect (the build script's clone, at the release ref)
#   --out   where the scanner's JSON and the YAML fragment are written
#   --yaml  COMPARISON_RESULTS.yaml to append the `dependencies:` block to (optional)
#   --apk   the APK to compare the declared packages with (optional; the official
#           one, or the one the build produced)
# Environment:
#   WS_DEPCHECK_CTR      container CLI: docker or podman (default: docker if present, else podman)
#   WS_DEPCHECK_IMAGE    scanner image, pinned by digest (default below)
#   WS_DEPCHECK_TIMEOUT  seconds the scan may take (default 600)
#   WS_DEPCHECK_SCANNER  command run instead of the container, for tests: gets the
#                        checkout path as its only argument and must print osv-scanner JSON
#   WS_DEPCHECK_REV      commit of this repository the identity check is fetched at
#                        (the build script's DEPCHECK_REV); unset and not in a checkout: skipped
#   WS_DEPCHECK_IDENTITY 0 skips the identity check
#   WS_DEPCHECK_IDENTITY_TIMEOUT  seconds the identity check may take (default 900)
#   WS_DEPCHECK_IDENTITY_CMD  command run instead of the identity check, for tests: gets
#                        the scanner JSON and the identity JSON to write as arguments
#   WS_DEPCHECK_APK_TIMEOUT  seconds the APK check may take (default 900)
#   WS_DEPCHECK_APK_CMD  command run instead of the APK check, for tests: gets the scanner
#                        JSON, the APK and the result JSON to write as arguments
#
# Build scripts are capped at 48 KB, so they do not embed this file; they fetch
# it by commit and check its hash (see scripts/rb/README.md).
set -u

export WS_DEPCHECK_VERSION="0.3.0"
# sha256 of the identity and APK checks' files at the commit this script is fetched at;
# test/unit/rb-depcheck.test.mjs fails when they drift from the files.
IDENTITY_FILES=(
  "identity-scan-cli.mjs 4a54ce5efa6416f31bf5f249fe7983e2bb554ddd1da35fc8d6d3eb40078b6fa8"
  "sourceIdentity.mjs fa2c7551daca79c25ccab5d11423f2f419a4ea2b9d8b244efbaab267eb8e5a76"
  "sourceRepos.mjs 6de1b3ecb772a524e7ae6b7daf916b632b85eb5fde1837c50c8ab7601b6a039d"
  "apkContents.mjs a07f7e959c0aa76bd96cf5e1a5dd139c5ab8dbf482c526f84484375bd3ff9d9d"
  "apk-scan-cli.mjs b642fbdf1cd4807fc0176d02f60ae155c0216d9d20ca14588455c161be65e9f8"
)
# ghcr.io/google/osv-scanner:v2.7.0 (2026-10-12), manifest list digest from the registry.
WS_DEPCHECK_IMAGE="${WS_DEPCHECK_IMAGE:-ghcr.io/google/osv-scanner@sha256:4f3b7e2c64b9d38a5febc5a7e4a3dfef1d1362f726dea7a2ef4762b46469fcd0}"
WS_DEPCHECK_TIMEOUT="${WS_DEPCHECK_TIMEOUT:-600}"
WS_DEPCHECK_IDENTITY_TIMEOUT="${WS_DEPCHECK_IDENTITY_TIMEOUT:-900}"
WS_DEPCHECK_APK_TIMEOUT="${WS_DEPCHECK_APK_TIMEOUT:-900}"

src=""; out=""; yaml=""; apk=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --src) src="${2:-}"; shift 2 ;;
    --out) out="${2:-}"; shift 2 ;;
    --yaml) yaml="${2:-}"; shift 2 ;;
    --apk) apk="${2:-}"; shift 2 ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "ws-depcheck: unknown argument $1" >&2; exit 2 ;;
  esac
done
[[ -d "$src" ]] || { echo "ws-depcheck: --src must be an existing directory" >&2; exit 2; }
[[ -n "$out" ]] || { echo "ws-depcheck: --out is required" >&2; exit 2; }
mkdir -p "$out" || exit 2
src="$(cd "$src" && pwd -P)"; out="$(cd "$out" && pwd -P)"
[[ -z "$apk" || -f "$apk" ]] || { echo "ws-depcheck: --apk must be an existing file" >&2; exit 2; }
[[ -n "$apk" ]] && apk="$(cd "$(dirname "$apk")" && pwd -P)/$(basename "$apk")"

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

# 3. Identity. Host-side: registry lookups and `git ls-remote`, nothing of the
#    checkout or of any package runs. Its own status, so a skipped or failed
#    identity check never reads as "all verified".
identity_json="${out}/identity.json"; identity_log="${out}/identity.log"; rm -f "$identity_json"
identity_lib() { # prints the directory holding the identity check's files, or fails with a reason
  local here lib entry f sum
  here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
  lib="${here}/../../external/source_analysis"
  [[ -f "${lib}/identity-scan-cli.mjs" ]] && { (cd "$lib" && pwd -P); return 0; }
  [[ -f "${out}/identity-lib/.complete" ]] && { echo "${out}/identity-lib"; return 0; } # fetched for the identity step already
  [[ -n "${WS_DEPCHECK_REV:-}" ]] || { echo "no WS_DEPCHECK_REV to fetch it at" >&2; return 1; }
  lib="${out}/identity-lib"; mkdir -p "$lib"
  for entry in "${IDENTITY_FILES[@]}"; do
    f="${entry%% *}"; sum="${entry##* }"
    curl -fsSL --max-time 60 -o "${lib}/${f}" "https://gitlab.com/walletscrutiny/walletScrutinyCom/-/raw/${WS_DEPCHECK_REV}/external/source_analysis/${f}" \
      || { echo "could not fetch ${f} at ${WS_DEPCHECK_REV}" >&2; return 1; }
    echo "${sum}  ${lib}/${f}" | sha256sum -c --quiet - >/dev/null 2>&1 || { echo "${f} at ${WS_DEPCHECK_REV} does not have the expected hash" >&2; return 1; }
  done
  : > "${lib}/.complete"
  echo "$lib"
}
if [[ "${WS_DEPCHECK_IDENTITY:-1}" == 0 ]]; then
  identity_status='skipped'; identity_note='WS_DEPCHECK_IDENTITY=0'
elif [[ ! -s "$scan_json" || "$status" != ok ]]; then
  identity_status='skipped'; identity_note='no package list from the scan'
elif [[ -n "${WS_DEPCHECK_IDENTITY_CMD:-}" ]]; then
  timeout "$WS_DEPCHECK_IDENTITY_TIMEOUT" $WS_DEPCHECK_IDENTITY_CMD "$scan_json" "$identity_json" > /dev/null 2> "$identity_log" \
    && identity_status=ok || { identity_status=failed; identity_note="exit $?"; }
elif ! node -e 'process.exit(+process.versions.node.split(".")[0] < 18 ? 1 : 0)' 2>/dev/null; then
  identity_status='skipped'; identity_note='no Node 18+ on PATH'
elif ! lib="$(identity_lib 2> "$identity_log")"; then
  identity_status='skipped'; identity_note="$(tail -1 "$identity_log")"
else
  echo "  identity: checking source repositories and tags (up to ${WS_DEPCHECK_IDENTITY_TIMEOUT}s)"
  timeout "$WS_DEPCHECK_IDENTITY_TIMEOUT" node "${lib}/identity-scan-cli.mjs" "$scan_json" "$identity_json" > /dev/null 2> "$identity_log"; rc=$?
  case "$rc" in
    0) identity_status=ok ;;
    124) identity_status=failed; identity_note="timed out after ${WS_DEPCHECK_IDENTITY_TIMEOUT}s" ;;
    *) identity_status=failed; identity_note="exit ${rc}, see ${identity_log}" ;;
  esac
fi
[[ "$identity_status" == ok && ! -s "$identity_json" ]] && { identity_status=failed; identity_note='no result written'; }

# 4. The APK. Downloads the declared Maven artifacts and reads the APK's
#    dex, META-INF version files and native libraries; nothing runs.
apk_json="${out}/apk-contents.json"; apk_log="${out}/apk-contents.log"; rm -f "$apk_json"; apk_note=''
if [[ -z "$apk" ]]; then
  apk_status='skipped'; apk_note='no --apk given'
elif [[ ! -s "$scan_json" || "$status" != ok ]]; then
  apk_status='skipped'; apk_note='no package list from the scan'
elif [[ -n "${WS_DEPCHECK_APK_CMD:-}" ]]; then
  timeout "$WS_DEPCHECK_APK_TIMEOUT" $WS_DEPCHECK_APK_CMD "$scan_json" "$apk" "$apk_json" > /dev/null 2> "$apk_log" \
    && apk_status=ok || { apk_status=failed; apk_note="exit $?"; }
elif ! node -e 'process.exit(+process.versions.node.split(".")[0] < 18 ? 1 : 0)' 2>/dev/null; then
  apk_status='skipped'; apk_note='no Node 18+ on PATH'
elif ! lib="$(identity_lib 2> "$apk_log")"; then
  apk_status='skipped'; apk_note="$(tail -1 "$apk_log")"
else
  echo "  apk: comparing the declared Maven packages with $(basename "$apk") (up to ${WS_DEPCHECK_APK_TIMEOUT}s)"
  timeout "$WS_DEPCHECK_APK_TIMEOUT" node "${lib}/apk-scan-cli.mjs" "$scan_json" "$apk" "$apk_json" > /dev/null 2> "$apk_log"; rc=$?
  case "$rc" in
    0) apk_status=ok ;;
    124) apk_status=failed; apk_note="timed out after ${WS_DEPCHECK_APK_TIMEOUT}s" ;;
    *) apk_status=failed; apk_note="exit ${rc}, see ${apk_log}" ;;
  esac
fi
[[ "$apk_status" == ok && ! -s "$apk_json" ]] && { apk_status=failed; apk_note='no result written'; }

# 5. Summary: table into the recording, YAML fragment next to the JSON.
if ! command -v python3 >/dev/null 2>&1; then
  echo "ws-depcheck: python3 missing, raw scanner JSON kept at ${scan_json}, no summary"
  exit 0
fi
WS_DEPCHECK_STATUS="$status" WS_DEPCHECK_SCANNER_ID="$scanner" WS_DEPCHECK_IDENTITY_STATUS="$identity_status" WS_DEPCHECK_IDENTITY_NOTE="${identity_note:-}" \
WS_DEPCHECK_APK_STATUS="$apk_status" WS_DEPCHECK_APK_NOTE="${apk_note:-}" WS_DEPCHECK_APK_NAME="$(basename "${apk:-}")" \
  python3 - "$scan_json" "$out" "$src" "$identity_json" "$apk_json" <<'PY'
import json, os, sys
scan_json, out, src, identity_json, apk_json = sys.argv[1:6]
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

# Identity: counts per status, and the versions nobody can tie to a commit.
# tag-found and commit-named tie the version to a commit; range is the
# build's gap (no single version), unsupported an ecosystem without a resolver.
ID_ORDER = ['tag-found', 'commit-named', 'no-tag', 'no-repo', 'repo-unreachable', 'not-on-registry', 'range', 'unsupported']
UNVERIFIED = ('no-tag', 'no-repo', 'repo-unreachable', 'not-on-registry')
identity = {'status': os.environ['WS_DEPCHECK_IDENTITY_STATUS']}
if os.environ.get('WS_DEPCHECK_IDENTITY_NOTE'): identity['note'] = os.environ['WS_DEPCHECK_IDENTITY_NOTE']
unverified = []
if identity['status'] == 'ok':
    try:
        idata = json.load(open(identity_json))
        counts = idata.get('byStatus', {})
        identity['counts'] = {k: counts.get(k, 0) for k in ID_ORDER + sorted(set(counts) - set(ID_ORDER))}
        identity['provenance'] = sum(1 for p in idata.get('packages', []) if p.get('provenance'))
        unverified = [p for p in idata.get('packages', []) if p.get('status') in UNVERIFIED]
    except (ValueError, OSError):
        identity = {'status': 'failed', 'note': 'unreadable identity.json'}
print(f"  identity: {identity['status']}" + (f" ({identity['note']})" if identity.get('note') else ''))
if 'counts' in identity:
    print('    ' + ', '.join(f"{k} {v}" for k, v in identity['counts'].items()) + f"; npm provenance {identity['provenance']}")
    if unverified:
        print(f"    not tied to a commit ({len(unverified)}), first 10:")
        for p in unverified[:10]: print(f"      {p['status']:<16} {p['name']}@{p['version']} ({p['ecosystem']}{', ' + p['repo'] if p.get('repo') else ''})")

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
lines.append('  identity:')
lines.append(f'    status: {identity["status"]}')
if identity.get('note'): lines.append(f'    note: {q(identity["note"])}')
if 'counts' in identity:
    lines.append('    counts: {' + ', '.join(f'{k}: {v}' for k, v in identity['counts'].items()) + '}')
    lines.append(f'    npm_provenance: {identity["provenance"]}')
    if unverified:
        lines.append('    unverified:')
        for p in unverified[:10]: lines.append(f'      - {{package: {q(p["name"] + "@" + p["version"])}, ecosystem: {q(p["ecosystem"])}, status: {p["status"]}}}')
    lines.append(f'    report: {q(os.path.basename(identity_json))}')
# The APK: declared packages found in it, native libraries that are the same
# code as the published package's, and what in it no package declares.
apk = {'status': os.environ['WS_DEPCHECK_APK_STATUS']}
if os.environ.get('WS_DEPCHECK_APK_NOTE'): apk['note'] = os.environ['WS_DEPCHECK_APK_NOTE']
if apk['status'] == 'ok':
    try:
        adata = json.load(open(apk_json))
        s = adata.get('summary', {})
        apk.update({'file': os.environ.get('WS_DEPCHECK_APK_NAME', ''), 'declared': s.get('declared', 0), 'present': s.get('present', 0) + s.get('otherVersionShipped', 0),
                    'absent': s.get('absent', 0), 'cant_tell': s.get('cantTell', 0), 'native': s.get('native', 0), 'native_identical': s.get('nativeIdentical', 0),
                    'native_differs': [n['path'] for n in adata.get('nativeFiles', []) if n.get('verdict') == 'differs'],
                    'native_undeclared': [n['path'] for n in adata.get('nativeFiles', []) if n.get('verdict') == 'undeclared'],
                    'undeclared_classes': s.get('undeclaredClasses', 0), 'obfuscated_share': s.get('obfuscatedShare', 0)})
    except (ValueError, OSError):
        apk = {'status': 'failed', 'note': 'unreadable apk-contents.json'}
print(f"  apk: {apk['status']}" + (f" ({apk['note']})" if apk.get('note') else ''))
if 'declared' in apk:
    print(f"    {apk['present']} of {apk['declared']} declared Maven packages in {apk['file']}, {apk['cant_tell']} can't tell; "
          f"native libraries {apk['native_identical']} of {apk['native']} same code as published; {apk['undeclared_classes']} classes from no declared package")
    for p in apk['native_differs']: print(f"    native code differs from every declared provider: {p}")
    for p in apk['native_undeclared'][:10]: print(f"    native library no package declares: {p}")
lines.append('  apk:')
lines.append(f'    status: {apk["status"]}')
if apk.get('note'): lines.append(f'    note: {q(apk["note"])}')
if 'declared' in apk:
    for k in ('file', 'declared', 'present', 'absent', 'cant_tell', 'native', 'native_identical', 'undeclared_classes', 'obfuscated_share'):
        lines.append(f'    {k}: {q(apk[k]) if k == "file" else apk[k]}')
    lines.append('    native_differs: [' + ', '.join(q(p) for p in apk['native_differs']) + ']')
    lines.append('    native_undeclared: [' + ', '.join(q(p) for p in apk['native_undeclared']) + ']')
    lines.append(f'    report: {q(os.path.basename(apk_json))}')
lines.append(f'  report: {q(os.path.basename(scan_json))}')
open(os.path.join(out, 'dependency-check.yaml'), 'w').write('\n'.join(lines) + '\n')
json.dump({'step': 'ws-depcheck', 'scanner': scanner, 'status': status, 'packages': packages, 'advisories': totals,
           'lockfiles': [{'path': p, **per_lock[p]} if p in per_lock else {'path': p, 'scanned': False} for p in list(lockfiles) + [p for p in per_lock if p not in lockfiles]],
           'unlocked_manifests': unlocked,
           'identity': {**identity, 'unverified': [{k: p.get(k) for k in ('name', 'version', 'ecosystem', 'status', 'repo')} for p in unverified]},
           'apk': apk,
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
