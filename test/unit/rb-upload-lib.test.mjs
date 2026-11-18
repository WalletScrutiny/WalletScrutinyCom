import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateSecretKey, getPublicKey, verifyEvent, nip19 } from 'nostr-tools';

// scripts/rb/upload-lib.sh against fake Blossom servers on localhost.

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(here, '../../scripts/rb/upload-lib.sh');
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

const sk = generateSecretKey();
const nsec = nip19.nsecEncode(sk);

/**
 * A Blossom server keeping blobs in memory. `blobs` seeds it; `serve` can
 * replace what a GET returns; `failUpload` answers every PUT with 500.
 */
async function fakeBlossom({ blobs = {}, serve = null, failUpload = false } = {}) {
  const store = new Map(Object.entries(blobs));
  const requests = [];
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      requests.push({ method: req.method, url: req.url, headers: req.headers, body });
      if (req.method === 'PUT' && req.url === '/upload') {
        if (failUpload) { res.writeHead(500).end('broken'); return; }
        const hash = sha256(body);
        store.set(hash, body);
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ sha256: hash, size: body.length }));
        return;
      }
      const hash = req.url.slice(1);
      if (!store.has(hash)) { res.writeHead(404).end(); return; }
      const data = serve ? serve(store.get(hash)) : store.get(hash);
      res.writeHead(200, { 'Content-Length': data.length });
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  return { url, store, requests, close: () => new Promise((resolve) => server.close(resolve)) };
}

function libDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'upload-lib-'));
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), content);
  return dir;
}

// spawn, not spawnSync: the fake servers live in this process and must keep answering.
function run(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn('bash', [script, ...args], {
      env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

const sums = (dir) => {
  const file = path.join(dir, 'SHA256SUMS');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
};

test('a new version is uploaded with a signed upload authorization, read back and sealed', async () => {
  const lib = 'echo core 1.0.0\n';
  const hash = sha256(lib);
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': lib });
  const keyFile = path.join(dir, 'key');
  fs.writeFileSync(keyFile, `${nsec}\n`);
  const srv = await fakeBlossom();
  try {
    const r = await run(['--lib-dir', dir, '--server', srv.url], { WS_BOT_NSEC_FILE: keyFile });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(srv.store.get(hash).toString(), lib);
    assert.deepEqual(srv.requests.map((q) => q.method), ['HEAD', 'PUT', 'GET']);

    const auth = srv.requests[1].headers.authorization;
    assert.match(auth, /^Nostr /);
    const event = JSON.parse(Buffer.from(auth.slice(6), 'base64').toString());
    assert.equal(event.kind, 24242);
    assert.ok(verifyEvent(event));
    assert.equal(event.pubkey, getPublicKey(sk));
    const tag = (k) => event.tags.find((t) => t[0] === k)?.[1];
    assert.equal(tag('t'), 'upload');
    assert.equal(tag('x'), hash);
    assert.equal(tag('size'), String(lib.length));
    assert.ok(Number(tag('expiration')) > Date.now() / 1000);

    assert.equal(sums(dir), `${hash}  ws-rb-core-1.0.0.sh\n`);
    assert.match(r.stdout, new RegExp(`ws-rb-core-1.0.0.sh ${hash}\\n`));
  } finally {
    await srv.close();
  }
});

test('a version the server already has is read back, not uploaded again', async () => {
  const lib = 'echo core 1.0.0\n';
  const hash = sha256(lib);
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': lib, SHA256SUMS: `${hash}  ws-rb-core-1.0.0.sh\n` });
  const srv = await fakeBlossom({ blobs: { [hash]: Buffer.from(lib) } });
  try {
    const r = await run(['--lib-dir', dir, '--server', srv.url], { WS_BOT_NSEC: nsec });
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(srv.requests.map((q) => q.method), ['HEAD', 'GET']);
    assert.match(r.stdout, /already there/);
    assert.equal(sums(dir), `${hash}  ws-rb-core-1.0.0.sh\n`); // not appended twice
  } finally {
    await srv.close();
  }
});

test('a sealed version a server lost is uploaded again', async () => {
  const lib = 'echo core 1.0.0\n';
  const hash = sha256(lib);
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': lib, SHA256SUMS: `${hash}  ws-rb-core-1.0.0.sh\n` });
  const srv = await fakeBlossom();
  try {
    const r = await run(['--lib-dir', dir, '--server', srv.url], { WS_BOT_NSEC: nsec });
    assert.equal(r.status, 0, r.stderr);
    assert.ok(srv.store.has(hash));
    assert.equal(sums(dir), `${hash}  ws-rb-core-1.0.0.sh\n`);
  } finally {
    await srv.close();
  }
});

test('a sealed version whose bytes changed is refused before any request', async () => {
  const old = 'echo core 1.0.0\n';
  const dir = libDir({
    'ws-rb-core-1.0.0.sh': 'echo core 1.0.0, edited\n',
    'ws-rb-core-1.1.0.sh': 'echo core 1.1.0\n',
    SHA256SUMS: `${sha256(old)}  ws-rb-core-1.0.0.sh\n`,
  });
  const srv = await fakeBlossom();
  try {
    const r = await run(['--lib-dir', dir, '--server', srv.url], { WS_BOT_NSEC: nsec });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /ws-rb-core-1\.0\.0\.sh is sealed at .* new version/);
    assert.equal(srv.requests.length, 0); // the good 1.1.0 waits too
    assert.equal(sums(dir), `${sha256(old)}  ws-rb-core-1.0.0.sh\n`);
  } finally {
    await srv.close();
  }
});

test('a server that serves other bytes fails the run and seals nothing', async () => {
  const lib = 'echo core 1.0.0\n';
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': lib });
  const srv = await fakeBlossom({ serve: () => Buffer.from('something else\n') });
  try {
    const r = await run(['--lib-dir', dir, '--server', srv.url], { WS_BOT_NSEC: nsec });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /uploaded, but read-back failed/);
    assert.equal(sums(dir), '');
  } finally {
    await srv.close();
  }
});

test('with a mirror, a failed upload on one server fails the run; the other still gets the file', async () => {
  const lib = 'echo core 1.0.0\n';
  const hash = sha256(lib);
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': lib });
  const good = await fakeBlossom();
  const bad = await fakeBlossom({ failUpload: true });
  try {
    const r = await run(['--lib-dir', dir], { WS_BOT_NSEC: nsec, BLOSSOM_SERVERS: `${good.url} ${bad.url}` });
    assert.equal(r.status, 1);
    assert.ok(good.store.has(hash));
    assert.match(r.stderr, new RegExp(`on ${bad.url}: upload failed`));
    assert.equal(sums(dir), ''); // sealed only once every server has it
  } finally {
    await good.close();
    await bad.close();
  }
});

test('no key is invalid input, and the key cannot be given on the command line', async () => {
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': 'echo core\n' });
  const srv = await fakeBlossom();
  try {
    let r = await run(['--lib-dir', dir, '--server', srv.url]);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /no signing key/);
    r = await run(['--lib-dir', dir, '--server', srv.url, '--nsec', nsec]);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /unknown option: --nsec/);
    assert.equal(srv.requests.length, 0);
  } finally {
    await srv.close();
  }
});

test('a dry run needs no key, uploads nothing and seals nothing', async () => {
  const lib = 'echo core 1.0.0\n';
  const dir = libDir({ 'ws-rb-core-1.0.0.sh': lib, 'notes.txt': 'not a version' });
  const srv = await fakeBlossom();
  try {
    const r = await run(['--lib-dir', dir, '--server', srv.url, '--dry-run']);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(srv.requests.map((q) => q.method), ['HEAD']);
    assert.match(r.stdout, /missing, would upload \(dry run\)/);
    assert.equal(sums(dir), '');
  } finally {
    await srv.close();
  }
});
