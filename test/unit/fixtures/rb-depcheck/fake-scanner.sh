#!/usr/bin/env bash
# Stands in for the osv-scanner container in the ws-depcheck unit test: prints
# a canned scanner result for the checkout it is given, exit 1 like a scan
# that found advisories. FAKE_SCANNER_MODE=fail exits 2 with garbage.
if [[ "${FAKE_SCANNER_MODE:-}" == fail ]]; then echo "boom" >&2; echo "not json"; exit 2; fi
src="$1"
cat <<JSON
{"results": [
  {"source": {"path": "${src}/yarn.lock", "type": "lockfile"}, "packages": [
    {"package": {"name": "left-pad", "version": "1.0.0", "ecosystem": "npm"}},
    {"package": {"name": "shell-quote", "version": "1.8.3", "ecosystem": "npm"},
     "vulnerabilities": [{"id": "GHSA-w7jw-789q-3m8p", "aliases": ["CVE-2026-0001"]}],
     "groups": [{"ids": ["GHSA-w7jw-789q-3m8p"], "aliases": ["CVE-2026-0001"], "max_severity": "9.2"}]},
    {"package": {"name": "evil", "version": "0.0.1", "ecosystem": "npm"},
     "vulnerabilities": [{"id": "MAL-2026-1"}],
     "groups": [{"ids": ["MAL-2026-1"], "aliases": [], "max_severity": ""}]}
  ]},
  {"source": {"path": "${src}/android/Gemfile.lock", "type": "lockfile"}, "packages": [
    {"package": {"name": "rubyzip", "version": "2.3.2", "ecosystem": "RubyGems"},
     "vulnerabilities": [{"id": "GHSA-47m2-wp7j-p9vc"}],
     "groups": [{"ids": ["GHSA-47m2-wp7j-p9vc"], "aliases": [], "max_severity": "5.0"}]}
  ]}
]}
JSON
exit 1
