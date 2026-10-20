#!/usr/bin/env bash
# Stands in for apk-scan-cli.mjs in the ws-depcheck unit test: writes a canned
# APK comparison to its third argument.
cat > "$3" <<'JSON'
{"summary": {"declared": 3, "present": 1, "otherVersionShipped": 1, "absent": 1, "cantTell": 0, "native": 2, "nativeIdentical": 1, "undeclaredClasses": 12, "obfuscatedShare": 0.01},
 "nativeFiles": [{"path": "lib/arm64-v8a/libtor.so", "verdict": "identical"}, {"path": "lib/arm64-v8a/libmystery.so", "verdict": "undeclared"}],
 "rows": [], "undeclared": []}
JSON
