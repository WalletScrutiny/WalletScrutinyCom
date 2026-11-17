#!/usr/bin/env bash
# Stands in for identity-scan-cli.mjs in the ws-depcheck unit test: writes a
# canned identity result to its second argument. FAKE_IDENTITY_MODE=fail exits 3.
if [[ "${FAKE_IDENTITY_MODE:-}" == fail ]]; then echo "boom" >&2; exit 3; fi
cat > "$2" <<'JSON'
{"byStatus": {"tag-found": 2, "no-tag": 1, "unsupported": 1},
 "packages": [
  {"ecosystem": "npm", "name": "evil", "version": "0.0.1", "repo": "https://github.com/x/evil", "status": "no-tag", "tag": null, "commit": null, "provenance": false},
  {"ecosystem": "npm", "name": "left-pad", "version": "1.0.0", "repo": "https://github.com/x/left-pad", "status": "tag-found", "tag": "v1.0.0", "commit": "aaaa", "provenance": true},
  {"ecosystem": "npm", "name": "shell-quote", "version": "1.8.3", "repo": "https://github.com/x/sq", "status": "tag-found", "tag": "v1.8.3", "commit": "bbbb", "provenance": false},
  {"ecosystem": "RubyGems", "name": "rubyzip", "version": "2.3.2", "repo": null, "status": "unsupported", "tag": null, "commit": null, "provenance": null}
 ]}
JSON
