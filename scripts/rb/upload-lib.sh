#!/usr/bin/env bash
# upload-lib.sh: put every version of the shared build-script library on Blossom.
#
# Each version is one file, scripts/rb/lib/ws-rb-<name>-X.Y.Z.sh. A build script
# pins its sha256, and the sha256 is also its Blossom address. For each version
# and each server this script:
#   - asks the server whether it has the blob (HEAD /<sha256>),
#   - uploads it when it doesn't (PUT /upload, signed with the WS Bot key),
#   - reads it back (GET /<sha256>) and checks the hash of what came back.
# A server that already has the blob is read back too: a server can lose files.
#
# A version is sealed once it's published: scripts/rb/lib/SHA256SUMS records its
# hash, and a file whose bytes no longer match that line is refused. Change the
# version number instead. A new version is added to SHA256SUMS once every server
# has it; commit that line with the file.
#
# Usage: scripts/rb/upload-lib.sh [--dry-run] [--server URL]... [--lib-dir DIR]
#   --server URL  Blossom server; repeat for mirrors. Default: $BLOSSOM_SERVERS
#                 (space-separated), else https://files.nostr.info
#   --lib-dir DIR library directory (default: scripts/rb/lib beside this script)
#   --dry-run     check and report only: no upload, no key needed, SHA256SUMS untouched
#
# Key: WS_BOT_NSEC_FILE (a file holding the nsec or 64-char hex key), or
# WS_BOT_NSEC. There is no command-line option for it, so it never shows in ps
# or in shell history. Signing needs node and the repo's nostr-tools (npm ci).
#
# Exit codes: 0 every version is on every server; 1 an upload or a read-back
# failed; 2 invalid input (bad option, no key, a sealed version changed).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
lib_dir="${here}/lib"
dry_run=0
servers=()

die() { echo "[ERROR] $2" >&2; exit "$1"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --server) [[ $# -ge 2 ]] || die 2 "--server needs a URL"; servers+=("${2%/}"); shift 2 ;;
    --lib-dir) [[ $# -ge 2 ]] || die 2 "--lib-dir needs a directory"; lib_dir="$2"; shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    -h|--help) sed -n '2,/^set -euo/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
    *) die 2 "unknown option: $1" ;;
  esac
done

if [[ ${#servers[@]} -eq 0 ]]; then
  read -r -a servers <<< "${BLOSSOM_SERVERS:-https://files.nostr.info}"
  servers=("${servers[@]%/}")
fi
[[ ${#servers[@]} -gt 0 ]] || die 2 "no Blossom server given"
[[ -d "$lib_dir" ]] || die 2 "no library directory: $lib_dir"
lib_dir="$(cd "$lib_dir" && pwd)"

sums_file="${lib_dir}/SHA256SUMS"
shopt -s nullglob
files=("$lib_dir"/ws-rb-*-[0-9]*.[0-9]*.[0-9]*.sh)
shopt -u nullglob
if [[ ${#files[@]} -eq 0 ]]; then
  echo "No library versions in ${lib_dir}."
  exit 0
fi

sealed_hash() { # sealed_hash <file name>: its hash in SHA256SUMS, or nothing
  [[ -f "$sums_file" ]] || return 0
  awk -v n="$1" '$2 == n { print $1; exit }' "$sums_file"
}

# Every check that needs no network comes first, so a refusal uploads nothing.
declare -A hash_of
for f in "${files[@]}"; do
  name="$(basename "$f")"
  hash="$(sha256sum "$f" | cut -d' ' -f1)"
  sealed="$(sealed_hash "$name")"
  if [[ -n "$sealed" && "$sealed" != "$hash" ]]; then
    die 2 "${name} is sealed at ${sealed}, but its bytes now hash to ${hash}. A published version never changes: restore it and put the change in a new version."
  fi
  hash_of["$name"]="$hash"
done

secret=""
if [[ $dry_run -eq 0 ]]; then
  if [[ -n "${WS_BOT_NSEC_FILE:-}" ]]; then
    [[ -r "$WS_BOT_NSEC_FILE" ]] || die 2 "WS_BOT_NSEC_FILE is not readable: $WS_BOT_NSEC_FILE"
    secret="$(tr -d '[:space:]' < "$WS_BOT_NSEC_FILE")"
  else
    secret="${WS_BOT_NSEC:-}"
  fi
  [[ -n "$secret" ]] || die 2 "no signing key: set WS_BOT_NSEC_FILE (or WS_BOT_NSEC) to the WS Bot key"
fi

# auth_header <sha256> <size> <server>: a BUD-02 upload authorization (kind 24242).
auth_header() {
  WS_SECRET="$secret" node --input-type=module - "$1" "$2" "$3" <<'EOF'
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'noop.js'));
const { finalizeEvent, nip19 } = require('nostr-tools');
const [hash, size, server] = process.argv.slice(2);
const s = process.env.WS_SECRET.trim();
let sk;
if (s.startsWith('nsec1')) sk = nip19.decode(s).data;
else if (/^[0-9a-f]{64}$/i.test(s)) sk = Uint8Array.from(Buffer.from(s, 'hex'));
else { console.error('the key is neither an nsec nor 64-char hex'); process.exit(2); }
const now = Math.floor(Date.now() / 1000);
const event = finalizeEvent({
  kind: 24242,
  created_at: now,
  content: `Upload blob ${hash}`,
  tags: [['t', 'upload'], ['x', hash], ['size', size], ['expiration', String(now + 600)], ['server', server]],
}, sk);
process.stdout.write('Nostr ' + Buffer.from(JSON.stringify(event)).toString('base64'));
EOF
}

# read_back <server> <sha256>: 0 when the server serves exactly these bytes.
read_back() {
  local tmp got
  tmp="$(mktemp)"
  if ! curl -fsS --max-time 60 -o "$tmp" "$1/$2"; then rm -f "$tmp"; return 1; fi
  got="$(sha256sum "$tmp" | cut -d' ' -f1)"
  rm -f "$tmp"
  [[ "$got" == "$2" ]] || { echo "  read back ${got}, not ${2}" >&2; return 1; }
}

# The script runs node from the repo root, where nostr-tools is installed.
cd "$here/../.."

failed=0
for f in "${files[@]}"; do
  name="$(basename "$f")"
  hash="${hash_of[$name]}"
  size="$(wc -c < "$f" | tr -d ' ')"
  on_all=1
  for server in "${servers[@]}"; do
    status="$(curl -sS -o /dev/null -w '%{http_code}' -I --max-time 30 "$server/$hash" || true)"
    if [[ "$status" == 200 ]]; then
      if read_back "$server" "$hash"; then
        echo "${name} ${hash} on ${server}: already there"
      else
        echo "${name} ${hash} on ${server}: listed, but read-back failed" >&2
        on_all=0; failed=1
      fi
      continue
    fi
    if [[ "$status" != 404 ]]; then
      echo "${name} ${hash} on ${server}: HEAD answered ${status:-nothing}, expected 200 or 404" >&2
      on_all=0; failed=1
      continue
    fi
    if [[ $dry_run -eq 1 ]]; then
      echo "${name} ${hash} on ${server}: missing, would upload (dry run)"
      on_all=0
      continue
    fi
    if ! auth="$(auth_header "$hash" "$size" "$server")"; then
      die 2 "could not sign the upload (is nostr-tools installed? run npm ci)"
    fi
    if ! curl -fsS --max-time 120 -o /dev/null -X PUT \
        -H "Authorization: ${auth}" -H 'Content-Type: text/plain' \
        --data-binary "@${f}" "$server/upload"; then
      echo "${name} ${hash} on ${server}: upload failed" >&2
      on_all=0; failed=1
      continue
    fi
    if read_back "$server" "$hash"; then
      echo "${name} ${hash} on ${server}: uploaded"
    else
      echo "${name} ${hash} on ${server}: uploaded, but read-back failed" >&2
      on_all=0; failed=1
    fi
  done
  # Seal a new version once every server has it.
  if [[ $on_all -eq 1 && -z "$(sealed_hash "$name")" ]]; then
    echo "${hash}  ${name}" >> "$sums_file"
    echo "${name}: sealed in $(basename "$sums_file"), commit that line"
  fi
done

echo
echo "Pin in a build script:"
for f in "${files[@]}"; do
  name="$(basename "$f")"
  echo "  ${name} ${hash_of[$name]}"
done
exit "$failed"
