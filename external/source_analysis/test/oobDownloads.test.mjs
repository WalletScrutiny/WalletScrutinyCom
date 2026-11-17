// Out-of-band downloads (plugins/oob-downloads.mjs): what counts as a fetch.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { analyzeOobDownloads } from '../plugins/oob-downloads.mjs';

function scan(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oob-'));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.join(dir, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  }
  const log = console.log;
  console.log = () => {};
  try { return analyzeOobDownloads(dir); } finally { console.log = log; }
}

test('FROM is a base image in a Dockerfile only, not SQL or Python in a script', () => {
  const found = scan({
    'Dockerfile': 'FROM ubuntu:22.04 AS build\nFROM build\nFROM scratch\n',
    'Containerfile.release': 'FROM debian:12\n',
    'scripts/seed.sh': 'psql <<SQL\nSELECT id\nFROM communities\nSQL\npython3 - <<PY\nfrom pathlib import Path\nPY\n',
    'tools/release.sh': 'echo "Copy the image"\nFROM the device\n',
  });
  assert.deepEqual(found.map(f => `${f.file} ${f.target}`).sort(), ['Containerfile.release debian:12', 'Dockerfile ubuntu:22.04']);
});

test('a health check against a local service is no download', () => {
  const found = scan({
    'scripts/wait.sh': [
      'curl -sf http://127.0.0.1:3000/_readiness',
      'curl http://0.0.0.0:8080/health',
      'curl http://[::1]:9000/minio/health/live',
      'curl http://localhost:5432',
      'curl -LO https://dl.example.org/sdk.zip',
      'curl https://127.0.0.1.nip.io/x',
    ].join('\n'),
  });
  assert.deepEqual(found.map(f => f.target), ['https://dl.example.org/sdk.zip', 'https://127.0.0.1.nip.io/x']);
});
